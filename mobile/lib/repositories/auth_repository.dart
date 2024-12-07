import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/repositories/user_repository.dart';
import 'package:mobile/screens/authentication/utils/forget_email_sent.dart';
import 'package:mobile/screens/home.dart';
import 'package:mobile/utils/dialog_widgets.dart';
import 'package:mobile/utils/globals.dart';
import 'package:provider/provider.dart';

class AuthRepository {
  // Inject UserRepository
  final UserRepository _userRepository;
  
  // Regular constructor
  AuthRepository(this._userRepository);

  // FirebaseAuth instance
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  void signIn(BuildContext context, String email, String password) async {

    loadingDialog(context);

    try {
      // 1. Check data with FirebaseAuth (validate email and password)
      await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      // 2. Check if user exists in 'users' collection based on it's email
      // (A user may not exist in 'users' collection if the account was disabled - deleted data)
      bool? userInFirestoreCollection = await _userRepository.userInFirestoreCollection(email);
      if (userInFirestoreCollection == true) {

        User user = _firebaseAuth.currentUser!;

        if (user.email == null) {
          logger.e('[authRepository.signIn()] User email is null.');
          return;
        }
        
        await startListeningToProviders(context, user.email!);
        Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (context) => const HomePage()), (Route<dynamic> route) => false);
        
      } else if (userInFirestoreCollection == false) {
        _firebaseAuth.signOut();
        errorDialog(context, 'Contul nu e in Firestore Database.');
        logger.w('Contul nu e in Firestore Database.');
      } else {
        _firebaseAuth.signOut();
        errorDialog(context, 'Unexpected error, check logger!');
        // logger in userInFirestoreCollection() function
      }
      
    } on FirebaseAuthException catch (error) {
      if (error.code == 'user-not-found' || error.code == 'wrong-password') {
        errorDialog(context, 'Email/parolă greșite!');
        logger.w(error.toString());
      } else {
        errorDialog(context, error.toString());
        logger.e(error.toString());
      }
    }
  }

  void logOut(BuildContext context, {bool showLoadingDialog = true}) {
    if (showLoadingDialog) {
      loadingDialog(context);
    }

    stopListeningToProviders(context);

    FirebaseAuth.instance.signOut();
  }

  Future<void> sendPasswordResetEmail(BuildContext context, BuildContext dialogContext, String email) async {

    Navigator.pop(dialogContext);
    loadingDialog(context);

    try {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
      logger.i('Password reset email sent SUCCESSFULLY!');
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (context) => const ForgetEmailSent()), (Route<dynamic> route) => false);
      
    } catch (error) {
      logger.e(error.toString());
      errorDialog(context, error.toString());
    }
  }

  Future<void> startListeningToProviders(BuildContext context, String email) async {

    final userProvider = Provider.of<UserProvider>(context, listen: false);

    userProvider.startListeningToUser(email);

    await userProvider.initializationCompleter.future;
  }

  Future<void> stopListeningToProviders(BuildContext context) async {
    Provider.of<UserProvider>(context, listen: false).stopListeningToUser();
  }
}
