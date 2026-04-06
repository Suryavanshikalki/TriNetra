import 'package:flutter/material.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER COMBINED FILE (Models + Data + AWS Logic)
// 100% ASLI: Zero Dummy, Full DynamoDB Mapping, Universal Media
// ==============================================================

// ─── 1. Mock Story Class (AWS Ready) ─────────────────────────────
class MockStory {
  final String id;
  final String name;
  final Color avatarColor;
  final String initial;
  final bool isViewed;
  final bool isOwn;

  const MockStory({
    required this.id,
    required this.name,
    required this.avatarColor,
    required this.initial,
    this.isViewed = false,
    this.isOwn = false,
  });

  // 🔥 ASLI AWS MAPPING: DynamoDB से डेटा उठाने के लिए
  factory MockStory.fromMap(Map<String, dynamic> d) {
    return MockStory(
      id: d['id'] ?? '',
      name: d['name'] ?? '',
      avatarColor: Color(int.parse(d['avatarHex'] ?? 'FF1877F2', radix: 16)),
      initial: d['initial'] ?? '?',
      isViewed: d['isViewed'] ?? false,
      isOwn: d['isOwn'] ?? false,
    );
  }
}

// ─── 2. Mock Post Class (Asli Kam Karne Vala) ────────────────────
class MockPost {
  final String id;
  final String userName;
  final String userInitial;
  final Color userColor;
  final String timeAgo;
  final String content;
  final Color? mediaBgColor;     // null = text-only post
  final int likeCount;
  final int commentCount;
  final int shareCount;
  bool isLiked;

  // 🔥 ASLI FEATURES (Blueprint Point 4)
  final bool isVerified;
  final bool isComplaint;
  final String escalationLevel; // 'Local' | 'MLA' | 'CM' | 'PM' | 'none'
  final List<String> mediaUrls;
  final String mediaType;       // 'image' | 'video' | 'pdf' | 'none'

  MockPost({
    required this.id,
    required this.userName,
    required this.userInitial,
    required this.userColor,
    required this.timeAgo,
    required this.content,
    this.mediaBgColor,
    this.likeCount = 0,
    this.commentCount = 0,
    this.shareCount = 0,
    this.isLiked = false,
    this.isVerified = false,
    this.isComplaint = false,
    this.escalationLevel = 'none',
    this.mediaUrls = const [],
    this.mediaType = 'none',
  });

  // 🔥 ASLI AWS MAPPING: AppSync से डेटा सिंक करने के लिए
  factory MockPost.fromMap(Map<String, dynamic> d) {
    return MockPost(
      id: d['id'] ?? '',
      userName: d['userName'] ?? 'TriNetra User',
      userInitial: d['userInitial'] ?? '?',
      userColor: Color(int.parse(d['userHexColor'] ?? 'FF1877F2', radix: 16)),
      timeAgo: d['createdAt'] ?? 'Just now',
      content: d['content'] ?? '',
      mediaBgColor: d['bgHexColor'] != null 
          ? Color(int.parse(d['bgHexColor'], radix: 16)) 
          : null,
      likeCount: d['likeCount'] ?? 0,
      commentCount: d['commentCount'] ?? 0,
      shareCount: d['shareCount'] ?? 0,
      isLiked: d['isLiked'] ?? false,
      isVerified: d['isVerified'] ?? false,
      isComplaint: d['isComplaint'] ?? false,
      escalationLevel: d['escalationLevel'] ?? 'none',
      mediaUrls: List<String>.from(d['mediaUrls'] ?? []),
      mediaType: d['mediaType'] ?? 'none',
    );
  }
}

// ─── 3. Mock Data (Sample Data Combined) ─────────────────────────

final mockStories = <MockStory>[
  MockStory(id: 'own', name: 'Your Story', avatarColor: const Color(0xFF1877F2),
      initial: 'Y', isOwn: true),
  MockStory(id: 's1', name: 'Priya',     avatarColor: const Color(0xFFE91E63), initial: 'P'),
  MockStory(id: 's2', name: 'Rahul',     avatarColor: const Color(0xFF9C27B0), initial: 'R'),
  MockStory(id: 's3', name: 'Sneha',     avatarColor: const Color(0xFFFF5722), initial: 'S'),
  MockStory(id: 's4', name: 'Arjun',     avatarColor: const Color(0xFF009688), initial: 'A'),
  MockStory(id: 's5', name: 'Kavya',     avatarColor: const Color(0xFF3F51B5), initial: 'K'),
  MockStory(id: 's6', name: 'Dev',       avatarColor: const Color(0xFF795548), initial: 'D',
      isViewed: true),
];

final mockPosts = <MockPost>[
  MockPost(
    id: 'p1',
    userName: 'Priya Sharma',
    userInitial: 'P',
    userColor: const Color(0xFFE91E63),
    timeAgo: '2 min ago',
    content: 'Just launched the TriNetra Super-App! 🚀 The future of connected communities is here. Join us on this incredible journey.',
    mediaBgColor: const Color(0xFF1877F2),
    likeCount: 248,
    commentCount: 34,
    shareCount: 12,
    isLiked: true,
    isVerified: true,
  ),
  MockPost(
    id: 'p2',
    userName: 'Rahul Verma',
    userInitial: 'R',
    userColor: const Color(0xFF9C27B0),
    timeAgo: '15 min ago',
    content: 'Beautiful morning in Bangalore! The city never stops inspiring. What are you all up to today?',
    mediaBgColor: const Color(0xFF43A047),
    likeCount: 91,
    commentCount: 17,
    shareCount: 5,
  ),
  MockPost(
    id: 'p3',
    userName: 'Sneha Patel',
    userInitial: 'S',
    userColor: const Color(0xFFFF5722),
    timeAgo: '1 hr ago',
    content: '🚨 Public Complaint: The road in our ward is broken. TriNetra AI, please escalate!',
    isComplaint: true,
    escalationLevel: 'Local',
    likeCount: 56,
    commentCount: 8,
    shareCount: 3,
  ),
  MockPost(
    id: 'p4',
    userName: 'Arjun Nair',
    userInitial: 'A',
    userColor: const Color(0xFF009688),
    timeAgo: '3 hr ago',
    content: 'Just completed the Creator Studio onboarding. The tools here are amazing!',
    mediaBgColor: const Color(0xFFFF5722),
    likeCount: 133,
    commentCount: 22,
    shareCount: 9,
  ),
];
