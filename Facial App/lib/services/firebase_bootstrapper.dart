import 'package:shared_preferences/shared_preferences.dart';

const _firestoreRules = '''
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /classes/{classId} {
      allow read, write: if request.auth != null;
    }
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    match /attendance_sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    match /attendance_sessions/{sessionId}/records/{recordId} {
      allow read, write: if request.auth != null;
    }
  }
}
''';

class FirebaseBootstrapper {
  static Future<void> run() async {
    final prefs = await SharedPreferences.getInstance();
    final initialized = prefs.getBool('firebase_initialized') ?? false;
    if (initialized) return;

    // ignore: avoid_print
    print('=== ATTENDANCE.AI FIRESTORE RULES ===\n$_firestoreRules');
    // ignore: avoid_print
    print('=== SETUP CHECKLIST ===\n'
        '1. google-services.json in android/app/\n'
        '2. firebase_options.dart in lib/\n'
        '3. Email/Password Auth enabled in Firebase Console\n'
        '4. Firestore database created (test mode)\n'
        '5. Firestore rules published (see above)');

    await prefs.setBool('firebase_initialized', true);
  }
}
