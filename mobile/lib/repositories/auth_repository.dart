import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/repositories/user_repository.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/dialog_widgets.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/pref_data.dart';
import 'package:mobile/utils/routes/app_routes.dart';
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

      await PrefData.setSelectInterest(true);
      
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
        Constant.sendToNext(context, Routes.homeScreenRoute);
        
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

  void logOut(BuildContext context, {bool showLoadingDialog = true}) async {
    if (showLoadingDialog) {
      loadingDialog(context);
    }

    await PrefData.setIsIntro(false);
    await PrefData.setIsSignIn(false);
    await PrefData.setSelectInterest(true);

    stopListeningToProviders(context);

    FirebaseAuth.instance.signOut();

    Constant.sendToNext(context, Routes.loginRoute);
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
