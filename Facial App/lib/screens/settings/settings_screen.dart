import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_avatar.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/gradient_background.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  Widget _settingsRow(BuildContext context, IconData icon, String label) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('COMING SOON', style: AppTheme.label(fontSize: 11)),
            backgroundColor: AppColors.bgGradientEnd,
          ),
        );
      },
      child: Row(
        children: [
          Icon(icon, color: AppColors.primaryAccent, size: 20),
          const SizedBox(width: 14),
          Expanded(
            child: Text(label, style: AppTheme.body(fontSize: 14)),
          ),
          const Icon(Icons.chevron_right, color: AppColors.mutedText),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final teacher = context.watch<AuthProvider>().teacher;

    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Settings', style: AppTheme.heading(fontSize: 22)),
                const SizedBox(height: 28),
                Center(
                  child: GlassAvatar(
                    name: teacher?.name ?? '?',
                    size: 88,
                    glowRing: true,
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    teacher?.name ?? '',
                    style: AppTheme.heading(fontSize: 20),
                  ),
                ),
                const SizedBox(height: 4),
                Center(
                  child: Text(
                    teacher?.email ?? '',
                    style: AppTheme.body(fontSize: 12, color: AppColors.secondaryText),
                  ),
                ),
                const SizedBox(height: 28),
                _settingsRow(context, Icons.person_outline, 'Edit Profile'),
                const SizedBox(height: 10),
                _settingsRow(context, Icons.notifications_outlined, 'Notifications'),
                const SizedBox(height: 10),
                _settingsRow(context, Icons.info_outline, 'About'),
                const Spacer(),
                ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: GestureDetector(
                      onTap: () async {
                        await context.read<AuthProvider>().logout();
                        if (context.mounted) {
                          Navigator.of(context)
                              .pushNamedAndRemoveUntil('/login', (_) => false);
                        }
                      },
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: AppColors.error.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(
                            color: AppColors.error.withValues(alpha: 0.4),
                          ),
                        ),
                        child: Text(
                          'SIGN OUT',
                          style: AppTheme.body(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.error,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Center(
                  child: Text(
                    'v1.0.0',
                    style: AppTheme.body(fontSize: 10, color: AppColors.mutedText),
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
