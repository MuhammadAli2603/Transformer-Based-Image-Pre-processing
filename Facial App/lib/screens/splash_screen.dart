import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_background.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 2),
  )..forward();

  @override
  void initState() {
    super.initState();
    _route();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _route() async {
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;

    final prefs = await SharedPreferences.getInstance();
    final setupComplete = prefs.getBool('setup_complete') ?? false;
    if (!setupComplete) {
      if (!mounted) return;
      Navigator.of(context).pushReplacementNamed('/setup');
      return;
    }

    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      if (!mounted) return;
      await context.read<AuthProvider>().loadTeacher();
    }
    if (!mounted) return;
    Navigator.of(context)
        .pushReplacementNamed(user != null ? '/dashboard' : '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      PulsingGlow(
                        child: Container(
                          width: 96,
                          height: 96,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: AppTheme.primaryButtonGradient,
                            border: Border.all(
                              color: AppColors.primaryAccent.withValues(alpha: 0.5),
                              width: 2,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'A.I',
                            style: AppTheme.heading(fontSize: 28),
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),
                      FadeTransition(
                        opacity: _controller,
                        child: Text(
                          'ATTENDANCE AI',
                          style: AppTheme.heading(fontSize: 26),
                        ),
                      ),
                      const SizedBox(height: 8),
                      FadeTransition(
                        opacity: _controller,
                        child: Text(
                          'POWERED BY ARIA',
                          style: AppTheme.label(
                            fontSize: 11,
                            color: AppColors.secondaryAccent,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 40),
                child: SizedBox(
                  width: 120,
                  height: 2,
                  child: AnimatedBuilder(
                    animation: _controller,
                    builder: (context, child) {
                      return Align(
                        alignment: Alignment(-1 + _controller.value * 2, 0),
                        child: Container(
                          width: 40,
                          height: 2,
                          decoration: BoxDecoration(
                            color: AppColors.primaryAccent,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
