import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/repositories/event_repository.dart';

class EventsProvider extends ChangeNotifier {
  final EventRepository _eventRepository;
  List<EventModel> _events = [];

  // A subscription to the events stream
  StreamSubscription<List<EventModel>>? subscription;
  // A completer to signal when initial data is loaded
  Completer<void> initializationCompleter = Completer<void>();

  EventsProvider(this._eventRepository);

  List<EventModel> get events => _events;

  // Start listening to all events in Firestore
  void startListeningToEvents() {
    subscription = _eventRepository.getAllEventsStream().listen((eventList) {
      _events = eventList;
      if (!initializationCompleter.isCompleted) {
        initializationCompleter.complete(); // Completes the future once we get initial data
      }
      notifyListeners(); // Notify listeners so UI can update
    });
  }

  // Stop listening to the stream of events
  void stopListeningToEvents() {
    _events = [];
    subscription?.cancel();
    notifyListeners();
  }

  @override
  void dispose() {
    subscription?.cancel(); // Ensure subscription is cancelled on dispose
    super.dispose();
  }
}
