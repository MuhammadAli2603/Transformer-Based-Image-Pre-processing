import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/class_model.dart';
import '../../providers/attendance_provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_app_bar.dart';
import '../../widgets/glass_avatar.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/gradient_background.dart';

class AttendanceResultScreen extends StatefulWidget {
  final ClassModel classModel;
  final File photo;

  const AttendanceResultScreen({
    super.key,
    required this.classModel,
    required this.photo,
  });

  @override
  State<AttendanceResultScreen> createState() =>
      _AttendanceResultScreenState();
}

class _AttendanceResultScreenState extends State<AttendanceResultScreen> {
  bool _isSaving = false;

  Future<void> _confirm() async {
    final teacher = context.read<AuthProvider>().teacher;
    if (teacher == null) return;
    setState(() => _isSaving = true);

    final success = await context.read<AttendanceProvider>().confirmAttendance(
          classId: widget.classModel.id,
          teacherId: teacher.uid,
          classPhoto: widget.photo,
        );

    if (!mounted) return;
    setState(() => _isSaving = false);
    if (success) {
      Navigator.of(context)
          .popUntil((route) => route.settings.name == '/class-detail' || route.isFirst);
    }
  }

  Widget _countBadge(String label, int count, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        '$label: $count',
        style: AppTheme.label(fontSize: 11, color: color),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final attendance = context.watch<AttendanceProvider>();
    final presentCount = attendance.records.where((r) => r.isPresent).length;
    final absentCount = attendance.records.length - presentCount;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const GlassAppBar(title: 'Attendance Result'),
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GlassCard(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.file(
                          widget.photo,
                          width: 56,
                          height: 56,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(width: 16),
                      _countBadge('PRESENT', presentCount, AppColors.success),
                      const SizedBox(width: 10),
                      _countBadge('ABSENT', absentCount, AppColors.error),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView.separated(
                    itemCount: attendance.records.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final record = attendance.records[index];
                      return FadeSlideIn(
                        index: index,
                        child: GlassCard(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 10),
                          child: Row(
                            children: [
                              GlassAvatar(name: record.studentName, size: 40),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      record.studentName,
                                      style: AppTheme.body(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    Text(
                                      record.rollNumber,
                                      style: AppTheme.body(
                                        fontSize: 12,
                                        color: AppColors.secondaryText,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              _PresenceToggle(
                                isPresent: record.isPresent,
                                onChanged: () => context
                                    .read<AttendanceProvider>()
                                    .toggleRecord(record.studentId),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: GlassButton(
                    label: 'Confirm Attendance',
                    isLoading: _isSaving,
                    onPressed: _confirm,
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: GlassButton(
                    label: 'Retake',
                    variant: GlassButtonVariant.secondary,
                    onPressed: () => Navigator.of(context).pop(),
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

class _PresenceToggle extends StatelessWidget {
  final bool isPresent;
  final VoidCallback onChanged;

  const _PresenceToggle({required this.isPresent, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final color = isPresent ? AppColors.primaryAccent : AppColors.error;
    return GestureDetector(
      onTap: onChanged,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 48,
        height: 28,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.3),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color),
        ),
        child: AnimatedAlign(
          duration: const Duration(milliseconds: 200),
          alignment: isPresent ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
        ),
      ),
    );
  }
}
