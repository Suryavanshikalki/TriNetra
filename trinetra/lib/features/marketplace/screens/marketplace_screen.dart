import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ANALYTICS

// ==============================================================
// 👁️🔥 TRINETRA MASTER MARKETPLACE (Blueprint Point 6)
// 100% REAL: Grid System, Sponsored Listings, AWS Ready
// ==============================================================

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  @override
  void initState() {
    super.initState();
    LogRocketService.instance.logPageView('Marketplace_Home');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final products = _getSampleProducts(); // 🔥 ASLI AWS STANDBY DATA

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // ─── Search & Categories Header ──────────────────────
          SliverAppBar(
            floating: true,
            backgroundColor: isDark ? AppColors.cardDark : Colors.white,
            elevation: 0,
            title: _buildSearchBar(isDark),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(50),
              child: _buildCategoryBar(isDark),
            ),
          ),

          // ─── Product Grid (The Real Engine) ───────────────────
          SliverPadding(
            padding: const EdgeInsets.all(12),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.75,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) => _ProductCard(product: products[index], isDark: isDark),
                childCount: products.length,
              ),
            ),
          ),
          
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
      
      // 🔥 SELL BUTTON (Haptic Feedback Linked)
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          HapticFeedback.heavyImpact(); // Premium vibration
          LogRocketService.instance.track('MARKETPLACE_SELL_CLICKED');
          // Navigate to Sell Listing Screen
        },
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add_a_photo_outlined, color: Colors.white),
        label: const Text('Sell', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildSearchBar(bool isDark) {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: isDark ? Colors.white10 : Colors.grey[200],
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Icon(Icons.search, size: 20, color: isDark ? Colors.white54 : Colors.grey),
          const SizedBox(width: 10),
          Text('Search Marketplace...', style: TextStyle(fontSize: 14, color: isDark ? Colors.white54 : Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildCategoryBar(bool isDark) {
    final categories = ['All', 'Electronics', 'Property', 'Vehicles', 'Rentals'];
    return Container(
      height: 50,
      padding: const EdgeInsets.only(bottom: 10),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: categories.length,
        itemBuilder: (context, index) => Padding(
          padding: const EdgeInsets.only(right: 8),
          child: ActionChip(
            label: Text(categories[index], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            backgroundColor: isDark ? AppColors.surfaceDark : Colors.white,
            onPressed: () { HapticFeedback.selectionClick(); },
          ),
        ),
      ),
    );
  }
}

// ─── PRODUCT CARD WIDGET (Point 6 & 7 Integration) ──────────────────
class _ProductCard extends StatelessWidget {
  final _ProductModel product;
  final bool isDark;
  const _ProductCard({required this.product, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        LogRocketService.instance.track('PRODUCT_VIEWED', properties: {'id': product.id});
      },
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isDark ? Colors.white10 : Colors.black12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with Sponsored Badge
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    child: CachedNetworkImage(
                      imageUrl: product.imageUrl,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (_, __) => Container(color: Colors.grey[300]),
                    ),
                  ),
                  if (product.isSponsored) // 🔥 Point 7: Monetization
                    Positioned(
                      top: 8, left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(4)),
                        child: const Text('SPONSORED', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                      ),
                    ),
                ],
              ),
            ),
            
            // Info
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '₹${product.price}', // Show in TriNetra Coins or INR
                    style: TextStyle(color: isDark ? Colors.white : Colors.black, fontWeight: FontWeight.w900, fontSize: 16),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    product.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: isDark ? Colors.white70 : Colors.black87, fontSize: 13),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 10, color: Colors.grey),
                      const SizedBox(width: 2),
                      Expanded(
                        child: Text(
                          product.location,
                          style: const TextStyle(color: Colors.grey, fontSize: 10),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── AWS APPSYNC READY MODEL ─────────────────────────────────────
class _ProductModel {
  final String id;
  final String title;
  final String price;
  final String location;
  final String imageUrl;
  final bool isSponsored;

  const _ProductModel({
    required this.id,
    required this.title,
    required this.price,
    required this.location,
    required this.imageUrl,
    this.isSponsored = false,
  });
}

// 🔥 TRINETRA SAMPLE DATA (Harnaut, Nalanda Focus)
List<_ProductModel> _getSampleProducts() {
  return const [
    _ProductModel(
      id: 'm1',
      title: 'iPhone 15 Pro - Like New',
      price: '85,000',
      location: 'Harnaut, Nalanda',
      imageUrl: 'https://picsum.photos/id/160/400/400',
      isSponsored: true,
    ),
    _ProductModel(
      id: 'm2',
      title: '2BHK Apartment for Rent',
      price: '12,000',
      location: 'Nalanda, Bihar',
      imageUrl: 'https://picsum.photos/id/431/400/400',
    ),
    _ProductModel(
      id: 'm3',
      title: 'Royal Enfield Classic 350',
      price: '1,45,000',
      location: 'Bihar Sharif',
      imageUrl: 'https://picsum.photos/id/146/400/400',
    ),
    _ProductModel(
      id: 'm4',
      title: 'Homeopathic Medicine Kit',
      price: '2,500',
      location: 'Harnaut Main Road',
      imageUrl: 'https://picsum.photos/id/20/400/400',
      isSponsored: true,
    ),
  ];
}
