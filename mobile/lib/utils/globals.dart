import 'package:logger/logger.dart';
import 'package:mobile/repositories/auth_repository.dart';
import 'package:mobile/repositories/event_repository.dart';
import 'package:mobile/repositories/user_repository.dart';

/// Global logger instance.
var logger = Logger(printer: PrettyPrinter(),);

String appName = 'DB Mobile';
String packageName = 'com.example.mobile';

// Initialize repositories globally
final UserRepository userRepository = UserRepository();
final EventRepository eventRepository = EventRepository();
final AuthRepository authRepository = AuthRepository(userRepository);
