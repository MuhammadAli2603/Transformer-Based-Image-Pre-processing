import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/class_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/class_provider.dart';
import '../../services/firestore_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/gradient_background.dart';

class _StudentStat {
  final String name;
  final String rollNumber;
  final double percentage;

  _StudentStat(this.name, this.rollNumber, this.percentage);
}

enum _DateRange { week, month, custom }

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  final _firestoreService = FirestoreService();
  ClassModel? _selectedClass;
  List<_StudentStat> _stats = [];
  bool _isLoading = false;
  _DateRange _range = _DateRange.week;
  DateTimeRange? _customRange;

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

  Future<void> _selectRange(_DateRange range) async {
    if (range == _DateRange.custom) {
      final now = DateTime.now();
      final picked = await showDateRangePicker(
        context: context,
        firstDate: now.subtract(const Duration(days: 365)),
        lastDate: now,
      );
      if (picked == null) return;
      _customRange = picked;
    }
    setState(() => _range = range);
    if (_selectedClass != null) _loadStats(_selectedClass!);
  }

  bool _inRange(DateTime date) {
    final now = DateTime.now();
    switch (_range) {
      case _DateRange.week:
        return date.isAfter(now.subtract(const Duration(days: 7)));
      case _DateRange.month:
        return date.isAfter(now.subtract(const Duration(days: 30)));
      case _DateRange.custom:
        if (_customRange == null) return true;
        return date.isAfter(_customRange!.start) &&
            date.isBefore(_customRange!.end.add(const Duration(days: 1)));
    }
  }

  Future<void> _loadStats(ClassModel classModel) async {
    setState(() {
      _selectedClass = classModel;
      _isLoading = true;
    });

    final students = await _firestoreService.fetchStudents(classModel.id);
    final sessions = await _firestoreService.fetchSessions(classModel.id);
    final confirmedSessions =
        sessions.where((s) => s.confirmed && _inRange(s.date)).toList();

    final stats = <_StudentStat>[];
    for (final student in students) {
      var presentCount = 0;
      for (final session in confirmedSessions) {
        final records =
            await _firestoreService.fetchSessionRecords(session.id);
        final record = records.where((r) => r.studentId == student.id);
        if (record.isNotEmpty && record.first.isPresent) presentCount++;
      }
      final percentage = confirmedSessions.isEmpty
          ? 0.0
          : (presentCount / confirmedSessions.length) * 100;
      stats.add(_StudentStat(student.name, student.rollNumber, percentage));
    }

    if (!mounted) return;
    setState(() {
      _stats = stats;
      _isLoading = false;
    });
  }

  String _toCsv() {
    final buffer = StringBuffer('Name,Roll Number,Attendance %\n');
    for (final stat in _stats) {
      buffer.writeln(
          '${stat.name},${stat.rollNumber},${stat.percentage.toStringAsFixed(1)}');
    }
    return buffer.toString();
  }

  Widget _rangeChip(String label, _DateRange range) {
    final isActive = _range == range;
    return GestureDetector(
      onTap: () => _selectRange(range),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          gradient: isActive ? AppTheme.chipGradient : null,
          color: isActive ? null : AppColors.glassSurface,
          borderRadius: BorderRadius.circular(20),
          border: isActive ? null : Border.all(color: AppColors.glassBorder),
        ),
        child: Text(
          label,
          style: AppTheme.label(
            fontSize: 10,
            color: isActive ? Colors.white : AppColors.secondaryText,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final classProvider = context.watch<ClassProvider>();

    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Reports', style: AppTheme.heading(fontSize: 22)),
                const SizedBox(height: 16),
                GlassCard(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  borderRadius: 30,
                  child: DropdownButtonHideUnderline(
                    child: DropdownButtonFormField<ClassModel>(
                      initialValue: _selectedClass,
                      dropdownColor: AppColors.bgGradientEnd,
                      style: AppTheme.body(fontSize: 13),
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        hintText: 'SELECT CLASS',
                        hintStyle: AppTheme.body(
                          fontSize: 13,
                          color: AppColors.secondaryText,
                        ),
                      ),
                      items: classProvider.classes
                          .map((c) => DropdownMenuItem(
                                value: c,
                                child: Text(c.name),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) _loadStats(value);
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    _rangeChip('WEEK', _DateRange.week),
                    const SizedBox(width: 8),
                    _rangeChip('MONTH', _DateRange.month),
                    const SizedBox(width: 8),
                    _rangeChip('CUSTOM', _DateRange.custom),
                  ],
                ),
                const SizedBox(height: 16),
                if (_isLoading)
                  const Expanded(
                    child: Center(
                      child: CircularProgressIndicator(
                        color: AppColors.primaryAccent,
                      ),
                    ),
                  )
                else if (_selectedClass != null)
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GlassCard(
                          child: SizedBox(
                            height: 160,
                            child: _stats.isEmpty
                                ? Center(
                                    child: Text(
                                      'NO DATA',
                                      style: AppTheme.body(
                                        fontSize: 12,
                                        color: AppColors.secondaryText,
                                      ),
                                    ),
                                  )
                                : BarChart(
                                    BarChartData(
                                      gridData: const FlGridData(show: false),
                                      borderData: FlBorderData(show: false),
                                      titlesData: const FlTitlesData(show: false),
                                      barGroups: [
                                        for (var i = 0; i < _stats.length; i++)
                                          BarChartGroupData(
                                            x: i,
                                            barRods: [
                                              BarChartRodData(
                                                toY: _stats[i].percentage,
                                                gradient: AppTheme.chipGradient,
                                                width: 12,
                                                borderRadius:
                                                    BorderRadius.circular(4),
                                              ),
                                            ],
                                          ),
                                      ],
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Expanded(
                          child: ListView.separated(
                            itemCount: _stats.length,
                            separatorBuilder: (_, _) =>
                                const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final stat = _stats[index];
                              return GlassCard(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 12),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          stat.name,
                                          style: AppTheme.body(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        Text(
                                          stat.rollNumber,
                                          style: AppTheme.body(
                                            fontSize: 11,
                                            color: AppColors.secondaryText,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        gradient: AppTheme.chipGradient,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        '${stat.percentage.toStringAsFixed(0)}%',
                                        style: AppTheme.label(
                                          fontSize: 11,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: GlassButton(
                            label: 'Export CSV',
                            variant: GlassButtonVariant.secondary,
                            onPressed: () {
                              final csv = _toCsv();
                              showDialog(
                                context: context,
                                builder: (_) => AlertDialog(
                                  backgroundColor: AppColors.bgGradientEnd,
                                  content: SingleChildScrollView(
                                    child: Text(
                                      csv,
                                      style: AppTheme.body(fontSize: 11),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
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
