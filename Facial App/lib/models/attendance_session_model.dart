import 'package:cloud_firestore/cloud_firestore.dart';

class AttendanceSessionModel {
  final String id;
  final String classId;
  final String teacherId;
  final DateTime date;
  final String attendancePhotoUrl;
  final bool confirmed;
  final DateTime createdAt;

  AttendanceSessionModel({
    required this.id,
    required this.classId,
    required this.teacherId,
    required this.date,
    required this.attendancePhotoUrl,
    required this.confirmed,
    required this.createdAt,
  });

  factory AttendanceSessionModel.fromMap(String id, Map<String, dynamic> map) {
    return AttendanceSessionModel(
      id: id,
      classId: map['classId'] ?? '',
      teacherId: map['teacherId'] ?? '',
      date: (map['date'] as Timestamp?)?.toDate() ?? DateTime.now(),
      attendancePhotoUrl: map['attendancePhotoUrl'] ?? '',
      confirmed: map['confirmed'] ?? false,
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'classId': classId,
      'teacherId': teacherId,
      'date': Timestamp.fromDate(date),
      'attendancePhotoUrl': attendancePhotoUrl,
      'confirmed': confirmed,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
