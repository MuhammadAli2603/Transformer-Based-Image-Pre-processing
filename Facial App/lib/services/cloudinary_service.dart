import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class CloudinaryService {
  static const String cloudName = 'uczttt93';
  static const String uploadPreset = 'attendance_ai_preset';
  static const String uploadUrl =
      'https://api.cloudinary.com/v1_1/uczttt93/image/upload';

  static Future<String> _upload(
    File imageFile,
    String folder,
    Function(double)? onProgress,
  ) async {
    final mimeType = lookupMimeType(imageFile.path) ?? 'image/jpeg';
    final request = http.MultipartRequest('POST', Uri.parse(uploadUrl))
      ..fields['upload_preset'] = uploadPreset
      ..fields['folder'] = folder
      ..files.add(await http.MultipartFile.fromPath(
        'file',
        imageFile.path,
        contentType: MediaType.parse(mimeType),
      ));

    onProgress?.call(0.1);
    final streamedResponse = await request.send();
    onProgress?.call(0.8);
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 200) {
      throw Exception('Cloudinary upload failed: ${response.body}');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    onProgress?.call(1.0);
    return data['secure_url'] as String;
  }

  static Future<String> uploadImage(
    File imageFile, {
    required String teacherId,
    required String studentId,
    Function(double)? onProgress,
  }) async {
    return _upload(imageFile, 'students/$teacherId/$studentId', onProgress);
  }

  static Future<String> uploadAttendancePhoto(
    File imageFile, {
    required String teacherId,
    Function(double)? onProgress,
  }) async {
    return _upload(imageFile, 'attendance/$teacherId', onProgress);
  }

  static Future<void> deleteImage(String publicId) async {
    // ponytail: unsigned upload presets can't delete server-side without
    // exposing the API secret; deletion is a no-op until a signed backend
    // endpoint exists.
    return;
  }
}
