import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'dart:math' as math;

import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';

class UpComingScreen extends StatefulWidget {
  const UpComingScreen({super.key});

  @override
  State<UpComingScreen> createState() => _UpComingScreenState();
}

class _UpComingScreenState extends State<UpComingScreen> {

  @override
  Widget build(BuildContext context) {
    
    final userProvider = Provider.of<UserProvider>(context);
    UserModel? currentUser = userProvider.currentUser;
    
    List<Map<String, String>> tickets = [];
    if (currentUser != null) {
      tickets = currentUser.tickets;
      // filter out the tikcets that have ticket['active] == 'false'
      tickets = tickets.where((ticket) => ticket['active'] == 'true').toList();
    }
    
    return tickets.isEmpty
        ? getPaddingWidget(
            EdgeInsets.symmetric(horizontal: 20.h),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  height: 208.h,
                  width: 208.h,
                  padding: EdgeInsets.all(47.h),
                  decoration: BoxDecoration(
                      color: lightColor,
                      borderRadius: BorderRadius.circular(187.h)),
                  child:
                      getAssetImage("ticket.png", height: 114.h, width: 114.h),
                  // padding: ,
                ),
                getVerSpace(28.h),
                getCustomFont("No Upcoming Ticket Yet!", 20.sp, Colors.black, 1,
                    fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                getVerSpace(8.h),
                getMultilineCustomFont(
                    "Explore more and shortlist events.", 16.sp, Colors.black,
                    fontWeight: FontWeight.w500, txtHeight: 1.5.h)
              ],
            ),
          )
        : ListView.separated(
            primary: true,
            shrinkWrap: true,
            itemCount: tickets.length,
            separatorBuilder: (context, index) {
              return getVerSpace(20.h);
            },
            padding: EdgeInsets.only(
                right: 20.h, left: 20.h, top: 30.h, bottom: 50.h),
            itemBuilder: (context, index) {
              Map<String, String> ticket = tickets[index];
              return Transform.rotate(
                angle: math.pi,
                child: GestureDetector(
                  onTap: () {
                    Constant.sendToNext(context, Routes.ticketDetailRoute, arguments: ticket);
                  },
                  child: CustomPaint(
                    painter: RPSCustomPainter(right: 123.h, holeRadius: 16.h),
                    child: Transform.rotate(
                      angle: math.pi,
                      child: Container(
                        padding: EdgeInsets.only(
                            top: 15.h, bottom: 15.h, left: 17.h, right: 16.h),
                        width: double.infinity,
                        child: Row(
                          children: [
                            SizedBox(
                              width: 115.h,
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  getAssetImage("code.png",
                                      width: 100.h, height: 100.h),
                                  CustomPaint(
                                      size: Size(2.h, 105.h),
                                      painter: DashedLineVerticalPainter())
                                ],
                              ),
                            ),
                            getHorSpace(31.h),
                            Expanded(
                              flex: 1,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  getCustomFont(ticket['eventName']!, 18.sp,
                                      Colors.black, 1,
                                      fontWeight: FontWeight.w600,
                                      txtHeight: 1.5.h),
                                  getVerSpace(6.h),
                                  getCustomFont(ticket['eventDate']!, 15.sp,
                                      greyColor, 1,
                                      fontWeight: FontWeight.w500,
                                      txtHeight: 1.46.h),
                                  getVerSpace(9.h),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      getCustomFont(
                                          "Ticket : 1", 15.sp, Colors.black, 1,
                                          fontWeight: FontWeight.w500,
                                          txtHeight: 1.46.h),
                                      Container(
                                        decoration: BoxDecoration(
                                          color: lightAccent,
                                          borderRadius:
                                              BorderRadius.circular(12.h),
                                        ),
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 12.h, vertical: 6.h),
                                        child: getCustomFont(
                                            "\$${ticket['eventPrice']!}",
                                            15.sp,
                                            accentColor,
                                            1,
                                            fontWeight: FontWeight.w600,
                                            txtHeight: 1.46.h),
                                      )
                                    ],
                                  )
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          );
  }
}

class RPSCustomPainter extends CustomPainter {
  RPSCustomPainter({required this.right, required this.holeRadius});

  final double right;
  final double holeRadius;

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint_3 = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.h;

    final path2 = Path()
      ..moveTo(size.width - right - holeRadius, 0)
      ..lineTo(size.width - right - holeRadius, 0.0)
      ..arcToPoint(
        Offset(size.width - right, 0),
        clockwise: false,
        radius: Radius.circular(1.h),
      )
      ..quadraticBezierTo(size.width * 0.86, 0, size.width * 0.94, 0)
      ..quadraticBezierTo(
          size.width * 1.00, size.height * 0.00, size.width, size.height * 0.13)
      ..lineTo(size.width, size.height * 0.88)
      ..quadraticBezierTo(
          size.width * 1.00, size.height * 1.00, size.width * 0.94, size.height)
      ..lineTo(size.width - right, size.height)
      ..arcToPoint(
        Offset(size.width - right - holeRadius, size.height),
        clockwise: false,
        radius: Radius.circular(1.h),
      )
      ..quadraticBezierTo(size.width * 0.200000, size.height,
          size.width * 0.0625000, size.height)
      ..quadraticBezierTo(size.width * 0.0013375, size.height * 0.9976500, 0,
          size.height * 0.8750000)
      ..quadraticBezierTo(
          0, size.height * 0.1875000, 0, size.height * 0.1250000)
      ..quadraticBezierTo(size.width * 0.0031875, size.height * 0.0027500,
          size.width * 0.0625000, 0);

    path2.close();

    canvas.drawPath(path2, paint_3);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class DashedLineVerticalPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    double dashHeight = 5.h, dashSpace = 4.h, startY = 0;
    final paint = Paint()
      ..color = borderColor
      ..strokeWidth = 2.h;
    while (startY < size.height) {
      canvas.drawLine(Offset(0, startY), Offset(0, startY + dashHeight), paint);
      startY += dashHeight + dashSpace;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
