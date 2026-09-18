import 'package:cloud_firestore/cloud_firestore.dart';

class TeacherModel {
  final String uid;
  final String name;
  final String email;
  final DateTime createdAt;

  TeacherModel({
    required this.uid,
    required this.name,
    required this.email,
    required this.createdAt,
  });

  factory TeacherModel.fromMap(String uid, Map<String, dynamic> map) {
    return TeacherModel(
      uid: uid,
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
