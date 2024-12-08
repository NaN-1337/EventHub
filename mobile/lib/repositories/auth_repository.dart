import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/events_provider.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/repositories/user_repository.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/dialog_widgets.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/modal/modal_select_interest.dart';
import 'package:mobile/utils/pref_data.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:provider/provider.dart';

Map<String, String> firestoreData = {
  "Music": "music",
  "Sports": "sports",
  "Travel": "travel",
  "Culture": "culture",
  "Volunteering": "community_involvement",
  "Entertainment": "entertainment",
};

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

  void signUp(BuildContext context, String inputEmail, String inputName, String inputPassword, List<ModalSelectInterest> selectIntersetList) async {

    loadingDialog(context);

    try {
      await PrefData.setSelectInterest(true);
      await PrefData.setIsSignIn(true);
        
      // 2. Check data with FirebaseAuth (validate email and password)
      UserCredential userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
        email: inputEmail,
        password: inputPassword
      );

      User user = userCredential.user!;

      Map<String, List<String>> interests = {};
      for (ModalSelectInterest interest in selectIntersetList) {
        if (interest.select == true) {
          interests[firestoreData[interest.name!]!] = interest.subInterests;
        }
      }

      UserModel newUser = UserModel(
        uid: user.uid,
        name: inputName,
        email: inputEmail,
        username: "",
        location: "",
        gender: "",
        xpPoints: 0,
        donationPoints: 0,
        level: 1,
        friends: [],
        joinedEvents: [],
        createdEvents: [],
        tickets: [],
        preferences: interests,
        feelings: {}
      );
  
      _userRepository.addUser(newUser);

      await user.updateDisplayName(inputName);
      await user.reload();

      await startListeningToProviders(context, user.email!);
      Constant.sendToNext(context, Routes.homeScreenRoute);

    } on FirebaseAuthException catch (error) {
      if (error.code == 'weak-password') {
        errorDialog(context, 'Parolă prea slabă!\n (min. 6 caractere)');
        logger.w(error.toString());
      } else if (error.code == 'email-already-in-use') {
        errorDialog(context, 'Adresă de email deja existentă!');
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
    final eventsProvider = Provider.of<EventsProvider>(context, listen: false);

    userProvider.startListeningToUser(email);
    eventsProvider.startListeningToEvents();

    await userProvider.initializationCompleter.future;
    await eventsProvider.initializationCompleter.future;
  }

  Future<void> stopListeningToProviders(BuildContext context) async {
    Provider.of<UserProvider>(context, listen: false).stopListeningToUser();
    Provider.of<EventsProvider>(context, listen: false).stopListeningToEvents();
  }
}
