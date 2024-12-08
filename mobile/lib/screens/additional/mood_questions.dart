import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/dialog_widgets.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';
import 'rating_stars.dart'; // Make sure this import points to where your RatingStars widget is defined.

class MoodQuestions extends StatefulWidget {
  const MoodQuestions({super.key});

  @override
  State<MoodQuestions> createState() => _MoodQuestionsState();
}

class _MoodQuestionsState extends State<MoodQuestions> {
  // Store the ratings for each question
  int _ratingQ1 = 0;
  int _ratingQ2 = 0;
  int _ratingQ3 = 0;
  int _ratingQ4 = 0;

  @override
  Widget build(BuildContext context) {

    final userProvider = Provider.of<UserProvider>(context);
    UserModel? currentUser = userProvider.currentUser;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(''),
        leading: Container(
          margin: EdgeInsets.only(left: 15.w, top: 15.h),
          // make the container round with gray background color
          decoration: BoxDecoration(
            color: const Color.fromARGB(255, 242, 242, 242),
            borderRadius: BorderRadius.circular(80),
          ),
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.only(left: 20.0, right: 20.0, top: 20.0),
        child: Column(
          children: [
            // Question 1
            // questionWidget("How energetic do you feel right now?", _ratingQ1),
            Container(
              padding: const EdgeInsets.all(12),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white, // Background color
                border: Border.all(
                  color: const Color.fromARGB(255, 198, 198, 198), // Border color
                  width: 1,          // Border width
                ),
                borderRadius: BorderRadius.circular(25), // Rounded corners
              ),
              child: Column(
                children: [
                  getCustomFont("How energetic do you feel right now?", 18.sp, Colors.black, 2,
                          fontWeight: FontWeight.w500, txtHeight: 1.5.h,),
                  const SizedBox(height: 8),
                  RatingStars(
                    maxRating: 5,
                    initialRating: _ratingQ1,
                    onRatingSelected: (newRating) {
                      setState(() {
                        _ratingQ1 = newRating;
                      });
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 15),

            // questionWidget("How much do you want to connect with others?", _ratingQ2),
            Container(
              padding: const EdgeInsets.all(12),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white, // Background color
                border: Border.all(
                  color: const Color.fromARGB(255, 198, 198, 198), // Border color
                  width: 1,          // Border width
                ),
                borderRadius: BorderRadius.circular(25), // Rounded corners
              ),
              child: Column(
                children: [
                  getCustomFont("How much do you want to connect with others?", 18.sp, Colors.black, 2,
                          fontWeight: FontWeight.w500, txtHeight: 1.5.h,),
                  const SizedBox(height: 8),
                  RatingStars(
                    maxRating: 5,
                    initialRating: _ratingQ2,
                    onRatingSelected: (newRating) {
                      setState(() {
                        _ratingQ2 = newRating;
                      });
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 15),

            // questionWidget("How adventurous or spontaneous do you feel?", _ratingQ3),
            Container(
              padding: const EdgeInsets.all(12),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white, // Background color
                border: Border.all(
                  color: const Color.fromARGB(255, 198, 198, 198), // Border color
                  width: 1,          // Border width
                ),
                borderRadius: BorderRadius.circular(25), // Rounded corners
              ),
              child: Column(
                children: [
                  getCustomFont("How adventurous or spontaneous do you feel?", 18.sp, Colors.black, 2,
                          fontWeight: FontWeight.w500, txtHeight: 1.5.h,),
                  const SizedBox(height: 8),
                  RatingStars(
                    maxRating: 5,
                    initialRating: _ratingQ3,
                    onRatingSelected: (newRating) {
                      setState(() {
                        _ratingQ3 = newRating;
                      });
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 15),

            // questionWidget("How much relaxation do you need?", _ratingQ4),
            Container(
              padding: const EdgeInsets.all(12),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white, // Background color
                border: Border.all(
                  color: const Color.fromARGB(255, 198, 198, 198), // Border color
                  width: 1,          // Border width
                ),
                borderRadius: BorderRadius.circular(25), // Rounded corners
              ),
              child: Column(
                children: [
                  getCustomFont("How much relaxation do you need?", 18.sp, Colors.black, 2,
                          fontWeight: FontWeight.w500, txtHeight: 1.5.h,),
                  const SizedBox(height: 8),
                  RatingStars(
                    maxRating: 5,
                    initialRating: _ratingQ4,
                    onRatingSelected: (newRating) {
                      setState(() {
                        _ratingQ4 = newRating;
                      });
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            getButton(context, accentColor, "Submit", Colors.white, () {
                  loadingDialog(context);
                  currentUser!.feelings["F1"] = _ratingQ1;
                  currentUser.feelings["F2"] = _ratingQ2;
                  currentUser.feelings["F3"] = _ratingQ3;
                  currentUser.feelings["F4"] = _ratingQ4;
                  userRepository.updateUserField(currentUser.docId!, "feelings", currentUser.feelings);
                  Constant.sendToNext(context, Routes.homeScreenRoute);
                }, 18.sp,
                    weight: FontWeight.w700,
                    borderRadius: BorderRadius.circular(22.h),
                    buttonHeight: 60.h),
          ],
        ),
      ),
    );
  }

  Widget questionWidget(String text, int rating) {
    return Container(
      padding: const EdgeInsets.all(12),
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white, // Background color
        border: Border.all(
          color: const Color.fromARGB(255, 198, 198, 198), // Border color
          width: 1,          // Border width
        ),
        borderRadius: BorderRadius.circular(25), // Rounded corners
      ),
      child: Column(
        children: [
          getCustomFont(text, 18.sp, Colors.black, 2,
                  fontWeight: FontWeight.w500, txtHeight: 1.5.h,),
          const SizedBox(height: 8),
          RatingStars(
            maxRating: 5,
            initialRating: rating,
            onRatingSelected: (newRating) {
              setState(() {
                rating = newRating;
              });
            },
          ),
        ],
      ),
    );
  }
}
