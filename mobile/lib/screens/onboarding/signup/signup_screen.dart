import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  void backClick() {
    Constant.sendToNext(context, Routes.loginRoute);
  }

  SignUpController controller = Get.put(SignUpController());
  GlobalKey<FormState> signupFormKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    setStatusBarColor(Colors.white);
    return WillPopScope(
      onWillPop: () async {
        backClick();
        return false;
      },
      child: Scaffold(
        resizeToAvoidBottomInset: true,
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
              Expanded(
                  flex: 1,
                  child: ListView(
                    primary: true,
                    shrinkWrap: true,
                    physics: const BouncingScrollPhysics(),
                    children: [
                      getVerSpace(60.h),
                      getCustomFont("Sign Up", 24.sp, Colors.black, 1,
                          fontWeight: FontWeight.w700,
                          textAlign: TextAlign.center,
                          txtHeight: 1.5.h),
                      getVerSpace(8.h),
                      getMultilineCustomFont(
                          "Use your details for Create a new account!",
                          16.sp,
                          Colors.black,
                          txtHeight: 1.5.h,
                          textAlign: TextAlign.center,
                          fontWeight: FontWeight.w500),
                      getVerSpace(30.h),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 20.h),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.vertical(
                                top: Radius.circular(34.h)),
                            boxShadow: [
                              BoxShadow(
                                  color: "#2B9CC3C6".toColor(),
                                  blurRadius: 24,
                                  offset: const Offset(0, -2))
                            ]),
                        child: Form(
                          key: signupFormKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              getVerSpace(36.h),
                              getCustomFont("Full Name", 16.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600),
                              getVerSpace(7.h),
                              getDefaultTextFiledWithLabel(context,
                                  "Enter full name", controller.nameController,
                                  isEnable: false,
                                  height: 60.h,
                                  validator: controller.fullNamevalidator),
                              getVerSpace(24.h),
                              getCustomFont("Email", 16.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600),
                              getVerSpace(7.h),
                              getDefaultTextFiledWithLabel(context,
                                  "Enter email", controller.emailController,
                                  isEnable: false,
                                  height: 60.h,
                                  validator: controller.emailvalidator),
                              getVerSpace(24.h),
                              getCustomFont(
                                  "Phone Number", 16.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600),
                              getVerSpace(7.h),
                              GetX<SignUpController>(
                                init: SignUpController(),
                                builder: (controller) =>
                                    getDefaultTextFiledWithLabel(
                                        context,
                                        "Phone Number",
                                        controller.phoneController,
                                        isEnable: false,
                                        height: 60.h,
                                        validator: controller.phonevalidator,
                                        isprefix: true,
                                        prefix: GestureDetector(
                                          onTap: () {
                                            Get.toNamed(
                                                Routes.selectCountryRoute);
                                          },
                                          child: Row(
                                            children: [
                                              getHorSpace(18.h),
                                              getAssetImage(
                                                  controller.image.value),
                                              getHorSpace(12.h),
                                              getCustomFont(
                                                  controller.code.value,
                                                  16.sp,
                                                  greyColor,
                                                  1,
                                                  fontWeight: FontWeight.w500),
                                              getHorSpace(5.h),
                                              getSvgImage("arrow_down.svg",
                                                  width: 24.h, height: 24.h),
                                              getHorSpace(5.h),
                                            ],
                                          ),
                                        ),
                                        inputFormatters: <TextInputFormatter>[
                                          FilteringTextInputFormatter.allow(
                                              RegExp('[0-9.,]')),
                                        ],
                                        constraint: BoxConstraints(
                                            maxWidth: 135.h, maxHeight: 24.h)),
                              ),
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
                                  validator: controller.passwordvalidator,
                                  withSufix: true,
                                  suffiximage: "show.svg",
                                  isPass: true),
                              getVerSpace(20.h),
                              Row(
                                children: [
                                  GetX<SignUpController>(
                                    init: SignUpController(),
                                    builder: (controller) => GestureDetector(
                                      child: controller.check.value == true
                                          ? Container(
                                              height: 24.h,
                                              width: 24.h,
                                              decoration: BoxDecoration(
                                                  color: accentColor,
                                                  borderRadius:
                                                      BorderRadius.circular(
                                                          6.h)),
                                              alignment: Alignment.center,
                                              child: Icon(Icons.done,
                                                  color: Colors.white,
                                                  size: 20.h),
                                            )
                                          : getSvgImage("uncheck.svg",
                                              width: 24.h, height: 24.h),
                                      onTap: () {
                                        controller.onCheck();
                                      },
                                    ),
                                  ),
                                  getHorSpace(10.h),
                                  getCustomFont("I agree with Terms & Privacy",
                                      16.sp, Colors.black, 1,
                                      fontWeight: FontWeight.w500)
                                ],
                              ),
                              getVerSpace(36.h),
                              getButton(
                                  context, accentColor, "Sign Up", Colors.white,
                                  () {
                                Constant.sendToNext(context, Routes.selectInterestRoute, arguments: {
                                  "name": controller.nameController.text.toString(),
                                  "email": controller.emailController.text.toString(),
                                  "password": controller.passwordController.text.toString()
                                });
                              }, 18.sp,
                                  weight: FontWeight.w700,
                                  buttonHeight: 60.h,
                                  borderRadius: BorderRadius.circular(22.h)),
                              getVerSpace(40.h),
                              GestureDetector(
                                child: getRichText(
                                    "Already have an account? / ",
                                    Colors.black,
                                    FontWeight.w500,
                                    15.sp,
                                    "Login",
                                    Colors.black,
                                    FontWeight.w700,
                                    14.sp),
                                onTap: () {
                                  Constant.sendToNext(
                                      context, Routes.loginRoute);
                                },
                              ),
                              getVerSpace(30.h),
                            ],
                          ),
                        ),
                      )
                    ],
                  ))
            ],
          ),
        ),
      ),
    );
  }
}
