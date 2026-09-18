import 'package:flutter/foundation.dart';
import '../models/student_model.dart';
import '../services/firestore_service.dart';

class StudentProvider with ChangeNotifier {
  final _firestoreService = FirestoreService();

  List<StudentModel> students = [];
  bool isLoading = false;
  String? error;

  Future<void> loadStudents(String classId) async {
    isLoading = true;
    error = null;
    notifyListeners();
    try {
      students = await _firestoreService.fetchStudents(classId);
    } catch (e) {
      error = 'Could not load students.';
    }
    isLoading = false;
    notifyListeners();
  }

  Future<bool> createStudent(StudentModel student) async {
    try {
      final id = await _firestoreService.createStudent(student);
      if (id == null) return false;
      students.add(StudentModel.fromMap(id, student.toMap()));
      notifyListeners();
      return true;
    } catch (e) {
      error = 'Could not save student.';
      notifyListeners();
      return false;
    }
  }
}
