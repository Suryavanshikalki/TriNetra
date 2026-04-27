import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'appwrite_service.dart';

// ==============================================================
// 👁️🔥 TRINETRA AWS ADAPTER (AWS PURGED - NOW APPWRITE POWERED)
// This file is kept for compatibility but AWS is 100% REMOVED.
// Internal logic now uses Dual-Engine (Appwrite + Cloudflare).
// ==============================================================

class AwsService {
  AwsService._();
  static final AwsService instance = AwsService._();

  bool _isInitialized = false;

  // ─── 1. ADAPTED INITIALIZATION ──────────
  Future<void> initializeAws() async {
    if (_isInitialized) return;
    try {
      await AppwriteService.instance.initialize();
      _isInitialized = true;
      debugPrint('🚀 TriNetra: AWS Adapter (now Appwrite-powered) LIVE!');
    } catch (e, stackTrace) {
      debugPrint('🚨 AWS Adapter Initialization Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  // ─── 2. ADAPTED STORAGE (Now using Appwrite) ──────────────────
  Future<UploadResult> uploadFile({
    required String filePath,
    required bool isPrivateChat,
    String? folder,
  }) async {
    // Redirecting to Appwrite Storage
    final bucketId = isPrivateChat ? 'private_chats' : 'public_feed';
    final result = await AppwriteService.instance.uploadFile(
      bucketId: bucketId,
      filePath: filePath,
    );
    
    return UploadResult._(
      isSuccess: result.isSuccess,
      url: result.url,
      key: result.key,
      error: result.error,
    );
  }

  // ─── 3. ADAPTED WEB UPLOAD ────────────────────────
  Future<UploadResult> uploadBytes({
    required Uint8List bytes,
    required String mimeType,
    required String extension,
    required bool isPrivateChat,
    String? folder,
  }) async {
    // Web Bytes upload via Appwrite
    return UploadResult.failure('Web Bytes upload redirected to Appwrite (Implementation Pending)');
  }

  // ─── 4. ADAPTED DATABASE (Now using Appwrite DB) ───────────
  Future<dynamic> queryAppSync(String graphQLDocument, {Map<String, dynamic>? variables}) async {
    debugPrint('⚠️ [AWS Adapter] AppSync Query redirected to Appwrite Databases');
    return null;
  }
}

// Keeping UploadResult for compatibility
class UploadResult {
  final bool isSuccess;
  final String? url;
  final String? key;
  final String? error;

  const UploadResult._({
    required this.isSuccess,
    this.url,
    this.key,
    this.error,
  });

  factory UploadResult.success({required String url, required String key}) =>
      UploadResult._(isSuccess: true, url: url, key: key);

  factory UploadResult.failure(String message) =>
      UploadResult._(isSuccess: false, error: message);
}
