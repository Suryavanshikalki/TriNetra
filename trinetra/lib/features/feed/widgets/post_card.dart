import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../core/constants/app_colors.dart';
import '../../../core/services/ai_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../controllers/feed_controller.dart';
import '../models/post_model.dart';
import 'reaction_widget.dart';

/// Facebook-style Post Card — uses PostModel with real Firebase reactions + AI translate
class PostCard extends ConsumerStatefulWidget {
  final PostModel post;

  const PostCard({super.key, required this.post});

  @override
  ConsumerState<PostCard> createState() => _PostCardState();
}

class _PostCardState extends ConsumerState<PostCard> {
  bool _showReactions = false;
  bool _isTranslated = false;
  bool _isTranslating = false;
  String? _translatedContent;

  String? get _myReaction {
    final myUid = ref.read(currentUserProvider)?.uid ?? '';
    return widget.post.userReactions[myUid];
  }

  bool get _isLiked => _myReaction != null;

  void _toggleReactions() =>
      setState(() => _showReactions = !_showReactions);

  void _onReact(String reaction) {
    setState(() => _showReactions = false);
    ref.read(feedControllerProvider.notifier).reactToPost(
      postId: widget.post.id,
      reaction: reaction.toLowerCase(),
    );
  }

  void _onLikeTap() {
    if (_isLiked) {
      // Toggle off (react with same = remove)
      ref.read(feedControllerProvider.notifier).reactToPost(
        postId: widget.post.id,
        reaction: _myReaction!,
      );
    } else {
      ref.read(feedControllerProvider.notifier).reactToPost(
        postId: widget.post.id,
        reaction: 'like',
      );
    }
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

    // Detect language: if content has Devanagari → translate to English, else to Hindi
    final isHindi = RegExp(r'[\u0900-\u097F]').hasMatch(widget.post.content);
    final targetLang = isHindi ? 'English' : 'Hindi';

    final translated = await AIService.instance.translateText(
      text: widget.post.content,
      targetLanguage: targetLang,
    );

    if (mounted) {
      setState(() {
        _translatedContent = translated;
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

    // Watch feed state to get updated reaction counts
    final feedState = ref.watch(feedControllerProvider);
    final livePost = feedState.posts.firstWhere(
      (p) => p.id == widget.post.id,
      orElse: () => widget.post,
    );

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
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.dividerLight,
                  backgroundImage: livePost.userAvatar.isNotEmpty
                      ? CachedNetworkImageProvider(livePost.userAvatar)
                      : null,
                  child: livePost.userAvatar.isEmpty
                      ? Text(
                          livePost.userName.isNotEmpty
                              ? livePost.userName[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        )
                      : null,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              livePost.userName,
                              style: TextStyle(
                                color: textColor,
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (livePost.isVerified) ...[
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
                        timeago.format(livePost.createdAt),
                        style: TextStyle(color: subColor, fontSize: 12),
                      ),
                    ],
                  ),
                ),
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
                      : livePost.content,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 6),
                // Translate Button
                GestureDetector(
                  onTap: _onTranslate,
                  child: _isTranslating
                      ? Row(
                          mainAxisSize: MainAxisSize.min,
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
                            Text(
                              'Translating...',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        )
                      : Text(
                          _isTranslated ? 'See original' : 'Translate',
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
          if (livePost.mediaUrls.isNotEmpty &&
              livePost.mediaType == 'image') ...[
            const SizedBox(height: 8),
            _PostImages(images: livePost.mediaUrls),
          ],

          const SizedBox(height: 8),

          // ─── Reaction Counts ──────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                if (livePost.totalReactions > 0) ...[
                  const Icon(
                    Icons.thumb_up,
                    size: 14,
                    color: AppColors.reactionLike,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${livePost.totalReactions}',
                    style: TextStyle(color: subColor, fontSize: 12),
                  ),
                  const Spacer(),
                ],
                Text(
                  '${livePost.commentsCount} comments · '
                  '${livePost.sharesCount} shares',
                  style: TextStyle(color: subColor, fontSize: 12),
                ),
              ],
            ),
          ),

          // ─── Divider ─────────────────────────────────────
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
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
                padding:
                    const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Like (long press = reaction picker)
                    GestureDetector(
                      onLongPress: _toggleReactions,
                      child: _ActionButton(
                        icon: _isLiked
                            ? _reactionIcon(_myReaction)
                            : Icons.thumb_up_outlined,
                        label: _myReaction != null
                            ? _capitalize(_myReaction!)
                            : 'Like',
                        color: _isLiked
                            ? _reactionColor(_myReaction)
                            : subColor,
                        onTap: _onLikeTap,
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
                    // Boost Post
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
                    onReaction: _onReact,
                    onDismiss: () =>
                        setState(() => _showReactions = false),
                  ),
                ),
            ],
          ),

          const SizedBox(height: 4),
        ],
      ),
    );
  }

  String _capitalize(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  IconData _reactionIcon(String? reaction) {
    switch (reaction) {
      case 'love':
        return Icons.favorite;
      case 'haha':
        return Icons.sentiment_very_satisfied;
      case 'wow':
        return Icons.sentiment_satisfied_alt;
      case 'sad':
        return Icons.sentiment_dissatisfied;
      case 'angry':
        return Icons.mood_bad;
      default:
        return Icons.thumb_up;
    }
  }

  Color _reactionColor(String? reaction) {
    switch (reaction) {
      case 'love':
        return AppColors.reactionLove;
      case 'haha':
      case 'wow':
      case 'sad':
        return AppColors.reactionHaha;
      case 'angry':
        return AppColors.reactionAngry;
      default:
        return AppColors.reactionLike;
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

// ─── Post Images Grid ─────────────────────────────────────────────
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
        errorWidget: (_, __, ___) => Container(
          height: 300,
          color: Colors.grey[200],
          child: const Icon(Icons.image_not_supported, size: 48),
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
                errorWidget: (_, __, ___) =>
                    Container(color: Colors.grey[200]),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─── Action Button ────────────────────────────────────────────────
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
