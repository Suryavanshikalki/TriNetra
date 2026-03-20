/// Stub screen for Messenger
import 'package:flutter/material.dart';

class MessengerListScreen extends StatelessWidget {
  const MessengerListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.send_outlined, size: 56, color: Colors.grey),
          SizedBox(height: 12),
          Text('Messenger', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
          SizedBox(height: 8),
          Text('Real-time chat — Coming Soon',
              style: TextStyle(color: Colors.grey, fontSize: 14)),
        ],
      ),
    );
  }
}
