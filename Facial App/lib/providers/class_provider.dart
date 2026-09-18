import 'package:flutter/foundation.dart';
import '../models/class_model.dart';
import '../services/firestore_service.dart';

class ClassProvider with ChangeNotifier {
  final _firestoreService = FirestoreService();

  List<ClassModel> classes = [];
  bool isLoading = false;
  String? error;

  Future<void> loadClasses(String teacherId) async {
    isLoading = true;
    error = null;
    notifyListeners();
    try {
      classes = await _firestoreService.fetchClasses(teacherId);
    } catch (e) {
      error = 'Could not load classes.';
    }
    isLoading = false;
    notifyListeners();
  }

  Future<bool> createClass(ClassModel classModel) async {
    try {
      final id = await _firestoreService.createClass(classModel);
      if (id == null) return false;
      classes.add(ClassModel.fromMap(id, classModel.toMap()));
      notifyListeners();
      return true;
    } catch (e) {
      error = 'Could not create class.';
      notifyListeners();
      return false;
    }
  }
}
