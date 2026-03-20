// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'TriNetra';

  @override
  String get tagline => 'Connect. Share. Grow.';

  @override
  String get login => 'Log In';

  @override
  String get logout => 'Log Out';

  @override
  String get createAccount => 'Create new account';

  @override
  String get phoneNumber => 'Phone Number';

  @override
  String get enterPhoneNumber => 'Enter your mobile number';

  @override
  String get otpSentTo => 'We sent a 6-digit code to';

  @override
  String get verifyOtp => 'Verify OTP';

  @override
  String get verifyAndContinue => 'Verify & Continue';

  @override
  String get resendOtp => 'Resend OTP';

  @override
  String resendIn(int seconds) {
    return 'Resend in ${seconds}s';
  }

  @override
  String get continueBtn => 'Continue';

  @override
  String get home => 'Home';

  @override
  String get friends => 'Friends';

  @override
  String get reels => 'Reels';

  @override
  String get marketplace => 'Marketplace';

  @override
  String get menu => 'Menu';

  @override
  String get whatsOnYourMind => 'What\'s on your mind?';

  @override
  String get like => 'Like';

  @override
  String get comment => 'Comment';

  @override
  String get share => 'Share';

  @override
  String get boost => 'Boost';

  @override
  String get translate => 'Translate';

  @override
  String get seeOriginal => 'See original';

  @override
  String get addStory => 'Add Story';

  @override
  String get createStory => 'Create Story';

  @override
  String get liveVideo => 'Live video';

  @override
  String get photo => 'Photo';

  @override
  String get feeling => 'Feeling';

  @override
  String get aiAssist => 'AI Assist';

  @override
  String get savePost => 'Save post';

  @override
  String get hidePost => 'Hide post';

  @override
  String get reportPost => 'Report post';

  @override
  String get boostPost => 'Boost Post';

  @override
  String get boostPostDesc =>
      'Promote this post to reach more people.\nPowered by TriNetra Pay.';

  @override
  String get cancel => 'Cancel';

  @override
  String get boostNow => 'Boost Now';

  @override
  String get settings => 'Settings';

  @override
  String get darkMode => 'Dark Mode';

  @override
  String get lightMode => 'Light Mode';

  @override
  String get language => 'Language';

  @override
  String get english => 'English';

  @override
  String get hindi => 'Hindi';

  @override
  String get termsPrivacy =>
      'By continuing, you agree to our Terms of Service and Privacy Policy.';

  @override
  String get dontHaveAccount => 'Don\'t have an account?';

  @override
  String get invalidPhone =>
      'Invalid phone number. Please check and try again.';

  @override
  String get tooManyAttempts =>
      'Too many attempts. Please wait before trying again.';

  @override
  String get incorrectOtp => 'Incorrect OTP. Please enter the correct code.';

  @override
  String get otpExpired => 'OTP expired. Please request a new one.';

  @override
  String get sessionExpired => 'Session expired. Please request a new OTP.';

  @override
  String get comingSoon => 'Coming Soon!';

  @override
  String get emailLoginComingSoon => 'Email login coming soon!';

  @override
  String get logInWithPhone => 'Log in with Phone Number';

  @override
  String get logInWithEmail => 'Log in with Email';

  @override
  String get or => 'OR';

  @override
  String get creatorStudio => 'Creator Studio';

  @override
  String get wallet => 'TriNetra Pay';

  @override
  String get notifications => 'Notifications';

  @override
  String get search => 'Search';

  @override
  String get messenger => 'Messenger';

  @override
  String get groups => 'Groups';

  @override
  String get pages => 'Pages';

  @override
  String get profileLock => 'Lock Profile';

  @override
  String get verificationBadge => 'Verified';

  @override
  String get creatorPro => 'Creator Pro';

  @override
  String get earnMore => 'Earn More';

  @override
  String get requestPayout => 'Request Payout';

  @override
  String get transactionHistory => 'Transaction History';
}
