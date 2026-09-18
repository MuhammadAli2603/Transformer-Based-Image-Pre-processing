import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;

  const GradientBackground({super.key, required this.child});

  Widget _orb({
    required double size,
    required Color color,
    required Alignment alignment,
  }) {
    return Align(
      alignment: alignment,
      child: ImageFiltered(
        imageFilter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [color.withValues(alpha: 0.15), Colors.transparent],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(gradient: AppTheme.backgroundGradient),
      child: Stack(
        children: [
          Positioned.fill(
            child: Stack(
              children: [
                _orb(
                  size: 320,
                  color: AppColors.orbPurple,
                  alignment: const Alignment(-1.2, -1.0),
                ),
                _orb(
                  size: 360,
                  color: AppColors.orbBlue,
                  alignment: const Alignment(1.3, -0.2),
                ),
                _orb(
                  size: 300,
                  color: AppColors.orbPurple,
                  alignment: const Alignment(0.8, 1.2),
                ),
              ],
            ),
          ),
          child,
        ],
      ),
    );
  }
}
