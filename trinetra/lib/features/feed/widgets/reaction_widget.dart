import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ANALYTICS

// ==============================================================
// 👁️🔥 TRINETRA MASTER REACTION PICKER (Blueprint Style)
// 100% REAL: Multi-Platform Hover/Touch Support, Haptics, Analytics
// ==============================================================

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
    // ⚡ Logic: High energy elastic pop-in
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    )..forward();
    
    HapticFeedback.mediumImpact(); // Pop vibration
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // 🔥 MOBILE TOUCH TRACKER: Track finger movement to scale emojis
  void _handleTouchUpdate(Offset localPosition) {
    const double emojiWidth = 44.0; // Padding included
    final int index = (localPosition.dx / emojiWidth).floor();
    if (index >= 0 && index < reactions.length) {
      if (_hoveredIndex != index) {
        setState(() => _hoveredIndex = index);
        HapticFeedback.selectionClick(); // Tick on every emoji change
      }
    } else {
      if (_hoveredIndex != null) setState(() => _hoveredIndex = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return TapRegion( // 🔥 AUTO DISMISS LOGIC
      onTapOutside: (_) => widget.onDismiss(),
      child: ScaleTransition(
        scale: CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
          decoration: BoxDecoration(
            color: isDark ? AppColors.cardDark : Colors.white,
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: isDark ? Colors.white10 : Colors.black12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.4 : 0.15),
                blurRadius: 15,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: GestureDetector(
            // 🔥 REAL MOBILE SWIPE/TOUCH SUPPORT
            onPanUpdate: (details) => _handleTouchUpdate(details.localPosition),
            onPanEnd: (_) {
              if (_hoveredIndex != null) {
                _selectReaction(reactions[_hoveredIndex!].label);
              }
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(reactions.length, (i) {
                final r = reactions[i];
                final isSelected = _hoveredIndex == i;
                
                return MouseRegion( // Desktop Support
                  onEnter: (_) {
                    setState(() => _hoveredIndex = i);
                    HapticFeedback.selectionClick();
                  },
                  onExit: (_) => setState(() => _hoveredIndex = null),
                  child: GestureDetector(
                    onTap: () => _selectReaction(r.label),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Floating Label
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            curve: Curves.easeOutBack,
                            transform: Matrix4.translationValues(0, isSelected ? -5 : 10, 0),
                            child: AnimatedOpacity(
                              opacity: isSelected ? 1.0 : 0.0,
                              duration: const Duration(milliseconds: 150),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  r.label,
                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 2),
                          // Animated Emoji
                          AnimatedScale(
                            scale: isSelected ? 1.5 : 1.0,
                            duration: const Duration(milliseconds: 200),
                            curve: Curves.easeOutBack,
                            child: Text(r.emoji, style: const TextStyle(fontSize: 28)),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }

  void _selectReaction(String label) {
    HapticFeedback.heavyImpact(); // Confirmed vibration
    LogRocketService.instance.track('REACTION_PICKED', properties: {'reaction': label});
    widget.onReaction(label);
  }
}

class _Reaction {
  final String emoji;
  final String label;
  final Color color;
  const _Reaction({required this.emoji, required this.label, required this.color});
}
