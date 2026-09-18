import 'package:cloud_firestore/cloud_firestore.dart';

class StudentModel {
  final String id;
  final String classId;
  final String teacherId;
  final String name;
  final String rollNumber;
  final List<String> photoUrls;
  final List<String> cloudinaryIds;
  final DateTime createdAt;

  StudentModel({
    required this.id,
    required this.classId,
    required this.teacherId,
    required this.name,
    required this.rollNumber,
    required this.photoUrls,
    required this.cloudinaryIds,
    required this.createdAt,
  });

  factory StudentModel.fromMap(String id, Map<String, dynamic> map) {
    return StudentModel(
      id: id,
      classId: map['classId'] ?? '',
      teacherId: map['teacherId'] ?? '',
      name: map['name'] ?? '',
      rollNumber: map['rollNumber'] ?? '',
      photoUrls: List<String>.from(map['photoUrls'] ?? []),
      cloudinaryIds: List<String>.from(map['cloudinaryIds'] ?? []),
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'classId': classId,
      'teacherId': teacherId,
      'name': name,
      'rollNumber': rollNumber,
      'photoUrls': photoUrls,
      'cloudinaryIds': cloudinaryIds,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
