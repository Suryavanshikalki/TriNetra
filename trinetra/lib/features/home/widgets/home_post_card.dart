import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../data/mock_posts.dart';

/// Beautiful PostCard for the Super-App feed.
/// Includes a PDF/file attachment placeholder in the comment area.
class HomePostCard extends StatefulWidget {
  final MockPost post;
  const HomePostCard({super.key, required this.post});

  @override
  State<HomePostCard> createState() => _HomePostCardState();
}

class _HomePostCardState extends State<HomePostCard>
    with SingleTickerProviderStateMixin {
  late bool _liked;
  late int _likeCount;
  late AnimationController _likeCtrl;
  late Animation<double> _likeScale;

  @override
  void initState() {
    super.initState();
    _liked = widget.post.isLiked;
    _likeCount = widget.post.likeCount;
    _likeCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 200));
    _likeScale = TweenSequence([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.35), weight: 50),
      TweenSequenceItem(tween: Tween(begin: 1.35, end: 1.0), weight: 50),
    ]).animate(CurvedAnimation(parent: _likeCtrl, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _likeCtrl.dispose();
    super.dispose();
  }

  void _toggleLike() {
    setState(() {
      _liked = !_liked;
      _likeCount += _liked ? 1 : -1;
    });
    _likeCtrl.forward(from: 0);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.cardDark : Colors.white;
    final textPrimary =
        isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final textSecondary =
        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;
    final divider =
        isDark ? AppColors.dividerDark : AppColors.dividerLight;

    return Container(
      color: cardBg,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Header ──────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 8, 8),
            child: Row(
              children: [
                // Avatar
                CircleAvatar(
                  radius: 20,
                  backgroundColor: widget.post.userColor,
                  child: Text(
                    widget.post.userInitial,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            widget.post.userName,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: textPrimary,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.verified,
                              color: AppColors.verifiedBlue, size: 14),
                        ],
                      ),
                      Text(
                        widget.post.timeAgo,
                        style: TextStyle(fontSize: 11, color: textSecondary),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.more_horiz, color: textSecondary),
                  onPressed: () {},
                  splashRadius: 20,
                ),
              ],
            ),
          ),

          // ── Post Content ─────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 10),
            child: Text(
              widget.post.content,
              style: TextStyle(
                fontSize: 14,
                color: textPrimary,
                height: 1.45,
              ),
            ),
          ),

          // ── Media Placeholder ─────────────────────────────────
          if (widget.post.mediaBgColor != null)
            Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    widget.post.mediaBgColor!,
                    widget.post.mediaBgColor!.withValues(alpha: 0.6),
                  ],
                ),
              ),
              child: Center(
                child: Icon(
                  Icons.image_outlined,
                  size: 52,
                  color: Colors.white.withValues(alpha: 0.7),
                ),
              ),
            ),

          // ── Reaction Summary ──────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              children: [
                // Reaction icons
                Row(
                  children: [
                    _ReactionDot(color: AppColors.reactionLike,
                        icon: Icons.thumb_up),
                    const SizedBox(width: 2),
                    _ReactionDot(color: AppColors.reactionLove,
                        icon: Icons.favorite),
                    const SizedBox(width: 2),
                    _ReactionDot(color: AppColors.reactionHaha,
                        icon: Icons.sentiment_very_satisfied),
                  ],
                ),
                const SizedBox(width: 6),
                Text(
                  _formatCount(_likeCount),
                  style: TextStyle(fontSize: 13, color: textSecondary),
                ),
                const Spacer(),
                Text(
                  '${_formatCount(widget.post.commentCount)} comments  '
                  '· ${_formatCount(widget.post.shareCount)} shares',
                  style: TextStyle(fontSize: 12, color: textSecondary),
                ),
              ],
            ),
          ),

          Divider(color: divider, height: 1),

          // ── Action Bar ───────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
            child: Row(
              children: [
                _ActionButton(
                  icon: _liked ? Icons.thumb_up : Icons.thumb_up_outlined,
                  label: 'Like',
                  color: _liked ? AppColors.primary : textSecondary,
                  scaleAnim: _likeScale,
                  onTap: _toggleLike,
                ),
                _ActionButton(
                  icon: Icons.chat_bubble_outline,
                  label: 'Comment',
                  color: textSecondary,
                  onTap: () {},
                ),
                _ActionButton(
                  icon: Icons.share_outlined,
                  label: 'Share',
                  color: textSecondary,
                  onTap: () {},
                ),
              ],
            ),
          ),

          Divider(color: divider, height: 1),

          // ── Comment Input Row ─────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 10),
            child: Row(
              children: [
                // User avatar
                CircleAvatar(
                  radius: 16,
                  backgroundColor: AppColors.primary,
                  child: const Text('Y',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w700)),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Container(
                    height: 36,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.inputBgDark : AppColors.inputBgLight,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            'Write a comment…',
                            style: TextStyle(
                                fontSize: 13, color: textSecondary),
                          ),
                        ),
                        // Camera / image
                        Icon(Icons.camera_alt_outlined,
                            size: 18, color: textSecondary),
                        const SizedBox(width: 8),
                        // ─ PDF / File attach placeholder ────────────
                        // TODO: wire up file picker in Phase 2
                        Tooltip(
                          message: 'Attach PDF / File (coming soon)',
                          child: Icon(Icons.attach_file,
                              size: 18, color: textSecondary),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatCount(int n) {
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return '$n';
  }
}

// ─── Reaction dot ─────────────────────────────────────────────────
class _ReactionDot extends StatelessWidget {
  final Color color;
  final IconData icon;
  const _ReactionDot({required this.color, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 18,
      height: 18,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
      child: Icon(icon, size: 10, color: Colors.white),
    );
  }
}

// ─── Action button ────────────────────────────────────────────────
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  final Animation<double>? scaleAnim;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
    this.scaleAnim,
  });

  @override
  Widget build(BuildContext context) {
    Widget iconWidget = Icon(icon, size: 20, color: color);
    if (scaleAnim != null) {
      iconWidget = ScaleTransition(scale: scaleAnim!, child: iconWidget);
    }
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(6),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              iconWidget,
              const SizedBox(width: 5),
              Text(label,
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: color)),
            ],
          ),
        ),
      ),
    );
  }
}
