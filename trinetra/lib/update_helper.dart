import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class TriNetraUpdateManager extends StatefulWidget {
  final Widget child; // आपका असली ऐप इसके अंदर चलेगा

  const TriNetraUpdateManager({Key? key, required this.child}) : super(key: key);

  @override
  _TriNetraUpdateManagerState createState() => _TriNetraUpdateManagerState();
}

class _TriNetraUpdateManagerState extends State<TriNetraUpdateManager> {
  // यह आपके सर्वर या GitHub पर रखे नए वर्ज़न का नंबर होगा
  final String latestVersionFromServer = "1.0.1"; 
  
  // आपकी वेबसाइट का लिंक जहाँ से नया ऐप डाउनलोड होगा
  final String universalDownloadHub = "https://trinetra-8b846.web.app"; 

  @override
  void initState() {
    super.initState();
    _checkForUpdates();
  }

  Future<void> _checkForUpdates() async {
    // अगर यूज़र वेब (वेबसाइट) पर है, तो उसे अपडेट चेक करने की ज़रूरत नहीं है
    if (kIsWeb) return;

    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    String currentVersion = packageInfo.version;

    // अगर मोबाइल ऐप का वर्ज़न पुराना है, तो पॉपअप दिखाओ
    if (currentVersion != latestVersionFromServer) {
      _showUpdateDialog();
    }
  }

  void _showUpdateDialog() {
    showDialog(
      context: context,
      barrierDismissible: false, // यूज़र इसे बिना अपडेट किए हटा नहीं सकता
      builder: (context) {
        return AlertDialog(
          backgroundColor: Colors.black87,
          title: Text("🚀 नया अपडेट उपलब्ध है!", style: TextStyle(color: Colors.white)),
          content: Text(
            "TriNetra का नया और तेज़ वर्ज़न आ गया है। कृपया शानदार अनुभव के लिए अभी अपडेट करें।",
            style: TextStyle(color: Colors.white70),
          ),
          actions: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
              onPressed: () async {
                final Uri url = Uri.parse(universalDownloadHub);
                if (await canLaunchUrl(url)) {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                }
              },
              child: Text("अभी Update करें", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 1. आपका पूरा असली ऐप
          widget.child,

          // 2. वेब के लिए एक्स्ट्रा 'Download' बटन्स (सिर्फ वेब पर दिखेंगे)
          if (kIsWeb)
            Positioned(
              bottom: 20,
              right: 20,
              child: FloatingActionButton.extended(
                onPressed: () async {
                  final Uri url = Uri.parse(universalDownloadHub);
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                },
                backgroundColor: Colors.redAccent,
                icon: Icon(Icons.download, color: Colors.white),
                label: Text("Download Apps", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
        ],
      ),
    );
  }
}
