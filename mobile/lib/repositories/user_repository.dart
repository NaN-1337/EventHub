import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/utils/globals.dart';

class UserRepository {
  // Regular constructor
  UserRepository();

  // Firestore instance
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Get a user by a field value.
  /// P.S. Expecting only ONE user to match the query.
  Future<UserModel?> getUserByField(String fieldName, String value) async {
    try {
      QuerySnapshot querySnapshot = await _firestore.collection("users").where(fieldName, isEqualTo: value).get();

      if(querySnapshot.docs.isEmpty) {
        logger.w('No user matches this query.');
        return null;
      }

      if(querySnapshot.docs.length > 1) {
        logger.w('More than one user matches this query.');
        return null;
      }

      DocumentSnapshot doc = querySnapshot.docs.first;
      return UserModel.fromDocumentSnapshot(doc);
      
    } catch (error) {
      logger.e(error.toString());
      return null;
    }
  }

  /// Get users by a field value.
  /// P.S. Expecting one or MORE users to match the query.
  Future<List<UserModel>?> getUsersByField(String fieldName, String value) async {
    try {
      QuerySnapshot querySnapshot = await _firestore.collection("users").where(fieldName, isEqualTo: value).get();

      if(querySnapshot.docs.isEmpty) {
        logger.w('No user matches this query.');
      }

      return querySnapshot.docs.map((doc) => UserModel.fromDocumentSnapshot(doc)).toList();
    } catch (error) {
      logger.e(error.toString());
      return null;
    }
  }

  /// Get all users except the current user.
  Future<List<UserModel>?> getAllUsers(String currentUserUid) async {
    try {
      QuerySnapshot snapshot = await FirebaseFirestore.instance.collection("users").where("uid", isNotEqualTo: currentUserUid).get();
      return snapshot.docs.map((doc) => UserModel.fromDocumentSnapshot(doc)).toList();
    } catch (error) {
      logger.e(error.toString());
      return null;
    }
  }

  /// Add a user to Firestore.
  Future<void> addUser(UserModel user) async {
    try {
      await FirebaseFirestore.instance.collection("users").add(user.toMap());
    } catch (error) {
      logger.e(error.toString());
    }
  }

  /// Update a user field in Firestore.
  Future<void> updateUserField(String docId, String fieldName, dynamic value) async {
    try {
      DocumentReference docRef = FirebaseFirestore.instance.collection("users").doc(docId);
      await docRef.update({fieldName: value});
    } catch (error) {
      logger.e(error.toString());
    }
  }

  /// Check if a user is in Firestore collection based on email.
  Future<bool?> userInFirestoreCollection(String email) async {
    try {
      final snapshot = await FirebaseFirestore.instance.collection('users').get();
      for (var doc in snapshot.docs) {
        if (doc.data()['email'].toString() == email) {
          return true;
        }
      }
      return false;
      
    } catch (error) {
      logger.e(error.toString());
      return null;
    }
  }

  /// Get a Firestore stream for a specific user's data
  Stream<UserModel?> getUserStreamByEmail(String email) {
    try {
      return _firestore.collection('users').where('email', isEqualTo: email).snapshots().map((querySnapshot) {
        if (querySnapshot.docs.isNotEmpty) {
          // Assuming only one document matches the "email"
          final doc = querySnapshot.docs.first;
          return UserModel.fromDocumentSnapshot(doc);
        }

        // Handle case where no document matches the query
        logger.e('[getUserStreamById()] No document found for email: $email');
        return null;
      }).handleError((error) {
        // Log or handle Firestore stream errors
        logger.e('[getUserStreamById()] Error fetching user stream: $error');
        return null;
      });
    } catch (e) {
      // If an error occurs outside the stream, return an error stream
      logger.e('[getUserStreamById()] $e');
      return Stream.error('[getUserStreamById()] $e');
    }
  }
}
