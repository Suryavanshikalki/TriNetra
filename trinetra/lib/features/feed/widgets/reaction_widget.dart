import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

/// Facebook-style 6 Animated Reactions Picker
class ReactionPicker extends StatefulWidget {
  final void Function(String reaction) onReaction;
  final VoidCallback onDismiss;

  const ReactionPicker({
    super.key,
    required this.onReaction,
    required this.onDismiss,
  });

  @override
  State<ReactionPicker> createState() => _ReactionPickerState();
}

class _ReactionPickerState extends State<ReactionPicker>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  int? _hoveredIndex;

  final List<_Reaction> reactions = const [
    _Reaction(emoji: '👍', label: 'Like', color: AppColors.reactionLike),
    _Reaction(emoji: '❤️', label: 'Love', color: AppColors.reactionLove),
    _Reaction(emoji: '😂', label: 'Haha', color: AppColors.reactionHaha),
    _Reaction(emoji: '😮', label: 'Wow', color: AppColors.reactionWow),
    _Reaction(emoji: '😢', label: 'Sad', color: AppColors.reactionSad),
    _Reaction(emoji: '😡', label: 'Angry', color: AppColors.reactionAngry),
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    )..forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return ScaleTransition(
      scale: CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(reactions.length, (i) {
            final r = reactions[i];
            final isHovered = _hoveredIndex == i;
            return MouseRegion(
              onEnter: (_) => setState(() => _hoveredIndex = i),
              onExit: (_) => setState(() => _hoveredIndex = null),
              child: GestureDetector(
                onTap: () => widget.onReaction(r.label),
                child: AnimatedScale(
                  scale: isHovered ? 1.4 : 1.0,
                  duration: const Duration(milliseconds: 150),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AnimatedOpacity(
                          opacity: isHovered ? 1.0 : 0.0,
                          duration: const Duration(milliseconds: 100),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.black87,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              r.label,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(r.emoji, style: const TextStyle(fontSize: 26)),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

class _Reaction {
  final String emoji;
  final String label;
  final Color color;
  const _Reaction({required this.emoji, required this.label, required this.color});
}
