import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/screens/onboarding/signup/account_create_dialog.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:pinput/pinput.dart';

class VerifyScreen extends StatefulWidget {
  const VerifyScreen({super.key});

  @override
  State<VerifyScreen> createState() => _VerifyScreenState();
}

class _VerifyScreenState extends State<VerifyScreen> {
  void backClick() {
    Constant.backToPrev(context);
  }

  @override
  Widget build(BuildContext context) {
    final defaultPinTheme = PinTheme(
      width: 60.h,
      height: 60.h,
      margin: EdgeInsets.symmetric(horizontal: 14.h),
      textStyle: TextStyle(
          fontSize: 24.h,
          color: Colors.black,
          fontWeight: FontWeight.w700,
          fontFamily: Constant.fontsFamily),
      decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: borderColor, width: 1.h),
          borderRadius: BorderRadius.circular(22.h)),
    );
    setStatusBarColor(Colors.white);
    return WillPopScope(
      onWillPop: () async {
        backClick();
        return false;
      },
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.white,
        appBar: getToolBar(
          () {
            backClick();
          },
          title: getSvgImage("event_logo.svg", width: 72.h, height: 35.h),
        ),
        body: SafeArea(
          child: Column(
            children: [
              getDivider(
                dividerColor,
                1.h,
              ),
              getVerSpace(60.h),
              getCustomFont("Verify", 24.sp, Colors.black, 1,
                  fontWeight: FontWeight.w700,
                  textAlign: TextAlign.center,
                  txtHeight: 1.5.h),
              getVerSpace(8.h),
              getMultilineCustomFont(
                  "Enter code sent to your phone number!", 16.sp, Colors.black,
                  txtHeight: 1.5.h,
                  textAlign: TextAlign.center,
                  fontWeight: FontWeight.w500),
              getVerSpace(30.h),
              Expanded(
                  flex: 1,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 20.h),
                    decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius:
                            BorderRadius.vertical(top: Radius.circular(34.h)),
                        boxShadow: [
                          BoxShadow(
                              color: "#2B9CC3C6".toColor(),
                              blurRadius: 24,
                              offset: const Offset(0, -2))
                        ]),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        getVerSpace(50.h),
                        Pinput(
                          defaultPinTheme: defaultPinTheme,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                          ],
                          pinputAutovalidateMode:
                              PinputAutovalidateMode.onSubmit,
                          showCursor: true,
                          onCompleted: (pin) {},
                          length: 4,
                          mainAxisAlignment: MainAxisAlignment.center,
                        ),
                        getVerSpace(50.h),
                        getButton(context, accentColor, "Verify", Colors.white,
                            () {
                          showDialog(
                              builder: (context) {
                                return const AccountCreateDialog();
                              },
                              context: context);
                        }, 18.sp,
                            weight: FontWeight.w700,
                            buttonHeight: 60.h,
                            borderRadius: BorderRadius.circular(22.h)),
                        Expanded(
                          flex: 1,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              GestureDetector(
                                child: getRichText(
                                    "Don’t recieve code? / ",
                                    Colors.black,
                                    FontWeight.w500,
                                    15.sp,
                                    "Resend",
                                    Colors.black,
                                    FontWeight.w700,
                                    14.sp),
                                onTap: () {},
                              ),
                              getVerSpace(30.h)
                            ],
                          ),
                        )
                      ],
                    ),
                  ))
            ],
          ),
        ),
      ),
    );
  }
}
