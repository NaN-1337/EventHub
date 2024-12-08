import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  void backClick() {
    Constant.closeApp();
  }

  @override
  void initState() {
    super.initState();
    FlutterNativeSplash.remove();
  }

  LoginController controller = Get.put(LoginController());

  @override
  Widget build(BuildContext context) {
    setStatusBarColor(Colors.white);
    return WillPopScope(
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
                getCustomFont("Log In", 24.sp, Colors.black, 1,
                    fontWeight: FontWeight.w700,
                    textAlign: TextAlign.center,
                    txtHeight: 1.5.h),
                getVerSpace(8.h),
                getMultilineCustomFont(
                    "Use your credentials and login to your account",
                    16.sp,
                    Colors.black,
                    txtHeight: 1.5.h,
                    textAlign: TextAlign.center,
                    fontWeight: FontWeight.w500),
                getVerSpace(38.h),
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
                      child: Form(
                        key: controller.loginFormKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            getVerSpace(30.h),
                            getCustomFont("Email", 16.sp, Colors.black, 1,
                                fontWeight: FontWeight.w600),
                            getVerSpace(7.h),
                            getDefaultTextFiledWithLabel(context, "Enter email",
                                controller.emailController,
                                isEnable: false,
                                height: 60.h,
                                validator: controller.emailvalidator),
                            getVerSpace(24.h),
                            getCustomFont("Password", 16.sp, Colors.black, 1,
                                fontWeight: FontWeight.w600),
                            getVerSpace(7.h),
                            getDefaultTextFiledWithLabel(
                                context,
                                "Enter password",
                                controller.passwordController,
                                isEnable: false,
                                height: 60.h,
                                withSufix: true,
                                suffiximage: "show.svg",
                                validator: controller.passwordvalidator,
                                isPass: true),
                            getVerSpace(20.h),
                            GestureDetector(
                              onTap: () {
                                // Constant.sendToNext(
                                //     context, Routes.forgotPasswordRoute);
                              },
                              child: getCustomFont(
                                  "Forgot Password?", 14.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w700,
                                  textAlign: TextAlign.end),
                            ),
                            getVerSpace(36.h),
                            getButton(
                                context, accentColor, "Log In", Colors.white,
                                () {
                                  authRepository.signIn(context, controller.emailController.text, controller.passwordController.text);
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
                                        "If you are new / ",
                                        Colors.black,
                                        FontWeight.w500,
                                        15.sp,
                                        "Create New Account",
                                        Colors.black,
                                        FontWeight.w700,
                                        14.sp),
                                    onTap: () {
                                      Constant.sendToNext(
                                          context, Routes.signUpRoute);
                                    },
                                  ),
                                  getVerSpace(38.h)
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    )),
              ],
            ),
          ),
        ),
        onWillPop: () async {
          backClick();
          return false;
        });
  }
}
