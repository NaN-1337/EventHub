import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/repositories/user_repository.dart';

class UserProvider extends ChangeNotifier {
  final UserRepository _userRepository;
  UserModel? _currentUser;

  StreamSubscription<UserModel?>? subscription;
  Completer<void> initializationCompleter = Completer<void>();

  UserProvider(this._userRepository);

  UserModel? get currentUser => _currentUser;

  // Start listening to the current user's data in Firestore
  void startListeningToUser(String email) {
    subscription = _userRepository.getUserStreamByEmail(email).listen((userData) {
      _currentUser = userData;
      if (!initializationCompleter.isCompleted) {
        initializationCompleter.complete(); // Completes the future when user is set
      }
      notifyListeners(); // Notify UI of changes
    });
  }

  // Called on log out.
  void stopListeningToUser() {
    _currentUser = null;
    subscription?.cancel();
    notifyListeners();
  }

  // Called when closing the app, for example.
  @override
  void dispose() {
    subscription?.cancel(); // Ensure the subscription is cancelled to avoid memory leaks
    super.dispose();
  }
}