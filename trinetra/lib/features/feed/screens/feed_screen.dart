import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../core/config/ads_config.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/providers/user_providers.dart';
import '../../../core/services/ads_service.dart';
import '../../stories/widgets/story_bar.dart';
import '../controllers/feed_controller.dart';
import '../models/post_model.dart';
import '../widgets/post_card.dart';
import '../widgets/create_post_bar.dart';
import '../screens/create_post_screen.dart';
import '../../../widgets/smart_download_section.dart';

/// Main Feed Screen — real-time Firebase Firestore feed
class FeedScreen extends ConsumerStatefulWidget {
  const FeedScreen({super.key});

  @override
  ConsumerState<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends ConsumerState<FeedScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !ref.read(feedControllerProvider).isLoading) {
      ref.read(feedControllerProvider.notifier).loadMore();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final feedState = ref.watch(feedControllerProvider);

    // Use Firestore posts if available, otherwise show sample posts
    final posts = feedState.posts.isNotEmpty
        ? feedState.posts
        : _samplePosts();

    return RefreshIndicator(
      onRefresh: () => ref.read(feedControllerProvider.notifier).refresh(),
      color: AppColors.primary,
      child: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // ─── Stories Bar ──────────────────────────────────
          const SliverToBoxAdapter(child: StoryBar()),

          // ─── Section Divider ─────────────────────────────
          SliverToBoxAdapter(
            child: Divider(
              height: 8,
              thickness: 8,
              color: isDark
                  ? AppColors.backgroundDark
                  : AppColors.backgroundLight,
            ),
          ),

          // ─── Create Post Bar ─────────────────────────────
          SliverToBoxAdapter(
            child: CreatePostBar(
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreatePostScreen()),
              ),
            ),
          ),

          // ─── Section Divider ─────────────────────────────
          SliverToBoxAdapter(
            child: Divider(
              height: 8,
              thickness: 8,
              color: isDark
                  ? AppColors.backgroundDark
                  : AppColors.backgroundLight,
            ),
          ),

          // ─── Smart Download Section (web-only) ────────────
          const SliverToBoxAdapter(
            child: SmartDownloadSection(),
          ),

          // ─── Feed Posts with inline Banner Ads ────────────
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                // Insert a banner ad slot every feedAdFrequency posts
                final adFreq = AdsConfig.feedAdFrequency + 1;
                if (!kIsWeb && index > 0 && index % adFreq == 0) {
                  return const _FeedAdSlot();
                }
                final postIndex = index - (index ~/ adFreq);
                if (postIndex >= posts.length) return null;
                return Column(
                  children: [
                    PostCard(post: posts[postIndex]),
                    Divider(
                      height: 8,
                      thickness: 8,
                      color: isDark
                          ? AppColors.backgroundDark
                          : AppColors.backgroundLight,
                    ),
                  ],
                );
              },
              childCount: posts.length + (posts.length ~/ AdsConfig.feedAdFrequency),
            ),
          ),

          // ─── Loading / Error ──────────────────────────────
          if (feedState.isLoading && posts.isNotEmpty)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Center(
                  child: CircularProgressIndicator(
                    color: AppColors.primary,
                    strokeWidth: 2,
                  ),
                ),
              ),
            ),

          const SliverToBoxAdapter(child: SizedBox(height: 16)),
        ],
      ),
    );
  }
}

// ─── Feed Ad Slot ─────────────────────────────────────────────────
/// Renders a banner ad inline in the feed on Android/iOS.
/// AUTOMATICALLY HIDDEN for Creator Pro subscribers (ad-free logic).
/// Invisible on web — AdMob doesn't support Flutter Web.
class _FeedAdSlot extends ConsumerWidget {
  const _FeedAdSlot();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ── Creator Pro = Zero Ads ────────────────────────────────────
    final adsEnabled = ref.watch(adsEnabledProvider);
    if (!adsEnabled || kIsWeb || !AdsService.instance.isAvailable) {
      return const SizedBox.shrink();
    }
    return Container(
      color: Theme.of(context).brightness == Brightness.dark
          ? AppColors.cardDark
          : Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: const Column(
        children: [
          Padding(
            padding: EdgeInsets.only(left: 8, bottom: 2),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Sponsored',
                style: TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ),
          ),
          TriNetraBannerAd(),
        ],
      ),
    );
  }
}

/// Sample posts shown when Firestore has no data (Firebase not yet configured)
List<PostModel> _samplePosts() {
  final now = DateTime.now();
  return [
    PostModel(
      id: 'sample_1',
      userId: 'u1',
      userName: 'Rahul Sharma',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
      content:
          'Just explored the Himalayas! The view is breathtaking. Nature is truly divine. '
          'TriNetra connected me with amazing hikers from around the world! 🏔️',
      mediaUrls: ['https://picsum.photos/id/29/600/400'],
      mediaType: 'image',
      reactions: {
        'like': 432,
        'love': 56,
        'haha': 0,
        'wow': 12,
        'sad': 0,
        'angry': 0,
      },
      userReactions: {},
      commentsCount: 87,
      sharesCount: 24,
      createdAt: now.subtract(const Duration(hours: 2)),
    ),
    PostModel(
      id: 'sample_2',
      userId: 'u2',
      userName: 'Priya Patel',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      content:
          'Amazing sunset from my rooftop today! Sometimes you just need to pause and '
          'appreciate life. Golden hour hits different. 🌅',
      mediaUrls: [
        'https://picsum.photos/id/15/600/400',
        'https://picsum.photos/id/16/600/400',
      ],
      mediaType: 'image',
      reactions: {
        'like': 1204,
        'love': 320,
        'haha': 0,
        'wow': 89,
        'sad': 0,
        'angry': 0,
      },
      userReactions: {},
      commentsCount: 156,
      sharesCount: 89,
      createdAt: now.subtract(const Duration(hours: 4)),
    ),
    PostModel(
      id: 'sample_3',
      userId: 'u3',
      userName: 'Tech with Arun',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      isVerified: true,
      content:
          'Just launched our new Flutter app! 6 platforms from a single codebase. '
          'The future of cross-platform development is here! 🚀',
      reactions: {
        'like': 2891,
        'love': 654,
        'haha': 0,
        'wow': 234,
        'sad': 0,
        'angry': 0,
      },
      userReactions: {},
      commentsCount: 342,
      sharesCount: 567,
      createdAt: now.subtract(const Duration(hours: 6)),
    ),
    PostModel(
      id: 'sample_4',
      userId: 'u4',
      userName: 'Meera Krishnan',
      userAvatar: 'https://i.pravatar.cc/150?img=9',
      content:
          'आज का दिन बहुत अच्छा रहा! नई जगह गई और नए दोस्त बनाए। '
          'ज़िंदगी में छोटी-छोटी खुशियाँ बहुत ज़रूरी हैं। 😊',
      reactions: {
        'like': 543,
        'love': 89,
        'haha': 12,
        'wow': 0,
        'sad': 0,
        'angry': 0,
      },
      userReactions: {},
      commentsCount: 67,
      sharesCount: 23,
      createdAt: now.subtract(const Duration(hours: 8)),
    ),
  ];
}

// Keep PostData for backward compatibility
@Deprecated('Use PostModel instead')
class PostData {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final String content;
  final List<String> images;
  final int likes;
  final int comments;
  final int shares;
  final String timeAgo;
  final bool isVerified;

  const PostData({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userAvatar,
    required this.content,
    required this.images,
    required this.likes,
    required this.comments,
    required this.shares,
    required this.timeAgo,
    required this.isVerified,
  });
}
