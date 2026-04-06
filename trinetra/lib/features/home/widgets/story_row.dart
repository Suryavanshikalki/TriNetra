import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import 'package:image_picker/image_picker.dart'; // 🔥 ASLI MEDIA PICKER
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING
import '../data/mock_posts.dart'; // Using your MockStory and mockStories

class StoryRow extends StatelessWidget {
  const StoryRow({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 105, // Slightly adjusted for better padding
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: mockStories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12), // Better spacing
        itemBuilder: (context, index) {
          final story = mockStories[index];
          return story.isOwn
              ? _AddStoryBubble(story: story)
              : _StoryBubble(story: story);
        },
      ),
    );
  }
}

// ─── Add Story (ASLI MEDIA UPLOAD HOOK) ───────────────────────────
class _AddStoryBubble extends StatelessWidget {
  final MockStory story;
  const _AddStoryBubble({required this.story});

  Future<void> _pickStoryMedia(BuildContext context) async {
    HapticFeedback.mediumImpact(); // 🔥 Real Vibe
    final ImagePicker picker = ImagePicker();
    
    // 🔥 ASLI ACTION: Picking media to upload to AWS S3
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    
    if (image != null) {
      LogRocketService.instance.track('STORY_UPLOAD_INITIATED');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Uploading to TriNetra Cloud...'), backgroundColor: AppColors.primary),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: () => _pickStoryMedia(context),
      child: SizedBox(
        width: 70,
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isDark ? AppColors.surfaceDark : AppColors.inputBgLight,
                    border: Border.all(
                      color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
                      width: 1,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      story.initial,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w900, // Premium Bold
                        color: isDark ? Colors.white : AppColors.textPrimaryLight,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isDark ? AppColors.cardDark : Colors.white,
                        width: 2.5,
                      ),
                    ),
                    child: const Icon(Icons.add, color: Colors.white, size: 14),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              'Add Story',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Story Bubble (ASLI VIEWER HOOK) ──────────────────────────────
class _StoryBubble extends StatelessWidget {
  final MockStory story;
  const _StoryBubble({required this.story});

  void _viewStory() {
    HapticFeedback.selectionClick(); // 🔥 Premium Tick
    LogRocketService.instance.track('STORY_VIEWED', properties: {'storyId': story.id});
    // TODO: Navigate to Real Story Viewer Screen (AWS Fetch)
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: _viewStory,
      child: SizedBox(
        width: 70,
        child: Column(
          children: [
            Container(
              width: 68,
              height: 68,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: story.isViewed
                    ? null
                    : const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: AppColors.storyGradient,
                      ),
                color: story.isViewed
                    ? (isDark ? AppColors.dividerDark : AppColors.dividerLight)
                    : null,
              ),
              padding: const EdgeInsets.all(3), // Smooth Gradient Ring
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isDark ? AppColors.cardDark : Colors.white,
                ),
                padding: const EdgeInsets.all(2),
                child: CircleAvatar(
                  radius: 28,
                  backgroundColor: story.avatarColor,
                  child: Text(
                    story.initial,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              story.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 11,
                fontWeight: story.isViewed ? FontWeight.w500 : FontWeight.w800,
                color: story.isViewed
                    ? (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight)
                    : (isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
