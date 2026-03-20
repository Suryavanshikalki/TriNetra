import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../screens/feed_screen.dart';
import 'reaction_widget.dart';

/// Facebook-style Post Card with 6 animated reactions,
/// translate button, boost button, share, and comment.
class PostCard extends StatefulWidget {
  final PostData post;
  const PostCard({super.key, required this.post});

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  bool _isLiked = false;
  bool _showReactions = false;
  String? _activeReaction;
  bool _isTranslated = false;
  bool _isTranslating = false;
  String? _translatedContent;

  void _toggleReactions() => setState(() => _showReactions = !_showReactions);

  void _onReaction(String reaction) {
    setState(() {
      _activeReaction = reaction;
      _isLiked = true;
      _showReactions = false;
    });
  }

  Future<void> _onTranslate() async {
    if (_isTranslated) {
      setState(() {
        _isTranslated = false;
        _translatedContent = null;
      });
      return;
    }
    setState(() => _isTranslating = true);
    await Future.delayed(const Duration(milliseconds: 800));
    if (mounted) {
      setState(() {
        _translatedContent =
            '[Hindi Translation] ${widget.post.content.substring(0, 40)}...';
        _isTranslated = true;
        _isTranslating = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.cardDark : AppColors.cardLight;
    final textColor =
        isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final subColor =
        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;

    return Container(
      color: cardBg,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ─── Post Header ──────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
            child: Row(
              children: [
                // Avatar
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.dividerLight,
                  backgroundImage: CachedNetworkImageProvider(
                    widget.post.userAvatar,
                  ),
                ),
                const SizedBox(width: 10),
                // Name & Time
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            widget.post.userName,
                            style: TextStyle(
                              color: textColor,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          if (widget.post.isVerified) ...[
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.verified,
                              color: AppColors.verifiedBlue,
                              size: 14,
                            ),
                          ],
                        ],
                      ),
                      Text(
                        widget.post.timeAgo,
                        style: TextStyle(color: subColor, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                // Options Menu
                IconButton(
                  icon: Icon(Icons.more_horiz, color: subColor),
                  onPressed: () => _showPostOptions(context),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ),

          // ─── Post Content ─────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isTranslated && _translatedContent != null
                      ? _translatedContent!
                      : widget.post.content,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 8),
                // Translate Button
                GestureDetector(
                  onTap: _onTranslate,
                  child: _isTranslating
                      ? Row(
                          children: [
                            const SizedBox(
                              width: 12,
                              height: 12,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: AppColors.primary,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text('Translating...',
                                style: TextStyle(
                                    color: AppColors.primary, fontSize: 12)),
                          ],
                        )
                      : Text(
                          _isTranslated
                              ? 'See original'
                              : 'Translate',
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                ),
              ],
            ),
          ),

          // ─── Post Images ──────────────────────────────────
          if (widget.post.images.isNotEmpty) ...[
            const SizedBox(height: 8),
            _PostImages(images: widget.post.images),
          ],

          const SizedBox(height: 8),

          // ─── Like/Comment/Share Counts ────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                // Reaction count
                if (widget.post.likes > 0) ...[
                  const Icon(Icons.thumb_up,
                      size: 14, color: AppColors.reactionLike),
                  const SizedBox(width: 4),
                  Text('${widget.post.likes}',
                      style: TextStyle(color: subColor, fontSize: 12)),
                  const Spacer(),
                ],
                Text(
                  '${widget.post.comments} comments · ${widget.post.shares} shares',
                  style: TextStyle(color: subColor, fontSize: 12),
                ),
              ],
            ),
          ),

          // ─── Divider ─────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Divider(
              height: 1,
              color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
            ),
          ),

          // ─── Action Buttons ───────────────────────────────
          Stack(
            clipBehavior: Clip.none,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Like Button (long press = reaction picker)
                    GestureDetector(
                      onLongPress: _toggleReactions,
                      child: _ActionButton(
                        icon: _isLiked
                            ? _reactionIcon(_activeReaction)
                            : Icons.thumb_up_outlined,
                        label: _activeReaction ?? 'Like',
                        color: _isLiked
                            ? _reactionColor(_activeReaction)
                            : subColor,
                        onTap: () => setState(() => _isLiked = !_isLiked),
                      ),
                    ),
                    // Comment
                    _ActionButton(
                      icon: Icons.chat_bubble_outline,
                      label: 'Comment',
                      color: subColor,
                      onTap: () {},
                    ),
                    // Share
                    _ActionButton(
                      icon: Icons.share_outlined,
                      label: 'Share',
                      color: subColor,
                      onTap: () {},
                    ),
                    // Boost Post (Creator feature)
                    _ActionButton(
                      icon: Icons.rocket_launch_outlined,
                      label: 'Boost',
                      color: AppColors.accent,
                      onTap: () => _showBoostPost(context),
                    ),
                  ],
                ),
              ),

              // ─── Reaction Picker ──────────────────────────
              if (_showReactions)
                Positioned(
                  top: -60,
                  left: 12,
                  child: ReactionPicker(
                    onReaction: _onReaction,
                    onDismiss: () => setState(() => _showReactions = false),
                  ),
                ),
            ],
          ),

          const SizedBox(height: 4),
        ],
      ),
    );
  }

  IconData _reactionIcon(String? reaction) {
    switch (reaction) {
      case 'Love': return Icons.favorite;
      case 'Haha': return Icons.sentiment_very_satisfied;
      case 'Wow': return Icons.sentiment_satisfied_alt;
      case 'Sad': return Icons.sentiment_dissatisfied;
      case 'Angry': return Icons.mood_bad;
      default: return Icons.thumb_up;
    }
  }

  Color _reactionColor(String? reaction) {
    switch (reaction) {
      case 'Love': return AppColors.reactionLove;
      case 'Haha':
      case 'Wow':
      case 'Sad': return AppColors.reactionHaha;
      case 'Angry': return AppColors.reactionAngry;
      default: return AppColors.reactionLike;
    }
  }

  void _showPostOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (_) => Wrap(
        children: [
          ListTile(
            leading: const Icon(Icons.bookmark_border),
            title: const Text('Save post'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.hide_source_outlined),
            title: const Text('Hide post'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.report_outlined),
            title: const Text('Report post'),
            onTap: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  void _showBoostPost(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Boost Post'),
        content: const Text(
          'Promote this post to reach more people.\nPowered by TriNetra Pay.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Boost Now'),
          ),
        ],
      ),
    );
  }
}

// ─── Post Images Grid ────────────────────────────────────────────
class _PostImages extends StatelessWidget {
  final List<String> images;
  const _PostImages({required this.images});

  @override
  Widget build(BuildContext context) {
    if (images.length == 1) {
      return CachedNetworkImage(
        imageUrl: images[0],
        width: double.infinity,
        height: 300,
        fit: BoxFit.cover,
        placeholder: (_, __) => Container(
          height: 300,
          color: Colors.grey[200],
          child: const Center(child: CircularProgressIndicator()),
        ),
      );
    }

    return SizedBox(
      height: 200,
      child: Row(
        children: images.take(3).map((img) {
          return Expanded(
            child: Padding(
              padding: const EdgeInsets.all(1),
              child: CachedNetworkImage(
                imageUrl: img,
                fit: BoxFit.cover,
                height: 200,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─── Action Button Widget ─────────────────────────────────────────
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
