import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GlassAvatar extends StatelessWidget {
  final String name;
  final double size;
  final bool glowRing;

  const GlassAvatar({
    super.key,
    required this.name,
    this.size = 48,
    this.glowRing = false,
  });

  String get _initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) return '?';
    final first = parts.first[0];
    final last = parts.length > 1 ? parts.last[0] : '';
    return (first + last).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: AppTheme.primaryButtonGradient,
        boxShadow: glowRing
            ? [
                BoxShadow(
                  color: Colors.white.withValues(alpha: 0.3),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ]
            : null,
      ),
      alignment: Alignment.center,
      child: Text(
        _initials,
        style: AppTheme.heading(fontSize: size * 0.36, fontWeight: FontWeight.w600),
      ),
    );
  }
}
