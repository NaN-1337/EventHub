import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  
  final String? docId; // may be null, documentId from Firestore Collection (null when creating instance)
  final String uid;
  final String name;
  final String email;
  final String username;
  final String location;
  final String gender;
  final int xpPoints;
  final int donationPoints;
  final int level;
  final List<String> friends;
  final List<String> joinedEvents;
  final List<String> createdEvents;
  final List<Map<String, String>> tickets;
  final Map<String, List<String>> preferences;
  final Map<String, int> feelings;
  
  UserModel({
    this.docId,
    required this.uid,
    required this.name,
    required this.email,
    required this.username,
    required this.location,
    required this.gender,
    required this.xpPoints,
    required this.donationPoints,
    required this.level,
    required this.friends,
    required this.joinedEvents,
    required this.createdEvents,
    required this.tickets,
    required this.preferences,
    required this.feelings
  });

  // Convert UserModel to a Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      "uid": uid,
      "name": name,
      "email": email,
      "username": username,
      "location": location,
      "gender": gender,
      "xpPoints": xpPoints,
      "donationPoints": donationPoints,
      "level": level,
      "friends": friends,
      "joinedEvents": joinedEvents,
      "createdEvents": createdEvents,
      "tickets": tickets,
      "preferences": preferences,
      "feelings": feelings
    };
  }

  // Factory method to create a UserModel from Firestore document snapshot
  factory UserModel.fromDocumentSnapshot(DocumentSnapshot doc) {
    
    Map data = doc.data()! as Map<String, dynamic>;

    List<String> friends = (data["friends"] as List<dynamic>).map((e) => e.toString()).toList();
    List<String> joinedEvents = (data["joinedEvents"] as List<dynamic>).map((e) => e.toString()).toList();
    List<String> createdEvents = (data["createdEvents"] as List<dynamic>).map((e) => e.toString()).toList();
    List<Map<String, String>> tickets = (data["tickets"] as List<dynamic>).map((e) => (e as Map<dynamic, dynamic>).map((key, value) => MapEntry(key.toString(), value.toString())).cast<String, String>()).toList();
    Map<String, List<String>> preferences = (data["preferences"] as Map<dynamic, dynamic>).map((key, value) => MapEntry(key.toString(), (value as List<dynamic>).map((e) => e.toString()).toList()));
    Map<String, int> feelings = (data["feelings"] as Map<dynamic, dynamic>).map((key, value) => MapEntry(key.toString(), value as int));

    return UserModel(
      docId: doc.id,
      uid: data["uid"],
      name: data["name"],
      email: data["email"],
      username: data["username"],
      location: data["location"],
      gender: data["gender"],
      xpPoints: data["xpPoints"],
      donationPoints: data["donationPoints"],
      level: data["level"],
      friends: friends,
      joinedEvents: joinedEvents,
      createdEvents: createdEvents,
      tickets: tickets,
      preferences: preferences,
      feelings: feelings
    );
  }
}
