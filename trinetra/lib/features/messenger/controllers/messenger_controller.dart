import 'dart:async'; // 🔥 FIXED: 'Import' का 'I' छोटा (small) कर दिया है
import 'package:amplify_flutter/amplify_flutter.dart'; // 🔥 ASLI AWS CORE
import 'package:amplify_api/amplify_api.dart'; // 🔥 ASLI GRAPHQL
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../models/message_model.dart';
import '../models/conversation_model.dart'; // Assumed from your previous code

// ==============================================================
// 👁️🔥 TRINETRA MASTER MESSENGER CONTROLLER (Blueprint Point 5)
// 100% REAL AWS: AppSync Subscriptions, GraphQL Mutations
// ==============================================================

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
  StreamSubscription? _convSubscription; // 🔥 Real AWS Subscription

  MessengerController(this._currentUserId) : super(const MessengerState()) {
    if (_currentUserId != null) {
      _loadConversations();
      _subscribeToConversations();
    }
  }

  // 🔥 ASLI AWS QUERY: Load existing chats from DynamoDB
  Future<void> _loadConversations() async {
    state = state.copyWith(isLoading: true);
    try {
      final request = ModelQueries.list(ConversationModel.classType);
      final response = await Amplify.API.query(request: request).response;
      
      final conversations = response.data?.items
          .whereType<ConversationModel>()
          .toList() ?? [];
          
      state = state.copyWith(conversations: conversations, isLoading: false);
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: e.toString());
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // 🔥 ASLI AWS SUBSCRIPTION: New chats appear in real-time
  void _subscribeToConversations() {
    final subscriptionRequest = ModelSubscriptions.onCreate(ConversationModel.classType);
    final operation = Amplify.API.subscribe(subscriptionRequest);
    
    // 🔥 FIXED: AWS का सही 'listen' सिंटैक्स लगा दिया है ताकि रियल-टाइम चैट काम करे
    _convSubscription = operation.listen(
      (event) {
        final newConv = event.data;
        if (newConv != null) {
          state = state.copyWith(conversations: [newConv, ...state.conversations]);
        }
      },
      onError: (e) => safePrint('Subscription Error: $e'),
    );
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

// ─── Chat Controller (The Real Chat Engine) ──────────────────────
class ChatController extends StateNotifier<ChatState> {
  final String _conversationId;
  final String? _currentUserId;
  StreamSubscription? _msgSubscription; // 🔥 Real-time Message Stream

  ChatController(this._conversationId, this._currentUserId)
      : super(const ChatState()) {
    _loadMessages();
    _subscribeToMessages();
  }

  // 🔥 ASLI AWS QUERY: Fetch message history
  Future<void> _loadMessages() async {
    state = state.copyWith(isLoading: true);
    try {
      final request = ModelQueries.list(
        MessageModel.classType,
        where: MessageModel.CONVERSATIONID.eq(_conversationId),
      );
      final response = await Amplify.API.query(request: request).response;
      
      final messages = response.data?.items
          .whereType<MessageModel>()
          .toList() ?? [];
      
      // Sort by creation time
      messages.sort((a, b) => b.createdAt!.compareTo(a.createdAt!));
          
      state = state.copyWith(messages: messages, isLoading: false);
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load history');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // 🔥 ASLI AWS SUBSCRIPTION: Incoming messages appear instantly
  void _subscribeToMessages() {
    final subscriptionRequest = ModelSubscriptions.onCreate(MessageModel.classType);
    final operation = Amplify.API.subscribe(subscriptionRequest);
    
    // 🔥 FIXED: AWS का सही 'listen' सिंटैक्स लगा दिया है ताकि मैसेज तुरंत स्क्रीन पर आएं
    _msgSubscription = operation.listen(
      (event) {
        final newMessage = event.data;
        if (newMessage != null && newMessage.conversationId == _conversationId) {
          state = state.copyWith(messages: [newMessage, ...state.messages]);
        }
      },
      onError: (e) => safePrint('Message Subscription Error: $e'),
    );
  }

  // 🔥 ASLI AWS MUTATION: Send real message to DynamoDB
  Future<void> sendMessage({
    required String content,
    MessageType type = MessageType.text,
    String? mediaUrl,
    String? replyToId,
  }) async {
    if (_currentUserId == null || content.trim().isEmpty) return;
    state = state.copyWith(isSending: true);

    try {
      final newMessage = MessageModel(
        conversationId: _conversationId,
        senderId: _currentUserId!,
        content: content,
        type: type,
        mediaUrl: mediaUrl,
        replyToId: replyToId,
        createdAt: TemporalDateTime.now(), // 🔥 Real AWS Timestamp
        isRead: false,
      );

      final request = ModelMutations.create(newMessage);
      final response = await Amplify.API.mutate(request: request).response;

      if (response.hasErrors) {
        throw Exception(response.errors.first.message);
      }

      state = state.copyWith(isSending: false);
    } catch (e, st) {
      state = state.copyWith(isSending: false, error: 'Message failed to send');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
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
