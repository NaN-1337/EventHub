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
