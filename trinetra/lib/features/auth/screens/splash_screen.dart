import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../controllers/auth_controller.dart';

/// TriNetra Premium Splash Screen
/// Animated logo reveal → routes based on auth state
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;
  late Animation<double> _textOpacity;
  late Animation<Offset> _textSlide;
  late Animation<double> _taglineOpacity;
  late Animation<double> _bgOpacity;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _startSequence();
  }

  void _setupAnimations() {
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2800),
    );

    // Background fade in
    _bgOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.15, curve: Curves.easeIn),
      ),
    );

    // Logo scale + fade
    _logoScale = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.55, curve: Curves.elasticOut),
      ),
    );

    _logoOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.35, curve: Curves.easeIn),
      ),
    );

    // App name slide up + fade
    _textOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.45, 0.70, curve: Curves.easeIn),
      ),
    );

    _textSlide = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.45, 0.70, curve: Curves.easeOut),
      ),
    );

    // Tagline fade
    _taglineOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.65, 0.85, curve: Curves.easeIn),
      ),
    );
  }

  Future<void> _startSequence() async {
    await _controller.forward();
    // Wait a beat then navigate
    await Future.delayed(const Duration(milliseconds: 600));
    if (mounted) _navigate();
  }

  void _navigate() {
    final authStatus = ref.read(authControllerProvider).status;
    switch (authStatus) {
      case AuthStatus.authenticated:
        context.go('/home');
        break;
      case AuthStatus.unknown:
        // Wait briefly for Firebase auth state to resolve
        Future.delayed(const Duration(milliseconds: 500), () {
          if (mounted) _navigate();
        });
        break;
      default:
        context.go('/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: AnimatedBuilder(
        animation: _controller,
        builder: (_, __) {
          return Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  const Color(0xFF0B1426).withOpacity(_bgOpacity.value),
                  const Color(0xFF0A1628).withOpacity(_bgOpacity.value),
                  const Color(0xFF061020).withOpacity(_bgOpacity.value),
                ],
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // ─── Animated Logo ───────────────────────────
                Opacity(
                  opacity: _logoOpacity.value,
                  child: Transform.scale(
                    scale: _logoScale.value,
                    child: _TriNetraLogo(),
                  ),
                ),

                const SizedBox(height: 24),

                // ─── App Name ─────────────────────────────────
                SlideTransition(
                  position: _textSlide,
                  child: Opacity(
                    opacity: _textOpacity.value,
                    child: const Text(
                      'TriNetra',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 40,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                // ─── Tagline ──────────────────────────────────
                Opacity(
                  opacity: _taglineOpacity.value,
                  child: const Text(
                    'Connect. Share. Grow.',
                    style: TextStyle(
                      color: Color(0xFF8A9BB0),
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
      bottomSheet: AnimatedBuilder(
        animation: _taglineOpacity,
        builder: (_, __) => Opacity(
          opacity: _taglineOpacity.value,
          child: Container(
            color: Colors.transparent,
            padding: const EdgeInsets.only(bottom: 32),
            width: double.infinity,
            child: const Text(
              'from TriNetra Technologies',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Color(0xFF4A5568),
                fontSize: 12,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Animated 3-Eye (TriNetra) Logo
class _TriNetraLogo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 110,
      height: 110,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1877F2),
            Color(0xFF0D5FCC),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.5),
            blurRadius: 40,
            spreadRadius: 8,
          ),
        ],
      ),
      child: const Center(
        child: _EyeIcon(),
      ),
    );
  }
}

class _EyeIcon extends StatelessWidget {
  const _EyeIcon();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 64,
      height: 64,
      child: CustomPaint(
        painter: _TriNetraEyePainter(),
      ),
    );
  }
}

/// Custom painter for the TriNetra 3-eye symbol
class _TriNetraEyePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final cx = size.width / 2;
    final cy = size.height / 2;

    // Draw stylized TriNetra symbol (3 nested arcs/eyes)
    // Outer eye shape
    final outerPath = Path()
      ..moveTo(cx - 28, cy)
      ..quadraticBezierTo(cx, cy - 20, cx + 28, cy)
      ..quadraticBezierTo(cx, cy + 20, cx - 28, cy);
    canvas.drawPath(outerPath, paint);

    // Middle eye shape
    final midPath = Path()
      ..moveTo(cx - 18, cy)
      ..quadraticBezierTo(cx, cy - 13, cx + 18, cy)
      ..quadraticBezierTo(cx, cy + 13, cx - 18, cy);
    canvas.drawPath(midPath, paint..strokeWidth = 1.5);

    // Iris circle
    canvas.drawCircle(Offset(cx, cy), 7, paint..strokeWidth = 2);

    // Pupil dot
    canvas.drawCircle(Offset(cx, cy), 3, fillPaint);

    // Third eye dot (above center - "divine eye")
    canvas.drawCircle(
      Offset(cx, cy - 22),
      3.5,
      fillPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
