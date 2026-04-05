import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:mime/mime.dart';
import 'package:path/path.dart' as path;
import 'package:uuid/uuid.dart';
import 'package:sentry_flutter/sentry_flutter.dart'; // 100% Crash Tracking

// 🔥 ASLI AWS AMPLIFY PACKAGES
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_storage_s3/amplify_storage_s3.dart';

// यह फाइल आपके AWS CLI से जनरेट होगी
import '../../amplifyconfiguration.dart'; 

// ==============================================================
// 👁️🔥 TRINETRA MASTER AWS SERVICE (Facebook 2026 Standard)
// 100% Secure Storage | Real-time WebSockets | Sentry Tracked
// ==============================================================

class AwsService {
  AwsService._();
  static final AwsService instance = AwsService._();

  final _uuid = const Uuid();
  bool _isInitialized = false;

  // ─── 1. ASLI AWS INITIALIZATION (Auth, API, Storage) ──────────
  Future<void> initializeAws() async {
    if (_isInitialized) return;
    try {
      final authPlugin = AmplifyAuthCognito();
      final apiPlugin = AmplifyAPI(); // AppSync GraphQL (Real-time Chat/Feed)
      final storagePlugin = AmplifyStorageS3(); // S3 Media (Secure)

      await Amplify.addPlugins([authPlugin, apiPlugin, storagePlugin]);
      await Amplify.configure(amplifyconfig);
      
      _isInitialized = true;
      safePrint('🚀 TriNetra: AWS Master Backend (Cognito, AppSync, S3) 100% LIVE!');
    } catch (e, stackTrace) {
      safePrint('🚨 AWS Initialization Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  // ─── 2. SECURE S3 UPLOAD (Mobile/Desktop) ──────────────────────
  Future<UploadResult> uploadFile({
    required String filePath,
    required bool isPrivateChat, // WhatsApp 2.0 ke liye secure flag
    String? folder,
  }) async {
    try {
      final mimeType = lookupMimeType(filePath) ?? 'application/octet-stream';
      final ext = path.extension(filePath).replaceFirst('.', '');
      final finalFolder = folder ?? _folderFromMime(mimeType);
      final filename = '$finalFolder/${_uuid.v4()}.$ext';

      // 🔥 ASLI SECURITY: Feed = Protected, WhatsApp 2.0 = Private
      final accessLevel = isPrivateChat ? StorageAccessLevel.private : StorageAccessLevel.protected;
      final storagePathPrefix = isPrivateChat ? 'private' : 'protected';

      final result = await Amplify.Storage.uploadFile(
        localFile: AWSFile.fromPath(filePath),
        path: StoragePath.fromString('$storagePathPrefix/$filename'),
        options: StorageUploadFileOptions(accessLevel: accessLevel),
      ).result;

      final urlResult = await Amplify.Storage.getUrl(
        path: StoragePath.fromString('$storagePathPrefix/$filename'),
      ).result;

      return UploadResult.success(url: urlResult.url.toString(), key: filename);
    } catch (e, stackTrace) {
      safePrint('🚨 [AWS S3] Upload error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      return UploadResult.failure(e.toString());
    }
  }

  // ─── 3. SECURE S3 UPLOAD FOR WEB (PWA) ────────────────────────
  Future<UploadResult> uploadBytes({
    required Uint8List bytes,
    required String mimeType,
    required String extension,
    required bool isPrivateChat,
    String? folder,
  }) async {
    try {
      if (bytes.isEmpty) return UploadResult.failure('File is empty.');

      final finalFolder = folder ?? _folderFromMime(mimeType);
      final filename = '$finalFolder/${_uuid.v4()}.$extension';
      
      final accessLevel = isPrivateChat ? StorageAccessLevel.private : StorageAccessLevel.protected;
      final storagePathPrefix = isPrivateChat ? 'private' : 'protected';

      final result = await Amplify.Storage.uploadData(
        data: AWSFile.fromData(bytes, contentType: mimeType),
        path: StoragePath.fromString('$storagePathPrefix/$filename'),
        options: StorageUploadDataOptions(accessLevel: accessLevel),
      ).result;

      final urlResult = await Amplify.Storage.getUrl(
        path: StoragePath.fromString('$storagePathPrefix/$filename'),
      ).result;

      return UploadResult.success(url: urlResult.url.toString(), key: filename);
    } catch (e, stackTrace) {
      safePrint('🚨 [AWS S3 Web] Upload error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      return UploadResult.failure(e.toString());
    }
  }

  // ─── 4. ASLI APPSYNC MUTATION/QUERY ───────────────────────────
  Future<dynamic> queryAppSync(String graphQLDocument, {Map<String, dynamic>? variables}) async {
    try {
      final request = GraphQLRequest<String>(
        document: graphQLDocument,
        variables: variables ?? {},
      );
      final response = await Amplify.API.query(request: request).response;
      return response.data;
    } catch (e, stackTrace) {
      safePrint('🚨 [AWS AppSync] Query Failed: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      rethrow;
    }
  }

  // ─── 5. ASLI APPSYNC REAL-TIME SUBSCRIPTION (WhatsApp 2.0) ────
  // Bina iske Live Chat aur Live Video Calling possible nahi thi!
  Stream<GraphQLResponse<String>> subscribeAppSync(String graphQLDocument, {Map<String, dynamic>? variables}) {
    final request = GraphQLRequest<String>(
      document: graphQLDocument,
      variables: variables ?? {},
    );
    return Amplify.API.subscribe(
      request,
      onEstablished: () => safePrint('✅ TriNetra Live WebSocket Connected!'),
    );
  }

  // Folder routing logic
  String _folderFromMime(String mime) {
    if (mime.startsWith('image/')) return 'images';
    if (mime.startsWith('video/')) return 'videos';
    if (mime == 'application/pdf') return 'documents';
    if (mime.startsWith('audio/')) return 'audios';
    return 'misc';
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
