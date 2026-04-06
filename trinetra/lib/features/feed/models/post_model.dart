// 🔥 Firebase 100% Removed. AWS AppSync GraphQL Ready 🔥

/// Post Model (AWS Ready - No Firebase)
/// Database: AWS DynamoDB via AppSync
class PostModel {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final bool isVerified;
  final String content;
  final List<String> mediaUrls;
  
  // 🔥 ASLI UNIVERSAL MEDIA SUPPORT (Point 4)
  final String mediaType; // 'none' | 'image' | 'video' | 'audio' | 'voice' | 'pdf'
  
  final Map<String, int> reactions; // {like:5, love:3, haha:1, wow:0, sad:0, angry:0}
  final Map<String, String> userReactions; // {uid: 'love', uid2: 'like'}
  final int commentsCount;
  final int sharesCount;
  final DateTime createdAt;
  final bool isBoosted; // 🔥 FIXED: Typo 'isBooted' to 'isBoosted'
  final String? location;

  // 🔥 ASLI AUTO-ESCALATION ENGINE FIELDS (Point 4 - ₹30k/month Tier)
  final bool isComplaint;
  final String escalationLevel; // 'none' | 'Local_Authority' | 'MLA' | 'CM' | 'PM' | 'Supreme_Court' | 'International'

  const PostModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userAvatar,
    this.isVerified = false,
    required this.content,
    this.mediaUrls = const [],
    this.mediaType = 'none',
    this.reactions = const {
      'like': 0, 'love': 0, 'haha': 0, 'wow': 0, 'sad': 0, 'angry': 0,
    },
    this.userReactions = const {},
    this.commentsCount = 0,
    this.sharesCount = 0,
    required this.createdAt,
    this.isBoosted = false,
    this.location,
    this.isComplaint = false,
    this.escalationLevel = 'none',
  });

  // 🔥 FIXED: Firebase style docId removed. AWS GraphQL returns 'id' inside the Map 🔥
  factory PostModel.fromMap(Map<String, dynamic> d) {
    return PostModel(
      id: d['id'] ?? '',
      userId: d['authorId'] ?? d['userId'] ?? '', // Match GraphQL query schema
      userName: d['userName'] ?? 'TriNetra User',
      userAvatar: d['userAvatar'] ?? '',
      isVerified: d['isVerified'] ?? false,
      content: d['content'] ?? '',
      mediaUrls: List<String>.from(d['mediaUrls'] ?? []),
      mediaType: d['mediaType'] ?? 'none',
      reactions: Map<String, int>.from(d['reactions'] ?? {
        'like': 0, 'love': 0, 'haha': 0, 'wow': 0, 'sad': 0, 'angry': 0,
      }),
      userReactions: Map<String, String>.from(d['userReactions'] ?? {}),
      commentsCount: d['commentsCount'] ?? 0,
      sharesCount: d['sharesCount'] ?? 0,
      createdAt: d['createdAt'] != null 
          ? DateTime.tryParse(d['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
      isBoosted: d['isBoosted'] ?? false,
      location: d['location'],
      isComplaint: d['isComplaint'] ?? false,
      escalationLevel: d['escalationLevel'] ?? 'none',
    );
  }

  // 🔥 FIXED: AWS API Mutation format 🔥
  Map<String, dynamic> toMap() => {
    'id': id,
    'authorId': userId,
    'userName': userName,
    'userAvatar': userAvatar,
    'isVerified': isVerified,
    'content': content,
    'mediaUrls': mediaUrls,
    'mediaType': mediaType,
    'reactions': reactions,
    'userReactions': userReactions,
    'commentsCount': commentsCount,
    'sharesCount': sharesCount,
    'createdAt': createdAt.toUtc().toIso8601String(),
    'isBoosted': isBoosted,
    'location': location,
    'isComplaint': isComplaint,
    'escalationLevel': escalationLevel,
  };

  int get totalReactions =>
      reactions.values.fold(0, (acc, val) => acc + val);

  PostModel copyWith({
    Map<String, int>? reactions,
    Map<String, String>? userReactions,
    int? commentsCount,
    bool? isBoosted,
    String? escalationLevel,
  }) =>
      PostModel(
        id: id,
        userId: userId,
        userName: userName,
        userAvatar: userAvatar,
        isVerified: isVerified,
        content: content,
        mediaUrls: mediaUrls,
        mediaType: mediaType,
        reactions: reactions ?? this.reactions,
        userReactions: userReactions ?? this.userReactions,
        commentsCount: commentsCount ?? this.commentsCount,
        sharesCount: sharesCount,
        createdAt: createdAt,
        isBoosted: isBoosted ?? this.isBoosted,
        location: location,
        isComplaint: isComplaint,
        escalationLevel: escalationLevel ?? this.escalationLevel,
      );
}
