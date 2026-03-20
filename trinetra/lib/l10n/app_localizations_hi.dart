// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class AppLocalizationsHi extends AppLocalizations {
  AppLocalizationsHi([String locale = 'hi']) : super(locale);

  @override
  String get appName => 'ट्राईनेत्र';

  @override
  String get tagline => 'जुड़ें. साझा करें. आगे बढ़ें.';

  @override
  String get login => 'लॉग इन';

  @override
  String get logout => 'लॉग आउट';

  @override
  String get createAccount => 'नया खाता बनाएं';

  @override
  String get phoneNumber => 'फ़ोन नंबर';

  @override
  String get enterPhoneNumber => 'अपना मोबाइल नंबर दर्ज करें';

  @override
  String get otpSentTo => 'हमने 6 अंकों का कोड भेजा है';

  @override
  String get verifyOtp => 'OTP सत्यापित करें';

  @override
  String get verifyAndContinue => 'सत्यापित करें और जारी रखें';

  @override
  String get resendOtp => 'OTP फिर से भेजें';

  @override
  String resendIn(int seconds) {
    return '$seconds सेकंड में फिर से भेजें';
  }

  @override
  String get continueBtn => 'जारी रखें';

  @override
  String get home => 'होम';

  @override
  String get friends => 'मित्र';

  @override
  String get reels => 'रील्स';

  @override
  String get marketplace => 'मार्केटप्लेस';

  @override
  String get menu => 'मेनू';

  @override
  String get whatsOnYourMind => 'आप क्या सोच रहे हैं?';

  @override
  String get like => 'पसंद';

  @override
  String get comment => 'टिप्पणी';

  @override
  String get share => 'साझा करें';

  @override
  String get boost => 'बूस्ट';

  @override
  String get translate => 'अनुवाद करें';

  @override
  String get seeOriginal => 'मूल देखें';

  @override
  String get addStory => 'स्टोरी जोड़ें';

  @override
  String get createStory => 'स्टोरी बनाएं';

  @override
  String get liveVideo => 'लाइव वीडियो';

  @override
  String get photo => 'फ़ोटो';

  @override
  String get feeling => 'भावना';

  @override
  String get aiAssist => 'AI सहायक';

  @override
  String get savePost => 'पोस्ट सहेजें';

  @override
  String get hidePost => 'पोस्ट छुपाएं';

  @override
  String get reportPost => 'पोस्ट रिपोर्ट करें';

  @override
  String get boostPost => 'पोस्ट बूस्ट करें';

  @override
  String get boostPostDesc =>
      'इस पोस्ट को अधिक लोगों तक पहुंचाएं।\nTriNetra Pay द्वारा संचालित।';

  @override
  String get cancel => 'रद्द करें';

  @override
  String get boostNow => 'अभी बूस्ट करें';

  @override
  String get settings => 'सेटिंग्स';

  @override
  String get darkMode => 'डार्क मोड';

  @override
  String get lightMode => 'लाइट मोड';

  @override
  String get language => 'भाषा';

  @override
  String get english => 'अंग्रेजी';

  @override
  String get hindi => 'हिंदी';

  @override
  String get termsPrivacy =>
      'जारी रखकर आप हमारी सेवा की शर्तें और गोपनीयता नीति से सहमत हैं।';

  @override
  String get dontHaveAccount => 'खाता नहीं है?';

  @override
  String get invalidPhone =>
      'अमान्य फ़ोन नंबर। कृपया जांचें और पुनः प्रयास करें।';

  @override
  String get tooManyAttempts => 'बहुत अधिक प्रयास। कृपया प्रतीक्षा करें।';

  @override
  String get incorrectOtp => 'गलत OTP। कृपया सही कोड दर्ज करें।';

  @override
  String get otpExpired => 'OTP समाप्त हो गया। कृपया नया अनुरोध करें।';

  @override
  String get sessionExpired => 'सत्र समाप्त हो गया। कृपया नया OTP मांगें।';

  @override
  String get comingSoon => 'जल्द आ रहा है!';

  @override
  String get emailLoginComingSoon => 'ईमेल लॉगिन जल्द आ रहा है!';

  @override
  String get logInWithPhone => 'फ़ोन नंबर से लॉग इन करें';

  @override
  String get logInWithEmail => 'ईमेल से लॉग इन करें';

  @override
  String get or => 'या';

  @override
  String get creatorStudio => 'क्रिएटर स्टूडियो';

  @override
  String get wallet => 'TriNetra Pay';

  @override
  String get notifications => 'सूचनाएं';

  @override
  String get search => 'खोजें';

  @override
  String get messenger => 'मैसेंजर';

  @override
  String get groups => 'समूह';

  @override
  String get pages => 'पेज';

  @override
  String get profileLock => 'प्रोफ़ाइल लॉक करें';

  @override
  String get verificationBadge => 'सत्यापित';

  @override
  String get creatorPro => 'क्रिएटर प्रो';

  @override
  String get earnMore => 'अधिक कमाएं';

  @override
  String get requestPayout => 'भुगतान मांगें';

  @override
  String get transactionHistory => 'लेन-देन इतिहास';
}
