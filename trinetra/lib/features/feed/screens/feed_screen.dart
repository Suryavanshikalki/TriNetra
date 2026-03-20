import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../stories/widgets/story_bar.dart';
import '../widgets/post_card.dart';
import '../widgets/create_post_bar.dart';

/// Main Feed Screen — Facebook 2026 style
class FeedScreen extends ConsumerStatefulWidget {
  const FeedScreen({super.key});

  @override
  ConsumerState<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends ConsumerState<FeedScreen> {
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false;

  // Placeholder posts for initial UI
  final List<PostData> _posts = _generateSamplePosts();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoadingMore) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_isLoadingMore) return;
    setState(() => _isLoadingMore = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) setState(() => _isLoadingMore = false);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return RefreshIndicator(
      onRefresh: () async {
        await Future.delayed(const Duration(seconds: 1));
      },
      color: AppColors.primary,
      child: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // ─── Stories Bar ──────────────────────────────────
          const SliverToBoxAdapter(child: StoryBar()),

          // ─── Divider ─────────────────────────────────────
          SliverToBoxAdapter(
            child: Divider(
              height: 8,
              thickness: 8,
              color: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
            ),
          ),

          // ─── Create Post Bar ─────────────────────────────
          const SliverToBoxAdapter(child: CreatePostBar()),

          // ─── Divider ─────────────────────────────────────
          SliverToBoxAdapter(
            child: Divider(
              height: 8,
              thickness: 8,
              color: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
            ),
          ),

          // ─── Feed Posts ───────────────────────────────────
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                if (index >= _posts.length) return null;
                return Column(
                  children: [
                    PostCard(post: _posts[index]),
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
              childCount: _posts.length,
            ),
          ),

          // ─── Loading Indicator ────────────────────────────
          if (_isLoadingMore)
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
        ],
      ),
    );
  }
}

// ─── Sample Posts Data ────────────────────────────────────────────
List<PostData> _generateSamplePosts() {
  return [
    PostData(
      id: '1',
      userId: 'u1',
      userName: 'Rahul Sharma',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      content:
          'Just explored the Himalayas! The view is breathtaking. Nature is truly divine. TriNetra connected me with amazing hikers from around the world!',
      images: ['https://picsum.photos/id/29/600/400'],
      likes: 432,
      comments: 87,
      shares: 24,
      timeAgo: '2h ago',
      isVerified: true,
    ),
    PostData(
      id: '2',
      userId: 'u2',
      userName: 'Priya Patel',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      content:
          'Amazing sunset from my rooftop today! Sometimes you just need to pause and appreciate life.',
      images: [
        'https://picsum.photos/id/15/600/400',
        'https://picsum.photos/id/16/600/400',
      ],
      likes: 1204,
      comments: 156,
      shares: 89,
      timeAgo: '4h ago',
      isVerified: false,
    ),
    PostData(
      id: '3',
      userId: 'u3',
      userName: 'Tech with Arun',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      content:
          'Just launched our new Flutter app! 6 platforms from a single codebase. The future of mobile development is here!',
      images: [],
      likes: 2891,
      comments: 342,
      shares: 567,
      timeAgo: '6h ago',
      isVerified: true,
    ),
  ];
}

/// Post data model for feed items
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
