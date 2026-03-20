import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../core/constants/app_colors.dart';
import '../models/message_model.dart';

/// WhatsApp/Messenger-style message bubble
class MessageBubble extends StatelessWidget {
  final MessageModel message;
  final bool isMe;
  final bool isDark;
  final void Function(String id, String content)? onReply;

  const MessageBubble({
    super.key,
    required this.message,
    required this.isMe,
    required this.isDark,
    this.onReply,
  });

  @override
  Widget build(BuildContext context) {
    final bubbleBg = isMe
        ? AppColors.primary
        : (isDark ? AppColors.cardDark : Colors.white);
    final textColor = isMe ? Colors.white : (isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight);
    final timeColor = isMe ? Colors.white70 : (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight);

    return GestureDetector(
      onLongPress: () => _showMessageOptions(context),
      child: Padding(
        padding: EdgeInsets.only(
          left: isMe ? 64 : 4,
          right: isMe ? 4 : 64,
          bottom: 4,
        ),
        child: Align(
          alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.72,
            ),
            decoration: BoxDecoration(
              color: bubbleBg,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(16),
                topRight: const Radius.circular(16),
                bottomLeft: Radius.circular(isMe ? 16 : 4),
                bottomRight: Radius.circular(isMe ? 4 : 16),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Reply preview
                  if (message.replyToContent != null) ...[
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: isMe
                            ? Colors.white.withOpacity(0.2)
                            : AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border(
                          left: BorderSide(
                            color: isMe ? Colors.white : AppColors.primary,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Text(
                        message.replyToContent!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: isMe ? Colors.white70 : AppColors.primary,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                  ],

                  // Message content
                  if (message.type == MessageType.text)
                    Text(
                      message.content,
                      style: TextStyle(
                        color: textColor,
                        fontSize: 15,
                        height: 1.4,
                      ),
                    )
                  else if (message.type == MessageType.image &&
                      message.mediaUrl != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        message.mediaUrl!,
                        width: 220,
                        height: 180,
                        fit: BoxFit.cover,
                      ),
                    )
                  else
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _typeIcon(message.type),
                          color: textColor,
                          size: 18,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _typeLabel(message.type),
                          style: TextStyle(color: textColor, fontSize: 14),
                        ),
                      ],
                    ),

                  const SizedBox(height: 4),

                  // Timestamp + Read status
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Flexible(
                        child: Text(
                          timeago.format(message.timestamp),
                          style: TextStyle(color: timeColor, fontSize: 10),
                        ),
                      ),
                      if (isMe) ...[
                        const SizedBox(width: 4),
                        Icon(
                          message.isRead ? Icons.done_all : Icons.done,
                          size: 14,
                          color: message.isRead
                              ? Colors.lightBlueAccent
                              : Colors.white70,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  IconData _typeIcon(MessageType type) {
    switch (type) {
      case MessageType.image: return Icons.image;
      case MessageType.video: return Icons.videocam;
      case MessageType.audio: return Icons.mic;
      case MessageType.pdf: return Icons.picture_as_pdf;
      case MessageType.location: return Icons.location_on;
      default: return Icons.message;
    }
  }

  String _typeLabel(MessageType type) {
    switch (type) {
      case MessageType.image: return 'Photo';
      case MessageType.video: return 'Video';
      case MessageType.audio: return 'Voice Message';
      case MessageType.pdf: return 'Document';
      case MessageType.location: return 'Location';
      default: return message.content;
    }
  }

  void _showMessageOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (_) => Wrap(
        children: [
          if (onReply != null)
            ListTile(
              leading: const Icon(Icons.reply),
              title: const Text('Reply'),
              onTap: () {
                Navigator.pop(context);
                onReply!(message.id, message.content);
              },
            ),
          ListTile(
            leading: const Icon(Icons.copy),
            title: const Text('Copy'),
            onTap: () {
              Clipboard.setData(ClipboardData(text: message.content));
              Navigator.pop(context);
            },
          ),
          if (isMe)
            ListTile(
              leading: const Icon(Icons.delete_outline, color: AppColors.error),
              title: const Text('Delete',
                  style: TextStyle(color: AppColors.error)),
              onTap: () => Navigator.pop(context),
            ),
        ],
      ),
    );
  }
}
