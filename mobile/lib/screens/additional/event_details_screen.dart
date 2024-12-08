import 'package:event_app/app/routes/app_routes.dart';
import 'package:event_app/base/color_data.dart';
import 'package:event_app/base/widget_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:readmore/readmore.dart';

import '../../../base/constant.dart';

class FeaturedEventDetail extends StatefulWidget {
  const FeaturedEventDetail({Key? key}) : super(key: key);

  @override
  State<FeaturedEventDetail> createState() => _FeaturedEventDetailState();
}

class _FeaturedEventDetailState extends State<FeaturedEventDetail> {
  void backClick() {
    Constant.backToPrev(context);
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () async {
          backClick();
          return false;
        },
        child: Scaffold(
          body: Container(
            height: double.infinity,
            width: double.infinity,
            color: Colors.white,
            child: Column(
              children: [
                Expanded(
                  flex: 1,
                  child: ListView(
                    children: [
                      buildImageWidget(),
                      getVerSpace(77.h),
                      buildTicketPrice(),
                      getVerSpace(20.h),
                      buildFollowWidget(context),
                      getVerSpace(20.h),
                      getPaddingWidget(
                        EdgeInsets.symmetric(horizontal: 20.h),
                        ReadMoreText(
                          'A news conference is often held when an organization wants members of the press to get an announcement simultaneously. The in-person events A news conference is often held when an organization wants members of the press to get an announcement ',
                          trimLines: 3,
                          trimMode: TrimMode.Line,
                          trimCollapsedText: 'Read more...',
                          trimExpandedText: 'Show less',
                          style: TextStyle(
                              color: greyColor,
                              fontWeight: FontWeight.w500,
                              fontSize: 15.sp,
                              height: 1.5.h),
                          lessStyle: TextStyle(
                              fontSize: 15.sp,
                              fontWeight: FontWeight.w600,
                              color: accentColor),
                          moreStyle: TextStyle(
                              fontSize: 15.sp,
                              fontWeight: FontWeight.w600,
                              color: accentColor),
                        ),
                      ),
                      getVerSpace(30.h),
                      buildLocationWidget(),
                      getVerSpace(22.h),
                      buildButtonWidget(context),
                      getVerSpace(22.h),
                    ],
                  ),
                )
              ],
            ),
          ),
        ));
  }

  Container buildLocationWidget() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20.h),
      height: 116.h,
      decoration: BoxDecoration(
          image: DecorationImage(
              image: AssetImage("${Constant.assetImagePath}location_image.png"),
              fit: BoxFit.fill),
          borderRadius: BorderRadius.circular(22.h)),
    );
  }

  Widget buildButtonWidget(BuildContext context) {
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      getButton(context, accentColor, "Buy Ticket", Colors.white, () {
        Constant.sendToNext(context, Routes.buyTicketRoute);
      }, 18.sp,
          weight: FontWeight.w700,
          buttonHeight: 60.h,
          borderRadius: BorderRadius.circular(22.h)),
    );
  }

  Widget buildFollowWidget(BuildContext context) {
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              getAssetImage("image.png", width: 58.h, height: 58.h),
              getHorSpace(10.h),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getCustomFont("Bella Flores", 18.sp, Colors.black, 1,
                      fontWeight: FontWeight.w600, txtHeight: 1.5.h),
                  getVerSpace(1.h),
                  getCustomFont("Organizer", 15.sp, greyColor, 1,
                      fontWeight: FontWeight.w500, txtHeight: 1.46.h)
                ],
              )
            ],
          ),
          getButton(context, Colors.white, "Follow", accentColor, () {}, 14.sp,
              weight: FontWeight.w700,
              buttonHeight: 40.h,
              buttonWidth: 76.h,
              isBorder: true,
              borderColor: accentColor,
              borderWidth: 1.h,
              borderRadius: BorderRadius.circular(14.h))
        ],
      ),
    );
  }

  Container buildTicketPrice() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20.h),
      padding: EdgeInsets.symmetric(horizontal: 16.h, vertical: 16.h),
      decoration: BoxDecoration(
          color: lightGrey, borderRadius: BorderRadius.circular(22.h)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          getRichText("Ticket Price ", Colors.black, FontWeight.w600, 15.sp,
              '(Economy)', greyColor, FontWeight.w500, 13.sp),
          getCustomFont("\$21.00", 20.sp, Colors.black, 1,
              fontWeight: FontWeight.w700)
        ],
      ),
    );
  }

  Stack buildImageWidget() {
    return Stack(
      alignment: Alignment.topCenter,
      clipBehavior: Clip.none,
      children: [
        Container(
          height: 327.h,
          width: double.infinity,
          decoration: BoxDecoration(
              borderRadius:
                  BorderRadius.vertical(bottom: Radius.circular(22.h)),
              image: DecorationImage(
                  image: AssetImage(
                      "${Constant.assetImagePath}feature_detail.png"),
                  fit: BoxFit.fill)),
          alignment: Alignment.topCenter,
          child: Container(
            height: 183.h,
            decoration: BoxDecoration(
                gradient: LinearGradient(
                    colors: [
                      darkShadow.withOpacity(0.6),
                      lightShadow.withOpacity(0.0)
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    stops: const [0.0, 1.0])),
            child: getPaddingWidget(
              EdgeInsets.only(top: 26.h, right: 20.h, left: 20.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  GestureDetector(
                    onTap: () {
                      backClick();
                    },
                    child: getSvgImage("arrow_back.svg",
                        width: 24.h, height: 24.h, color: Colors.white),
                  ),
                  getSvgImage(
                    "favourite_white.svg",
                    width: 24.h,
                    height: 24.h,
                  )
                ],
              ),
            ),
          ),
        ),
        Positioned(
            top: 255.h,
            width: 374.w,
            child: Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22.h),
                  boxShadow: [
                    BoxShadow(
                        color: shadowColor,
                        blurRadius: 27,
                        offset: const Offset(0, 8))
                  ]),
              padding: EdgeInsets.symmetric(horizontal: 16.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getVerSpace(16.h),
                  getCustomFont("National Creativity", 22.sp, Colors.black, 1,
                      fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                  getVerSpace(10.h),
                  Row(
                    children: [
                      getSvgImage("location.svg",
                          height: 20.h, width: 20.h, color: greyColor),
                      getHorSpace(5.h),
                      getCustomFont(
                        "California, USA",
                        15.sp,
                        greyColor,
                        1,
                        fontWeight: FontWeight.w500,
                      )
                    ],
                  ),
                  getVerSpace(10.h),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          getSvgImage("calender.svg",
                              width: 20.h, height: 20.h),
                          getHorSpace(5.h),
                          getCustomFont(
                            "20 July, 03:00 pm",
                            15.sp,
                            greyColor,
                            1,
                            fontWeight: FontWeight.w500,
                          )
                        ],
                      ),
                      Row(
                        children: [
                          Container(
                            padding: EdgeInsets.only(right: 67.h),
                            child: Stack(
                              clipBehavior: Clip.none,
                              children: [
                                getAssetImage("view1.png",
                                    width: 36.h, height: 36.h),
                                Positioned(
                                    left: 22.h,
                                    child: Stack(
                                      clipBehavior: Clip.none,
                                      children: [
                                        getAssetImage("view2.png",
                                            height: 36.h, width: 36.h),
                                        Positioned(
                                            left: 22.h,
                                            child: Stack(
                                              clipBehavior: Clip.none,
                                              children: [
                                                getAssetImage("view3.png",
                                                    height: 36.h, width: 36.h),
                                                Positioned(
                                                    left: 22.h,
                                                    child: Container(
                                                      height: 36.h,
                                                      width: 36.h,
                                                      decoration: BoxDecoration(
                                                          color: accentColor,
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      30.h),
                                                          border: Border.all(
                                                              color:
                                                                  Colors.white,
                                                              width: 1.5.h)),
                                                      alignment:
                                                          Alignment.center,
                                                      child: getCustomFont(
                                                          "+50",
                                                          12.sp,
                                                          Colors.white,
                                                          1,
                                                          fontWeight:
                                                              FontWeight.w600),
                                                    ))
                                              ],
                                            ))
                                      ],
                                    )),
                              ],
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                  getVerSpace(16.h),
                ],
              ),
            ))
      ],
    );
  }
}
