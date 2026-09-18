import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/class_model.dart';
import '../models/student_model.dart';
import '../models/attendance_session_model.dart';
import '../models/attendance_record_model.dart';

class FirestoreService {
  final _db = FirebaseFirestore.instance;

  // ---- Classes ----

  Future<List<ClassModel>> fetchClasses(String teacherId) async {
    try {
      final snap = await _db
          .collection('classes')
          .where('teacherId', isEqualTo: teacherId)
          .get();
      return snap.docs
          .map((d) => ClassModel.fromMap(d.id, d.data()))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<String?> createClass(ClassModel classModel) async {
    try {
      final ref = await _db.collection('classes').add(classModel.toMap());
      return ref.id;
    } catch (_) {
      return null;
    }
  }

  // ---- Students ----

  Future<List<StudentModel>> fetchStudents(String classId) async {
    try {
      final snap = await _db
          .collection('students')
          .where('classId', isEqualTo: classId)
          .get();
      return snap.docs
          .map((d) => StudentModel.fromMap(d.id, d.data()))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<String?> createStudent(StudentModel student) async {
    try {
      final ref = await _db.collection('students').add(student.toMap());
      return ref.id;
    } catch (_) {
      return null;
    }
  }

  // ---- Attendance ----

  Future<String?> createAttendanceSession(
    AttendanceSessionModel session,
    List<AttendanceRecord> records,
  ) async {
    try {
      final ref =
          await _db.collection('attendance_sessions').add(session.toMap());
      final batch = _db.batch();
      for (final record in records) {
        final recordRef = ref.collection('records').doc();
        batch.set(recordRef, record.toMap());
      }
      await batch.commit();
      return ref.id;
    } catch (_) {
      return null;
    }
  }

  Future<List<AttendanceSessionModel>> fetchSessions(String classId) async {
    try {
      final snap = await _db
          .collection('attendance_sessions')
          .where('classId', isEqualTo: classId)
          .get();
      return snap.docs
          .map((d) => AttendanceSessionModel.fromMap(d.id, d.data()))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<AttendanceRecord>> fetchSessionRecords(String sessionId) async {
    try {
      final snap = await _db
          .collection('attendance_sessions')
          .doc(sessionId)
          .collection('records')
          .get();
      return snap.docs.map((d) => AttendanceRecord.fromMap(d.data())).toList();
    } catch (_) {
      return [];
    }
  }
}
