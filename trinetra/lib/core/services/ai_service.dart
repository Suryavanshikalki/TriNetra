import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';

/// AIService — connects Flutter to TriNetra AI Backend
/// Backend uses emergentintegrations + Gemini (Emergent LLM Key)
class AIService {
  AIService._();
  static final AIService instance = AIService._();

  final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 60),
  ));

  /// Returns the base URL for API calls.
  /// For Flutter Web: uses current page's origin (Kubernetes proxies /api → port 8001)
  /// For Flutter Native: uses dart-define injected API_BASE_URL
  String get _apiBase {
    if (kIsWeb) {
      return Uri.base.origin;
    }
    return const String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'http://localhost:8001',
    );
  }

  // ─── Translation ─────────────────────────────────────────────
  Future<String> translateText({
    required String text,
    String targetLanguage = 'Hindi',
    String? sourceLanguage,
  }) async {
    try {
      final response = await _dio.post(
        '$_apiBase/api/ai/translate',
        data: {
          'text': text,
          'target_language': targetLanguage,
          if (sourceLanguage != null) 'source_language': sourceLanguage,
        },
      );
      return (response.data['translated_text'] as String?) ?? text;
    } catch (e) {
      if (kDebugMode) debugPrint('AI translate error: $e');
      return text;
    }
  }

  // ─── Chatbot ──────────────────────────────────────────────────
  Future<String> chat({
    required String message,
    required String sessionId,
  }) async {
    try {
      final response = await _dio.post(
        '$_apiBase/api/ai/chat',
        data: {
          'message': message,
          'session_id': sessionId,
        },
      );
      return (response.data['reply'] as String?) ??
          'Unable to get a response.';
    } catch (e) {
      if (kDebugMode) debugPrint('AI chat error: $e');
      return 'AI service is currently unavailable. Please try again.';
    }
  }
}

/// Singleton AI session ID — persists for the duration of the app session
final String aiSessionId = const Uuid().v4();
