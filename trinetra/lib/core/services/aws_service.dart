import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:mime/mime.dart';
import 'package:path/path.dart' as path;
import 'package:uuid/uuid.dart';

// असली AWS Amplify पैकेजेस
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_storage_s3/amplify_storage_s3.dart';

// यह फाइल आपके AWS Keys से जनरेट होगी
import '../../amplifyconfiguration.dart'; 

class AwsService {
  AwsService._();
  static final AwsService instance = AwsService._();

  final _uuid = const Uuid();
  bool _isInitialized = false;

  // ─── 1. Asli AWS Initialization (Auth, API, Storage) ──────────
  Future<void> initializeAws() async {
    if (_isInitialized) return;
    try {
      final authPlugin = AmplifyAuthCognito();
      final apiPlugin = AmplifyAPI(); // AppSync GraphQL के लिए
      final storagePlugin = AmplifyStorageS3(); // S3 Media के लिए

      await Amplify.addPlugins([authPlugin, apiPlugin, storagePlugin]);
      await Amplify.configure(amplifyconfig);
      
      _isInitialized = true;
      safePrint('🚀 TriNetra: AWS Backend (Cognito, AppSync, S3) 100% Live!');
    } catch (e) {
      safePrint('❌ AWS Initialization Error: $e');
    }
  }

  // ─── 2. Direct S3 Upload (For iOS, Android, Windows, Mac, Linux) ───
  Future<UploadResult> uploadFile({
    required String filePath,
    String? folder,
  }) async {
    try {
      final mimeType = lookupMimeType(filePath) ?? 'application/octet-stream';
      final ext = path.extension(filePath).replaceFirst('.', '');
      final finalFolder = folder ?? _folderFromMime(mimeType);
      final filename = '$finalFolder/${_uuid.v4()}.$ext';

      // असली AWS S3 डायरेक्ट अपलोड (बिना किसी बैकएंड के)
      final result = await Amplify.Storage.uploadFile(
        localFile: AWSFile.fromPath(filePath),
        path: const StoragePath.fromString('public/$filename'),
        options: const StorageUploadFileOptions(
          accessLevel: StorageAccessLevel.guest,
        ),
      ).result;

      // अपलोडेड फाइल का CDN URL प्राप्त करना
      final urlResult = await Amplify.Storage.getUrl(
        path: const StoragePath.fromString('public/$filename'),
      ).result;

      return UploadResult.success(url: urlResult.url.toString(), key: filename);
    } catch (e) {
      safePrint('[AWS S3] Upload error: $e');
      return UploadResult.failure(e.toString());
    }
  }

  // ─── 3. Direct S3 Upload for Web (PWA) ────────────────────────
  Future<UploadResult> uploadBytes({
    required Uint8List bytes,
    required String mimeType,
    required String extension,
    String? folder,
  }) async {
    try {
      if (bytes.isEmpty) {
        return UploadResult.failure('File is empty.');
      }

      final finalFolder = folder ?? _folderFromMime(mimeType);
      final filename = '$finalFolder/${_uuid.v4()}.$extension';

      // असली AWS S3 Web/Memory डायरेक्ट अपलोड
      final result = await Amplify.Storage.uploadData(
        data: AWSFile.fromData(bytes, contentType: mimeType),
        path: const StoragePath.fromString('public/$filename'),
        options: const StorageUploadDataOptions(
          accessLevel: StorageAccessLevel.guest,
        ),
      ).result;

      final urlResult = await Amplify.Storage.getUrl(
        path: const StoragePath.fromString('public/$filename'),
      ).result;

      return UploadResult.success(url: urlResult.url.toString(), key: filename);
    } catch (e) {
      safePrint('[AWS S3 Web] Upload error: $e');
      return UploadResult.failure(e.toString());
    }
  }

  // ─── 4. Asli AppSync Query/Mutation (For Real-time Feed) ───────
  Future<dynamic> queryAppSync(String graphQLDocument, {Map<String, dynamic>? variables}) async {
    try {
      final request = GraphQLRequest<String>(
        document: graphQLDocument,
        variables: variables ?? {},
      );
      final response = await Amplify.API.query(request: request).response;
      return response.data;
    } catch (e) {
      safePrint('[AWS AppSync] Query Failed: $e');
      rethrow;
    }
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
