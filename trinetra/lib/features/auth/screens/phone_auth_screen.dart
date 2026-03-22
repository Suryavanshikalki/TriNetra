import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:country_code_picker/country_code_picker.dart';
import 'package:go_router/go_router.dart';
import 'package:pinput/pinput.dart';
import '../../../core/constants/app_colors.dart';
import '../controllers/auth_controller.dart';

/// PhoneAuthScreen — Unified Phone Authentication (single screen, two steps)
///
/// Step 1: Phone number entry with country code picker
/// Step 2: OTP verification (6-digit PIN input)
///
/// Replaces the two-screen flow (phone_input_screen + otp_verify_screen)
/// with a slick single-screen animated experience.
class PhoneAuthScreen extends ConsumerStatefulWidget {
  const PhoneAuthScreen({super.key});

  @override
  ConsumerState<PhoneAuthScreen> createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends ConsumerState<PhoneAuthScreen>
    with SingleTickerProviderStateMixin {
  // ─── Controllers ──────────────────────────────────────────────
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  final _phoneFocus = FocusNode();
  final _otpFocus = FocusNode();

  // ─── State ────────────────────────────────────────────────────
  String _countryCode = '+91';
  bool _phoneValid = false;
  bool _showOtp = false;
  String? _errorMessage;
  int _secondsLeft = 30;
  bool _canResend = false;
  Timer? _timer;

  late AnimationController _slideController;
  late Animation<Offset> _slideIn;
  late Animation<double> _fadeIn;

  @override
  void initState() {
    super.initState();
    _phoneController.addListener(_validatePhone);

    _slideController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _slideIn = Tween<Offset>(
      begin: const Offset(1.0, 0.0),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOut));
    _fadeIn = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _slideController, curve: Curves.easeIn),
    );
  }

  void _validatePhone() {
    final digits = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    setState(() => _phoneValid = digits.length >= 7 && digits.length <= 15);
  }

  Future<void> _sendOtp() async {
    if (!_phoneValid) return;
    final phone = '$_countryCode${_phoneController.text.trim()}';

    setState(() => _errorMessage = null);
    await ref.read(authControllerProvider.notifier).sendOtp(
      phoneNumber: phone,
      onError: (e) => setState(() => _errorMessage = e),
      onCodeSent: () {
        setState(() {
          _showOtp = true;
          _secondsLeft = 30;
          _canResend = false;
          _errorMessage = null;
        });
        _slideController.forward(from: 0.0);
        _startTimer();
        Future.delayed(const Duration(milliseconds: 400), () {
          if (mounted) _otpFocus.requestFocus();
        });
      },
    );
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        setState(() => _canResend = true);
        t.cancel();
      }
    });
  }

  Future<void> _verifyOtp(String otp) async {
    if (otp.length != 6) return;
    setState(() => _errorMessage = null);

    await ref.read(authControllerProvider.notifier).verifyOtp(
      otp: otp,
      onError: (e) {
        setState(() => _errorMessage = e);
        _otpController.clear();
        _otpFocus.requestFocus();
      },
    );

    final status = ref.read(authControllerProvider).status;
    if (status == AuthStatus.authenticated && mounted) {
      context.go('/home');
    }
  }

  void _goBackToPhone() {
    setState(() {
      _showOtp = false;
      _errorMessage = null;
      _otpController.clear();
    });
    _timer?.cancel();
    _slideController.reverse();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    _phoneFocus.dispose();
    _otpFocus.dispose();
    _timer?.cancel();
    _slideController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.status == AuthStatus.loading;

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: _showOtp ? _goBackToPhone : () => context.go('/login'),
        ),
        title: Text(
          _showOtp ? 'Verify OTP' : 'Sign In',
          style: TextStyle(
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 350),
          transitionBuilder: (child, animation) => FadeTransition(
            opacity: animation,
            child: child,
          ),
          child: _showOtp
              ? _OtpStep(
                  key: const ValueKey('otp'),
                  slideIn: _slideIn,
                  fadeIn: _fadeIn,
                  otpController: _otpController,
                  otpFocus: _otpFocus,
                  phoneNumber: '$_countryCode${_phoneController.text.trim()}',
                  isLoading: isLoading,
                  errorMessage: _errorMessage,
                  secondsLeft: _secondsLeft,
                  canResend: _canResend,
                  isDark: isDark,
                  onVerify: _verifyOtp,
                  onResend: () {
                    setState(() {
                      _secondsLeft = 30;
                      _canResend = false;
                      _errorMessage = null;
                    });
                    _otpController.clear();
                    _startTimer();
                    _sendOtp();
                  },
                )
              : _PhoneStep(
                  key: const ValueKey('phone'),
                  phoneController: _phoneController,
                  phoneFocus: _phoneFocus,
                  countryCode: _countryCode,
                  isValid: _phoneValid,
                  isLoading: isLoading,
                  errorMessage: _errorMessage,
                  isDark: isDark,
                  onCountryChanged: (code) =>
                      setState(() => _countryCode = code),
                  onContinue: _sendOtp,
                ),
        ),
      ),
    );
  }
}

// ─── Step 1: Phone Entry ──────────────────────────────────────────
class _PhoneStep extends StatelessWidget {
  final TextEditingController phoneController;
  final FocusNode phoneFocus;
  final String countryCode;
  final bool isValid;
  final bool isLoading;
  final String? errorMessage;
  final bool isDark;
  final void Function(String) onCountryChanged;
  final VoidCallback onContinue;

  const _PhoneStep({
    super.key,
    required this.phoneController,
    required this.phoneFocus,
    required this.countryCode,
    required this.isValid,
    required this.isLoading,
    required this.errorMessage,
    required this.isDark,
    required this.onCountryChanged,
    required this.onContinue,
  });

  @override
  Widget build(BuildContext context) {
    final textColor =
        isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final subColor =
        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;
    final cardBg = isDark ? AppColors.cardDark : Colors.white;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 32),

          // ─── Icon ─────────────────────────────────────────
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.phone_android_outlined,
              color: AppColors.primary,
              size: 30,
            ),
          ),
          const SizedBox(height: 20),

          // ─── Headline ─────────────────────────────────────
          Text(
            'Enter your mobile number',
            style: TextStyle(
              color: textColor,
              fontSize: 22,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "We'll send you a 6-digit OTP to verify your identity.",
            style: TextStyle(color: subColor, fontSize: 14, height: 1.5),
          ),
          const SizedBox(height: 32),

          // ─── Phone Input Card ─────────────────────────────
          Container(
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
              ),
            ),
            child: Row(
              children: [
                CountryCodePicker(
                  onChanged: (c) => onCountryChanged(c.dialCode ?? '+91'),
                  initialSelection: 'IN',
                  favorite: const ['+91', 'IN', '+1', 'US'],
                  showCountryOnly: false,
                  showOnlyCountryWhenClosed: false,
                  alignLeft: false,
                  textStyle: TextStyle(
                    color: textColor,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                  flagWidth: 24,
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                ),
                Container(
                  width: 1,
                  height: 28,
                  color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
                ),
                Expanded(
                  child: TextField(
                    controller: phoneController,
                    focusNode: phoneFocus,
                    keyboardType: TextInputType.phone,
                    autofocus: true,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(15),
                    ],
                    style: TextStyle(
                      color: textColor,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Mobile number',
                      hintStyle: TextStyle(color: subColor, fontSize: 15),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 16,
                      ),
                    ),
                    onSubmitted: (_) => onContinue(),
                  ),
                ),
              ],
            ),
          ),

          if (errorMessage != null) ...[
            const SizedBox(height: 12),
            _ErrorBanner(message: errorMessage!),
          ],

          const SizedBox(height: 8),
          Text(
            'Standard SMS rates may apply.',
            style: TextStyle(color: subColor, fontSize: 11),
          ),

          const SizedBox(height: 32),

          // ─── Continue Button ──────────────────────────────
          AnimatedOpacity(
            opacity: isValid && !isLoading ? 1.0 : 0.5,
            duration: const Duration(milliseconds: 200),
            child: ElevatedButton(
              onPressed: isValid && !isLoading ? onContinue : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size(double.infinity, 52),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: isLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text(
                      'Continue',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Step 2: OTP Verification ─────────────────────────────────────
class _OtpStep extends StatelessWidget {
  final Animation<Offset> slideIn;
  final Animation<double> fadeIn;
  final TextEditingController otpController;
  final FocusNode otpFocus;
  final String phoneNumber;
  final bool isLoading;
  final String? errorMessage;
  final int secondsLeft;
  final bool canResend;
  final bool isDark;
  final void Function(String) onVerify;
  final VoidCallback onResend;

  const _OtpStep({
    super.key,
    required this.slideIn,
    required this.fadeIn,
    required this.otpController,
    required this.otpFocus,
    required this.phoneNumber,
    required this.isLoading,
    required this.errorMessage,
    required this.secondsLeft,
    required this.canResend,
    required this.isDark,
    required this.onVerify,
    required this.onResend,
  });

  @override
  Widget build(BuildContext context) {
    final textColor =
        isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final subColor =
        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;

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

    return FadeTransition(
      opacity: fadeIn,
      child: SlideTransition(
        position: slideIn,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 32),

              // ─── Icon ──────────────────────────────────────
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.sms_outlined,
                  color: AppColors.primary,
                  size: 34,
                ),
              ),
              const SizedBox(height: 24),

              // ─── Headline ──────────────────────────────────
              Text(
                'Verification Code',
                style: TextStyle(
                  color: textColor,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'We sent a 6-digit code to',
                style: TextStyle(color: subColor, fontSize: 14),
              ),
              const SizedBox(height: 4),
              Text(
                phoneNumber,
                style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),

              const SizedBox(height: 36),

              // ─── OTP Input ────────────────────────────────
              Pinput(
                controller: otpController,
                focusNode: otpFocus,
                length: 6,
                autofocus: true,
                defaultPinTheme: defaultPinTheme,
                focusedPinTheme: defaultPinTheme.copyDecorationWith(
                  border: Border.all(
                    color: AppColors.primary,
                    width: 2,
                  ),
                ),
                errorPinTheme: defaultPinTheme.copyDecorationWith(
                  border: Border.all(color: AppColors.error, width: 2),
                ),
                onCompleted: onVerify,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              ),

              if (errorMessage != null) ...[
                const SizedBox(height: 16),
                _ErrorBanner(message: errorMessage!),
              ],

              const SizedBox(height: 32),

              // ─── Verify Button ────────────────────────────
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () => onVerify(otpController.text),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: isLoading
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor:
                              AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        'Verify & Continue',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
              ),

              const SizedBox(height: 24),

              // ─── Resend OTP ───────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Didn't receive code? ",
                    style: TextStyle(color: subColor, fontSize: 14),
                  ),
                  GestureDetector(
                    onTap: canResend ? onResend : null,
                    child: Text(
                      canResend
                          ? 'Resend OTP'
                          : 'Resend in ${secondsLeft}s',
                      style: TextStyle(
                        color: canResend ? AppColors.primary : subColor,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
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

// ─── Error Banner ─────────────────────────────────────────────────
class _ErrorBanner extends StatelessWidget {
  final String message;
  const _ErrorBanner({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: AppColors.error.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: AppColors.error, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: AppColors.error, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
