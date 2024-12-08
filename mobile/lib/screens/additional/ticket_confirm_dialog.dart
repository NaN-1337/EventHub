import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';

class TicketConfirmDialog extends StatefulWidget {
  const TicketConfirmDialog({super.key});

  @override
  State<TicketConfirmDialog> createState() => _TicketConfirmDialogState();
}

class _TicketConfirmDialogState extends State<TicketConfirmDialog> {
  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(37.h)),
      insetPadding: EdgeInsets.symmetric(horizontal: 20.h),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        mainAxisSize: MainAxisSize.min,
        children: [
          getVerSpace(30.h),
          Container(
            height: 190.h,
            decoration: BoxDecoration(
                color: lightColor,
                borderRadius:
                    BorderRadius.vertical(top: Radius.circular(34.h))),
            width: double.infinity,
            margin: EdgeInsets.symmetric(horizontal: 30.h),
            child: Column(
              children: [
                getVerSpace(40.h),
                getAssetImage("password1.png", width: 90.h, height: 90.h)
              ],
            ),
          ),
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(37.h),
                boxShadow: [
                  BoxShadow(
                      color: '#2B9CC3C6'.toColor(),
                      offset: const Offset(0, -2),
                      blurRadius: 24)
                ]),
            child: Column(
              children: [
                getVerSpace(30.h),
                getCustomFont("Ticket Confirmed!", 22.sp, Colors.black, 1,
                    fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                getVerSpace(8.h),
                getMultilineCustomFont(
                    "Your ticket successfully confirmed.", 16.sp, Colors.black,
                    fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                getVerSpace(30.h),
                getPaddingWidget(
                  EdgeInsets.symmetric(horizontal: 30.h),
                  getButton(context, accentColor, "Return to Home Screen", Colors.white, () {
                    Constant.sendToNext(context, Routes.homeScreenRoute);
                  }, 18.sp,
                      weight: FontWeight.w700,
                      buttonHeight: 60.h,
                      borderRadius: BorderRadius.circular(22.h)),
                ),
                getVerSpace(30.h),
              ],
            ),
          )
        ],
      ),
    );
  }
}
