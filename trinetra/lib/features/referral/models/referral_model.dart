import 'package:flutter/foundation.dart';

// ==============================================================
// 👁️🔥 TRINETRA COINS & REFERRAL MODEL (Blueprint Point 6)
// 100% REAL: No Firebase, AWS DynamoDB Ready, Riverpod Safe
// ==============================================================

@immutable
class ReferralModel {
  final String userId;
  final String referralCode;
  final String? referredByUid;
  final List<String> referredUserIds;
  final int totalCoinsEarned;
  final int coinsAvailable;
  final int coinsRedeemed;
  final DateTime createdAt;

  const ReferralModel({
    required this.userId,
    required this.referralCode,
    this.referredByUid,
    this.referredUserIds = const [],
    this.totalCoinsEarned = 0,
    this.coinsAvailable = 0,
    this.coinsRedeemed = 0,
    required this.createdAt,
  });

  // ─── 💰 TRINETRA ECONOMY CONSTANTS (Point 6) ──────────────────
  /// Coins awarded per successful referral
  static const int coinsPerReferral = 100;

  /// Coins awarded to new user when they join via referral
  static const int welcomeBonus = 50;

  /// Minimum coins required to redeem to TriNetra Wallet
  static const int minimumRedeem = 500;

  /// 1 Coin = ₹0.10 (Real Money logic for Payout Wallet)
  static const double coinValueInRupees = 0.10;

  // ─── 🔥 ASLI AWS MAPPING ────────────────────────────────────────
  factory ReferralModel.fromMap(String docId, Map<String, dynamic> d) {
    return ReferralModel(
      userId: docId,
      referralCode: d['referralCode'] ?? '',
      referredByUid: d['referredByUid'],
      referredUserIds: List<String>.from(d['referredUserIds'] ?? []),
      totalCoinsEarned: d['totalCoinsEarned'] ?? 0,
      coinsAvailable: d['coinsAvailable'] ?? 0,
      coinsRedeemed: d['coinsRedeemed'] ?? 0,
      // AWS AppSync returns ISO8601 standard datetime strings
      createdAt: d['createdAt'] != null 
          ? DateTime.tryParse(d['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
    'referralCode': referralCode,
    'referredByUid': referredByUid,
    'referredUserIds': referredUserIds,
    'totalCoinsEarned': totalCoinsEarned,
    'coinsAvailable': coinsAvailable,
    'coinsRedeemed': coinsRedeemed,
    'createdAt': createdAt.toIso8601String(), // 100% AWS Safe
  };

  // ─── 🔄 RIVERPOD STATE UPDATER (Added for Backend Sync) ─────────
  ReferralModel copyWith({
    String? userId,
    String? referralCode,
    String? referredByUid,
    List<String>? referredUserIds,
    int? totalCoinsEarned,
    int? coinsAvailable,
    int? coinsRedeemed,
    DateTime? createdAt,
  }) {
    return ReferralModel(
      userId: userId ?? this.userId,
      referralCode: referralCode ?? this.referralCode,
      referredByUid: referredByUid ?? this.referredByUid,
      referredUserIds: referredUserIds ?? this.referredUserIds,
      totalCoinsEarned: totalCoinsEarned ?? this.totalCoinsEarned,
      coinsAvailable: coinsAvailable ?? this.coinsAvailable,
      coinsRedeemed: coinsRedeemed ?? this.coinsRedeemed,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  // ─── 📊 UTILITY GETTERS ──────────────────────────────────────────
  double get availableValueInRupees => coinsAvailable * coinValueInRupees;
  int get totalReferrals => referredUserIds.length;
  bool get canRedeem => coinsAvailable >= minimumRedeem;

  /// Generate a unique referral code from TriNetra UID
  static String generateCode(String uid) {
    final suffix = uid.length >= 6 ? uid.substring(uid.length - 6).toUpperCase() : uid.toUpperCase();
    return 'TN$suffix'; // Brand identity attached to code
  }
}
