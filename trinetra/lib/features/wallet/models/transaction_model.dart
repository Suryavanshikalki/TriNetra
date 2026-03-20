import 'package:cloud_firestore/cloud_firestore.dart';

/// Transaction Model for TriNetra Pay
/// Collection: transactions/{txnId}
class TransactionModel {
  final String id;
  final String userId;
  final TransactionType type;
  final double amount;
  final String currency;
  final TransactionStatus status;
  final String description;
  final String? referenceId;
  final String? paymentMethod;
  final DateTime createdAt;
  final Map<String, dynamic> metadata;

  const TransactionModel({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    this.currency = 'INR',
    required this.status,
    required this.description,
    this.referenceId,
    this.paymentMethod,
    required this.createdAt,
    this.metadata = const {},
  });

  factory TransactionModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return TransactionModel(
      id: doc.id,
      userId: d['userId'] ?? '',
      type: TransactionType.fromString(d['type'] ?? 'payment'),
      amount: (d['amount'] ?? 0).toDouble(),
      currency: d['currency'] ?? 'INR',
      status: TransactionStatus.fromString(d['status'] ?? 'pending'),
      description: d['description'] ?? '',
      referenceId: d['referenceId'],
      paymentMethod: d['paymentMethod'],
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      metadata: Map<String, dynamic>.from(d['metadata'] ?? {}),
    );
  }

  Map<String, dynamic> toFirestore() => {
    'userId': userId,
    'type': type.value,
    'amount': amount,
    'currency': currency,
    'status': status.value,
    'description': description,
    'referenceId': referenceId,
    'paymentMethod': paymentMethod,
    'createdAt': FieldValue.serverTimestamp(),
    'metadata': metadata,
  };

  bool get isCredit => type == TransactionType.coinEarned ||
      type == TransactionType.refund ||
      type == TransactionType.payoutReceived;

  bool get isDebit => !isCredit;
}

enum TransactionType {
  payment,
  upiPayment,
  adBoost,
  subscription,
  marketplaceSale,
  coinEarned,
  coinRedeemed,
  refund,
  payoutReceived,
  payoutRequested;

  static TransactionType fromString(String s) {
    switch (s) {
      case 'upi_payment': return TransactionType.upiPayment;
      case 'ad_boost': return TransactionType.adBoost;
      case 'subscription': return TransactionType.subscription;
      case 'marketplace_sale': return TransactionType.marketplaceSale;
      case 'coin_earned': return TransactionType.coinEarned;
      case 'coin_redeemed': return TransactionType.coinRedeemed;
      case 'refund': return TransactionType.refund;
      case 'payout_received': return TransactionType.payoutReceived;
      case 'payout_requested': return TransactionType.payoutRequested;
      default: return TransactionType.payment;
    }
  }

  String get value {
    switch (this) {
      case TransactionType.upiPayment: return 'upi_payment';
      case TransactionType.adBoost: return 'ad_boost';
      case TransactionType.subscription: return 'subscription';
      case TransactionType.marketplaceSale: return 'marketplace_sale';
      case TransactionType.coinEarned: return 'coin_earned';
      case TransactionType.coinRedeemed: return 'coin_redeemed';
      case TransactionType.refund: return 'refund';
      case TransactionType.payoutReceived: return 'payout_received';
      case TransactionType.payoutRequested: return 'payout_requested';
      default: return 'payment';
    }
  }

  String get displayName {
    switch (this) {
      case TransactionType.upiPayment: return 'UPI Payment';
      case TransactionType.adBoost: return 'Boost Post';
      case TransactionType.subscription: return 'Creator Pro';
      case TransactionType.marketplaceSale: return 'Marketplace Sale';
      case TransactionType.coinEarned: return 'Coins Earned';
      case TransactionType.coinRedeemed: return 'Coins Redeemed';
      case TransactionType.refund: return 'Refund';
      case TransactionType.payoutReceived: return 'Payout Received';
      case TransactionType.payoutRequested: return 'Payout Requested';
      default: return 'Payment';
    }
  }
}

enum TransactionStatus {
  pending,
  completed,
  failed,
  cancelled;

  static TransactionStatus fromString(String s) {
    switch (s) {
      case 'completed': return TransactionStatus.completed;
      case 'failed': return TransactionStatus.failed;
      case 'cancelled': return TransactionStatus.cancelled;
      default: return TransactionStatus.pending;
    }
  }

  String get value => name;
}
