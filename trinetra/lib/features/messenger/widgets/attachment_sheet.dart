import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../controllers/messenger_controller.dart';
import '../models/message_model.dart';

/// WhatsApp-style Attachment Sheet for Messenger
class AttachmentSheet {
  static void show(
    BuildContext context, {
    required String conversationId,
    required ChatController controller,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _AttachmentSheetContent(
        conversationId: conversationId,
        controller: controller,
      ),
    );
  }
}

class _AttachmentSheetContent extends StatelessWidget {
  final String conversationId;
  final ChatController controller;

  const _AttachmentSheetContent({
    required this.conversationId,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: Colors.grey[400],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _AttachOption(
                  icon: Icons.photo_library,
                  label: 'Gallery',
                  color: const Color(0xFF9C27B0),
                  onTap: () => _sendAttachment(context, MessageType.image),
                ),
                _AttachOption(
                  icon: Icons.camera_alt,
                  label: 'Camera',
                  color: const Color(0xFFE91E63),
                  onTap: () => _sendAttachment(context, MessageType.image),
                ),
                _AttachOption(
                  icon: Icons.videocam,
                  label: 'Video',
                  color: const Color(0xFFF44336),
                  onTap: () => _sendAttachment(context, MessageType.video),
                ),
                _AttachOption(
                  icon: Icons.insert_drive_file,
                  label: 'Document',
                  color: const Color(0xFF2196F3),
                  onTap: () => _sendAttachment(context, MessageType.pdf),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _AttachOption(
                  icon: Icons.mic,
                  label: 'Audio',
                  color: const Color(0xFF4CAF50),
                  onTap: () => _sendAttachment(context, MessageType.audio),
                ),
                _AttachOption(
                  icon: Icons.location_on,
                  label: 'Location',
                  color: const Color(0xFFFF9800),
                  onTap: () => _sendAttachment(context, MessageType.location),
                ),
                _AttachOption(
                  icon: Icons.contact_phone,
                  label: 'Contact',
                  color: const Color(0xFF009688),
                  onTap: () => Navigator.pop(context),
                ),
                _AttachOption(
                  icon: Icons.currency_rupee,
                  label: 'Pay',
                  color: AppColors.accent,
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _sendAttachment(BuildContext context, MessageType type) {
    Navigator.pop(context);
    controller.sendMessage(
      content: '[${type.name.toUpperCase()}]',
      type: type,
    );
  }
}

class _AttachOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _AttachOption({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
