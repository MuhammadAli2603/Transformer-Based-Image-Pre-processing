import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../models/class_model.dart';
import '../../models/student_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/student_provider.dart';
import '../../services/cloudinary_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_app_bar.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_text_field.dart';
import '../../widgets/gradient_background.dart';

const _minPhotos = 3;
const _maxPhotos = 6;

class AddStudentScreen extends StatefulWidget {
  final ClassModel classModel;

  const AddStudentScreen({super.key, required this.classModel});

  @override
  State<AddStudentScreen> createState() => _AddStudentScreenState();
}

class _AddStudentScreenState extends State<AddStudentScreen> {
  final _nameController = TextEditingController();
  final _rollController = TextEditingController();
  final _picker = ImagePicker();

  final List<File> _photoFiles = [];
  final Map<int, double> _uploadProgress = {};
  bool _isSaving = false;

  Future<void> _pickPhoto(ImageSource source) async {
    if (_photoFiles.length >= _maxPhotos) return;
    final picked = await _picker.pickImage(source: source, imageQuality: 85);
    if (picked != null) {
      setState(() => _photoFiles.add(File(picked.path)));
    }
  }

  bool get _canSave =>
      _nameController.text.isNotEmpty &&
      _rollController.text.isNotEmpty &&
      _photoFiles.length >= _minPhotos &&
      !_isSaving;

  Future<void> _save() async {
    final teacher = context.read<AuthProvider>().teacher;
    if (teacher == null) return;

    setState(() => _isSaving = true);

    final studentId = DateTime.now().microsecondsSinceEpoch.toString();
    final photoUrls = <String>[];
    try {
      for (var i = 0; i < _photoFiles.length; i++) {
        final url = await CloudinaryService.uploadImage(
          _photoFiles[i],
          teacherId: teacher.uid,
          studentId: studentId,
          onProgress: (progress) {
            setState(() => _uploadProgress[i] = progress);
          },
        );
        photoUrls.add(url);
      }

      final student = StudentModel(
        id: '',
        classId: widget.classModel.id,
        teacherId: teacher.uid,
        name: _nameController.text,
        rollNumber: _rollController.text,
        photoUrls: photoUrls,
        cloudinaryIds: const [],
        createdAt: DateTime.now(),
      );

      if (!mounted) return;
      final success =
          await context.read<StudentProvider>().createStudent(student);
      if (success && mounted) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Upload failed',
              style: AppTheme.body(fontSize: 12),
            ),
            backgroundColor: AppColors.error.withValues(alpha: 0.9),
          ),
        );
      }
    }

    if (mounted) setState(() => _isSaving = false);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _rollController.dispose();
    super.dispose();
  }

  Widget _photoSlot(int index) {
    if (index < _photoFiles.length) {
      final progress = _uploadProgress[index];
      return Stack(
        fit: StackFit.expand,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.file(_photoFiles[index], fit: BoxFit.cover),
          ),
          if (!_isSaving)
            Positioned(
              top: 4,
              right: 4,
              child: GestureDetector(
                onTap: () => setState(() => _photoFiles.removeAt(index)),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Colors.black54,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.close, color: Colors.white, size: 14),
                ),
              ),
            ),
          if (progress != null && progress < 1)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: LinearProgressIndicator(
                value: progress,
                color: AppColors.secondaryAccent,
                backgroundColor: Colors.black45,
                minHeight: 4,
              ),
            ),
        ],
      );
    }

    return GestureDetector(
      onTap: () => _pickPhoto(ImageSource.gallery),
      child: DottedBorderBox(
        child: const Icon(Icons.add, color: AppColors.secondaryText),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const GlassAppBar(title: 'Add Student'),
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GlassTextField(
                  controller: _nameController,
                  hint: 'Full Name',
                  icon: Icons.person_outline,
                ),
                const SizedBox(height: 12),
                GlassTextField(
                  controller: _rollController,
                  hint: 'Roll Number',
                  icon: Icons.badge_outlined,
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('PHOTOS', style: AppTheme.label()),
                    Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        gradient: AppTheme.chipGradient,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${_photoFiles.length} / $_minPhotos PHOTOS',
                        style: AppTheme.label(fontSize: 9, color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                    childAspectRatio: 1,
                  ),
                  itemCount: _maxPhotos,
                  itemBuilder: (context, index) => _photoSlot(index),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: GlassButton(
                        label: 'Camera',
                        variant: GlassButtonVariant.secondary,
                        onPressed: () => _pickPhoto(ImageSource.camera),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GlassButton(
                        label: 'Gallery',
                        variant: GlassButtonVariant.secondary,
                        onPressed: () => _pickPhoto(ImageSource.gallery),
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: GlassButton(
                    label: 'Save Student',
                    isLoading: _isSaving,
                    onPressed: _canSave ? _save : null,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class DottedBorderBox extends StatelessWidget {
  final Widget child;

  const DottedBorderBox({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _DashedBorderPainter(),
      child: Center(child: child),
    );
  }
}

class _DashedBorderPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.glassBorder
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.width, size.height),
      const Radius.circular(16),
    );
    const dashWidth = 6.0;
    const dashSpace = 4.0;
    final path = Path()..addRRect(rrect);
    for (final metric in path.computeMetrics()) {
      var distance = 0.0;
      while (distance < metric.length) {
        canvas.drawPath(
          metric.extractPath(distance, distance + dashWidth),
          paint,
        );
        distance += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
