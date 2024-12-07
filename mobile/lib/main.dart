import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/screens/authentication/login.dart';
import 'package:mobile/screens/home.dart';
import 'package:mobile/utils/firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:mobile/utils/globals.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();

  // Preserve the splash screen until loading is complete
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  // Add Firebase.initializeApp() here
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<UserProvider>(create: (_) => UserProvider(userRepository)),
      ],
      child: const MainApp(),
    )
  );
}

class MainApp extends StatelessWidget {
  const MainApp({
    super.key
  });

  @override
  Widget build(BuildContext context) {

    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
    ]);
    
    return const MaterialApp(
      title: "DB Mobile",
      debugShowMaterialGrid: false,
      debugShowCheckedModeBanner: false,
      home: StartChecks(),
    );
  }
}

class StartChecks extends StatelessWidget {
  const StartChecks({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Widget>(
      future: returnPageBasedOnLoginStatus(context),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          
          if (!snapshot.hasData) {
            logger.e('[StartChecks()] Snapshot has no data.');
            return const Text('[StartChecks()] Snapshot has no data.');
          }
          
          FlutterNativeSplash.remove(); // Remove splash screen
          return snapshot.data!; // Return resulted page

        } else {
          // Show a loading spinner while waiting for the future to complete
          // (probably won't be seen because the splash screen is still visible)
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
      },
    );
  }
}

Future<Widget> returnPageBasedOnLoginStatus(BuildContext context) async {
  User? user = FirebaseAuth.instance.currentUser;
  
  // If user is logged out, redirect to LoginPage().
  if (user == null) return const LoginPage();

  if (user.email == null) {
    logger.e('[returnPageBasedOnLoginStatus()] User email is null.');
    return const LoginPage();
  }
  
  // Go to HomePage().
  authRepository.startListeningToProviders(context, user.email!);
  return const HomePage();
}
