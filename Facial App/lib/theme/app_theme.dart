import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Background gradient
  static const bgGradientStart = Color(0xFF0A0015);
  static const bgGradientEnd = Color(0xFF000A1A);

  // Floating orbs
  static const orbPurple = Color(0xFF6B21A8);
  static const orbBlue = Color(0xFF1D4ED8);

  // Glass surface
  static final glassSurface = Colors.white.withValues(alpha: 0.06);
  static final glassSurfaceStrong = Colors.white.withValues(alpha: 0.08);
  static final glassBorder = Colors.white.withValues(alpha: 0.15);

  // Accents
  static const primaryAccent = Color(0xFF7C3AED);
  static const primaryAccentDark = Color(0xFF5B21B6);
  static const secondaryAccent = Color(0xFF06B6D4);
  static const success = Color(0xFF10B981);
  static const warning = Color(0xFFF59E0B);
  static const error = Color(0xFFEF4444);

  // Text
  static const primaryText = Color(0xFFFFFFFF);
  static const secondaryText = Color(0xFF94A3B8);
  static const mutedText = Color(0xFF475569);
}

class AppTheme {
  static TextStyle heading({
    double fontSize = 24,
    Color color = AppColors.primaryText,
    FontWeight fontWeight = FontWeight.w700,
  }) {
    return GoogleFonts.outfit(
      fontSize: fontSize,
      color: color,
      fontWeight: fontWeight,
    );
  }

  static TextStyle label({
    double fontSize = 12,
    Color color = AppColors.secondaryText,
    double letterSpacing = 1.5,
  }) {
    return GoogleFonts.inter(
      fontSize: fontSize,
      color: color,
      fontWeight: FontWeight.w600,
      letterSpacing: letterSpacing,
    );
  }

  static TextStyle body({
    double fontSize = 15,
    Color color = AppColors.primaryText,
    FontWeight fontWeight = FontWeight.w400,
  }) {
    return GoogleFonts.inter(
      fontSize: fontSize,
      color: color,
      fontWeight: fontWeight,
    );
  }

  static const backgroundGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [AppColors.bgGradientStart, AppColors.bgGradientEnd],
  );

  static const primaryButtonGradient = LinearGradient(
    colors: [AppColors.primaryAccent, AppColors.primaryAccentDark],
  );

  static const chipGradient = LinearGradient(
    colors: [AppColors.primaryAccent, AppColors.secondaryAccent],
  );

  static ThemeData get theme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.bgGradientStart,
      colorScheme: const ColorScheme.dark(
        surface: AppColors.bgGradientStart,
        primary: AppColors.primaryAccent,
        secondary: AppColors.secondaryAccent,
        error: AppColors.error,
      ),
      fontFamily: GoogleFonts.inter().fontFamily,
      textSelectionTheme: const TextSelectionThemeData(
        cursorColor: AppColors.primaryAccent,
      ),
    );
  }
}
