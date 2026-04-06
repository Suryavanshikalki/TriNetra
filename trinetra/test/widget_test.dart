import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trinetra/app.dart';

// ==============================================================
// 👁️🔥 TRINETRA BOOTSTRAP TEST (Blueprint Point 1 & 12)
// 100% REAL: Testing App Life-Cycle & Provider Scope
// ==============================================================

void main() {
  testWidgets('TriNetra App Bootstrap and Root Loading Test', (WidgetTester tester) async {
    // 🔥 ASLI ACTION: Building the app inside ProviderScope (Riverpod ready)
    await tester.pumpWidget(
      const ProviderScope(
        child: TriNetraApp(),
      ),
    );

    // 🔥 ASLI ACTION: सिर्फ ऐप टाइप नहीं, बल्कि 'MaterialApp' का अस्तित्व चेक करना।
    // यह पक्का करता है कि Flutter Engine ने सही से रेंडरिंग शुरू कर दी है।
    expect(find.byType(MaterialApp), findsOneWidget);

    // 🔥 DEEP SEARCH TIP: 
    // भविष्य में जब तुम SplashScreen बनाओगे, तो यहाँ expect(find.byType(SplashScreen), findsOneWidget); 
    // डालना असली 'TriNetra' स्टैंडर्ड होगा।
    
    debugPrint('TriNetra: Bootstrap Test Passed Successfully! 🚀');
  });
}
