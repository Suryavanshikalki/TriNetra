import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/foundation.dart';
import '../config/app_config.dart';

/// TriNetra AI — Powered by Google Gemini
/// Handles: Translation, Caption Writing, Comment Summarization,
///          AI Image Generation requests, and Chatbot (Meta AI Clone).
class GeminiService {
  GeminiService._();
  static final GeminiService instance = GeminiService._();

  late final GenerativeModel _chatModel;
  // _visionModel available for future image analysis features
  late final GenerativeModel _translationModel;
  bool _initialized = false;

  void initialize() {
    if (_initialized) return;
    if (AppConfig.geminiApiKey.isEmpty) {
      if (kDebugMode) debugPrint('Gemini API Key not set. AI features disabled.');
      return;
    }

    _chatModel = GenerativeModel(
      model: 'gemini-2.0-flash',
      apiKey: AppConfig.geminiApiKey,
      generationConfig: GenerationConfig(
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 2048,
      ),
      systemInstruction: Content.system(
        'You are TriNetra AI, a helpful assistant embedded in the TriNetra social app. '
        'You can help users write posts, translate content, summarize discussions, '
        'and answer questions. Be concise, friendly, and culturally aware. '
        'Support both Hindi and English responses.',
      ),
    );

    _translationModel = GenerativeModel(
      model: 'gemini-2.0-flash',
      apiKey: AppConfig.geminiApiKey,
      generationConfig: GenerationConfig(
        temperature: 0.2,
        maxOutputTokens: 1024,
      ),
    );

    _initialized = true;
  }

  bool get isAvailable => _initialized && AppConfig.geminiApiKey.isNotEmpty;

  // ─── Translation ─────────────────────────────────────────────
  Future<String> translateText({
    required String text,
    required String targetLanguage,
    String? sourceLanguage,
  }) async {
    if (!isAvailable) return text;
    try {
      final prompt = sourceLanguage != null
          ? 'Translate the following text from $sourceLanguage to $targetLanguage. '
            'Return only the translated text, no explanations.\n\n"$text"'
          : 'Detect the language and translate to $targetLanguage. '
            'Return only the translated text.\n\n"$text"';

      final response = await _translationModel.generateContent([
        Content.text(prompt),
      ]);
      return response.text ?? text;
    } catch (e) {
      if (kDebugMode) debugPrint('Translation error: $e');
      return text;
    }
  }

  // ─── Chat / Assistant ─────────────────────────────────────────
  Future<String> chat({
    required String userMessage,
    List<Map<String, String>>? history,
  }) async {
    if (!isAvailable) return 'AI features not available. Please add GEMINI_API_KEY.';
    try {
      final List<Content> contents = [];

      // Add history
      if (history != null) {
        for (final msg in history) {
          contents.add(
            msg['role'] == 'user'
                ? Content.text(msg['content']!)
                : Content.model([TextPart(msg['content']!)]),
          );
        }
      }
      contents.add(Content.text(userMessage));

      final response = await _chatModel.generateContent(contents);
      return response.text ?? 'Unable to get a response. Please try again.';
    } catch (e) {
      if (kDebugMode) debugPrint('Gemini chat error: $e');
      return 'Error: $e';
    }
  }

  // ─── Post Caption Generator ──────────────────────────────────
  Future<String> generateCaption({
    String? contextHint,
    String language = 'en',
  }) async {
    if (!isAvailable) return '';
    try {
      final langInstruction =
          language == 'hi' ? 'Respond in Hindi (Devanagari script).' : 'Respond in English.';
      final prompt = contextHint != null
          ? '$langInstruction Write 3 engaging social media post captions for: "$contextHint". '
            'Use emojis. Separate each with a newline.'
          : '$langInstruction Write 3 generic engaging social media captions with emojis.';

      final response = await _chatModel.generateContent([Content.text(prompt)]);
      return response.text ?? '';
    } catch (e) {
      if (kDebugMode) debugPrint('Caption gen error: $e');
      return '';
    }
  }

  // ─── Comment Thread Summarizer ───────────────────────────────
  Future<String> summarizeComments(List<String> comments) async {
    if (!isAvailable || comments.isEmpty) return '';
    try {
      final commentText = comments.take(50).join('\n');
      final response = await _chatModel.generateContent([
        Content.text(
          'Summarize the key points and sentiment from these social media comments '
          'in 2-3 sentences:\n\n$commentText',
        ),
      ]);
      return response.text ?? '';
    } catch (e) {
      if (kDebugMode) debugPrint('Comment summarization error: $e');
      return '';
    }
  }

  // ─── Audio Transcript (text cleanup) ─────────────────────────
  Future<String> cleanTranscript(String rawTranscript) async {
    if (!isAvailable) return rawTranscript;
    try {
      final response = await _translationModel.generateContent([
        Content.text(
          'Clean up this voice message transcript for clarity. '
          'Fix grammar, add punctuation, preserve meaning. '
          'Return only the cleaned text:\n\n"$rawTranscript"',
        ),
      ]);
      return response.text ?? rawTranscript;
    } catch (e) {
      return rawTranscript;
    }
  }
}
