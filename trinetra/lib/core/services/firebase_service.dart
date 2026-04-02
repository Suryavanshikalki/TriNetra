// Firebase is completely removed for AWS. 
// This is a dummy class so that other files don't show import errors.

class FirebaseService {
  FirebaseService._();
  static final FirebaseService instance = FirebaseService._();

  Future<void> initialize() async {
    // Nothing to do here. AWS Amplify will handle backend.
  }
}
