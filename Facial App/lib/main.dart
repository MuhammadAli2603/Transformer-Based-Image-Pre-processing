import 'dart:io';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';
import 'models/class_model.dart';
import 'providers/attendance_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/class_provider.dart';
import 'providers/student_provider.dart';
import 'screens/attendance/attendance_result_screen.dart';
import 'screens/attendance/mark_attendance_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/classes/class_detail_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/reports/reports_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/setup/setup_guide_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/students/add_student_screen.dart';
import 'services/firebase_bootstrapper.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await FirebaseBootstrapper.run();
  runApp(const AttendanceAiApp());
}

PageRouteBuilder _fadeSlideRoute(Widget page) {
  return PageRouteBuilder(
    pageBuilder: (_, _, _) => page,
    transitionDuration: const Duration(milliseconds: 300),
    transitionsBuilder: (_, animation, _, child) {
      final curved = CurvedAnimation(parent: animation, curve: Curves.easeOut);
      return FadeTransition(
        opacity: curved,
        child: Transform.translate(
          offset: Offset(0, (1 - curved.value) * 24),
          child: child,
        ),
      );
    },
  );
}

class AttendanceAiApp extends StatelessWidget {
  const AttendanceAiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ClassProvider()),
        ChangeNotifierProvider(create: (_) => StudentProvider()),
        ChangeNotifierProvider(create: (_) => AttendanceProvider()),
      ],
      child: MaterialApp(
        title: 'ATTENDANCE.AI',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.theme,
        initialRoute: '/splash',
        onGenerateRoute: (settings) {
          switch (settings.name) {
            case '/setup':
              return _fadeSlideRoute(const SetupGuideScreen());
            case '/splash':
              return _fadeSlideRoute(const SplashScreen());
            case '/login':
              return _fadeSlideRoute(const LoginScreen());
            case '/register':
              return _fadeSlideRoute(const RegisterScreen());
            case '/dashboard':
              return _fadeSlideRoute(const DashboardScreen());
            case '/class-detail':
              final classModel = settings.arguments as ClassModel;
              return _fadeSlideRoute(ClassDetailScreen(classModel: classModel));
            case '/add-student':
              final classModel = settings.arguments as ClassModel;
              return _fadeSlideRoute(AddStudentScreen(classModel: classModel));
            case '/attendance':
              final classModel = settings.arguments as ClassModel;
              return _fadeSlideRoute(MarkAttendanceScreen(classModel: classModel));
            case '/results':
              final args = settings.arguments as Map<String, dynamic>;
              return _fadeSlideRoute(AttendanceResultScreen(
                classModel: args['classModel'] as ClassModel,
                photo: args['photo'] as File,
              ));
            case '/reports':
              return _fadeSlideRoute(const ReportsScreen());
            case '/settings':
              return _fadeSlideRoute(const SettingsScreen());
            default:
              return _fadeSlideRoute(const SplashScreen());
          }
        },
      ),
    );
  }
}
