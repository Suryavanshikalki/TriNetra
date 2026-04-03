// 🔥 Firebase का import (cloud_firestore) हटा दिया गया है 🔥

/// TriNetra Coins Referral Model (AWS Ready)
/// Collection: referrals/{uid}
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

  /// Coins awarded per successful referral
  static const int coinsPerReferral = 100;

  /// Coins awarded to new user when they join via referral
  static const int welcomeBonus = 50;

  /// Minimum coins required to redeem
  static const int minimumRedeem = 500;

  /// 1 Coin = ₹0.10 (ad credit or payout)
  static const double coinValueInRupees = 0.10;

  // 🔥 FIXED: DocumentSnapshot हटाकर नॉर्मल Map कर दिया है 🔥
  factory ReferralModel.fromMap(String docId, Map<String, dynamic> d) {
    return ReferralModel(
      userId: docId,
      referralCode: d['referralCode'] ?? '',
      referredByUid: d['referredByUid'],
      referredUserIds: List<String>.from(d['referredUserIds'] ?? []),
      totalCoinsEarned: d['totalCoinsEarned'] ?? 0,
      coinsAvailable: d['coinsAvailable'] ?? 0,
      coinsRedeemed: d['coinsRedeemed'] ?? 0,
      // 🔥 FIXED: Timestamp हटाकर स्टैंडर्ड DateTime कर दिया है 🔥
      createdAt: d['createdAt'] != null 
          ? DateTime.tryParse(d['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
    );
  }

  // 🔥 FIXED: toFirestore को बदलकर toMap कर दिया है और FieldValue हटा दिया है 🔥
  Map<String, dynamic> toMap() => {
    'referralCode': referralCode,
    'referredByUid': referredByUid,
    'referredUserIds': referredUserIds,
    'totalCoinsEarned': totalCoinsEarned,
    'coinsAvailable': coinsAvailable,
    'coinsRedeemed': coinsRedeemed,
    'createdAt': createdAt.toIso8601String(),
  };

  double get availableValueInRupees => coinsAvailable * coinValueInRupees;
  int get totalReferrals => referredUserIds.length;
  bool get canRedeem => coinsAvailable >= minimumRedeem;

  /// Generate a unique referral code from uid
  static String generateCode(String uid) {
    final suffix = uid.substring(uid.length - 6).toUpperCase();
    return 'TN$suffix';
  }
}
