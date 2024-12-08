import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/events_provider.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/dialog_widgets.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';
import 'package:readmore/readmore.dart';

class EventDetailsScreen extends StatefulWidget {
  
  const EventDetailsScreen({super.key});

  @override
  State<EventDetailsScreen> createState() => _EventDetailsScreenState();
}

class _EventDetailsScreenState extends State<EventDetailsScreen> {
  void backClick() {
    Constant.backToPrev(context);
  }

  @override
  Widget build(BuildContext context) {

    final docUid = Get.arguments;

    final userProvider = Provider.of<UserProvider>(context);
    UserModel? currentUser = userProvider.currentUser;

    final eventsProvider = Provider.of<EventsProvider>(context);
    List<EventModel> events = eventsProvider.events;

    EventModel? event = events.firstWhere((element) => element.uid == docUid);

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
                      buildImageWidget(event),
                      getVerSpace(77.h),
                      buildTicketPrice(event),
                      getVerSpace(20.h),
                      buildFollowWidget(context, event),
                      getVerSpace(20.h),
                      getPaddingWidget(
                        EdgeInsets.symmetric(horizontal: 20.h),
                        ReadMoreText(
                          event.description,
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
                      buildButtonWidget(context, currentUser!, event),
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

  Widget buildButtonWidget(BuildContext context, UserModel currentUser, EventModel event) {
    String buttonText = (event.organizer == "community") ? "Join" : "Buy Ticket  -  \$${event.price}";
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      getButton(context, accentColor, buttonText, Colors.white, () {

        loadingDialog(context);

        int updatedPoints = currentUser.xpPoints + event.points;
        int updatedLevel = updatedPoints ~/ 20 + 1; 
        List<String> updatedJoinedEvents = currentUser.joinedEvents;
        updatedJoinedEvents.add(event.uid);

        userRepository.updateUserField(currentUser.docId!, "xpPoints", updatedPoints);
        userRepository.updateUserField(currentUser.docId!, "level", updatedLevel);
        userRepository.updateUserField(currentUser.docId!, "joinedEvents", updatedJoinedEvents);

        Constant.sendToNext(context, Routes.homeScreenRoute);

        // if (event.organizer == "community") {
        //   // Constant.sendToNext(context, Routes.joinCommunityRoute);
        // } else {
        //   // Constant.sendToNext(context, Routes.buyTicketRoute);
        // }
      }, 18.sp,
          weight: FontWeight.w700,
          buttonHeight: 60.h,
          borderRadius: BorderRadius.circular(22.h)),
    );
  }

  Widget buildFollowWidget(BuildContext context, EventModel event) {
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              getCustomFont(event.organizerName, 18.sp, Colors.black, 1,
                  fontWeight: FontWeight.w600, txtHeight: 1.5.h),
              getVerSpace(1.h),
              getCustomFont("Organizer", 15.sp, greyColor, 1,
                  fontWeight: FontWeight.w500, txtHeight: 1.46.h)
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

  Container buildTicketPrice(EventModel event) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20.h),
      padding: EdgeInsets.symmetric(horizontal: 16.h, vertical: 16.h),
      decoration: BoxDecoration(
          color: lightGrey, borderRadius: BorderRadius.circular(22.h)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          getRichText("Points you will earn", Colors.black, FontWeight.w600, 15.sp,
              '', greyColor, FontWeight.w500, 13.sp),
          getCustomFont(event.points.toString(), 20.sp, Colors.black, 1,
              fontWeight: FontWeight.w700)
        ],
      ),
    );
  }

  Stack buildImageWidget(EventModel event) {
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
                      (int.tryParse(event.uid)! >= 1 && int.tryParse(event.uid)! <= 14) ? "${Constant.assetImagePath}${event.uid}.png" : "${Constant.assetImagePath}default.png"),
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
                  getCustomFont(event.name, 22.sp, Colors.black, 1,
                      fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                  getVerSpace(10.h),
                  Row(
                    children: [
                      getSvgImage("location.svg",
                          height: 20.h, width: 20.h, color: greyColor),
                      getHorSpace(5.h),
                      getCustomFont(
                        event.location,
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
                            event.date,
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
