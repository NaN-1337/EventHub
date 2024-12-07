import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/utils/globals.dart';

class EventRepository {
  // Regular constructor
  EventRepository();

  // Firestore instance
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<EventModel>?> getAllEvents() async {
    try {
      QuerySnapshot querySnapshot = await _firestore.collection("events").get();

      if(querySnapshot.docs.isEmpty) {
        logger.e('[getAllEvents()] No event found.');
        return null;
      }

      // Convert each document into an EventModel
      List<EventModel> events = querySnapshot.docs.map((doc) {
        return EventModel.fromDocumentSnapshot(doc);
      }).toList();

      return events;
    } catch (error) {
      logger.e(error.toString());
      return null;
    }
  }

  // Returns a list of events that the user has joined based on the event UIDs in joinedEvents.
  List<EventModel> getJoinedEvents(List<EventModel> allEvents, List<String> joinedEvents) {
    return allEvents.where((event) => joinedEvents.contains(event.uid)).toList();
  }

  // Returns a list of events that match the user's preferences.
  // Preferences is a map like { "music": ["Rock", "Pop"], "sports": ["Football"] }
  // If an event's category and subcategory are found in the user's preferences, we consider it recommended.
  List<EventModel> getRecommendedEvents(List<EventModel> allEvents, Map<String, List<String>> preferences) {
    return allEvents.where((event) {
      final subcategories = preferences[event.category];
      if (subcategories == null) return false; 
      return subcategories.contains(event.subcategory);
    }).toList();
  }

  Stream<List<EventModel>> getAllEventsStream() {
    try {
      return _firestore.collection('events').snapshots().map((querySnapshot) {
        if (querySnapshot.docs.isNotEmpty) {
          return querySnapshot.docs.map((doc) {
            return EventModel.fromDocumentSnapshot(doc);
          }).toList();
        }

        // If no documents found, return an empty list
        logger.e('[getAllEventsStream()] No events found in "events" collection.');
        return <EventModel>[];
      }).handleError((error) {
        // Log or handle Firestore stream errors
        logger.e('[getAllEventsStream()] Error fetching events: $error');
        return <EventModel>[]; // Return an empty list on error
      });
    } catch (e) {
      // If an error occurs outside the stream, return an error stream
      logger.e('[getAllEventsStream()] $e');
      return Stream.error('[getAllEventsStream()] $e');
    }
  }
}
