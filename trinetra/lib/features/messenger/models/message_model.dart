import 'package:cloud_firestore/cloud_firestore.dart';

/// Firestore Message Model
/// Collection: conversations/{convId}/messages/{msgId}
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

  factory MessageModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return MessageModel(
      id: doc.id,
      conversationId: d['conversationId'] ?? '',
      senderId: d['senderId'] ?? '',
      senderName: d['senderName'] ?? '',
      content: d['content'] ?? '',
      type: MessageType.fromString(d['type'] ?? 'text'),
      mediaUrl: d['mediaUrl'],
      timestamp: (d['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
      isRead: d['isRead'] ?? false,
      replyToId: d['replyToId'],
      replyToContent: d['replyToContent'],
    );
  }

  Map<String, dynamic> toFirestore() => {
    'conversationId': conversationId,
    'senderId': senderId,
    'senderName': senderName,
    'content': content,
    'type': type.value,
    'mediaUrl': mediaUrl,
    'timestamp': FieldValue.serverTimestamp(),
    'isRead': isRead,
    'replyToId': replyToId,
    'replyToContent': replyToContent,
  };
}

enum MessageType {
  text,
  image,
  video,
  audio,
  pdf,
  location;

  static MessageType fromString(String s) {
    switch (s) {
      case 'image': return MessageType.image;
      case 'video': return MessageType.video;
      case 'audio': return MessageType.audio;
      case 'pdf': return MessageType.pdf;
      case 'location': return MessageType.location;
      default: return MessageType.text;
    }
  }

  String get value => name;
}

/// Conversation Model
/// Collection: conversations/{convId}
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

  factory ConversationModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return ConversationModel(
      id: doc.id,
      participantIds: List<String>.from(d['participantIds'] ?? []),
      participantNames: Map<String, String>.from(d['participantNames'] ?? {}),
      participantAvatars: Map<String, String>.from(d['participantAvatars'] ?? {}),
      lastMessage: d['lastMessage'] ?? '',
      lastMessageSenderId: d['lastMessageSenderId'] ?? '',
      lastMessageTime: (d['lastMessageTime'] as Timestamp?)?.toDate() ?? DateTime.now(),
      unreadCounts: Map<String, int>.from(d['unreadCounts'] ?? {}),
      isGroupChat: d['isGroupChat'] ?? false,
      groupName: d['groupName'],
      groupAvatar: d['groupAvatar'],
    );
  }

  /// Get the other participant's name (for 1-on-1 chats)
  String getOtherName(String myUid) {
    final otherId = participantIds.firstWhere((id) => id != myUid, orElse: () => '');
    return participantNames[otherId] ?? 'Unknown';
  }

  String getOtherAvatar(String myUid) {
    final otherId = participantIds.firstWhere((id) => id != myUid, orElse: () => '');
    return participantAvatars[otherId] ?? '';
  }

  int getUnreadCount(String myUid) => unreadCounts[myUid] ?? 0;
}
