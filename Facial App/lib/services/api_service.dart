import 'dart:io';
import 'dart:math';
import '../models/student_model.dart';
import '../models/attendance_record_model.dart';

class ApiService {
  // Mock face recognition. Replace with real FastAPI endpoint later:
  // POST https://your-huggingface-space.hf.space/recognize
  // Body: multipart/form-data with image file + student list
  static Future<List<AttendanceRecord>> recognizeAttendance({
    required File classPhoto,
    required List<StudentModel> students,
  }) async {
    await Future.delayed(const Duration(milliseconds: 1500));
    return students.map((student) {
      final isPresent = Random().nextDouble() > 0.3;
      return AttendanceRecord(
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        isPresent: isPresent,
      );
    }).toList();
  }
}
