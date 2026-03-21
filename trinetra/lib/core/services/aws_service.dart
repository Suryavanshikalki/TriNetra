import 'dart:io';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:mime/mime.dart';
import 'package:path/path.dart' as path;
import 'package:uuid/uuid.dart';
import '../config/app_config.dart';

/// AWS S3 Media Upload Service
///
/// Architecture:
///   Flutter → POST /api/aws/upload → FastAPI backend → S3 bucket
///
/// The backend handles AWS Signature V4 signing using boto3.
/// Flutter sends the file bytes; the backend stores it and returns the CDN URL.
///
/// S3 Bucket: [AppConfig.awsS3Bucket] (default: trinetra-media)
/// Region:    [AppConfig.awsRegion]   (default: ap-south-1)
class AwsService {
  AwsService._();
  static final AwsService instance = AwsService._();

  final _dio = Dio();
  final _uuid = const Uuid();

  // Determine base URL — same-origin on Web, or from AppConfig on native
  String get _apiBase {
    if (kIsWeb) {
      final origin = Uri.base.origin;
      return origin;
    }
    return AppConfig.apiBaseUrl.isNotEmpty
        ? AppConfig.apiBaseUrl
        : 'http://localhost:8001';
  }

  // ─── Upload File (path — mobile/desktop) ─────────────────────
  Future<UploadResult> uploadFile({
    required String filePath,
    String? folder,
  }) async {
    final file = File(filePath);
    final bytes = await file.readAsBytes();
    final mimeType =
        lookupMimeType(filePath) ?? 'application/octet-stream';
    final ext = path.extension(filePath).replaceFirst('.', '');
    return _upload(
      bytes: bytes,
      mimeType: mimeType,
      extension: ext,
      folder: folder ?? _folderFromMime(mimeType),
    );
  }

  // ─── Upload Bytes (web / memory) ─────────────────────────────
  Future<UploadResult> uploadBytes({
    required Uint8List bytes,
    required String mimeType,
    required String extension,
    String? folder,
  }) =>
      _upload(
        bytes: bytes,
        mimeType: mimeType,
        extension: extension,
        folder: folder ?? _folderFromMime(mimeType),
      );

  // ─── Core Upload ──────────────────────────────────────────────
  Future<UploadResult> _upload({
    required Uint8List bytes,
    required String mimeType,
    required String extension,
    required String folder,
  }) async {
    if (bytes.isEmpty) {
      return UploadResult.failure('File is empty.');
    }

    final filename = '${folder}/${_uuid.v4()}.$extension';

    try {
      final formData = FormData.fromMap({
        'file': MultipartFile.fromBytes(
          bytes,
          filename: filename,
          contentType: DioMediaType.parse(mimeType),
        ),
        'folder': folder,
        'filename': filename,
      });

      final response = await _dio.post(
        '$_apiBase/api/aws/upload',
        data: formData,
        options: Options(
          sendTimeout: const Duration(seconds: 120),
          receiveTimeout: const Duration(seconds: 120),
        ),
      );

      if (response.statusCode == 200) {
        final url = response.data['url'] as String;
        final key = response.data['key'] as String;
        return UploadResult.success(url: url, key: key);
      } else {
        return UploadResult.failure('Upload failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      final msg = e.response?.data?['detail'] ?? e.message ?? 'Upload failed';
      if (kDebugMode) debugPrint('[AWS] Upload error: $msg');
      return UploadResult.failure(msg);
    }
  }

  String _folderFromMime(String mime) {
    if (mime.startsWith('image/')) return 'images';
    if (mime.startsWith('video/')) return 'videos';
    if (mime == 'application/pdf') return 'documents';
    return 'misc';
  }
}

// ─── Upload Result ────────────────────────────────────────────────
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
