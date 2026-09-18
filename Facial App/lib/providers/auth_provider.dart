import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/teacher_model.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final _authService = AuthService();

  TeacherModel? teacher;
  bool isLoading = false;
  String? error;

  User? get firebaseUser => _authService.currentUser;

  Future<bool> login(String email, String password) async {
    isLoading = true;
    error = null;
    notifyListeners();
    try {
      final user = await _authService.login(email, password);
      if (user != null) {
        teacher = await _authService.fetchTeacher(user.uid);
      }
      isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      error = e.toString().replaceFirst('Exception: ', '');
      isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(
      String name, String email, String password) async {
    isLoading = true;
    error = null;
    notifyListeners();
    try {
      final user = await _authService.register(name, email, password);
      if (user != null) {
        teacher = await _authService.fetchTeacher(user.uid);
      }
      isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      error = e.toString().replaceFirst('Exception: ', '');
      isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> loadTeacher() async {
    final user = _authService.currentUser;
    if (user != null) {
      teacher = await _authService.fetchTeacher(user.uid);
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    teacher = null;
    notifyListeners();
  }
}
