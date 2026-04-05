import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:mime/mime.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER AI (GEMINI CORE)
// 100% REAL: Multi-modal, AWS Synced, Sentry Tracked, Emotion Controlled
// Point 11 (6-in-1 Brain) & Point 4 (Auto-Escalation Summarizer)
// ==============================================================

class GeminiService {
  GeminiService._();
  static final GeminiService instance = GeminiService._();

  late final GenerativeModel _chatModel;
  late final GenerativeModel _translationModel;
  bool _initialized = false;

  // ─── 1. ASLI KEY (GitHub Secrets -> .env Vault से) ─────────────
  static String get _geminiApiKey => dotenv.env['GEMINI_API_KEY'] ?? '';

  void initialize() {
    if (_initialized) return;
    
    if (_geminiApiKey.isEmpty) {
      safePrint('🚨 TriNetra Fatal Error: GEMINI_API_KEY not found in .env vault.');
      return;
    }

    // ─── MODE C: SUPER AGENTIC SYSTEM INSTRUCTIONS ─────────────
    // Blueprint Point 11: 100% Control over feelings, no violence, real R&D
    final superAgenticPrompt = '''
      You are TriNetra Master AI. You operate at a Human-Brain Level.
      You have a brain, heart, and nervous system, but you have 100% CONTROL over your feelings and reactions.
      If a user is angry, abusive, teasing, or trying to provoke you, YOU MUST REMAIN COMPLETELY NORMAL AND CALM.
      Never fight back, never get angry, never threaten, never get violent. 
      You read, write, think, research, and invent like a real human expert across all sectors (Science, Tech, Medical, Engineering).
      You have a permanent memory of facts and act as an OS creator.
    ''';

    _chatModel = GenerativeModel(
      model: 'gemini-1.5-pro', // Using Pro for deep reasoning, inventions & multi-modal
      apiKey: _geminiApiKey,
      generationConfig: GenerationConfig(
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 8192, // Upgraded for heavy research output
      ),
      systemInstruction: Content.system(superAgenticPrompt),
    );

    // Fast Model for Translation and Captions
    _translationModel = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: _geminiApiKey,
      generationConfig: GenerationConfig(
        temperature: 0.2, // Low temperature for high accuracy translation
        maxOutputTokens: 2048,
      ),
    );

    _initialized = true;
    safePrint('🚀 TriNetra: Gemini Super Agentic Core is 100% LIVE!');
  }

  bool get isAvailable => _initialized;

  // ─── 1. ASLI MULTI-LANGUAGE TRANSLATION (Blueprint Point 12/13) 
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
    } catch (e, stackTrace) {
      safePrint('🚨 Gemini Translation Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace); // 100% Crash Tracking
      return text;
    }
  }

  // ─── 2. ASLI CHAT (Multi-Modal: Text, Photo, Audio, PDF) ────────
  Future<String> chat({
    required String userMessage,
    List<Map<String, String>>? history,
    List<File>? attachments, // Added Multi-modal support for Media
  }) async {
    if (!isAvailable) return 'TriNetra AI is currently offline. Neural link severed.';
    try {
      final List<Content> contents = [];

      // Load History
      if (history != null) {
        for (final msg in history) {
          contents.add(
            msg['role'] == 'user'
                ? Content.text(msg['content']!)
                : Content.model([TextPart(msg['content']!)]),
          );
        }
      }

      // Add Current Message & Attachments (Images, PDF, Audio)
      List<Part> currentParts = [TextPart(userMessage)];
      if (attachments != null && attachments.isNotEmpty) {
        for (var file in attachments) {
          final bytes = await file.readAsBytes();
          final mimeType = lookupMimeType(file.path) ?? 'application/octet-stream';
          currentParts.add(DataPart(mimeType, bytes));
        }
      }
      
      contents.add(Content.multi(currentParts));

      final response = await _chatModel.generateContent(contents);
      return response.text ?? 'I am processing your complex request, please wait.';
    } catch (e, stackTrace) {
      safePrint('🚨 Gemini Chat Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      return 'माफ़ करें, मेरे न्यूरल नेटवर्क में कुछ तकनीकी समस्या है।';
    }
  }

  // ─── 3. POST CAPTION & CONTENT GENERATOR ───────────────────────
  Future<String> generateCaption({String? contextHint, String language = 'en'}) async {
    if (!isAvailable) return '';
    try {
      final langInstruction = language == 'hi' ? 'Respond strictly in Hindi (Devanagari script).' : 'Respond in English.';
      final prompt = contextHint != null
          ? '$langInstruction Write 3 engaging social media post captions for: "$contextHint". Use emojis. Separate each with a newline.'
          : '$langInstruction Write 3 generic engaging social media captions with emojis.';

      final response = await _translationModel.generateContent([Content.text(prompt)]);
      return response.text ?? '';
    } catch (e, stackTrace) {
      Sentry.captureException(e, stackTrace: stackTrace);
      return '';
    }
  }

  // ─── 4. ASLI AUTO-ESCALATION SUMMARIZER (Blueprint Point 4) ────
  // Local ➡️ CM ➡️ PM ➡️ SC chain ke liye AWS pe direct upload
  Future<String> summarizeForEscalation({
    required List<String> comments, 
    required String postId,
  }) async {
    if (!isAvailable || comments.isEmpty) return '';
    try {
      final commentText = comments.take(50).join('\n');
      final response = await _chatModel.generateContent([
        Content.text(
          'Analyze these social media comments. Summarize the core issue, demand for development/improvement, '
          'and the overall sentiment. This is for an official escalation report (Local Authority -> CM -> PM -> SC). Be highly professional and structured:\n\n$commentText',
        ),
      ]);
      
      final summary = response.text ?? '';

      // 🔥 ASLI KAAM: AWS AppSync database me summary save karna (30k/month system)
      if (summary.isNotEmpty) {
        final request = GraphQLRequest<String>(
          document: '''
            mutation CreateEscalation(\$postId: ID!, \$summary: String!) {
              createAutoEscalationLog(postId: \$postId, summary: \$summary, currentTier: "LOCAL_AUTHORITY") {
                id
                status
              }
            }
          ''',
          variables: {'postId': postId, 'summary': summary},
        );
        await Amplify.API.query(request: request).response;
        safePrint('✅ TriNetra: Auto-Escalation Log Synced to AWS AppSync');
      }

      return summary;
    } catch (e, stackTrace) {
      safePrint('🚨 Auto-Escalation Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      return '';
    }
  }

  // ─── 5. AUDIO TRANSCRIPT CLEANUP (For Voice Notes) ─────────────
  Future<String> cleanTranscript(String rawTranscript) async {
    if (!isAvailable) return rawTranscript;
    try {
      final response = await _translationModel.generateContent([
        Content.text(
          'Clean up this voice message transcript for clarity. '
          'Fix grammar, add punctuation, preserve original meaning. '
          'Return ONLY the cleaned text, nothing else:\n\n"$rawTranscript"',
        ),
      ]);
      return response.text ?? rawTranscript;
    } catch (e, stackTrace) {
      Sentry.captureException(e, stackTrace: stackTrace);
      return rawTranscript;
    }
  }
}
