import 'package:logger/logger.dart';
import 'package:mobile/repositories/auth_repository.dart';
import 'package:mobile/repositories/user_repository.dart';

/// Global logger instance.
var logger = Logger(printer: PrettyPrinter(),);

String appName = 'DB Mobile';

// Initialize repositories globally
final UserRepository userRepository = UserRepository();
final AuthRepository authRepository = AuthRepository(userRepository);
