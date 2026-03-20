import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:async';
import '../../../core/services/firebase_service.dart';
import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../models/message_model.dart';

// ─── Messenger State ─────────────────────────────────────────────
class MessengerState {
  final List<ConversationModel> conversations;
  final bool isLoading;
  final String? error;

  const MessengerState({
    this.conversations = const [],
    this.isLoading = false,
    this.error,
  });

  MessengerState copyWith({
    List<ConversationModel>? conversations,
    bool? isLoading,
    String? error,
  }) =>
      MessengerState(
        conversations: conversations ?? this.conversations,
        isLoading: isLoading ?? this.isLoading,
        error: error,
      );
}

// ─── Messenger Controller ────────────────────────────────────────
class MessengerController extends StateNotifier<MessengerState> {
  final FirebaseFirestore _firestore;
  final String? _currentUserId;
  StreamSubscription? _convSubscription;

  MessengerController(this._currentUserId)
      : _firestore = FirebaseService.instance.firestore,
        super(const MessengerState()) {
    if (_currentUserId != null) _subscribeToConversations();
  }

  void _subscribeToConversations() {
    state = state.copyWith(isLoading: true);
    _convSubscription = _firestore
        .collection('conversations')
        .where('participantIds', arrayContains: _currentUserId)
        .orderBy('lastMessageTime', descending: true)
        .snapshots()
        .listen(
      (snapshot) {
        final convs = snapshot.docs
            .map((doc) => ConversationModel.fromFirestore(doc))
            .toList();
        state = state.copyWith(conversations: convs, isLoading: false);
      },
      onError: (e) => state = state.copyWith(isLoading: false),
    );
  }

  // ─── Get or Create Conversation ────────────────────────────
  Future<String> getOrCreateConversation({
    required String otherUserId,
    required String otherUserName,
    required String otherUserAvatar,
  }) async {
    if (_currentUserId == null) return '';
    try {
      final userDoc = await _firestore.collection('users').doc(_currentUserId).get();
      final myName = userDoc.data()?['displayName'] ?? 'Me';
      final myAvatar = userDoc.data()?['photoUrl'] ?? '';

      // Check if conversation exists
      final existing = await _firestore
          .collection('conversations')
          .where('participantIds', arrayContains: _currentUserId)
          .get();

      for (final doc in existing.docs) {
        final ids = List<String>.from(doc.data()['participantIds'] ?? []);
        if (ids.contains(otherUserId)) return doc.id;
      }

      // Create new conversation
      final ref = await _firestore.collection('conversations').add({
        'participantIds': [_currentUserId, otherUserId],
        'participantNames': {
          _currentUserId!: myName,
          otherUserId: otherUserName,
        },
        'participantAvatars': {
          _currentUserId!: myAvatar,
          otherUserId: otherUserAvatar,
        },
        'lastMessage': '',
        'lastMessageSenderId': '',
        'lastMessageTime': FieldValue.serverTimestamp(),
        'unreadCounts': {_currentUserId!: 0, otherUserId: 0},
        'isGroupChat': false,
      });
      return ref.id;
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
      return '';
    }
  }

  @override
  void dispose() {
    _convSubscription?.cancel();
    super.dispose();
  }
}

// ─── Chat State ──────────────────────────────────────────────────
class ChatState {
  final List<MessageModel> messages;
  final bool isLoading;
  final bool isSending;
  final ConversationModel? conversation;
  final String? error;

  const ChatState({
    this.messages = const [],
    this.isLoading = false,
    this.isSending = false,
    this.conversation,
    this.error,
  });

  ChatState copyWith({
    List<MessageModel>? messages,
    bool? isLoading,
    bool? isSending,
    ConversationModel? conversation,
    String? error,
  }) =>
      ChatState(
        messages: messages ?? this.messages,
        isLoading: isLoading ?? this.isLoading,
        isSending: isSending ?? this.isSending,
        conversation: conversation ?? this.conversation,
        error: error,
      );
}

// ─── Chat Controller ─────────────────────────────────────────────
class ChatController extends StateNotifier<ChatState> {
  final FirebaseFirestore _firestore;
  final String _conversationId;
  final String? _currentUserId;
  StreamSubscription? _msgSubscription;

  ChatController(this._conversationId, this._currentUserId)
      : _firestore = FirebaseService.instance.firestore,
        super(const ChatState()) {
    _loadConversation();
    _subscribeToMessages();
  }

  Future<void> _loadConversation() async {
    try {
      final doc = await _firestore
          .collection('conversations')
          .doc(_conversationId)
          .get();
      if (doc.exists) {
        state = state.copyWith(
          conversation: ConversationModel.fromFirestore(doc),
        );
      }
      // Mark messages as read
      await _markAsRead();
    } catch (e) {
      // ignore
    }
  }

  void _subscribeToMessages() {
    state = state.copyWith(isLoading: true);
    _msgSubscription = _firestore
        .collection('conversations')
        .doc(_conversationId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .limit(50)
        .snapshots()
        .listen(
      (snapshot) {
        final msgs = snapshot.docs
            .map((doc) => MessageModel.fromFirestore(doc))
            .toList();
        state = state.copyWith(messages: msgs, isLoading: false);
      },
      onError: (_) => state = state.copyWith(isLoading: false),
    );
  }

  // ─── Send Message ───────────────────────────────────────────
  Future<void> sendMessage({
    required String content,
    MessageType type = MessageType.text,
    String? mediaUrl,
    String? replyToId,
    String? replyToContent,
  }) async {
    if (_currentUserId == null || content.trim().isEmpty) return;
    state = state.copyWith(isSending: true);

    try {
      final userDoc = await _firestore
          .collection('users')
          .doc(_currentUserId)
          .get();
      final senderName = userDoc.data()?['displayName'] ?? 'User';

      final msgRef = _firestore
          .collection('conversations')
          .doc(_conversationId)
          .collection('messages')
          .doc();

      final batch = _firestore.batch();

      // Add message
      batch.set(msgRef, {
        'conversationId': _conversationId,
        'senderId': _currentUserId,
        'senderName': senderName,
        'content': content.trim(),
        'type': type.value,
        'mediaUrl': mediaUrl,
        'timestamp': FieldValue.serverTimestamp(),
        'isRead': false,
        'replyToId': replyToId,
        'replyToContent': replyToContent,
      });

      // Update conversation
      batch.update(
        _firestore.collection('conversations').doc(_conversationId),
        {
          'lastMessage': type == MessageType.text
              ? content.trim()
              : '[${type.name.toUpperCase()}]',
          'lastMessageSenderId': _currentUserId,
          'lastMessageTime': FieldValue.serverTimestamp(),
        },
      );

      await batch.commit();
      state = state.copyWith(isSending: false);
    } catch (e, st) {
      state = state.copyWith(isSending: false, error: 'Failed to send message.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  Future<void> _markAsRead() async {
    if (_currentUserId == null) return;
    try {
      await _firestore
          .collection('conversations')
          .doc(_conversationId)
          .update({'unreadCounts.$_currentUserId': 0});
    } catch (_) {}
  }

  @override
  void dispose() {
    _msgSubscription?.cancel();
    super.dispose();
  }
}

// ─── Providers ───────────────────────────────────────────────────
final messengerControllerProvider =
    StateNotifierProvider<MessengerController, MessengerState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return MessengerController(userId);
});

final chatControllerProvider = StateNotifierProviderFamily<ChatController,
    ChatState, String>((ref, conversationId) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return ChatController(conversationId, userId);
});
