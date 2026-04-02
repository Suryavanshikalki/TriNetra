import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';
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
  final String? _currentUserId;

  static const int _pageSize = 15;
  bool _isSubscribed = false;

  FeedController(this._currentUserId) : super(const FeedState()) {
    _subscribeToFeed();
  }

  // ─── Real-time Feed Stream (Prepared for AWS) ──────────────────
  void _subscribeToFeed() async {
    if (_isSubscribed) return;
    _isSubscribed = true;
    state = state.copyWith(isLoading: true);

    try {
      // TODO: AWS Amplify API fetch will replace this
      await Future.delayed(const Duration(milliseconds: 500));
      
      state = state.copyWith(
        posts: [], // Starts empty until AWS is connected
        isLoading: false,
        hasMore: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to load feed.',
      );
    }
  }

  // ─── Load More (Pagination) ─────────────────────────────────
  Future<void> loadMore() async {
    if (!state.hasMore || state.isLoading) return;
    state = state.copyWith(isLoading: true);
    try {
      // TODO: AWS Pagination Logic
      await Future.delayed(const Duration(milliseconds: 500));

      state = state.copyWith(
        isLoading: false,
        hasMore: false,
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
    final uid = _currentUserId;
    if (uid == null) return false;
    state = state.copyWith(isCreating: true);

    try {
      // TODO: AWS Storage and GraphQL Mutation
      await Future.delayed(const Duration(seconds: 1));

      state = state.copyWith(isCreating: false);
      refresh(); // Refresh feed to show new dummy post
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
    final uid = _currentUserId;
    if (uid == null) return;
    try {
      final postIndex = state.posts.indexWhere((p) => p.id == postId);
      if (postIndex == -1) return;

      final post = state.posts[postIndex];
      final existingReaction = post.userReactions[uid];
      final newReactions = Map<String, int>.from(post.reactions);
      final newUserReactions = Map<String, String>.from(post.userReactions);

      // Remove existing reaction if same → toggle off
      if (existingReaction == reaction) {
        newReactions[reaction] = (newReactions[reaction] ?? 1) - 1;
        newUserReactions.remove(uid);
      } else {
        // Remove old reaction count if different
        if (existingReaction != null) {
          newReactions[existingReaction] =
              (newReactions[existingReaction] ?? 1) - 1;
        }
        // Add new reaction
        newReactions[reaction] = (newReactions[reaction] ?? 0) + 1;
        newUserReactions[uid] = reaction;
      }

      // Optimistic update for UI
      final updatedPosts = [...state.posts];
      updatedPosts[postIndex] = post.copyWith(
        reactions: newReactions,
        userReactions: newUserReactions,
      );
      state = state.copyWith(posts: updatedPosts);

      // TODO: Save to AWS Database
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Delete Post ────────────────────────────────────────────
  Future<void> deletePost(String postId) async {
    try {
      // Remove from local UI state instantly
      final updatedPosts = state.posts.where((p) => p.id != postId).toList();
      state = state.copyWith(posts: updatedPosts);

      // TODO: AWS Delete logic
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Refresh ────────────────────────────────────────────────
  Future<void> refresh() async {
    _isSubscribed = false;
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
