import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';
import '../../../core/services/firebase_service.dart';
import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../models/post_model.dart';

// ─── State ───────────────────────────────────────────────────────
class FeedState {
  final List<PostModel> posts;
  final bool isLoading;
  final bool hasMore;
  final String? error;
  final bool isCreating;

  const FeedState({
    this.posts = const [],
    this.isLoading = false,
    this.hasMore = true,
    this.error,
    this.isCreating = false,
  });

  FeedState copyWith({
    List<PostModel>? posts,
    bool? isLoading,
    bool? hasMore,
    String? error,
    bool? isCreating,
  }) =>
      FeedState(
        posts: posts ?? this.posts,
        isLoading: isLoading ?? this.isLoading,
        hasMore: hasMore ?? this.hasMore,
        error: error,
        isCreating: isCreating ?? this.isCreating,
      );
}

// ─── Controller ──────────────────────────────────────────────────
class FeedController extends StateNotifier<FeedState> {
  final FirebaseFirestore _firestore;
  final FirebaseStorage _storage;
  final String? _currentUserId;

  static const int _pageSize = 15;
  DocumentSnapshot? _lastDocument;
  bool _isSubscribed = false;

  FeedController(this._currentUserId)
      : _firestore = FirebaseService.instance.firestore,
        _storage = FirebaseService.instance.storage,
        super(const FeedState()) {
    _subscribeToFeed();
  }

  // ─── Real-time Feed Stream ──────────────────────────────────
  void _subscribeToFeed() {
    if (_isSubscribed) return;
    _isSubscribed = true;
    state = state.copyWith(isLoading: true);

    _firestore
        .collection('posts')
        .orderBy('createdAt', descending: true)
        .limit(_pageSize)
        .snapshots()
        .listen(
      (snapshot) {
        final posts = snapshot.docs
            .map((doc) => PostModel.fromFirestore(doc))
            .toList();
        if (snapshot.docs.isNotEmpty) {
          _lastDocument = snapshot.docs.last;
        }
        state = state.copyWith(
          posts: posts,
          isLoading: false,
          hasMore: snapshot.docs.length >= _pageSize,
        );
      },
      onError: (e) {
        state = state.copyWith(
          isLoading: false,
          error: 'Failed to load feed.',
        );
      },
    );
  }

  // ─── Load More (Pagination) ─────────────────────────────────
  Future<void> loadMore() async {
    if (!state.hasMore || state.isLoading || _lastDocument == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final snapshot = await _firestore
          .collection('posts')
          .orderBy('createdAt', descending: true)
          .startAfterDocument(_lastDocument!)
          .limit(_pageSize)
          .get();

      final morePosts = snapshot.docs
          .map((doc) => PostModel.fromFirestore(doc))
          .toList();

      if (snapshot.docs.isNotEmpty) {
        _lastDocument = snapshot.docs.last;
      }

      state = state.copyWith(
        posts: [...state.posts, ...morePosts],
        isLoading: false,
        hasMore: snapshot.docs.length >= _pageSize,
      );
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load more.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Create Post ────────────────────────────────────────────
  Future<bool> createPost({
    required String content,
    List<File>? mediaFiles,
    String mediaType = 'none',
    String? location,
  }) async {
    if (_currentUserId == null) return false;
    state = state.copyWith(isCreating: true);

    try {
      final userDoc = await _firestore.collection('users').doc(_currentUserId).get();
      final userData = userDoc.data() ?? {};

      final List<String> mediaUrls = [];
      if (mediaFiles != null && mediaFiles.isNotEmpty) {
        for (final file in mediaFiles) {
          final ref = _storage
              .ref()
              .child('posts')
              .child(_currentUserId!)
              .child('${DateTime.now().millisecondsSinceEpoch}');
          await ref.putFile(file);
          mediaUrls.add(await ref.getDownloadURL());
        }
      }

      await _firestore.collection('posts').add({
        'userId': _currentUserId,
        'userName': userData['displayName'] ?? 'User',
        'userAvatar': userData['photoUrl'] ?? '',
        'isVerified': userData['isVerified'] ?? false,
        'content': content,
        'mediaUrls': mediaUrls,
        'mediaType': mediaType,
        'reactions': {'like': 0, 'love': 0, 'haha': 0, 'wow': 0, 'sad': 0, 'angry': 0},
        'userReactions': {},
        'commentsCount': 0,
        'sharesCount': 0,
        'createdAt': FieldValue.serverTimestamp(),
        'isBoosted': false,
        'location': location,
      });

      // Update user post count
      await _firestore
          .collection('users')
          .doc(_currentUserId)
          .update({'postsCount': FieldValue.increment(1)});

      state = state.copyWith(isCreating: false);
      return true;
    } catch (e, st) {
      state = state.copyWith(isCreating: false, error: 'Failed to create post.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── React to Post ──────────────────────────────────────────
  Future<void> reactToPost({
    required String postId,
    required String reaction,
  }) async {
    if (_currentUserId == null) return;
    try {
      final postRef = _firestore.collection('posts').doc(postId);
      final postIndex = state.posts.indexWhere((p) => p.id == postId);
      if (postIndex == -1) return;

      final post = state.posts[postIndex];
      final existingReaction = post.userReactions[_currentUserId!];
      final newReactions = Map<String, int>.from(post.reactions);
      final newUserReactions = Map<String, String>.from(post.userReactions);

      // Remove existing reaction if same → toggle off
      if (existingReaction == reaction) {
        newReactions[reaction] = (newReactions[reaction] ?? 1) - 1;
        newUserReactions.remove(_currentUserId);
      } else {
        // Remove old reaction count if different
        if (existingReaction != null) {
          newReactions[existingReaction] =
              (newReactions[existingReaction] ?? 1) - 1;
        }
        // Add new reaction
        newReactions[reaction] = (newReactions[reaction] ?? 0) + 1;
        newUserReactions[_currentUserId!] = reaction;
      }

      // Optimistic update
      final updatedPosts = [...state.posts];
      updatedPosts[postIndex] = post.copyWith(
        reactions: newReactions,
        userReactions: newUserReactions,
      );
      state = state.copyWith(posts: updatedPosts);

      // Persist to Firestore
      await postRef.update({
        'reactions': newReactions,
        'userReactions': newUserReactions,
      });
    } catch (e, st) {
      // Revert optimistic update
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Delete Post ────────────────────────────────────────────
  Future<void> deletePost(String postId) async {
    try {
      await _firestore.collection('posts').doc(postId).delete();
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Refresh ────────────────────────────────────────────────
  Future<void> refresh() async {
    _isSubscribed = false;
    _lastDocument = null;
    state = const FeedState();
    _subscribeToFeed();
  }
}

// ─── Providers ───────────────────────────────────────────────────
final feedControllerProvider =
    StateNotifierProvider<FeedController, FeedState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return FeedController(userId);
});
