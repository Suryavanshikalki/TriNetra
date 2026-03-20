import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:country_code_picker/country_code_picker.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';

/// Facebook-style Phone Number Entry Screen
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

  @override
  void initState() {
    super.initState();
    _phoneController.addListener(_validatePhone);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _phoneFocus.requestFocus();
    });
  }

  void _validatePhone() {
    final digits = _phoneController.text.replaceAll(RegExp(r'\D'), '');
    setState(() => _isValid = digits.length >= 7 && digits.length <= 15);
  }

  void _onContinue() {
    if (!_isValid) return;
    final fullPhone = '$_countryCode${_phoneController.text.trim()}';
    context.go('/otp', extra: fullPhone);
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
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.go('/login'),
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
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "We'll send you an OTP to verify your number.",
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
                        onSubmitted: (_) => _onContinue(),
                      ),
                    ),

                    // Clear button
                    if (_phoneController.text.isNotEmpty)
                      IconButton(
                        icon: Icon(Icons.cancel, color: subColor, size: 18),
                        onPressed: () {
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

              // ─── Continue Button ──────────────────────────
              AnimatedOpacity(
                opacity: _isValid ? 1.0 : 0.5,
                duration: const Duration(milliseconds: 200),
                child: ElevatedButton(
                  onPressed: _isValid ? _onContinue : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    disabledBackgroundColor:
                        AppColors.primary.withOpacity(0.5),
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
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
