import 'package:flutter/material.dart';

// ==============================================================
// 👁️🔥 TRINETRA MESSENGER MODELS (Blueprint Point 4 & 5)
// 100% REAL: No Firebase, AWS Map Ready, Universal Media Support
// ==============================================================

/// ─── Message Type (Point 4 & 5 Integration) ──────────────────
enum MessageType {
  text,
  image,
  video,
  audio,
  voice,    // 🔥 ASLI: For Mic/Voice Notes (Point 5)
  pdf,      // 🔥 ASLI: For Documents (Point 4)
  location,
  contact;  // 🔥 ASLI: For Contact Sharing (Point 5)

  static MessageType fromString(String s) {
    switch (s) {
      case 'image': return MessageType.image;
      case 'video': return MessageType.video;
      case 'audio': return MessageType.audio;
      case 'voice': return MessageType.voice;
      case 'pdf': return MessageType.pdf;
      case 'location': return MessageType.location;
      case 'contact': return MessageType.contact;
      default: return MessageType.text;
    }
  }

  String get value => name;
}

/// ─── Message Model (100% Functional) ─────────────────────────
class MessageModel {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderName;
  final String content;
  final MessageType type;
  final String? mediaUrl;
  final DateTime timestamp;
  final bool isRead;
  final String? replyToId;
  final String? replyToContent;

  const MessageModel({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    required this.content,
    this.type = MessageType.text,
    this.mediaUrl,
    required this.timestamp,
    this.isRead = false,
    this.replyToId,
    this.replyToContent,
  });

  // 🔥 ASLI AWS MAPPING: No Firebase dependencies
  factory MessageModel.fromMap(String docId, Map<String, dynamic> d) {
    return MessageModel(
      id: docId,
      conversationId: d['conversationId'] ?? '',
      senderId: d['senderId'] ?? '',
      senderName: d['senderName'] ?? '',
      content: d['content'] ?? '',
      type: MessageType.fromString(d['type'] ?? 'text'),
      mediaUrl: d['mediaUrl'],
      // 🔥 FIXED: Standard ISO & AWS DateTime Compatibility
      timestamp: d['timestamp'] != null 
          ? DateTime.tryParse(d['timestamp'].toString()) ?? DateTime.now() 
          : DateTime.now(),
      isRead: d['isRead'] ?? false,
      replyToId: d['replyToId'],
      replyToContent: d['replyToContent'],
    );
  }

  Map<String, dynamic> toMap() => {
    'conversationId': conversationId,
    'senderId': senderId,
    'senderName': senderName,
    'content': content,
    'type': type.value,
    'mediaUrl': mediaUrl,
    'timestamp': timestamp.toIso8601String(),
    'isRead': isRead,
    'replyToId': replyToId,
    'replyToContent': replyToContent,
  };
}

/// ─── Conversation Model (AWS Ready) ──────────────────────────
class ConversationModel {
  final String id;
  final List<String> participantIds;
  final Map<String, String> participantNames;
  final Map<String, String> participantAvatars;
  final String lastMessage;
  final String lastMessageSenderId;
  final DateTime lastMessageTime;
  final Map<String, int> unreadCounts;
  final bool isGroupChat;
  final String? groupName;
  final String? groupAvatar;

  const ConversationModel({
    required this.id,
    required this.participantIds,
    required this.participantNames,
    required this.participantAvatars,
    required this.lastMessage,
    required this.lastMessageSenderId,
    required this.lastMessageTime,
    this.unreadCounts = const {},
    this.isGroupChat = false,
    this.groupName,
    this.groupAvatar,
  });

  factory ConversationModel.fromMap(String docId, Map<String, dynamic> d) {
    return ConversationModel(
      id: docId,
      participantIds: List<String>.from(d['participantIds'] ?? []),
      participantNames: Map<String, String>.from(d['participantNames'] ?? {}),
      participantAvatars: Map<String, String>.from(d['participantAvatars'] ?? {}),
      lastMessage: d['lastMessage'] ?? '',
      lastMessageSenderId: d['lastMessageSenderId'] ?? '',
      lastMessageTime: d['lastMessageTime'] != null 
          ? DateTime.tryParse(d['lastMessageTime'].toString()) ?? DateTime.now() 
          : DateTime.now(),
      unreadCounts: Map<String, int>.from(d['unreadCounts'] ?? {}),
      isGroupChat: d['isGroupChat'] ?? false,
      groupName: d['groupName'],
      groupAvatar: d['groupAvatar'],
    );
  }

  // 🔥 UTILS (Blueprint Point 5 logic)
  String getOtherName(String myUid) {
    final otherId = participantIds.firstWhere((id) => id != myUid, orElse: () => '');
    return participantNames[otherId] ?? 'TriNetra User';
  }

  String getOtherAvatar(String myUid) {
    final otherId = participantIds.firstWhere((id) => id != myUid, orElse: () => '');
    return participantAvatars[otherId] ?? '';
  }

  int getUnreadCount(String myUid) => unreadCounts[myUid] ?? 0;
}
