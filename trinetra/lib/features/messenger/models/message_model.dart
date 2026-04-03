// 🔥 Firebase का import हटा दिया गया है 🔥

/// Message Model (AWS Ready)
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

  // 🔥 FIXED: DocumentSnapshot को हटाकर नॉर्मल Map कर दिया गया है 🔥
  factory MessageModel.fromMap(String docId, Map<String, dynamic> d) {
    return MessageModel(
      id: docId,
      conversationId: d['conversationId'] ?? '',
      senderId: d['senderId'] ?? '',
      senderName: d['senderName'] ?? '',
      content: d['content'] ?? '',
      type: MessageType.fromString(d['type'] ?? 'text'),
      mediaUrl: d['mediaUrl'],
      // 🔥 FIXED: Timestamp को हटाकर DateTime कर दिया गया है 🔥
      timestamp: d['timestamp'] != null 
          ? DateTime.tryParse(d['timestamp'].toString()) ?? DateTime.now() 
          : DateTime.now(),
      isRead: d['isRead'] ?? false,
      replyToId: d['replyToId'],
      replyToContent: d['replyToContent'],
    );
  }

  // 🔥 FIXED: toFirestore को बदलकर toMap कर दिया गया है 🔥
  Map<String, dynamic> toMap() => {
    'conversationId': conversationId,
    'senderId': senderId,
    'senderName': senderName,
    'content': content,
    'type': type.value,
    'mediaUrl': mediaUrl,
    // 🔥 FIXED: FieldValue को हटाकर स्टैंडर्ड ISO टाइम कर दिया गया है 🔥
    'timestamp': timestamp.toIso8601String(),
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

/// Conversation Model (AWS Ready)
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

  // 🔥 FIXED: DocumentSnapshot को हटाकर नॉर्मल Map कर दिया गया है 🔥
  factory ConversationModel.fromMap(String docId, Map<String, dynamic> d) {
    return ConversationModel(
      id: docId,
      participantIds: List<String>.from(d['participantIds'] ?? []),
      participantNames: Map<String, String>.from(d['participantNames'] ?? {}),
      participantAvatars: Map<String, String>.from(d['participantAvatars'] ?? {}),
      lastMessage: d['lastMessage'] ?? '',
      lastMessageSenderId: d['lastMessageSenderId'] ?? '',
      // 🔥 FIXED: Timestamp को हटाकर DateTime कर दिया गया है 🔥
      lastMessageTime: d['lastMessageTime'] != null 
          ? DateTime.tryParse(d['lastMessageTime'].toString()) ?? DateTime.now() 
          : DateTime.now(),
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
