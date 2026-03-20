import 'dart:async';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import '../../firebase_options.dart';

class FirebaseService {
  FirebaseService._();
  static final FirebaseService instance = FirebaseService._();

  late final FirebaseAuth auth;
  late final FirebaseFirestore firestore;
  late final FirebaseStorage storage;
  late final FirebaseAnalytics analytics;
  late final FirebaseCrashlytics crashlytics;
  late final FirebaseMessaging messaging;

  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;

    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    auth = FirebaseAuth.instance;
    firestore = FirebaseFirestore.instance;
    storage = FirebaseStorage.instance;
    analytics = FirebaseAnalytics.instance;
    crashlytics = FirebaseCrashlytics.instance;
    messaging = FirebaseMessaging.instance;

    // Enable Crashlytics in release mode
    if (!kDebugMode) {
      await crashlytics.setCrashlyticsCollectionEnabled(true);
      FlutterError.onError = crashlytics.recordFlutterFatalError;
    }

    // Setup FCM
    await _setupFCM();

    // Firestore settings
    firestore.settings = const Settings(
      persistenceEnabled: true,
      cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
    );

    _initialized = true;
    if (kDebugMode) debugPrint('Firebase initialized successfully');
  }

  Future<void> _setupFCM() async {
    // Request notification permission
    await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Get FCM token
    final token = await messaging.getToken();
    if (kDebugMode) debugPrint('FCM Token: $token');

    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  }

  // ─── Auth Helpers ─────────────────────────────────────────
  Stream<User?> get authStateChanges => auth.authStateChanges();
  User? get currentUser => auth.currentUser;

  Future<void> signOut() async {
    await auth.signOut();
  }

  // ─── Firestore Helpers ────────────────────────────────────
  CollectionReference<Map<String, dynamic>> collection(String path) =>
      firestore.collection(path);

  DocumentReference<Map<String, dynamic>> doc(String path) =>
      firestore.doc(path);

  // ─── Analytics Helpers ───────────────────────────────────
  Future<void> logEvent(String name, {Map<String, Object>? params}) async {
    await analytics.logEvent(name: name, parameters: params);
  }

  Future<void> setUserId(String userId) async {
    await analytics.setUserId(id: userId);
  }

  // ─── Error Reporting ─────────────────────────────────────
  Future<void> recordError(dynamic exception, StackTrace? stack) async {
    if (!kDebugMode) {
      await crashlytics.recordError(exception, stack);
    }
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
}
