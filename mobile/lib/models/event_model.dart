import 'package:cloud_firestore/cloud_firestore.dart';

class EventModel {
  final String? docId; // may be null, documentId from Firestore Collection (null when creating instance)
  final String uid;
  final String name;
  final String description;
  final String location;
  final String date;
  final String organizer;
  final int points;
  final List<String> participants;
  final String category;
  final String subcategory;

  EventModel({
    this.docId,
    required this.uid,
    required this.name,
    required this.description,
    required this.location,
    required this.date,
    required this.organizer,
    required this.points,
    required this.participants,
    required this.category,
    required this.subcategory,
  });

  // Convert EventModel to a Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      "uid": uid,
      "name": name,
      "description": description,
      "location": location,
      "date": date,
      "organizer": organizer,
      "points": points,
      "participants": participants,
      "category": category,
      "subcategory": subcategory,
    };
  }

  // Factory method to create an EventModel from Firestore document snapshot
  factory EventModel.fromDocumentSnapshot(DocumentSnapshot doc) {
    final data = doc.data()! as Map<String, dynamic>;

    List<String> participants = (data["participants"] as List<dynamic>)
        .map((e) => e.toString())
        .toList();

    return EventModel(
      docId: doc.id,
      uid: data["uid"],
      name: data["name"],
      description: data["description"],
      location: data["location"],
      date: data["date"],
      organizer: data["organizer"],
      points: data["points"],
      participants: participants,
      category: data["category"],
      subcategory: data["subcategory"],
    );
  }
}
