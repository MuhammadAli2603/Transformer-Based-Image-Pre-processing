import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/gradient_background.dart';

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

const _checklist = [
  'google-services.json placed in android/app/',
  'firebase_options.dart placed in lib/',
  'Email/Password Auth enabled in Firebase Console',
  'Firestore database created (test mode)',
  'Firestore rules published',
];

class SetupGuideScreen extends StatelessWidget {
  const SetupGuideScreen({super.key});

  Future<void> _finish(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('setup_complete', true);
    if (context.mounted) {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded,
                        color: AppColors.warning, size: 22),
                    const SizedBox(width: 8),
                    Text('SETUP REQUIRED', style: AppTheme.heading(fontSize: 22)),
                  ],
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: ListView.separated(
                    itemCount: _checklist.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final isRulesStep = index == _checklist.length - 1;
                      return FadeSlideIn(
                        index: index,
                        child: GlassCard(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                          child: Row(
                            children: [
                              Icon(
                                isRulesStep
                                    ? Icons.rule_rounded
                                    : Icons.check_circle_outline,
                                color: AppColors.primaryAccent,
                                size: 18,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  '${index + 1}. ${_checklist[index]}',
                                  style: AppTheme.body(
                                    fontSize: 12,
                                    color: AppColors.secondaryText,
                                  ),
                                ),
                              ),
                              if (isRulesStep)
                                TextButton(
                                  onPressed: () {
                                    Clipboard.setData(
                                      const ClipboardData(text: _firestoreRules),
                                    );
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'RULES COPIED',
                                          style: AppTheme.body(fontSize: 12),
                                        ),
                                        backgroundColor: AppColors.bgGradientEnd,
                                      ),
                                    );
                                  },
                                  child: Text(
                                    'COPY',
                                    style: AppTheme.label(
                                      fontSize: 11,
                                      color: AppColors.secondaryAccent,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: GlassButton(
                    label: 'All Done',
                    onPressed: () => _finish(context),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
