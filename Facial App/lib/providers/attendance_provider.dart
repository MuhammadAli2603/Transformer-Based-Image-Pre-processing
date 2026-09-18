import 'dart:io';
import 'package:flutter/foundation.dart';
import '../models/attendance_record_model.dart';
import '../models/attendance_session_model.dart';
import '../models/student_model.dart';
import '../services/api_service.dart';
import '../services/cloudinary_service.dart';
import '../services/firestore_service.dart';

class AttendanceProvider with ChangeNotifier {
  final _firestoreService = FirestoreService();

  List<AttendanceRecord> records = [];
  bool isAnalyzing = false;
  String? error;

  Future<void> recognize(File classPhoto, List<StudentModel> students) async {
    isAnalyzing = true;
    error = null;
    notifyListeners();
    try {
      records = await ApiService.recognizeAttendance(
        classPhoto: classPhoto,
        students: students,
      );
    } catch (e) {
      error = 'Recognition failed.';
    }
    isAnalyzing = false;
    notifyListeners();
  }

  void toggleRecord(String studentId) {
    records = records.map((r) {
      if (r.studentId == studentId) {
        return r.copyWith(isPresent: !r.isPresent);
      }
      return r;
    }).toList();
    notifyListeners();
  }

  Future<bool> confirmAttendance({
    required String classId,
    required String teacherId,
    required File classPhoto,
  }) async {
    try {
      final photoUrl = await CloudinaryService.uploadAttendancePhoto(
        classPhoto,
        teacherId: teacherId,
      );
      final session = AttendanceSessionModel(
        id: '',
        classId: classId,
        teacherId: teacherId,
        date: DateTime.now(),
        attendancePhotoUrl: photoUrl,
        confirmed: true,
        createdAt: DateTime.now(),
      );
      final id = await _firestoreService.createAttendanceSession(
        session,
        records,
      );
      return id != null;
    } catch (e) {
      error = 'Could not save attendance.';
      notifyListeners();
      return false;
    }
  }

  void reset() {
    records = [];
    error = null;
  }
}
