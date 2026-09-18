import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum GlassButtonVariant { primary, secondary }

class GlassButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final GlassButtonVariant variant;
  final bool isLoading;

  const GlassButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = GlassButtonVariant.primary,
    this.isLoading = false,
  });

  @override
  State<GlassButton> createState() => _GlassButtonState();
}

class _GlassButtonState extends State<GlassButton> {
  double _scale = 1;

  bool get _enabled => widget.onPressed != null && !widget.isLoading;

  void _setScale(double value) {
    if (!_enabled) return;
    setState(() => _scale = value);
  }

  @override
  Widget build(BuildContext context) {
    final isPrimary = widget.variant == GlassButtonVariant.primary;

    final content = Center(
      child: widget.isLoading
          ? const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppColors.primaryText,
              ),
            )
          : Text(
              widget.label.toUpperCase(),
              style: AppTheme.body(fontSize: 14, fontWeight: FontWeight.w600),
            ),
    );

    Widget button = Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 32),
      decoration: BoxDecoration(
        gradient: isPrimary ? AppTheme.primaryButtonGradient : null,
        color: isPrimary ? null : AppColors.glassSurface,
        borderRadius: BorderRadius.circular(30),
        border: isPrimary ? null : Border.all(color: AppColors.glassBorder),
        boxShadow: isPrimary
            ? [
                BoxShadow(
                  color: AppColors.primaryAccent.withValues(alpha: 0.4),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ]
            : null,
      ),
      child: content,
    );

    if (!isPrimary) {
      button = ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: button,
        ),
      );
    }

    return Opacity(
      opacity: _enabled ? 1 : 0.4,
      child: GestureDetector(
        onTap: _enabled ? widget.onPressed : null,
        onTapDown: (_) => _setScale(0.96),
        onTapUp: (_) => _setScale(1),
        onTapCancel: () => _setScale(1),
        child: AnimatedScale(
          scale: _scale,
          duration: const Duration(milliseconds: 150),
          child: button,
        ),
      ),
    );
  }
}
