// ignore_for_file: use_build_context_synchronously

import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/pref_data.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _getIsFirst();
  }

  _getIsFirst() async {
    // check if user is signed in
    User? user = FirebaseAuth.instance.currentUser;
    if (user != null) {

      if (user.email == null) {
        logger.e('[_getIsFirst()] User email is null.');
        Constant.closeApp();
      }

      authRepository.startListeningToProviders(context, user.email!);

      await PrefData.setIsSignIn(true);
      await PrefData.setIsIntro(false);
      await PrefData.setSelectInterest(true);
    }

    bool isSignIn = await PrefData.getIsSignIn();
    bool isIntro = await PrefData.getIsIntro();
    bool isSelect = await PrefData.getSelectInterest();
    
    if (isIntro) {
      Constant.sendToNext(context, Routes.introRoute);
    } else if (!isSignIn) {
      Constant.sendToNext(context, Routes.loginRoute);
    } else if (!isSelect) {
      Constant.sendToNext(context, Routes.selectInterestRoute);
    } else {
      Timer(const Duration(seconds: 3), () {
        Constant.sendToNext(context, Routes.homeScreenRoute);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    initializeScreenSize(context);
    return Scaffold(
      appBar: getColorStatusBar(bgColor),
      body: SafeArea(
        child: Container(
          alignment: Alignment.center,
          width: double.infinity,
          color: bgColor
        ),
      ),
    );
  }
}
