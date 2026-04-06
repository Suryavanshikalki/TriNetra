import 'package:flutter/foundation.dart';

// ==============================================================
// 👁️🔥 TRINETRA TRANSACTION MODEL (Blueprint Point 6-10)
// 100% REAL: AWS Safe, Enum Bug Fixed, Riverpod Immutable
// ==============================================================

@immutable
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

  // ─── 🔥 ASLI AWS MAPPING ────────────────────────────────────────
  factory TransactionModel.fromMap(String docId, Map<String, dynamic> d) {
    return TransactionModel(
      id: docId,
      userId: d['userId'] ?? '',
      type: TransactionTypeExtension.fromString(d['type'] ?? 'payment'), // 🔥 Fixed Enum Call
      amount: (d['amount'] ?? 0).toDouble(),
      currency: d['currency'] ?? 'INR',
      status: TransactionStatusExtension.fromString(d['status'] ?? 'pending'), // 🔥 Fixed Enum Call
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
    'type': type.value, // 🔥 Now perfectly syncs with fromString
    'amount': amount,
    'currency': currency,
    'status': status.value,
    'description': description,
    'referenceId': referenceId,
    'paymentMethod': paymentMethod,
    'createdAt': createdAt.toIso8601String(),
    'metadata': metadata,
  };

  // ─── 🔄 RIVERPOD STATE UPDATER (Added for Backend Sync) ─────────
  TransactionModel copyWith({
    String? id,
    String? userId,
    TransactionType? type,
    double? amount,
    String? currency,
    TransactionStatus? status,
    String? description,
    String? referenceId,
    String? paymentMethod,
    DateTime? createdAt,
    Map<String, dynamic>? metadata,
  }) {
    return TransactionModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      status: status ?? this.status,
      description: description ?? this.description,
      referenceId: referenceId ?? this.referenceId,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      createdAt: createdAt ?? this.createdAt,
      metadata: metadata ?? this.metadata,
    );
  }

  // ─── 📊 UTILITY GETTERS ──────────────────────────────────────────
  bool get isCredit => type == TransactionType.coinEarned ||
      type == TransactionType.refund ||
      type == TransactionType.payoutReceived;

  bool get isDebit => !isCredit;
}

// ─── 🔥 ASLI ENUMS WITH SAFE STRING MATCHING ─────────────────────

enum TransactionType {
  payment, upiPayment, adBoost, subscription, marketplaceSale,
  coinEarned, coinRedeemed, refund, payoutReceived, payoutRequested
}

extension TransactionTypeExtension on TransactionType {
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
      case TransactionType.payment: return 'payment';
    }
  }
}

enum TransactionStatus {
  pending, completed, failed, cancelled
}

extension TransactionStatusExtension on TransactionStatus {
  static TransactionStatus fromString(String s) {
    switch (s) {
      case 'completed': return TransactionStatus.completed;
      case 'failed': return TransactionStatus.failed;
      case 'cancelled': return TransactionStatus.cancelled;
      default: return TransactionStatus.pending;
    }
  }

  String get value {
    switch (this) {
      case TransactionStatus.completed: return 'completed';
      case TransactionStatus.failed: return 'failed';
      case TransactionStatus.cancelled: return 'cancelled';
      case TransactionStatus.pending: return 'pending';
    }
  }
}
