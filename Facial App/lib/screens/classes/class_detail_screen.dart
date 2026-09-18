import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/class_model.dart';
import '../../providers/student_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_app_bar.dart';
import '../../widgets/glass_avatar.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/gradient_background.dart';

class ClassDetailScreen extends StatefulWidget {
  final ClassModel classModel;

  const ClassDetailScreen({super.key, required this.classModel});

  @override
  State<ClassDetailScreen> createState() => _ClassDetailScreenState();
}

class _ClassDetailScreenState extends State<ClassDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<StudentProvider>().loadStudents(widget.classModel.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final studentProvider = context.watch<StudentProvider>();

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: GlassAppBar(title: widget.classModel.name),
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.classModel.name, style: AppTheme.heading(fontSize: 20)),
                      const SizedBox(height: 4),
                      Text(
                        '${widget.classModel.subject} — ${widget.classModel.room}',
                        style: AppTheme.body(color: AppColors.secondaryText),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${studentProvider.students.length} STUDENTS',
                        style: AppTheme.label(fontSize: 11),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: GlassButton(
                        label: 'Mark Attendance',
                        onPressed: () => Navigator.of(context).pushNamed(
                          '/attendance',
                          arguments: widget.classModel,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GlassButton(
                        label: 'Reports',
                        variant: GlassButtonVariant.secondary,
                        onPressed: () =>
                            Navigator.of(context).pushNamed('/reports'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  'STUDENTS (${studentProvider.students.length})',
                  style: AppTheme.label(),
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: studentProvider.isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: AppColors.primaryAccent,
                          ),
                        )
                      : studentProvider.students.isEmpty
                          ? Center(
                              child: Text(
                                'NO STUDENTS YET',
                                style: AppTheme.body(color: AppColors.secondaryText),
                              ),
                            )
                          : ListView.separated(
                              itemCount: studentProvider.students.length,
                              separatorBuilder: (_, _) =>
                                  const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final student = studentProvider.students[index];
                                return FadeSlideIn(
                                  index: index,
                                  child: GlassCard(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16, vertical: 12),
                                    child: Row(
                                      children: [
                                        GlassAvatar(name: student.name, size: 40),
                                        const SizedBox(width: 14),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                student.name,
                                                style: AppTheme.body(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                              Text(
                                                student.rollNumber,
                                                style: AppTheme.body(
                                                  fontSize: 12,
                                                  color: AppColors.secondaryText,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const Icon(
                                          Icons.chevron_right,
                                          color: AppColors.mutedText,
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: AppTheme.primaryButtonGradient,
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryAccent.withValues(alpha: 0.4),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: FloatingActionButton(
          backgroundColor: Colors.transparent,
          elevation: 0,
          onPressed: () async {
            await Navigator.of(context)
                .pushNamed('/add-student', arguments: widget.classModel);
            if (!context.mounted) return;
            context.read<StudentProvider>().loadStudents(widget.classModel.id);
          },
          child: const Icon(Icons.add, color: AppColors.primaryText),
        ),
      ),
    );
  }
}
