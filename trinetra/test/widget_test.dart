import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trinetra/app.dart';

void main() {
  testWidgets('TriNetra app smoke test', (WidgetTester tester) async {
    // Build the app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: TriNetraApp(),
      ),
    );

    // Verify the app loads (Splash screen should appear)
    expect(find.byType(TriNetraApp), findsOneWidget);
  });
}
