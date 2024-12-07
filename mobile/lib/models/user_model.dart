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
  final Map<String, int> tickets;
  final Map<String, List<String>> preferences;
  
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
    required this.preferences
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
      "preferences": preferences
    };
  }

  // Factory method to create a UserModel from Firestore document snapshot
  factory UserModel.fromDocumentSnapshot(DocumentSnapshot doc) {
    
    Map data = doc.data()! as Map<String, dynamic>;

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
      friends: List<String>.from(data["friends"]),
      joinedEvents: List<String>.from(data["joinedEvents"]),
      createdEvents: List<String>.from(data["createdEvents"]),
      tickets: Map<String, int>.from(data["tickets"]),
      preferences: Map<String, List<String>>.from(data["preferences"])
    );
  }
}
