import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../feed/screens/feed_screen.dart';
import '../../marketplace/screens/marketplace_screen.dart';
import '../../../shared/widgets/bottom_nav.dart';
import '../../../shared/widgets/trinetra_app_bar.dart';

/// Main Home Screen with Facebook-style Bottom Navigation
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    FeedScreen(),
    Center(child: Text('Friends', style: TextStyle(fontSize: 24))),
    Center(child: Text('Reels', style: TextStyle(fontSize: 24))),
    MarketplaceScreen(),
    MenuScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _currentIndex == 0 ? const TriNetraAppBar() : null,
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: TriNetraBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}

// ─── Menu / Hamburger Screen (stub) ──────────────────────────────
class MenuScreen extends StatelessWidget {
  const MenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Menu / More', style: TextStyle(fontSize: 24)),
    );
  }
}
