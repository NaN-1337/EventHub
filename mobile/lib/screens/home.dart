import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/utils/globals.dart';
import 'package:provider/provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  @override
  void initState() {
    super.initState();
    FlutterNativeSplash.remove();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Simple Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GestureDetector(
              onTap: () {
                authRepository.logOut(context);
              },
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 15),
                padding: const EdgeInsets.all(13),
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                ),
                child: const Icon(Icons.logout, color: Colors.black),
              ),
            ),
            Consumer<UserProvider>(
              builder: (context, userProvider, child) {
                final user = userProvider.currentUser;

                if (user == null) {
                  logger.e("[HomePage: build()] User should NOT be null here, but it is...");
                  return const Center(child: CircularProgressIndicator());
                }

                return Column(
                  children: [
                    Text('User Name: ${user.name}'),
                    Text('User Email: ${user.email}'),
                    Text('Friends: ${user.friends}'),
                    Text('Joined Events: ${user.joinedEvents}'),
                    Text('Created Events: ${user.createdEvents}'),
                    Text('Tickets: ${user.tickets}'),
                    Text('Preferences: ${user.preferences}'),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
