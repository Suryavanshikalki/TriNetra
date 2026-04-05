import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTIC FEEDBACK KE LIYE
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinput/pinput.dart';

import '../../../core/constants/app_colors.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../../core/services/sentry_service.dart'; // 🔥 100% SECURITY TRACKING

// ==============================================================
// 👁️🔥 TRINETRA MASTER OTP GATEWAY (Facebook 2026 Standard)
// 100% REAL: AWS Synced, Sentry Tracked, Premium Haptics
// ==============================================================

class OtpVerifyScreen extends ConsumerStatefulWidget {
  final String phoneNumber;
  const OtpVerifyScreen({super.key, required this.phoneNumber});

  @override
  ConsumerState<OtpVerifyScreen> createState() => _OtpVerifyScreenState();
}

class _OtpVerifyScreenState extends ConsumerState<OtpVerifyScreen> {
  final TextEditingController _otpController = TextEditingController();
  final FocusNode _otpFocus = FocusNode();

  int _secondsLeft = 30;
  bool _canResend = false;
  Timer? _timer;
  String? _errorMessage;
  int _failedAttempts = 0; // 🔥 Security Tracker

  @override
  void initState() {
    super.initState();
    _startTimer();
    _sendOtp();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft > 0) {
        if (mounted) setState(() => _secondsLeft--);
      } else {
        if (mounted) setState(() => _canResend = true);
        t.cancel();
      }
    });
  }

  void _resetTimer() {
    _timer?.cancel();
    setState(() {
      _secondsLeft = 30;
      _canResend = false;
      _errorMessage = null;
    });
    _startTimer();
  }

  Future<void> _sendOtp() async {
    if (!mounted) return;
    setState(() => _errorMessage = null);
    
    await ref.read(authControllerProvider.notifier).sendOtp(
      phoneNumber: widget.phoneNumber,
      onError: (e) {
        if (mounted) {
          setState(() => _errorMessage = e);
          HapticFeedback.heavyImpact(); // 🔥 Error Vibration
        }
      },
      onCodeSent: () {
        if (mounted) {
          HapticFeedback.mediumImpact(); // 🔥 Success Vibration
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('AWS Secured OTP sent to ${widget.phoneNumber}'),
              backgroundColor: AppColors.success, // TriNetra Success Color
              duration: const Duration(seconds: 3),
            ),
          );
        }
      },
    );
  }

  Future<void> _verifyOtp(String otp) async {
    if (otp.length != 6 || !mounted) return;
    setState(() => _errorMessage = null);
    
    await ref.read(authControllerProvider.notifier).verifyOtp(
      otp: otp,
      onError: (e) {
        if (mounted) {
          _failedAttempts++;
          setState(() => _errorMessage = e);
          _otpController.clear();
          _otpFocus.requestFocus();
          HapticFeedback.heavyImpact(); // 🔥 Error Vibration
          
          // 🔥 SECURITY ALERT: If someone tries to brute force the OTP
          if (_failedAttempts >= 3) {
            SentryService.instance.captureMessage(
              '🚨 TriNetra Security Alert: Multiple Failed OTP Attempts for ${widget.phoneNumber}',
            );
          }
        }
      },
    );

    // After verification attempt, check the status
    if (mounted) {
      final status = ref.read(authControllerProvider).status;
      if (status == AuthStatus.authenticated) {
        HapticFeedback.lightImpact(); // 🔥 Premium Login Feel
        
        // As per Blueprint Point 3: User should go to Profile setup or Home
        // Context.go routes them safely into the TriNetra AWS Ecosystem
        context.go('/home');
      }
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _otpController.dispose();
    _otpFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.status == AuthStatus.loading;
    
    final textColor = isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final subColor = isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;

    final defaultPinTheme = PinTheme(
      width: 52,
      height: 56,
      textStyle: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: textColor,
      ),
      decoration: BoxDecoration(
        color: isDark ? AppColors.inputBgDark : AppColors.inputBgLight,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
          width: 1.5,
        ),
      ),
    );

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: textColor),
          onPressed: () => context.go('/phone'),
        ),
        title: Text(
          'Verify OTP',
          style: TextStyle(
            color: textColor,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.lock_outline, // 🔥 Updated icon to look more secure
                  color: AppColors.primary,
                  size: 34,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Security Verification',
                style: TextStyle(
                  color: textColor,
                  fontSize: 22,
                  fontWeight: FontWeight.w900, // Premium bold
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'We sent a 6-digit AWS secure code to',
                style: TextStyle(color: subColor, fontSize: 14),
              ),
              const SizedBox(height: 4),
              Text(
                widget.phoneNumber,
                style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 36),
              
              // 🔥 ASLI PINPUT UI
              Pinput(
                controller: _otpController,
                focusNode: _otpFocus,
                length: 6,
                autofocus: true,
                defaultPinTheme: defaultPinTheme,
                focusedPinTheme: defaultPinTheme.copyDecorationWith(
                  border: Border.all(color: AppColors.primary, width: 2),
                ),
                errorPinTheme: defaultPinTheme.copyDecorationWith(
                  border: Border.all(color: AppColors.error, width: 2),
                ),
                onCompleted: _verifyOtp,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              ),
              
              const SizedBox(height: 16),
              
              // 🔥 ERROR BOX UI
              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline, color: AppColors.error, size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(color: AppColors.error, fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
              
              const SizedBox(height: 32),
              
              // 🔥 VERIFY BUTTON
              AnimatedOpacity(
                opacity: isLoading ? 0.7 : 1.0,
                duration: const Duration(milliseconds: 200),
                child: ElevatedButton(
                  onPressed: isLoading ? null : () => _verifyOtp(_otpController.text),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    elevation: 0,
                  ),
                  child: isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text(
                          'Verify & Access TriNetra',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 24),
              
              // 🔥 RESEND TIMER
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Didn't receive code? ", style: TextStyle(color: subColor, fontSize: 14)),
                  GestureDetector(
                    onTap: _canResend
                        ? () {
                            HapticFeedback.selectionClick();
                            _resetTimer();
                            _sendOtp();
                          }
                        : null,
                    child: Text(
                      _canResend ? 'Resend OTP' : 'Resend in ${_secondsLeft}s',
                      style: TextStyle(
                        color: _canResend ? AppColors.primary : subColor,
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
