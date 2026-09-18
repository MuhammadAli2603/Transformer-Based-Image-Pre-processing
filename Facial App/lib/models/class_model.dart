import 'package:cloud_firestore/cloud_firestore.dart';

class ClassModel {
  final String id;
  final String teacherId;
  final String name;
  final String subject;
  final String room;
  final DateTime createdAt;

  ClassModel({
    required this.id,
    required this.teacherId,
    required this.name,
    required this.subject,
    required this.room,
    required this.createdAt,
  });

  factory ClassModel.fromMap(String id, Map<String, dynamic> map) {
    return ClassModel(
      id: id,
      teacherId: map['teacherId'] ?? '',
      name: map['name'] ?? '',
      subject: map['subject'] ?? '',
      room: map['room'] ?? '',
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'teacherId': teacherId,
      'name': name,
      'subject': subject,
      'room': room,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
