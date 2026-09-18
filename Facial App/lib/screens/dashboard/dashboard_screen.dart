import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/class_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/class_provider.dart';
import '../../services/firestore_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_bottom_nav.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/glass_text_field.dart';
import '../../widgets/gradient_background.dart';
import '../reports/reports_screen.dart';
import '../settings/settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _navIndex = 0;
  final _firestoreService = FirestoreService();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final teacher = context.read<AuthProvider>().teacher;
      if (teacher != null) {
        context.read<ClassProvider>().loadClasses(teacher.uid);
      }
    });
  }

  Future<(int, bool)> _loadClassStats(String classId) async {
    final students = await _firestoreService.fetchStudents(classId);
    final sessions = await _firestoreService.fetchSessions(classId);
    final now = DateTime.now();
    final doneToday = sessions.any((s) =>
        s.confirmed &&
        s.date.year == now.year &&
        s.date.month == now.month &&
        s.date.day == now.day);
    return (students.length, doneToday);
  }

  Future<(int, int, int)> _loadAggregateStats(List<ClassModel> classes) async {
    final stats = await Future.wait(classes.map((c) => _loadClassStats(c.id)));
    final totalStudents = stats.fold<int>(0, (sum, s) => sum + s.$1);
    final doneToday = stats.where((s) => s.$2).length;
    return (classes.length, totalStudents, doneToday);
  }

  void _showAddClassSheet() {
    final nameController = TextEditingController();
    final subjectController = TextEditingController();
    final roomController = TextEditingController();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (sheetContext) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(sheetContext).viewInsets.bottom + 20,
          ),
          child: GlassCard(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('New Class', style: AppTheme.heading(fontSize: 18)),
                const SizedBox(height: 16),
                GlassTextField(
                  controller: nameController,
                  hint: 'Class Name',
                  icon: Icons.class_outlined,
                ),
                const SizedBox(height: 12),
                GlassTextField(
                  controller: subjectController,
                  hint: 'Subject',
                  icon: Icons.menu_book_outlined,
                ),
                const SizedBox(height: 12),
                GlassTextField(
                  controller: roomController,
                  hint: 'Room',
                  icon: Icons.meeting_room_outlined,
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: GlassButton(
                    label: 'Create Class',
                    onPressed: () async {
                      final teacher = context.read<AuthProvider>().teacher;
                      if (teacher == null || nameController.text.isEmpty) return;
                      final classModel = ClassModel(
                        id: '',
                        teacherId: teacher.uid,
                        name: nameController.text,
                        subject: subjectController.text,
                        room: roomController.text,
                        createdAt: DateTime.now(),
                      );
                      await context.read<ClassProvider>().createClass(classModel);
                      if (sheetContext.mounted) Navigator.of(sheetContext).pop();
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final teacher = context.watch<AuthProvider>().teacher;
    final classProvider = context.watch<ClassProvider>();

    final body = _navIndex == 0
        ? _buildDashboardBody(classProvider, teacher?.name ?? '')
        : _navIndex == 1
            ? _buildDashboardBody(classProvider, teacher?.name ?? '')
            : _navIndex == 2
                ? const ReportsScreen()
                : const SettingsScreen();

    return Scaffold(
      body: GradientBackground(child: SafeArea(child: body)),
      floatingActionButton: _navIndex <= 1
          ? Container(
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
                onPressed: _showAddClassSheet,
                child: const Icon(Icons.add, color: AppColors.primaryText),
              ),
            )
          : null,
      bottomNavigationBar: GlassBottomNav(
        currentIndex: _navIndex,
        onTap: (index) => setState(() => _navIndex = index),
      ),
    );
  }

  Widget _buildDashboardBody(ClassProvider classProvider, String teacherName) {
    final now = DateTime.now();
    const weekdays = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final dateLabel =
        '${weekdays[now.weekday - 1]}, ${months[now.month - 1]} ${now.day}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Good Morning, $teacherName 👋',
                style: AppTheme.heading(fontSize: 22),
              ),
              const SizedBox(height: 4),
              Text(dateLabel, style: AppTheme.body(color: AppColors.secondaryText)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: FutureBuilder<(int, int, int)>(
            future: _loadAggregateStats(classProvider.classes),
            builder: (context, snapshot) {
              final classes = snapshot.data?.$1 ?? classProvider.classes.length;
              final students = snapshot.data?.$2 ?? 0;
              final sessions = snapshot.data?.$3 ?? 0;
              return Row(
                children: [
                  Expanded(child: _statCard('$classes', 'CLASSES')),
                  const SizedBox(width: 10),
                  Expanded(child: _statCard('$students', 'STUDENTS')),
                  const SizedBox(width: 10),
                  Expanded(child: _statCard('$sessions', 'TODAY')),
                ],
              );
            },
          ),
        ),
        const SizedBox(height: 24),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text('YOUR CLASSES', style: AppTheme.label()),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: classProvider.isLoading
              ? const Center(
                  child: CircularProgressIndicator(color: AppColors.primaryAccent),
                )
              : classProvider.classes.isEmpty
                  ? Center(
                      child: Text(
                        'NO CLASSES YET',
                        style: AppTheme.body(color: AppColors.secondaryText),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                      itemCount: classProvider.classes.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final classModel = classProvider.classes[index];
                        return FadeSlideIn(
                          index: index,
                          child: FutureBuilder<(int, bool)>(
                            future: _loadClassStats(classModel.id),
                            builder: (context, snapshot) {
                              final count = snapshot.data?.$1 ?? 0;
                              final doneToday = snapshot.data?.$2 ?? false;
                              return GlassCard(
                                onTap: () => Navigator.of(context).pushNamed(
                                  '/class-detail',
                                  arguments: classModel,
                                ),
                                child: IntrinsicHeight(
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.stretch,
                                    children: [
                                      Container(
                                        width: 4,
                                        decoration: BoxDecoration(
                                          color: AppColors.primaryAccent,
                                          borderRadius: BorderRadius.circular(2),
                                        ),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              classModel.name,
                                              style: AppTheme.heading(fontSize: 16),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              classModel.subject,
                                              style: AppTheme.body(
                                                fontSize: 13,
                                                color: AppColors.secondaryText,
                                              ),
                                            ),
                                            const SizedBox(height: 12),
                                            Wrap(
                                              spacing: 8,
                                              runSpacing: 8,
                                              children: [
                                                _chip('$count STUDENTS'),
                                                _chip(classModel.room),
                                                _statusBadge(doneToday),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
        ),
      ],
    );
  }

  Widget _statCard(String value, String label) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      child: Column(
        children: [
          Text(value, style: AppTheme.heading(fontSize: 20)),
          const SizedBox(height: 2),
          Text(label, style: AppTheme.label(fontSize: 9)),
        ],
      ),
    );
  }

  Widget _chip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: AppColors.glassSurfaceStrong,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Text(
        label.toUpperCase(),
        style: AppTheme.label(fontSize: 9, color: AppColors.secondaryText),
      ),
    );
  }

  Widget _statusBadge(bool done) {
    final color = done ? AppColors.success : AppColors.warning;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        done ? 'DONE' : 'PENDING',
        style: AppTheme.label(fontSize: 9, color: color),
      ),
    );
  }
}
