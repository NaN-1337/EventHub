import 'package:flutter/material.dart';
import 'package:mobile/screens/home.dart';
import 'package:mobile/screens/onboarding/intro.dart';
import 'package:mobile/screens/onboarding/login/login_screen.dart';
import 'package:mobile/screens/onboarding/select_interest_screen.dart';
import 'package:mobile/screens/onboarding/signup/select_country_screen.dart';
import 'package:mobile/screens/onboarding/signup/signup_screen.dart';
import 'package:mobile/screens/onboarding/signup/verify_screen.dart';
import 'package:mobile/screens/onboarding/splash_screen.dart';

import 'app_routes.dart';

class AppPages {
  static const initialRoute = Routes.homeRoute;
  static Map<String, WidgetBuilder> routes = {
    Routes.homeRoute: (context) => const SplashScreen(),
    Routes.introRoute: (context) => const IntroScreen(),

    Routes.loginRoute: (context) => const LoginScreen(),

    Routes.signUpRoute: (context) => const SignUpScreen(),
    Routes.selectCountryRoute: (context) => const SelectCountryScreen(),
    Routes.verifyRoute: (context) => const VerifyScreen(),

    Routes.selectInterestRoute: (context) => const SelectInterestScreen(),

    Routes.homeScreenRoute: (context) => const HomePage(),
  };
}
