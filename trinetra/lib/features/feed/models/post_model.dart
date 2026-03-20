import 'package:cloud_firestore/cloud_firestore.dart';

/// Firestore Post Model
/// Collection: posts/{postId}
class PostModel {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final bool isVerified;
  final String content;
  final List<String> mediaUrls;
  final String mediaType; // 'none' | 'image' | 'video' | 'pdf'
  final Map<String, int> reactions; // {like:5, love:3, haha:1, wow:0, sad:0, angry:0}
  final Map<String, String> userReactions; // {uid: 'love', uid2: 'like'}
  final int commentsCount;
  final int sharesCount;
  final DateTime createdAt;
  final bool isBooted;
  final String? location;

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
    this.isBooted = false,
    this.location,
  });

  factory PostModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return PostModel(
      id: doc.id,
      userId: d['userId'] ?? '',
      userName: d['userName'] ?? '',
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
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      isBooted: d['isBoosted'] ?? false,
      location: d['location'],
    );
  }

  Map<String, dynamic> toFirestore() => {
    'userId': userId,
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
    'createdAt': FieldValue.serverTimestamp(),
    'isBoosted': isBooted,
    'location': location,
  };

  int get totalReactions =>
      reactions.values.fold(0, (sum, count) => sum + count);

  PostModel copyWith({
    Map<String, int>? reactions,
    Map<String, String>? userReactions,
    int? commentsCount,
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
        isBooted: isBooted,
        location: location,
      );
}
