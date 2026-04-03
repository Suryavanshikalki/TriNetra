// 🔥 Firebase Removed 🔥
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

  factory TransactionModel.fromMap(String docId, Map<String, dynamic> d) {
    return TransactionModel(
      id: docId,
      userId: d['userId'] ?? '',
      type: TransactionType.fromString(d['type'] ?? 'payment'),
      amount: (d['amount'] ?? 0).toDouble(),
      currency: d['currency'] ?? 'INR',
      status: TransactionStatus.fromString(d['status'] ?? 'pending'),
      description: d['description'] ?? '',
      referenceId: d['referenceId'],
      paymentMethod: d['paymentMethod'],
      createdAt: d['createdAt'] != null 
          ? DateTime.tryParse(d['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
      metadata: Map<String, dynamic>.from(d['metadata'] ?? {}),
    );
  }

  Map<String, dynamic> toMap() => {
    'userId': userId,
    'type': type.value,
    'amount': amount,
    'currency': currency,
    'status': status.value,
    'description': description,
    'referenceId': referenceId,
    'paymentMethod': paymentMethod,
    'createdAt': createdAt.toIso8601String(),
    'metadata': metadata,
  };

  bool get isCredit => type == TransactionType.coinEarned ||
      type == TransactionType.refund ||
      type == TransactionType.payoutReceived;

  bool get isDebit => !isCredit;
}

enum TransactionType {
  payment, upiPayment, adBoost, subscription, marketplaceSale,
  coinEarned, coinRedeemed, refund, payoutReceived, payoutRequested;

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

  String get value => name;
}

enum TransactionStatus {
  pending, completed, failed, cancelled;

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
