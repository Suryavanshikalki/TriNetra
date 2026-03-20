import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/services/firebase_service.dart';
import '../../../core/services/sentry_service.dart';
import '../../../core/services/logrocket_service.dart';

// ─── Auth State ──────────────────────────────────────────────────
enum AuthStatus { unknown, authenticated, unauthenticated, loading, error }

class AuthState {
  final AuthStatus status;
  final User? user;
  final String? errorMessage;
  final String? verificationId;
  final int? resendToken;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.user,
    this.errorMessage,
    this.verificationId,
    this.resendToken,
  });

  AuthState copyWith({
    AuthStatus? status,
    User? user,
    String? errorMessage,
    String? verificationId,
    int? resendToken,
  }) =>
      AuthState(
        status: status ?? this.status,
        user: user ?? this.user,
        errorMessage: errorMessage,
        verificationId: verificationId ?? this.verificationId,
        resendToken: resendToken ?? this.resendToken,
      );
}

// ─── Auth Controller ─────────────────────────────────────────────
class AuthController extends StateNotifier<AuthState> {
  final FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  AuthController()
      : _auth = FirebaseService.instance.auth,
        _firestore = FirebaseService.instance.firestore,
        super(const AuthState()) {
    _init();
  }

  void _init() {
    _auth.authStateChanges().listen((user) {
      if (user != null) {
        state = state.copyWith(
          status: AuthStatus.authenticated,
          user: user,
        );
        SentryService.instance.setUser(
          id: user.uid,
          username: user.phoneNumber,
        );
        LogRocketService.instance.identifyUser(
          userId: user.uid,
          name: user.displayName,
        );
      } else {
        state = state.copyWith(
          status: AuthStatus.unauthenticated,
          user: null,
        );
      }
    });
  }

  // ─── Send OTP ──────────────────────────────────────────────
  Future<void> sendOtp({
    required String phoneNumber,
    required void Function(String error) onError,
    required void Function() onCodeSent,
  }) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      await _auth.verifyPhoneNumber(
        phoneNumber: phoneNumber,
        timeout: const Duration(seconds: 120),
        verificationCompleted: (PhoneAuthCredential credential) async {
          // Auto-retrieval on Android
          await _signInWithCredential(credential);
        },
        verificationFailed: (FirebaseAuthException e) {
          final msg = _mapFirebaseError(e.code);
          state = state.copyWith(
            status: AuthStatus.error,
            errorMessage: msg,
          );
          onError(msg);
        },
        codeSent: (String verificationId, int? resendToken) {
          state = state.copyWith(
            status: AuthStatus.unauthenticated,
            verificationId: verificationId,
            resendToken: resendToken,
          );
          onCodeSent();
        },
        codeAutoRetrievalTimeout: (String verificationId) {
          state = state.copyWith(verificationId: verificationId);
        },
        forceResendingToken: state.resendToken,
      );
    } catch (e, st) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: 'Something went wrong. Please try again.',
      );
      await SentryService.instance.captureException(e, stackTrace: st);
      onError(state.errorMessage!);
    }
  }

  // ─── Verify OTP ────────────────────────────────────────────
  Future<void> verifyOtp({
    required String otp,
    required void Function(String error) onError,
  }) async {
    if (state.verificationId == null) {
      onError('Session expired. Please request a new OTP.');
      return;
    }
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final credential = PhoneAuthProvider.credential(
        verificationId: state.verificationId!,
        smsCode: otp,
      );
      await _signInWithCredential(credential);
    } on FirebaseAuthException catch (e) {
      final msg = _mapFirebaseError(e.code);
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: msg,
      );
      onError(msg);
    } catch (e, st) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: 'Invalid OTP. Please try again.',
      );
      await SentryService.instance.captureException(e, stackTrace: st);
      onError('Invalid OTP. Please try again.');
    }
  }

  Future<void> _signInWithCredential(PhoneAuthCredential credential) async {
    final userCredential = await _auth.signInWithCredential(credential);
    final user = userCredential.user!;

    // Create/update user profile in Firestore
    await _upsertUserProfile(user);

    state = state.copyWith(
      status: AuthStatus.authenticated,
      user: user,
    );
  }

  Future<void> _upsertUserProfile(User user) async {
    final ref = _firestore.collection('users').doc(user.uid);
    final snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        'uid': user.uid,
        'phone': user.phoneNumber,
        'displayName': user.displayName ?? '',
        'photoUrl': user.photoURL ?? '',
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        'isVerified': false,
        'isCreatorPro': false,
        'bio': '',
        'followers': 0,
        'following': 0,
        'postsCount': 0,
      });
    } else {
      await ref.update({'updatedAt': FieldValue.serverTimestamp()});
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
    await SentryService.instance.clearUser();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  String _mapFirebaseError(String code) {
    switch (code) {
      case 'invalid-phone-number':
        return 'Invalid phone number. Please check and try again.';
      case 'too-many-requests':
        return 'Too many attempts. Please wait before trying again.';
      case 'invalid-verification-code':
        return 'Incorrect OTP. Please enter the correct code.';
      case 'session-expired':
        return 'OTP expired. Please request a new one.';
      case 'quota-exceeded':
        return 'SMS quota exceeded. Please try later.';
      default:
        return 'Authentication error. Please try again.';
    }
  }
}

// ─── Providers ───────────────────────────────────────────────────
final authControllerProvider =
    StateNotifierProvider<AuthController, AuthState>(
  (ref) => AuthController(),
);

final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authControllerProvider).user;
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authControllerProvider).status == AuthStatus.authenticated;
});

// No additional extensions needed
