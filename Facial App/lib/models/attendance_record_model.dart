class AttendanceRecord {
  final String studentId;
  final String studentName;
  final String rollNumber;
  final bool isPresent;

  AttendanceRecord({
    required this.studentId,
    required this.studentName,
    required this.rollNumber,
    required this.isPresent,
  });

  AttendanceRecord copyWith({bool? isPresent}) {
    return AttendanceRecord(
      studentId: studentId,
      studentName: studentName,
      rollNumber: rollNumber,
      isPresent: isPresent ?? this.isPresent,
    );
  }

  factory AttendanceRecord.fromMap(Map<String, dynamic> map) {
    return AttendanceRecord(
      studentId: map['studentId'] ?? '',
      studentName: map['studentName'] ?? '',
      rollNumber: map['rollNumber'] ?? '',
      isPresent: map['isPresent'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'studentId': studentId,
      'studentName': studentName,
      'rollNumber': rollNumber,
      'isPresent': isPresent,
    };
  }
}
