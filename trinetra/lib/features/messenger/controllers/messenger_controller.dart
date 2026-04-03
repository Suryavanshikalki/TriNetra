import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// 🔥 Firebase के imports हटा दिए गए हैं 🔥
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
  final String? _currentUserId;
  // StreamSubscription? _convSubscription; (Firebase Stream removed)

  MessengerController(this._currentUserId) : super(const MessengerState()) {
    if (_currentUserId != null) _subscribeToConversations();
  }

  void _subscribeToConversations() async {
    state = state.copyWith(isLoading: true);
    try {
      // TODO: AWS Amplify GraphQL Subscription Logic goes here
      await Future.delayed(const Duration(milliseconds: 500));
      state = state.copyWith(conversations: [], isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  // ─── Get or Create Conversation ────────────────────────────
  Future<String> getOrCreateConversation({
    required String otherUserId,
    required String otherUserName,
    required String otherUserAvatar,
  }) async {
    final uid = _currentUserId;
    if (uid == null) return '';
    try {
      // 🔥 FIXED: FieldValue.serverTimestamp() हटाकर डमी AWS Logic लगाया गया है 🔥
      await Future.delayed(const Duration(milliseconds: 500));
      return 'dummy_conversation_id_${DateTime.now().millisecondsSinceEpoch}';
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
      return '';
    }
  }

  @override
  void dispose() {
    // _convSubscription?.cancel();
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
  final String _conversationId;
  final String? _currentUserId;
  // StreamSubscription? _msgSubscription; (Firebase Stream removed)

  ChatController(this._conversationId, this._currentUserId)
      : super(const ChatState()) {
    _loadConversation();
    _subscribeToMessages();
  }

  Future<void> _loadConversation() async {
    try {
      // TODO: Load Conversation via AWS
      await Future.delayed(const Duration(milliseconds: 300));
      await _markAsRead();
    } catch (e) {
      // ignore
    }
  }

  void _subscribeToMessages() async {
    state = state.copyWith(isLoading: true);
    try {
      // TODO: Subscribe to Messages via AWS AppSync
      await Future.delayed(const Duration(milliseconds: 500));
      state = state.copyWith(messages: [], isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
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
      // 🔥 FIXED: Firebase Batch & FieldValue.serverTimestamp() हटा दिया गया है 🔥
      // TODO: Create Message via AWS GraphQL Mutation
      await Future.delayed(const Duration(milliseconds: 800));
      state = state.copyWith(isSending: false);
    } catch (e, st) {
      state = state.copyWith(isSending: false, error: 'Failed to send message.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  Future<void> _markAsRead() async {
    if (_currentUserId == null) return;
    try {
      // TODO: Mark as read via AWS
      await Future.delayed(const Duration(milliseconds: 200));
    } catch (_) {}
  }

  @override
  void dispose() {
    // _msgSubscription?.cancel();
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
