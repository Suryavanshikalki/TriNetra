import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';

/// Facebook-style 24h Stories horizontal bar
class StoryBar extends StatelessWidget {
  const StoryBar({super.key});

  static final List<_StoryItem> _stories = [
    _StoryItem(
      isCreate: true,
      name: 'Add Story',
      avatarUrl: '',
      gradientColors: [AppColors.primary, AppColors.primaryDark],
    ),
    _StoryItem(
      isCreate: false,
      name: 'Rahul',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      gradientColors: [Color(0xFFE1306C), Color(0xFFF77737)],
    ),
    _StoryItem(
      isCreate: false,
      name: 'Priya',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      gradientColors: [Color(0xFF833AB4), Color(0xFFE1306C)],
    ),
    _StoryItem(
      isCreate: false,
      name: 'Arun',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      gradientColors: [Color(0xFF1877F2), Color(0xFF42B72A)],
    ),
    _StoryItem(
      isCreate: false,
      name: 'Meera',
      avatarUrl: 'https://i.pravatar.cc/150?img=9',
      gradientColors: [Color(0xFFFCAF45), Color(0xFFE1306C)],
    ),
    _StoryItem(
      isCreate: false,
      name: 'Dev',
      avatarUrl: 'https://i.pravatar.cc/150?img=15',
      gradientColors: [Color(0xFF42B72A), Color(0xFF1877F2)],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      color: isDark ? AppColors.cardDark : Colors.white,
      height: 190,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        itemCount: _stories.length,
        itemBuilder: (context, index) {
          final story = _stories[index];
          return story.isCreate
              ? _CreateStoryCard(story: story)
              : _StoryCard(story: story);
        },
      ),
    );
  }
}

class _StoryCard extends StatelessWidget {
  final _StoryItem story;
  const _StoryCard({required this.story});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        width: 110,
        margin: const EdgeInsets.only(right: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: story.gradientColors,
          ),
        ),
        child: Stack(
          children: [
            // Background image
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: CachedNetworkImage(
                imageUrl: 'https://picsum.photos/seed/${story.name}/110/170',
                width: 110,
                height: double.infinity,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: story.gradientColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                ),
              ),
            ),
            // Gradient overlay
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.6),
                  ],
                ),
              ),
            ),
            // Avatar with story ring
            Positioned(
              top: 8,
              left: 8,
              child: Container(
                padding: const EdgeInsets.all(2.5),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(colors: AppColors.storyGradient),
                ),
                child: CircleAvatar(
                  radius: 18,
                  backgroundImage: CachedNetworkImageProvider(story.avatarUrl),
                ),
              ),
            ),
            // Name
            Positioned(
              bottom: 8,
              left: 6,
              right: 6,
              child: Text(
                story.name,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  shadows: [
                    Shadow(color: Colors.black54, blurRadius: 4),
                  ],
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CreateStoryCard extends StatelessWidget {
  final _StoryItem story;
  const _CreateStoryCard({required this.story});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: () {},
      child: Container(
        width: 110,
        margin: const EdgeInsets.only(right: 8),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.add, color: Colors.white, size: 26),
            ),
            const SizedBox(height: 8),
            Text(
              'Create Story',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: isDark
                    ? AppColors.textPrimaryDark
                    : AppColors.textPrimaryLight,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StoryItem {
  final bool isCreate;
  final String name;
  final String avatarUrl;
  final List<Color> gradientColors;

  const _StoryItem({
    required this.isCreate,
    required this.name,
    required this.avatarUrl,
    required this.gradientColors,
  });
}
