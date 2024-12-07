import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/data_file.dart';
import 'package:mobile/utils/modal/modal_select_interest.dart';
import 'package:mobile/utils/pref_data.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';

class SelectInterestScreen extends StatefulWidget {
  const SelectInterestScreen({super.key});

  @override
  State<SelectInterestScreen> createState() => _SelectInterestScreenState();
}

class _SelectInterestScreenState extends State<SelectInterestScreen> {
  void backClick() {
    Constant.sendToNext(context, Routes.loginRoute);
  }

  @override
  void initState() {
    super.initState();
    FlutterNativeSplash.remove();
  }

  List<ModalSelectInterest> selectIntersetList = DataFile.selectInterestList;

  @override
  Widget build(BuildContext context) {
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
          title: getCustomFont("Select Interests", 24.sp, Colors.black, 1,
              fontWeight: FontWeight.w700, textAlign: TextAlign.center),
        ),
        body: SafeArea(
          child: Column(
            children: [
              getDivider(
                dividerColor,
                1.h,
              ),
              getVerSpace(30.h),
              getPaddingWidget(
                EdgeInsets.symmetric(horizontal: 20.h),
                getMultilineCustomFont(
                    "Select a few of interests to match with events!",
                    16.sp,
                    Colors.black,
                    fontWeight: FontWeight.w500,
                    textAlign: TextAlign.center,
                    txtHeight: 1.5.h),
              ),
              getVerSpace(30.h),
              Expanded(
                  flex: 1,
                  child: Container(
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
                      children: [
                        getVerSpace(20.h),
                        Expanded(
                          flex: 1,
                          child: GridView.builder(
                            padding: EdgeInsets.symmetric(horizontal: 20.h),
                            itemCount: selectIntersetList.length,
                            itemBuilder: (context, index) {
                              ModalSelectInterest modalSelect =
                                  selectIntersetList[index];
                              return GestureDetector(
                                onTap: () {
                                  setState(() {
                                    if (modalSelect.select == true) {
                                      modalSelect.select = false;
                                    } else {
                                      modalSelect.select = true;
                                    }
                                  });
                                },
                                child: Stack(
                                  alignment: Alignment.bottomCenter,
                                  children: [
                                    SizedBox(
                                      height: 123.h,
                                      width: double.infinity,
                                      child: Container(
                                        decoration: BoxDecoration(
                                            color: modalSelect.color!.toColor(),
                                            borderRadius:
                                                BorderRadius.circular(22.h),
                                            border: modalSelect.select == true
                                                ? Border.all(
                                                    color: accentColor,
                                                    width: 2.h)
                                                : null),
                                        height: 111.h,
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.stretch,
                                          children: [
                                            getVerSpace(20.h),
                                            getAssetImage(
                                                modalSelect.image ?? '',
                                                height: 44.h,
                                                width: 44.h)
                                          ],
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      child: Container(
                                        height: 42.h,
                                        decoration: BoxDecoration(
                                          color: modalSelect.select == true
                                              ? accentColor
                                              : Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(22.h),
                                          boxShadow: [
                                            BoxShadow(
                                                color: "#2690B7B9".toColor(),
                                                offset: const Offset(0, 8),
                                                blurRadius: 27)
                                          ],
                                        ),
                                        alignment: Alignment.center,
                                        child: getCustomFont(
                                            modalSelect.name ?? '',
                                            15.sp,
                                            modalSelect.select == true
                                                ? Colors.white
                                                : Colors.black,
                                            1,
                                            fontWeight: FontWeight.w600),
                                      ),
                                    )
                                  ],
                                ),
                              );
                            },
                            gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 3,
                                    mainAxisExtent: 123.h,
                                    crossAxisSpacing: 19.h,
                                    mainAxisSpacing: 20.h),
                          ),
                        ),
                        getPaddingWidget(
                          EdgeInsets.symmetric(horizontal: 20.h),
                          getButton(
                              context, accentColor, "Continue", Colors.white,
                              () {
                            PrefData.setIsSignIn(true);
                            Constant.sendToNext(
                                context, Routes.homeScreenRoute);
                          }, 18.sp,
                              weight: FontWeight.w700,
                              buttonHeight: 60.h,
                              borderRadius: BorderRadius.circular(22.h)),
                        ),
                        getVerSpace(30.h)
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
