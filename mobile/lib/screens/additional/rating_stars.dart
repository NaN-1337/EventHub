import 'package:flutter/material.dart';

class RatingStars extends StatefulWidget {
  final int maxRating; // for example 10
  final int initialRating;
  final ValueChanged<int> onRatingSelected;

  const RatingStars({
    super.key,
    this.maxRating = 5,
    this.initialRating = 0,
    required this.onRatingSelected,
  });

  @override
  State<RatingStars> createState() => _RatingStarsState();
}

class _RatingStarsState extends State<RatingStars> {
  int _currentRating = 0;

  @override
  void initState() {
    super.initState();
    _currentRating = widget.initialRating;
  }

  void _updateRating(int newRating) {
    setState(() {
      _currentRating = newRating;
    });
    widget.onRatingSelected(newRating);
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(widget.maxRating, (index) {
        int starIndex = index + 1; // Stars from 1 to maxRating
        bool isFilled = starIndex <= _currentRating;

        return GestureDetector(
          onTap: () => _updateRating(starIndex),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3.0),
            child: Icon(
              Icons.star,
              color: isFilled ? Colors.amber : const Color.fromARGB(255, 204, 204, 204),
              size: 30.0,
            ),
          ),
        );
      }),
    );
  }
}
