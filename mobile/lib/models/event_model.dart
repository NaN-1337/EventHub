import 'package:cloud_firestore/cloud_firestore.dart';

class EventModel {
  final String? docId; // may be null, documentId from Firestore Collection (null when creating instance)
  final String uid;
  final String name;
  final String description;
  final String location;
  final String date;
  final String organizer;
  final String organizerName;
  final int points;
  final List<String> participants;
  final String category;
  final String subcategory;
  final Map<String, int> feelings;
  final String price;

  EventModel({
    this.docId,
    required this.uid,
    required this.name,
    required this.description,
    required this.location,
    required this.date,
    required this.organizer,
    required this.organizerName,
    required this.points,
    required this.participants,
    required this.category,
    required this.subcategory,
    required this.feelings,
    required this.price,
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
      "organizer_name": organizerName,
      "points": points,
      "participants": participants,
      "category": category,
      "subcategory": subcategory,
      "feelings": feelings,
      "price": price,
    };
  }

  // Factory method to create an EventModel from Firestore document snapshot
  factory EventModel.fromDocumentSnapshot(DocumentSnapshot doc) {
    final data = doc.data()! as Map<String, dynamic>;

    // logger.i("Converting event with name: ${data["name"]}");

    List<String> participants = (data["participants"] as List<dynamic>)
        .map((e) => e.toString())
        .toList();
    Map<String, int> feelings = (data["feelings"] as Map<dynamic, dynamic>).map((key, value) => MapEntry(key.toString(), value as int));

    return EventModel(
      docId: doc.id,
      uid: data["uid"],
      name: data["name"],
      description: data["description"],
      location: data["location"],
      date: data["date"],
      organizer: data["organizer"],
      organizerName: data["organizer_name"],
      points: data["points"],
      participants: participants,
      category: data["category"],
      subcategory: data["subcategory"],
      feelings: feelings,
      price: data["price"],
    );
  }
}
