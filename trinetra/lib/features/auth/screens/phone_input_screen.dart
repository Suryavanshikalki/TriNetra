import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTIC FEEDBACK
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:country_code_picker/country_code_picker.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_colors.dart';
import '../controllers/auth_controller.dart'; // 🔥 ASLI AWS AUTH CONTROLLER
import '../../../core/services/sentry_service.dart'; // 🔥 100% SECURITY TRACKING
import '../../../core/services/logrocket_service.dart'; // 🔥 ANALYTICS

// ==============================================================
// 👁️🔥 TRINETRA MASTER PHONE INPUT (Facebook 2026 Standard)
// 100% REAL: AWS Cognito OTP Trigger, Sentry Tracked, Haptics
// ==============================================================

class PhoneInputScreen extends ConsumerStatefulWidget {
  const PhoneInputScreen({super.key});

  @override
  ConsumerState<PhoneInputScreen> createState() => _PhoneInputScreenState();
}

class _PhoneInputScreenState extends ConsumerState<PhoneInputScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final FocusNode _phoneFocus = FocusNode();
  String _countryCode = '+91';
  bool _isValid = false;
  bool _isLoading = false; // 🔥 Asli Loading State for AWS Call

  @override
  void initState() {
    super.initState();
    _phoneController.addListener(_validatePhone);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _phoneFocus.requestFocus();
    });
    
    // Log Analytics Event
    LogRocketService.instance.logPageView('Phone_Input_Screen');
  }

  void _validatePhone() {
    final digits = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    setState(() => _isValid = digits.length >= 7 && digits.length <= 15);
  }

  // 🔥 100% ASLI AWS OTP TRIGGER
  Future<void> _onContinue() async {
    if (!_isValid || _isLoading) return;
    
    HapticFeedback.selectionClick(); // Premium Click Feel
    FocusScope.of(context).unfocus(); // Keyboard hide

    final fullPhone = '$_countryCode${_phoneController.text.trim()}';
    
    setState(() => _isLoading = true);

    // Track intent
    SentryService.instance.addBreadcrumb('Requesting AWS OTP for $fullPhone');
    LogRocketService.instance.track('OTP_Request_Initiated');

    // Trigger Real AWS Cognito OTP
    await ref.read(authControllerProvider.notifier).sendOtp(
      phoneNumber: fullPhone,
      onError: (errorMsg) {
        if (!mounted) return;
        setState(() => _isLoading = false);
        HapticFeedback.heavyImpact(); // Error Vibration
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMsg),
            backgroundColor: AppColors.error,
          ),
        );
      },
      onCodeSent: () {
        if (!mounted) return;
        setState(() => _isLoading = false);
        HapticFeedback.mediumImpact(); // Success Vibration
        
        // AWS OTP Sent successfully, NOW navigate to OTP screen
        context.go('/otp', extra: fullPhone);
      },
    );
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _phoneFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? AppColors.backgroundDark : AppColors.backgroundLight;
    final cardBg = isDark ? AppColors.cardDark : AppColors.cardLight;
    final textColor =
        isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final subColor =
        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: textColor),
          onPressed: () {
            HapticFeedback.selectionClick();
            context.go('/login');
          },
        ),
        title: Text(
          'Enter Phone Number',
          style: TextStyle(
            color: textColor,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 32),

              // ─── Header ──────────────────────────────────
              Text(
                'Enter your mobile number',
                style: TextStyle(
                  color: textColor,
                  fontSize: 22,
                  fontWeight: FontWeight.w800, // Premium Bold
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "We'll send you an AWS secure OTP to verify your number.", // 🔥 Secure Branding
                style: TextStyle(
                  color: subColor,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 32),

              // ─── Phone Input Card ─────────────────────────
              Container(
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _phoneFocus.hasFocus
                        ? AppColors.primary
                        : (isDark ? AppColors.dividerDark : AppColors.dividerLight),
                    width: _phoneFocus.hasFocus ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    // Country Code Picker
                    CountryCodePicker(
                      onChanged: (code) {
                        setState(() => _countryCode = code.dialCode ?? '+91');
                      },
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

                    // Divider
                    Container(
                      width: 1,
                      height: 28,
                      color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
                    ),

                    // Phone Number TextField
                    Expanded(
                      child: TextField(
                        controller: _phoneController,
                        focusNode: _phoneFocus,
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(15),
                        ],
                        style: TextStyle(
                          color: textColor,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
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
                        onSubmitted: (_) => _onContinue(),
                      ),
                    ),

                    // Clear button
                    if (_phoneController.text.isNotEmpty)
                      IconButton(
                        icon: Icon(Icons.cancel, color: subColor, size: 18),
                        onPressed: () {
                          HapticFeedback.selectionClick();
                          _phoneController.clear();
                          _phoneFocus.requestFocus();
                        },
                      ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Standard SMS rates may apply.',
                style: TextStyle(color: subColor, fontSize: 11),
              ),

              const SizedBox(height: 32),

              // ─── Continue Button (AWS Trigger) ──────────
              AnimatedOpacity(
                opacity: _isValid && !_isLoading ? 1.0 : 0.5,
                duration: const Duration(milliseconds: 200),
                child: ElevatedButton(
                  onPressed: _isValid && !_isLoading ? _onContinue : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    disabledBackgroundColor:
                        AppColors.primary.withOpacity(0.5),
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 0,
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
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
        ),
      ),
    );
  }
}
