import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../../auth/controllers/auth_controller.dart';
import '../controllers/messenger_controller.dart';
import '../models/message_model.dart';
import '../widgets/message_bubble.dart';
import '../widgets/attachment_sheet.dart';

/// Real-time Chat Screen
class ChatScreen extends ConsumerStatefulWidget {
  final String conversationId;
  final String otherName;
  final String otherAvatar;

  const ChatScreen({
    super.key,
    required this.conversationId,
    required this.otherName,
    required this.otherAvatar,
  });

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _showAttachments = false;
  String? _replyToId;
  String? _replyToContent;

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;
    ref
        .read(chatControllerProvider(widget.conversationId).notifier)
        .sendMessage(
          content: text,
          replyToId: _replyToId,
          replyToContent: _replyToContent,
        );
    _messageController.clear();
    setState(() {
      _replyToId = null;
      _replyToContent = null;
    });
    _scrollToTop();
  }

  void _scrollToTop() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          0,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final chatState = ref.watch(chatControllerProvider(widget.conversationId));
    final myUid = ref.watch(currentUserProvider)?.uid ?? '';

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : const Color(0xFFE5DDD5),
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : AppColors.primary,
        elevation: 0,
        leadingWidth: 40,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.white24,
              backgroundImage: widget.otherAvatar.isNotEmpty
                  ? CachedNetworkImageProvider(widget.otherAvatar)
                  : null,
              child: widget.otherAvatar.isEmpty
                  ? Text(
                      widget.otherName.isNotEmpty
                          ? widget.otherName[0].toUpperCase()
                          : '?',
                      style: const TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold),
                    )
                  : null,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.otherName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Text(
                    'Online',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.videocam_outlined, color: Colors.white),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.call_outlined, color: Colors.white),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // ─── Messages List ──────────────────────────────────
          Expanded(
            child: chatState.isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: AppColors.primary,
                    ),
                  )
                : chatState.messages.isEmpty
                    ? _EmptyChat(otherName: widget.otherName)
                    : ListView.builder(
                        controller: _scrollController,
                        reverse: true, // Newest at bottom
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 8,
                        ),
                        itemCount: chatState.messages.length,
                        itemBuilder: (context, index) {
                          final msg = chatState.messages[index];
                          final isMe = msg.senderId == myUid;
                          return MessageBubble(
                            message: msg,
                            isMe: isMe,
                            isDark: isDark,
                            onReply: (id, content) {
                              setState(() {
                                _replyToId = id;
                                _replyToContent = content;
                              });
                            },
                          );
                        },
                      ),
          ),

          // ─── Reply Preview ──────────────────────────────────
          if (_replyToContent != null)
            Container(
              color: isDark ? AppColors.cardDark : Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Container(
                    width: 3,
                    height: 36,
                    color: AppColors.primary,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Replying to',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          _replyToContent!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 18),
                    onPressed: () =>
                        setState(() => _replyToContent = null),
                  ),
                ],
              ),
            ),

          // ─── Input Bar ──────────────────────────────────────
          Container(
            color: isDark ? AppColors.cardDark : Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            child: Row(
              children: [
                // Attachment
                IconButton(
                  icon: Icon(
                    _showAttachments ? Icons.close : Icons.add,
                    color: AppColors.primary,
                  ),
                  onPressed: () {
                    setState(
                        () => _showAttachments = !_showAttachments);
                    if (_showAttachments) {
                      AttachmentSheet.show(
                        context,
                        conversationId: widget.conversationId,
                        controller: ref.read(
                          chatControllerProvider(widget.conversationId)
                              .notifier,
                        ),
                      );
                    }
                  },
                ),
                // Text Input
                Expanded(
                  child: Container(
                    constraints: const BoxConstraints(maxHeight: 100),
                    decoration: BoxDecoration(
                      color: isDark
                          ? AppColors.surfaceDark
                          : AppColors.inputBgLight,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: TextField(
                      controller: _messageController,
                      maxLines: null,
                      keyboardType: TextInputType.multiline,
                      style: TextStyle(
                        color: isDark
                            ? AppColors.textPrimaryDark
                            : AppColors.textPrimaryLight,
                        fontSize: 15,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Message...',
                        hintStyle: TextStyle(
                          color: isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                      ),
                      onChanged: (_) => setState(() {}),
                    ),
                  ),
                ),
                const SizedBox(width: 4),
                // Send / Mic button
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  child: _messageController.text.isNotEmpty
                      ? InkWell(
                          onTap: chatState.isSending ? null : _sendMessage,
                          borderRadius: BorderRadius.circular(24),
                          child: Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                            child: chatState.isSending
                                ? const Padding(
                                    padding: EdgeInsets.all(12),
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Icon(
                                    Icons.send,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                          ),
                        )
                      : IconButton(
                          icon: const Icon(
                            Icons.mic_none,
                            color: AppColors.primary,
                          ),
                          onPressed: () {},
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyChat extends StatelessWidget {
  final String otherName;
  const _EmptyChat({required this.otherName});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 40,
            backgroundColor: AppColors.primary.withValues(alpha: 0.1),
            child: Text(
              otherName.isNotEmpty ? otherName[0].toUpperCase() : '?',
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(otherName,
              style: const TextStyle(
                  fontSize: 20, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text(
            'Say hi to $otherName!',
            style: TextStyle(color: Colors.grey[600], fontSize: 14),
          ),
        ],
      ),
    );
  }
}
