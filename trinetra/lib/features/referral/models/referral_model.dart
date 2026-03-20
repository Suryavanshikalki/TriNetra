import 'package:cloud_firestore/cloud_firestore.dart';

/// TriNetra Coins Referral Model
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

  factory ReferralModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return ReferralModel(
      userId: doc.id,
      referralCode: d['referralCode'] ?? '',
      referredByUid: d['referredByUid'],
      referredUserIds: List<String>.from(d['referredUserIds'] ?? []),
      totalCoinsEarned: d['totalCoinsEarned'] ?? 0,
      coinsAvailable: d['coinsAvailable'] ?? 0,
      coinsRedeemed: d['coinsRedeemed'] ?? 0,
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() => {
    'referralCode': referralCode,
    'referredByUid': referredByUid,
    'referredUserIds': referredUserIds,
    'totalCoinsEarned': totalCoinsEarned,
    'coinsAvailable': coinsAvailable,
    'coinsRedeemed': coinsRedeemed,
    'createdAt': FieldValue.serverTimestamp(),
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
