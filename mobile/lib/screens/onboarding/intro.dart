import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/data_file.dart';
import 'package:mobile/utils/modal/modal_intro.dart';
import 'package:mobile/utils/pref_data.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';

class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key});

  @override
  State<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  void backClick() {
    Constant.closeApp();
  }
  
  @override
  void initState() {
    super.initState();
    FlutterNativeSplash.remove();
  }

  IntroController controller = Get.put(IntroController());
  List<ModalIntro> introLists = DataFile.introList;

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        child: Scaffold(
          appBar: getColorStatusBar(bgColor),
          backgroundColor: bgColor,
          body: SafeArea(
            child: GetX<IntroController>(
              init: IntroController(),
              builder: (controller) => Stack(
                children: [
                  Column(
                    children: [
                      SizedBox(
                        height: 450.h,
                        width: double.infinity,
                      ),
                      getVerSpace(14.h),
                      Visibility(
                        visible: controller.select.value == 3 ? false : true,
                        child: Column(
                          children: [
                            Container(
                              height: 305.h,
                              width: double.infinity,
                              margin: EdgeInsets.symmetric(horizontal: 20.h),
                              decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(33.h),
                                  boxShadow: [
                                    BoxShadow(
                                        color: "#2690B7B9".toColor(),
                                        blurRadius: 27,
                                        offset: const Offset(0, 8))
                                  ]),
                            ),
                            getVerSpace(24.h),
                            GestureDetector(
                              onTap: () {
                                PrefData.setIsIntro(false);
                                Get.toNamed(Routes.loginRoute);
                              },
                              child: getCustomFont("Skip", 18.sp, greyColor, 1,
                                  fontWeight: FontWeight.w700,
                                  textAlign: TextAlign.center),
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                  PageView.builder(
                    physics: const BouncingScrollPhysics(),
                    controller: controller.pageController,
                    onPageChanged: (value) {
                      controller.selectedPage.value = value;
                      controller.change(value.obs);
                    },
                    itemCount: introLists.length,
                    itemBuilder: (context, index) {
                      ModalIntro modalIntro = introLists[index];
                      return Column(
                        children: [
                          getAssetImage(modalIntro.image ?? "",
                              height: 450.h, width: double.infinity),
                          getVerSpace(40.h),
                          Visibility(
                            visible:
                                controller.select.value == 3 ? false : true,
                            child: Column(
                              children: [
                                getPaddingWidget(
                                  EdgeInsets.symmetric(horizontal: 40.h),
                                  getMultilineCustomFont(modalIntro.title ?? "",
                                      24.sp, Colors.black,
                                      fontWeight: FontWeight.w700,
                                      txtHeight: 1.5.h,
                                      textAlign: TextAlign.center),
                                ),
                                getVerSpace(8.h),
                                getPaddingWidget(
                                  EdgeInsets.symmetric(horizontal: 40.h),
                                  getMultilineCustomFont(
                                      modalIntro.description ?? "",
                                      16.sp,
                                      Colors.black,
                                      fontWeight: FontWeight.w500,
                                      txtHeight: 1.5.h,
                                      textAlign: TextAlign.center),
                                )
                              ],
                            ),
                          )
                        ],
                      );
                    },
                  ),
                  Visibility(
                    visible: controller.select.value == 3 ? true : false,
                    child: Positioned(
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 20.h),
                        width: double.infinity,
                        margin: EdgeInsets.only(
                            left: 20.h, right: 20.h, top: 350.h),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(33.h),
                            boxShadow: [
                              BoxShadow(
                                  color: "#2690B7B9".toColor(),
                                  blurRadius: 27,
                                  offset: const Offset(0, 8))
                            ]),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            getVerSpace(25.h),
                            getMultilineCustomFont(
                                introLists[controller.select.value].title ?? "",
                                24.sp,
                                Colors.black,
                                fontWeight: FontWeight.w700,
                                textAlign: TextAlign.center,
                                txtHeight: 1.5.h),
                            getVerSpace(8.h),
                            getMultilineCustomFont(
                                introLists[controller.select.value]
                                        .description ??
                                    "",
                                16.sp,
                                Colors.black,
                                fontWeight: FontWeight.w500,
                                textAlign: TextAlign.center,
                                txtHeight: 1.5.h),
                            getVerSpace(20.h),
                            getButton(
                                context,
                                Colors.white,
                                "Continue With Phone",
                                Colors.black,
                                () {},
                                16.sp,
                                weight: FontWeight.w600,
                                buttonHeight: 60.h,
                                borderRadius: BorderRadius.circular(20.h),
                                borderColor: borderColor,
                                isBorder: true,
                                borderWidth: 1.h,
                                isIcon: true,
                                image: "smartphone.svg",
                                imageHeight: 24.h,
                                imageWidth: 24.h),
                            getVerSpace(20.h),
                            getButton(
                                context,
                                Colors.white,
                                "Continue With Facebook",
                                Colors.black,
                                () {},
                                16.sp,
                                weight: FontWeight.w600,
                                buttonHeight: 60.h,
                                borderRadius: BorderRadius.circular(20.h),
                                borderColor: borderColor,
                                isBorder: true,
                                borderWidth: 1.h,
                                isIcon: true,
                                image: "facebook.svg",
                                imageHeight: 24.h,
                                imageWidth: 24.h),
                            getVerSpace(20.h),
                            getButton(
                                context,
                                Colors.white,
                                "Continue With Google",
                                Colors.black,
                                () {},
                                16.sp,
                                weight: FontWeight.w600,
                                buttonHeight: 60.h,
                                borderRadius: BorderRadius.circular(20.h),
                                borderColor: borderColor,
                                isBorder: true,
                                borderWidth: 1.h,
                                isIcon: true,
                                image: "google.svg",
                                imageHeight: 24.h,
                                imageWidth: 24.h),
                            getVerSpace(30.h),
                            Row(
                              children: [
                                Expanded(
                                    child: getButton(context, Colors.white,
                                        "Log In", accentColor, () {
                                  PrefData.setIsIntro(false);

                                  Constant.sendToNext(
                                      context, Routes.loginRoute);
                                }, 18.sp,
                                        weight: FontWeight.w700,
                                        buttonHeight: 60.h,
                                        isBorder: true,
                                        borderColor: accentColor,
                                        borderWidth: 1.h,
                                        borderRadius:
                                            BorderRadius.circular(22.h))),
                                getHorSpace(20.h),
                                Expanded(
                                    child: getButton(context, accentColor,
                                        "Sign Up", Colors.white, () {
                                  PrefData.setIsIntro(false);
                                  Constant.sendToNext(
                                      context, Routes.signUpRoute);
                                }, 18.sp,
                                        weight: FontWeight.w700,
                                        buttonHeight: 60.h,
                                        borderRadius:
                                            BorderRadius.circular(22.h)))
                              ],
                            ),
                            getVerSpace(20.h),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Visibility(
                    visible: controller.select.value == 3 ? false : true,
                    child: Align(
                      alignment: Alignment.topCenter,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          getVerSpace(650.h),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(
                              introLists.length,
                              (position) {
                                return getPaddingWidget(
                                    EdgeInsets.symmetric(horizontal: 3.h),
                                    getSvgImage(
                                        position == controller.select.value
                                            ? "selected_dot.svg"
                                            : "dot.svg"));
                              },
                            ),
                          ),
                          getVerSpace(29.h),
                          getPaddingWidget(
                            EdgeInsets.symmetric(horizontal: 40.h),
                            getButton(
                                context,
                                accentColor,
                                controller.select.value == 2
                                    ? "Get Started"
                                    : "Next",
                                Colors.white, () {
                              if (controller.select.value <= 2) {
                                controller
                                    .change(controller.select.value.obs + 1);
                              }
                              controller.pageController.animateToPage(
                                  controller.select.value,
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeInSine);
                            }, 18.sp,
                                weight: FontWeight.w700,
                                borderRadius: BorderRadius.circular(22.h),
                                buttonHeight: 60.h),
                          ),
                          // getVerSpace(130.h),
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
        onWillPop: () async {
          backClick();
          return false;
        });
  }
}
