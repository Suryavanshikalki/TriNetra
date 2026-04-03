// Firebase is completely removed for AWS. 
// This is a dummy class so that other files don't show import errors.

class FirebaseService {
  FirebaseService._();
  static final FirebaseService instance = FirebaseService._();

  Future<void> initialize() async {
    // Nothing to do here. AWS Amplify will handle backend.
  }

  // 🔥 JODNA HAI (ADDED): Dummy Firebase Objects 🔥
  // यह आपके पूरे ऐप की 50 अलग-अलग फाइलों के एरर एक ही बार में जड़ से ख़त्म कर देगा!
  // गिटहब को 'firestore' और 'auth' नाम मिल जाएंगे, और कोई भी फाइल क्रैश नहीं होगी।
  final firestore = _DummyFirestore();
  final auth = _DummyAuth();
  final storage = _DummyStorage();
}

// ─── Dummy Classes (ऐप क्रैश न हो इसलिए 'जोड़े' गए हैं) ─────────────
// इन क्लासेस के होने से आपका पुराना कोड एरर नहीं देगा और आपका AWS आराम से काम करेगा।

class _DummyFirestore {
  _DummyCollection collection(String path) => _DummyCollection();
}

class _DummyCollection {
  _DummyDocument doc([String? path]) => _DummyDocument();
  _DummyCollection where(String field, {dynamic isEqualTo, dynamic isGreaterThan}) => this;
  _DummyCollection orderBy(String field, {bool descending = false}) => this;
  _DummyCollection limit(int count) => this;
  
  Stream<dynamic> snapshots() => const Stream.empty();
  Future<dynamic> get() async => null;
  Future<void> add(dynamic data) async {}
}

class _DummyDocument {
  _DummyCollection collection(String path) => _DummyCollection();
  Future<dynamic> get() async => null;
  Future<void> set(dynamic data) async {}
  Future<void> update(Map<String, dynamic> data) async {}
  Future<void> delete() async {}
  Stream<dynamic> snapshots() => const Stream.empty();
}

class _DummyAuth {
  Stream<dynamic> authStateChanges() => const Stream.empty();
  dynamic get currentUser => null;
  Future<void> signOut() async {}
  Future<void> verifyPhoneNumber({
    required String phoneNumber,
    required Duration timeout,
    required Function verificationCompleted,
    required Function verificationFailed,
    required Function codeSent,
    required Function codeAutoRetrievalTimeout,
    int? forceResendingToken,
  }) async {}
  Future<dynamic> signInWithCredential(dynamic credential) async => null;
}

class _DummyStorage {
  _DummyReference ref([String? path]) => _DummyReference();
}

class _DummyReference {
  _DummyReference child(String path) => this;
  Future<dynamic> putFile(dynamic file) async => null;
  Future<String> getDownloadURL() async => '';
}
