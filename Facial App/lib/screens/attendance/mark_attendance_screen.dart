import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../models/class_model.dart';
import '../../providers/attendance_provider.dart';
import '../../providers/student_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_app_bar.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/gradient_background.dart';

class MarkAttendanceScreen extends StatefulWidget {
  final ClassModel classModel;

  const MarkAttendanceScreen({super.key, required this.classModel});

  @override
  State<MarkAttendanceScreen> createState() => _MarkAttendanceScreenState();
}

class _MarkAttendanceScreenState extends State<MarkAttendanceScreen> {
  final _picker = ImagePicker();
  File? _photo;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<StudentProvider>().loadStudents(widget.classModel.id);
      context.read<AttendanceProvider>().reset();
    });
  }

  Future<void> _capture() async {
    final picked =
        await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
    if (picked != null) {
      setState(() => _photo = File(picked.path));
    }
  }

  Future<void> _send() async {
    if (_photo == null) return;
    final students = context.read<StudentProvider>().students;
    await context.read<AttendanceProvider>().recognize(_photo!, students);
    if (!mounted) return;
    Navigator.of(context).pushNamed(
      '/results',
      arguments: {'classModel': widget.classModel, 'photo': _photo},
    );
  }

  @override
  Widget build(BuildContext context) {
    final attendance = context.watch<AttendanceProvider>();

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: GlassAppBar(title: widget.classModel.name),
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                GlassCard(
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 18),
                  child: Row(
                    children: [
                      const Icon(Icons.class_outlined, color: AppColors.primaryAccent),
                      const SizedBox(width: 12),
                      Text(widget.classModel.name, style: AppTheme.heading(fontSize: 16)),
                    ],
                  ),
                ),
                Expanded(
                  child: Center(
                    child: attendance.isAnalyzing
                        ? Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const CircularProgressIndicator(
                                color: AppColors.secondaryAccent,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'RECOGNISING...',
                                style: AppTheme.label(fontSize: 12),
                              ),
                            ],
                          )
                        : _photo != null
                            ? GlassCard(
                                padding: const EdgeInsets.all(8),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(14),
                                  child: Image.file(_photo!, fit: BoxFit.cover),
                                ),
                              )
                            : GestureDetector(
                                onTap: _capture,
                                child: PulsingGlow(
                                  child: Container(
                                    width: 130,
                                    height: 130,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppColors.glassSurface,
                                      border: Border.all(
                                        color: AppColors.glassBorder,
                                      ),
                                    ),
                                    child: const Icon(
                                      Icons.camera_alt_outlined,
                                      color: AppColors.primaryAccent,
                                      size: 40,
                                    ),
                                  ),
                                ),
                              ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _photo == null ? 'TAP TO CAPTURE' : 'CAPTURE CLASS PHOTO',
                  style: AppTheme.label(fontSize: 11),
                ),
                const SizedBox(height: 20),
                if (_photo != null)
                  SizedBox(
                    width: double.infinity,
                    child: GlassButton(
                      label: 'Analyse Photo',
                      isLoading: attendance.isAnalyzing,
                      onPressed: _send,
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
