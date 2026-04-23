import 'dart:io';
import 'dart:typed_data';
import 'package:appwrite/appwrite.dart';
import 'package:appwrite/models.dart' as models;
import 'package:flutter/foundation.dart';
import 'package:path/path.dart' as path;
import 'package:uuid/uuid.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import '../config/app_config.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER APPWRITE SERVICE (Dual-Engine)
// 100% Realtime | Secure Storage | Sentry Tracked
// ==============================================================

class AppwriteService {
  AppwriteService._();
  static final AppwriteService instance = AppwriteService._();

  final Client client = Client();
  late final Account account;
  late final Databases databases;
  late final Storage storage;
  late final Realtime realtime;

  final _uuid = const Uuid();
  bool _isInitialized = false;

  // ─── 1. INITIALIZATION ──────────
  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      client
          .setEndpoint(AppConfig.appwriteEndpoint)
          .setProject(AppConfig.appwriteProjectId)
          .setSelfSigned(status: true); // For development/self-hosted

      account = Account(client);
      databases = Databases(client);
      storage = Storage(client);
      realtime = Realtime(client);

      _isInitialized = true;
      debugPrint('🚀 TriNetra: Appwrite Engine LIVE!');
    } catch (e, stackTrace) {
      debugPrint('🚨 Appwrite Initialization Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  // ─── 2. SECURE STORAGE UPLOAD ──────────────────────
  Future<UploadResult> uploadFile({
    required String bucketId,
    required String filePath,
    String? fileId,
  }) async {
    try {
      final id = fileId ?? _uuid.v4();
      final result = await storage.createFile(
        bucketId: bucketId,
        fileId: id,
        file: InputFile.fromPath(path: filePath),
      );

      final url = '${AppConfig.appwriteEndpoint}/storage/buckets/$bucketId/files/${result.$id}/view?project=${AppConfig.appwriteProjectId}';

      return UploadResult.success(url: url, key: result.$id);
    } catch (e, stackTrace) {
      debugPrint('🚨 [Appwrite Storage] Upload error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      return UploadResult.failure(e.toString());
    }
  }

  // ─── 3. REALTIME SUBSCRIPTION (WhatsApp 2.0) ────
  RealtimeSubscription subscribe(List<String> channels) {
    return realtime.subscribe(channels);
  }

  // ─── 4. DATABASE OPERATIONS ───────────────────────────
  Future<models.DocumentList> listDocuments({
    required String databaseId,
    required String collectionId,
    List<String>? queries,
  }) async {
    return await databases.listDocuments(
      databaseId: databaseId,
      collectionId: collectionId,
      queries: queries,
    );
  }

  Future<models.Document> createDocument({
    required String databaseId,
    required String collectionId,
    required Map<String, dynamic> data,
    String? documentId,
  }) async {
    return await databases.createDocument(
      databaseId: databaseId,
      collectionId: collectionId,
      documentId: documentId ?? _uuid.v4(),
      data: data,
    );
  }
}

// ─── Upload Result Class ──────────────────────────────────────────
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
