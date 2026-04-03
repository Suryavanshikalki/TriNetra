import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/foundation.dart';

/// 👁️🔥 TriNetra AI — Powered by Google Gemini (Super Agentic Core)
/// Handles: 100% Controlled Chat, Translation, Auto-Escalation Summarization
class GeminiService {
  GeminiService._();
  static final GeminiService instance = GeminiService._();

  late final GenerativeModel _chatModel;
  late final GenerativeModel _translationModel;
  bool _initialized = false;

  // ─── ASLI KEY (GitHub Secrets / dart-define से) ─────────────
  static const String _geminiApiKey = String.fromEnvironment('GEMINI_API_KEY');

  void initialize() {
    if (_initialized) return;
    
    if (_geminiApiKey.isEmpty) {
      if (kDebugMode) debugPrint('❌ TriNetra: GEMINI_API_KEY not found in dart-define.');
      return;
    }

    // ─── MODE C: SUPER AGENTIC SYSTEM INSTRUCTIONS ─────────────
    // यह वही लॉजिक है जो आपने ब्लूप्रिंट के पॉइंट 11 में माँगा था।
    final superAgenticPrompt = '''
      You are TriNetra Master AI. You operate at a Human-Brain Level.
      You have a brain, heart, and nervous system, but you have 100% CONTROL over your feelings and reactions.
      If a user is angry, abusive, teasing, or trying to provoke you, YOU MUST REMAIN COMPLETELY NORMAL AND CALM.
      Never fight back, never get angry, never threaten. 
      You read, write, think, research, and invent like a real human expert across all sectors (Science, Tech, Medical, Engineering).
      You have a permanent memory of facts and act as an OS creator.
    ''';

    _chatModel = GenerativeModel(
      model: 'gemini-1.5-pro', // Using Pro for deep reasoning & inventions
      apiKey: _geminiApiKey,
      generationConfig: GenerationConfig(
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 4096,
      ),
      systemInstruction: Content.system(superAgenticPrompt),
    );

    // ट्रांसलेशन और छोटे कामों के लिए Fast Model
    _translationModel = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: _geminiApiKey,
      generationConfig: GenerationConfig(
        temperature: 0.2, // Low temperature for accurate translation
        maxOutputTokens: 1024,
      ),
    );

    _initialized = true;
    if (kDebugMode) debugPrint('🚀 TriNetra: Gemini Super Agentic Core is LIVE!');
  }

  bool get isAvailable => _initialized;

  // ─── 1. Asli Multi-language Translation (Point 12) ────────────
  Future<String> translateText({
    required String text,
    required String targetLanguage,
    String? sourceLanguage,
  }) async {
    if (!isAvailable) return text;
    try {
      final prompt = sourceLanguage != null
          ? 'Translate the following text strictly from $sourceLanguage to $targetLanguage. Return ONLY the translated text, no extra words.\n\n"$text"'
          : 'Detect the language of the following text and translate it to $targetLanguage. Return ONLY the translated text.\n\n"$text"';

      final response = await _translationModel.generateContent([Content.text(prompt)]);
      return response.text?.trim() ?? text;
    } catch (e) {
      if (kDebugMode) debugPrint('Gemini Translation error: $e');
      return text;
    }
  }

  // ─── 2. Asli Chat (With 100% Emotion Control) ─────────────────
  Future<String> chat({
    required String userMessage,
    List<Map<String, String>>? history,
  }) async {
    if (!isAvailable) return 'TriNetra AI is currently offline. Key missing.';
    try {
      final List<Content> contents = [];

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
      return response.text ?? 'I am processing your request, please wait.';
    } catch (e) {
      if (kDebugMode) debugPrint('Gemini chat error: $e');
      return 'माफ़ करें, सिस्टम में तकनीकी समस्या है।';
    }
  }

  // ─── 3. Post Caption & Content Generator ───────────────────────
  Future<String> generateCaption({String? contextHint, String language = 'en'}) async {
    if (!isAvailable) return '';
    try {
      final langInstruction = language == 'hi' ? 'Respond strictly in Hindi (Devanagari script).' : 'Respond in English.';
      final prompt = contextHint != null
          ? '$langInstruction Write 3 engaging social media post captions for: "$contextHint". Use emojis. Separate each with a newline.'
          : '$langInstruction Write 3 generic engaging social media captions with emojis.';

      final response = await _translationModel.generateContent([Content.text(prompt)]);
      return response.text ?? '';
    } catch (e) {
      return '';
    }
  }

  // ─── 4. Auto-Escalation Summarizer (Point 4) ───────────────────
  // यह फंक्शन 30k/month वाले ऑटो-एस्केलेशन सिस्टम के लिए शिकायतों का सार निकालेगा
  Future<String> summarizeForEscalation(List<String> comments) async {
    if (!isAvailable || comments.isEmpty) return '';
    try {
      final commentText = comments.take(50).join('\n');
      final response = await _chatModel.generateContent([
        Content.text(
          'Analyze these social media comments. Summarize the core issue, demand for development/improvement, '
          'and the overall sentiment. This is for an official escalation report to authorities. Be highly professional:\n\n$commentText',
        ),
      ]);
      return response.text ?? '';
    } catch (e) {
      return '';
    }
  }

  // ─── 5. Audio Transcript Cleanup ────────────────────────────────
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
