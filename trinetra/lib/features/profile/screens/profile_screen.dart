import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/firebase_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../feed/models/post_model.dart';

// ─── Profile Data Provider ────────────────────────────────────────
final profileDataProvider =
    FutureProvider.autoDispose.family<Map<String, dynamic>?, String>(
  (ref, userId) async {
    final doc = await FirebaseService.instance.firestore
        .collection('users')
        .doc(userId)
        .get();
    return doc.data();
  },
);

// ─── User Posts Provider (stream) ─────────────────────────────────
final userPostsProvider =
    StreamProvider.autoDispose.family<List<PostModel>, String>(
  (ref, userId) => FirebaseService.instance.firestore
      .collection('posts')
      .where('userId', isEqualTo: userId)
      .orderBy('createdAt', descending: true)
      .limit(12)
      .snapshots()
      .map((snap) =>
          snap.docs.map((d) => PostModel.fromFirestore(d)).toList()),
);

// ─── Profile Screen ────────────────────────────────────────────────
class ProfileScreen extends ConsumerStatefulWidget {
  final String? userId;
  const ProfileScreen({super.key, this.userId});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final me = ref.watch(currentUserProvider);
    final targetId = widget.userId ?? me?.uid;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (targetId == null) {
      return Scaffold(
        backgroundColor:
            isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.account_circle_outlined,
                  size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text('Please sign in to view profile',
                  style: TextStyle(fontSize: 16)),
            ],
          ),
        ),
      );
    }

    final isMe = me?.uid == targetId;
    final profileAsync = ref.watch(profileDataProvider(targetId));
    final postsAsync = ref.watch(userPostsProvider(targetId));

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: profileAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (_, __) => const Center(child: Text('Could not load profile')),
        data: (userData) => NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) => [
            _ProfileSliverAppBar(
              userData: userData ?? {},
              targetId: targetId,
              isMe: isMe,
              isDark: isDark,
              tabController: _tabController,
            ),
          ],
          body: TabBarView(
            controller: _tabController,
            children: [
              // ─── Posts Grid ──────────────────────────────
              postsAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
                error: (_, __) => _PostsGrid(posts: const []),
                data: (posts) => _PostsGrid(posts: posts),
              ),
              // ─── About ───────────────────────────────────
              _AboutTab(userData: userData ?? {}, isDark: isDark),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Sliver App Bar ───────────────────────────────────────────────
class _ProfileSliverAppBar extends StatelessWidget {
  final Map<String, dynamic> userData;
  final String targetId;
  final bool isMe;
  final bool isDark;
  final TabController tabController;

  const _ProfileSliverAppBar({
    required this.userData,
    required this.targetId,
    required this.isMe,
    required this.isDark,
    required this.tabController,
  });

  @override
  Widget build(BuildContext context) {
    final displayName =
        (userData['displayName'] as String?)?.isNotEmpty == true
            ? userData['displayName'] as String
            : (userData['phone'] as String?) ?? 'TriNetra User';
    final photoUrl = userData['photoUrl'] as String? ?? '';
    final bio = userData['bio'] as String? ?? '';
    final followers = userData['followers'] ?? 0;
    final following = userData['following'] ?? 0;
    final postsCount = userData['postsCount'] ?? 0;
    final isVerified = userData['isVerified'] ?? false;
    final initial =
        displayName.isNotEmpty ? displayName[0].toUpperCase() : 'T';

    return SliverAppBar(
      expandedHeight: 320,
      floating: false,
      pinned: true,
      backgroundColor: isDark ? AppColors.cardDark : Colors.white,
      leading: IconButton(
        icon: Icon(
          Icons.arrow_back_ios_new,
          size: 20,
          color: isDark ? Colors.white : Colors.black87,
        ),
        onPressed: () => Navigator.maybePop(context),
      ),
      actions: [
        if (isMe)
          IconButton(
            icon: Icon(
              Icons.edit_outlined,
              color: isDark ? Colors.white : Colors.black87,
            ),
            onPressed: () => _showEditProfile(context),
          ),
        IconButton(
          icon: Icon(
            Icons.more_horiz,
            color: isDark ? Colors.white : Colors.black87,
          ),
          onPressed: () {},
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        collapseMode: CollapseMode.pin,
        background: Container(
          color: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 60),
              // ─── Avatar ──────────────────────────────────
              Stack(
                children: [
                  Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.primary,
                        width: 2.5,
                      ),
                    ),
                    child: ClipOval(
                      child: photoUrl.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: photoUrl,
                              fit: BoxFit.cover,
                              errorWidget: (_, __, ___) => _InitialsAvatar(
                                initial: initial,
                                size: 96,
                              ),
                            )
                          : _InitialsAvatar(initial: initial, size: 96),
                    ),
                  ),
                  if (isVerified)
                    Positioned(
                      bottom: 2,
                      right: 2,
                      child: Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: AppColors.verifiedBlue,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.verified,
                          color: Colors.white,
                          size: 14,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              // ─── Name ─────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    displayName,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: isDark
                          ? AppColors.textPrimaryDark
                          : AppColors.textPrimaryLight,
                    ),
                  ),
                  if (isVerified) ...[
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.verified,
                      color: AppColors.verifiedBlue,
                      size: 18,
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 4),
              // ─── Bio ──────────────────────────────────────
              if (bio.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Text(
                    bio,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark
                          ? AppColors.textSecondaryDark
                          : AppColors.textSecondaryLight,
                    ),
                  ),
                ),
              const SizedBox(height: 16),
              // ─── Stats ────────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _StatBadge(
                    value: '$postsCount',
                    label: 'Posts',
                    isDark: isDark,
                  ),
                  Container(
                    height: 28,
                    width: 1,
                    color: isDark
                        ? AppColors.dividerDark
                        : AppColors.dividerLight,
                  ),
                  _StatBadge(
                    value: _formatCount(followers),
                    label: 'Followers',
                    isDark: isDark,
                  ),
                  Container(
                    height: 28,
                    width: 1,
                    color: isDark
                        ? AppColors.dividerDark
                        : AppColors.dividerLight,
                  ),
                  _StatBadge(
                    value: _formatCount(following),
                    label: 'Following',
                    isDark: isDark,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // ─── Action Buttons ───────────────────────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (isMe)
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _showEditProfile(context),
                          icon: const Icon(Icons.edit, size: 16),
                          label: const Text('Edit Profile'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: isDark
                                ? Colors.white
                                : Colors.black87,
                            side: BorderSide(
                              color: isDark
                                  ? AppColors.dividerDark
                                  : AppColors.dividerLight,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      )
                    else
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.person_add_outlined,
                              size: 16),
                          label: const Text('Follow'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                    const SizedBox(width: 8),
                    if (!isMe)
                      OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.message_outlined, size: 16),
                        label: const Text('Message'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor:
                              isDark ? Colors.white : Colors.black87,
                          side: BorderSide(
                            color: isDark
                                ? AppColors.dividerDark
                                : AppColors.dividerLight,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottom: TabBar(
        controller: tabController,
        indicatorColor: AppColors.primary,
        labelColor: AppColors.primary,
        unselectedLabelColor:
            isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
        tabs: const [
          Tab(icon: Icon(Icons.grid_on, size: 20)),
          Tab(icon: Icon(Icons.info_outline, size: 20)),
        ],
      ),
    );
  }

  String _formatCount(dynamic count) {
    final n = (count as num?)?.toInt() ?? 0;
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return '$n';
  }

  void _showEditProfile(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => const _EditProfileSheet(),
    );
  }
}

// ─── Posts Grid ───────────────────────────────────────────────────
class _PostsGrid extends StatelessWidget {
  final List<PostModel> posts;
  const _PostsGrid({required this.posts});

  @override
  Widget build(BuildContext context) {
    if (posts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.camera_alt_outlined,
                size: 56, color: Colors.grey[400]),
            const SizedBox(height: 16),
            const Text(
              'No posts yet',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text(
              'Share your first moment',
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
            ),
          ],
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(2),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 2,
        mainAxisSpacing: 2,
      ),
      itemCount: posts.length,
      itemBuilder: (context, index) {
        final post = posts[index];
        return _GridItem(post: post);
      },
    );
  }
}

class _GridItem extends StatelessWidget {
  final PostModel post;
  const _GridItem({required this.post});

  @override
  Widget build(BuildContext context) {
    final hasImage =
        post.mediaUrls.isNotEmpty && post.mediaType == 'image';
    return Stack(
      fit: StackFit.expand,
      children: [
        hasImage
            ? CachedNetworkImage(
                imageUrl: post.mediaUrls.first,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) =>
                    Container(color: Colors.grey[200]),
              )
            : Container(
                color: AppColors.primary.withValues(alpha: 0.1),
                child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: Text(
                    post.content,
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textPrimaryLight,
                    ),
                  ),
                ),
              ),
        if (post.mediaUrls.length > 1)
          Positioned(
            top: 4,
            right: 4,
            child: Icon(
              Icons.collections,
              color: Colors.white,
              size: 16,
              shadows: const [Shadow(color: Colors.black54, blurRadius: 4)],
            ),
          ),
      ],
    );
  }
}

// ─── About Tab ────────────────────────────────────────────────────
class _AboutTab extends StatelessWidget {
  final Map<String, dynamic> userData;
  final bool isDark;

  const _AboutTab({required this.userData, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final phone = userData['phone'] as String? ?? '';
    final bio = userData['bio'] as String? ?? '';
    final isCreatorPro = userData['isCreatorPro'] ?? false;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _InfoCard(isDark: isDark, children: [
            if (bio.isNotEmpty)
              _InfoRow(
                icon: Icons.info_outline,
                label: 'Bio',
                value: bio,
                isDark: isDark,
              ),
            if (phone.isNotEmpty)
              _InfoRow(
                icon: Icons.phone_outlined,
                label: 'Phone',
                value: phone,
                isDark: isDark,
              ),
            if (isCreatorPro)
              _InfoRow(
                icon: Icons.star,
                label: 'Creator Status',
                value: 'Creator Pro',
                valueColor: AppColors.premiumGold,
                isDark: isDark,
              ),
          ]),
          const SizedBox(height: 12),
          _InfoCard(isDark: isDark, children: [
            _InfoRow(
              icon: Icons.location_on_outlined,
              label: 'Location',
              value: 'India',
              isDark: isDark,
            ),
            _InfoRow(
              icon: Icons.calendar_today_outlined,
              label: 'Joined',
              value: 'TriNetra Member',
              isDark: isDark,
            ),
          ]),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final bool isDark;
  final List<Widget> children;
  const _InfoCard({required this.isDark, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(children: children),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;
  final bool isDark;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.isDark,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(
            icon,
            size: 20,
            color: isDark
                ? AppColors.textSecondaryDark
                : AppColors.textSecondaryLight,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    color: isDark
                        ? AppColors.textSecondaryDark
                        : AppColors.textSecondaryLight,
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: valueColor ??
                        (isDark
                            ? AppColors.textPrimaryDark
                            : AppColors.textPrimaryLight),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Edit Profile Bottom Sheet ────────────────────────────────────
class _EditProfileSheet extends ConsumerStatefulWidget {
  const _EditProfileSheet();

  @override
  ConsumerState<_EditProfileSheet> createState() =>
      _EditProfileSheetState();
}

class _EditProfileSheetState extends ConsumerState<_EditProfileSheet> {
  final _nameController = TextEditingController();
  final _bioController = TextEditingController();
  bool _isSaving = false;

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final me = ref.read(currentUserProvider);
    if (me == null) return;
    setState(() => _isSaving = true);
    try {
      final updates = <String, dynamic>{};
      if (_nameController.text.trim().isNotEmpty) {
        updates['displayName'] = _nameController.text.trim();
      }
      if (_bioController.text.trim().isNotEmpty) {
        updates['bio'] = _bioController.text.trim();
      }
      if (updates.isNotEmpty) {
        await FirebaseService.instance.firestore
            .collection('users')
            .doc(me.uid)
            .update(updates);
      }
      if (mounted) Navigator.pop(context);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save. Try again.')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Edit Profile',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Display Name',
                hintText: 'Your name',
                filled: true,
                fillColor: isDark
                    ? AppColors.surfaceDark
                    : AppColors.inputBgLight,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _bioController,
              maxLines: 3,
              maxLength: 150,
              decoration: InputDecoration(
                labelText: 'Bio',
                hintText: 'Tell the world about yourself',
                filled: true,
                fillColor: isDark
                    ? AppColors.surfaceDark
                    : AppColors.inputBgLight,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSaving ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  minimumSize: const Size(0, 48),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: _isSaving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Save Changes'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Stat Badge ───────────────────────────────────────────────────
class _StatBadge extends StatelessWidget {
  final String value;
  final String label;
  final bool isDark;

  const _StatBadge({
    required this.value,
    required this.label,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: isDark
                ? AppColors.textPrimaryDark
                : AppColors.textPrimaryLight,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isDark
                ? AppColors.textSecondaryDark
                : AppColors.textSecondaryLight,
          ),
        ),
      ],
    );
  }
}

// ─── Initials Avatar ──────────────────────────────────────────────
class _InitialsAvatar extends StatelessWidget {
  final String initial;
  final double size;
  const _InitialsAvatar({required this.initial, required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      color: AppColors.primary.withValues(alpha: 0.15),
      child: Center(
        child: Text(
          initial,
          style: TextStyle(
            color: AppColors.primary,
            fontWeight: FontWeight.w900,
            fontSize: size * 0.38,
          ),
        ),
      ),
    );
  }
}
