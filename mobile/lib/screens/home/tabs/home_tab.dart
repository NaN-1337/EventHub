import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/events_provider.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/data_file.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/modal/modal_event_category.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';

Map<String, String> firebaseCategory = {
  "Music": "music",
  "Sports": "sports",
  "Travel": "travel",
  "Culture": "culture",
  "Community Involvement": "community_involvement",
  "Entertainment": "entertainment",
};

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  HomeScreenController controller = Get.put(HomeScreenController());
  List<ModalEventCategory> eventCategoryLists = DataFile.eventCategoryList;
  String selectedCategory = "All";

  @override
  void initState() {
    super.initState();
    FlutterNativeSplash.remove();
  }

  @override
  Widget build(BuildContext context) {

    final userProvider = Provider.of<UserProvider>(context);
    UserModel? currentUser = userProvider.currentUser;

    final eventsProvider = Provider.of<EventsProvider>(context);
    List<EventModel> events = eventsProvider.events;

    // Filter joined events
    List<EventModel> joinedEvents = [];
    if (currentUser != null && currentUser.joinedEvents.isNotEmpty) {
      joinedEvents = eventRepository.getJoinedEvents(events, currentUser.joinedEvents);
    }

    // Filter recommended events
    List<EventModel> recommendedEvents = [];
    if (currentUser != null && currentUser.preferences.isNotEmpty) {
      recommendedEvents = eventRepository.getRecommendedEvents(events, currentUser.preferences);
      if (selectedCategory != "All") {
        recommendedEvents = recommendedEvents.where((event) => event.category == selectedCategory).toList();
      }
    }

    List<EventModel> feelingEvents = [];

    return Column(
      children: [
        buildAppBar(),

        getVerSpace(20.h),

        buildSearchWidget(context),
        
        getVerSpace(24.h),
        Expanded(
            flex: 1,
            child: ListView(
              primary: true,
              shrinkWrap: true,
              children: [
                // FEELING SECTION
                getPaddingWidget(
                  EdgeInsets.symmetric(horizontal: 20.h),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      getCustomFont("Maybe you feel like...", 20.sp, Colors.black, 1,
                          fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                      GestureDetector(
                        onTap: () {
                          // Constant.sendToNext(
                          //     context, Routes.featureEventListRoute);
                        },
                        child: getCustomFont("View All", 15.sp, greyColor, 1,
                            fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                      )
                    ],
                  ),
                ),
                getVerSpace(12.h),
                if (feelingEvents.isNotEmpty)
                  buildFeelingEventList(context, feelingEvents)
                else
                  feelingsPlaceholder(),

                getVerSpace(24.h),

                // RECOMMENDED SECTION
                getPaddingWidget(
                  EdgeInsets.symmetric(horizontal: 20.h),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      getCustomFont("Recommended Events", 20.sp, Colors.black, 1,
                          fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                      GestureDetector(
                        onTap: () {
                          // Constant.sendToNext(
                          //     context, Routes.trendingScreenRoute);
                        },
                        child: getCustomFont("View All", 15.sp, greyColor, 1,
                            fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                      )
                    ],
                  ),
                ),
                getVerSpace(12.h),
                buildRecommendedCategoryList(),
                getVerSpace(20.h),
                buildRecommendedEventList(recommendedEvents),

                // ALL SECTION
                getPaddingWidget(
                  EdgeInsets.symmetric(horizontal: 20.h),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      getCustomFont("All Events", 20.sp, Colors.black, 1,
                          fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                      GestureDetector(
                        onTap: () {
                          // Constant.sendToNext(
                          //     context, Routes.popularEventListRoute);
                        },
                        child: getCustomFont("View All", 15.sp, greyColor, 1,
                            fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                      )
                    ],
                  ),
                ),
                getVerSpace(12.h),
                buildAllEventList(events),
                getVerSpace(40.h),
              ],
            ))
      ],
    );
  }

  ListView buildAllEventList(List<EventModel> events) {
    return ListView.builder(
      padding: EdgeInsets.symmetric(horizontal: 20.h),
      itemCount: (events.length > 5) ? 5 : events.length,
      primary: false,
      shrinkWrap: true,
      itemBuilder: (context, index) {
        EventModel event = events[index];
        return Container(
          margin: EdgeInsets.only(bottom: 20.h),
          decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                    color: shadowColor,
                    blurRadius: 27,
                    offset: const Offset(0, 8))
              ],
              borderRadius: BorderRadius.circular(22.h)),
          padding: EdgeInsets.only(top: 14.h, left: 7.h, bottom: 13.h, right: 20.h),
          child: Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(15.0),
                      child: getAssetImage((int.tryParse(event.uid)! >= 1 && int.tryParse(event.uid)! <= 14) ? "${event.uid}.png" : "default.png",
                          width: 60.h, height: 60.h, boxFit: BoxFit.cover),
                    ),
                    getHorSpace(10.h),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          width: 200.w,
                          child: getCustomFont(event.name, 18.sp,
                              Colors.black, 1,
                              fontWeight: FontWeight.w600, txtHeight: 1.5.h),
                        ),
                        getVerSpace(4.h),
                        getCustomFont(
                            event.date, 15.sp, greyColor, 1,
                            fontWeight: FontWeight.w500, txtHeight: 1.46.h)
                      ],
                    )
                  ],
                ),
              ),
              Container(
                height: 34.h,
                decoration: BoxDecoration(
                    color: lightAccent,
                    borderRadius: BorderRadius.circular(12.h)),
                alignment: Alignment.center,
                padding: EdgeInsets.symmetric(horizontal: 12.h),
                child: getCustomFont(
                    "${event.points} Points", 15.sp, accentColor, 1,
                    fontWeight: FontWeight.w600, txtHeight: 1.46.h),
              )
            ],
          ),
        );
      },
    );
  }

  SizedBox buildRecommendedEventList(List<EventModel> recommendedEvents) {
    return SizedBox(
      height: 289.h,
      child: ListView.builder(
        primary: false,
        shrinkWrap: true,
        itemCount: (recommendedEvents.length > 5) ? 5 : recommendedEvents.length,
        physics: const BouncingScrollPhysics(),
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index) {
          EventModel event = recommendedEvents[index];
          return GestureDetector(
            onTap: () {
              // Constant.sendToNext(context, Routes.featuredEventDetailRoute);
            },
            child: Container(
              margin: EdgeInsets.only(right: 20.h, left: index == 0 ? 20.h : 0),
              child: Stack(
                alignment: Alignment.topCenter,
                children: [
                  Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(22.h),
                        image: DecorationImage(
                            image: AssetImage((int.tryParse(event.uid)! >= 1 && int.tryParse(event.uid)! <= 14) ? "${Constant.assetImagePath}${event.uid}.png" : "${Constant.assetImagePath}default.png"),
                            fit: BoxFit.fill)),
                    height: 170.h,
                    width: 248.h,
                    padding: EdgeInsets.only(left: 12.h, top: 12.h),
                    child: Wrap(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                              color: "#B2000000".toColor(),
                              borderRadius: BorderRadius.circular(12.h)),
                          padding: EdgeInsets.symmetric(
                              vertical: 4.h, horizontal: 10.h),
                          child: getCustomFont(event.date,
                              13.sp, Colors.white, 1,
                              fontWeight: FontWeight.w600, txtHeight: 1.69.h),
                        ),
                      ],
                    ),
                  ),
                  Positioned(
                    width: 230.h,
                    top: 132.h,
                    child: Container(
                      decoration: BoxDecoration(
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                                color: shadowColor,
                                blurRadius: 27,
                                offset: const Offset(0, 8))
                          ],
                          borderRadius: BorderRadius.circular(22.h)),
                      padding: EdgeInsets.symmetric(horizontal: 16.h),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          getVerSpace(16.h),
                          getCustomFont(event.name, 18.sp,
                              Colors.black, 1,
                              fontWeight: FontWeight.w600, txtHeight: 1.5.h),
                          getVerSpace(3.h),
                          Row(
                            children: [
                              getSvgImage("location.svg",
                                  width: 20.h, height: 20.h, color: greyColor),
                              getHorSpace(5.h),
                              getCustomFont(event.location,
                                  15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500, txtHeight: 1.5.h)
                            ],
                          ),
                          getVerSpace(16.h),
                        ],
                      ),
                      // height: 133.h,
                    ),
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  SizedBox buildRecommendedCategoryList() {
    return SizedBox(
      height: 50.h,
      child: ListView.builder(
        primary: false,
        shrinkWrap: true,
        itemCount: eventCategoryLists.length,
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index) {
          ModalEventCategory modalEventCategory = eventCategoryLists[index];
          return GestureDetector(
            onTap: () {
              controller.onChange(index.obs);
              selectedCategory = firebaseCategory[modalEventCategory.name] ?? "All";
              setState(() {});
            },
            child: GetX<HomeScreenController>(
              init: HomeScreenController(),
              builder: (controller) => Container(
                margin:
                    EdgeInsets.only(right: 12.h, left: index == 0 ? 20.h : 0),
                height: 50.h,
                decoration: BoxDecoration(
                    color: controller.select.value == index
                        ? accentColor
                        : lightColor,
                    borderRadius: BorderRadius.circular(22.h)),
                alignment: Alignment.center,
                child: modalEventCategory.image == ""
                    ? getPaddingWidget(
                        EdgeInsets.symmetric(
                          horizontal: 20.h,
                        ),
                        getCustomFont(
                            modalEventCategory.name ?? "",
                            16.sp,
                            controller.select.value == index
                                ? Colors.white
                                : Colors.black,
                            1,
                            fontWeight: FontWeight.w600,
                            textAlign: TextAlign.center),
                      )
                    : Row(
                        children: [
                          Row(
                            children: [
                              getPaddingWidget(
                                EdgeInsets.only(
                                    left: 3.h, top: 3.h, bottom: 3.h),
                                Container(
                                  height: 44.h,
                                  width: 44.h,
                                  decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius:
                                          BorderRadius.circular(20.h)),
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 9.h, vertical: 9.h),
                                  child: getAssetImage(
                                      modalEventCategory.image ?? "",
                                      height: 26.h,
                                      width: 26.h),
                                ),
                              ),
                              getHorSpace(10.h),
                            ],
                          ),
                          getCustomFont(
                            modalEventCategory.name ?? '',
                            16.sp,
                            controller.select.value == index
                                ? Colors.white
                                : Colors.black,
                            1,
                            fontWeight: FontWeight.w600,
                          ),
                          getHorSpace(13.h)
                        ],
                      ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget feelingsPlaceholder() {
    return Container(
      width: 374.h,
      height: 196.h,
      margin: EdgeInsets.only(right: 20.h, left: 20.h),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22.h),
        image: DecorationImage(
            image: AssetImage("${Constant.assetImagePath}feelings.png"),
                  fit: BoxFit.fill),
      ),
      child: GestureDetector(
        onTap: () {
          Constant.sendToNext(context, Routes.moodQuestionsRoute);
        },
        child: Stack(
          children: [
            Container(
              height: 196.h,
              width: double.infinity,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22.h),
                  gradient: LinearGradient(
                      colors: [
                        "#000000".toColor().withOpacity(0.05),
                        "#000000".toColor().withOpacity(0.65)
                      ],
                      stops: const [
                        0.0,
                        1.0
                      ],
                      begin: Alignment.centerRight,
                      end: Alignment.centerLeft)),
              padding: EdgeInsets.only(left: 24.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  getCustomFont("How are you feeling today?", 20.sp,
                      Colors.white, 1,
                      fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                  getVerSpace(4.h),
                  Row(
                    children: [
                      getCustomFont("Get recommendations based on your mood",
                          15.sp, Colors.white, 1,
                          fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                    ],
                  ),
                  getVerSpace(22.h),
                  getButton(context, accentColor, "Tell us",
                      Colors.white, () {}, 14.sp,
                      weight: FontWeight.w700,
                      buttonHeight: 40.h,
                      borderRadius: BorderRadius.circular(14.h),
                      buttonWidth: 111.h)
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  SizedBox buildFeelingEventList(BuildContext context, List<EventModel> feelingEvents) {
    return SizedBox(
      height: 196.h,
      child: ListView.builder(
        primary: false,
        shrinkWrap: true,
        physics: const BouncingScrollPhysics(),
        scrollDirection: Axis.horizontal,
        itemCount: (feelingEvents.length > 5) ? 5 : feelingEvents.length,
        itemBuilder: (context, index) {
          EventModel event = feelingEvents[index];
          return Container(
            width: 374.h,
            height: 196.h,
            margin: EdgeInsets.only(right: 20.h, left: index == 0 ? 20.h : 0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22.h),
              image: DecorationImage(
                  image: AssetImage((int.tryParse(event.uid)! >= 1 && int.tryParse(event.uid)! <= 14) ? "${Constant.assetImagePath}${event.uid}.png" : "${Constant.assetImagePath}default.png"),
                  fit: BoxFit.fill),
            ),
            child: GestureDetector(
              onTap: () {
                // Constant.sendToNext(context, Routes.featuredEventDetailRoute);
              },
              child: Stack(
                children: [
                  Container(
                    height: 196.h,
                    width: double.infinity,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(22.h),
                        gradient: LinearGradient(
                            colors: [
                              "#000000".toColor().withOpacity(0.0),
                              "#000000".toColor().withOpacity(0.88)
                            ],
                            stops: const [
                              0.0,
                              1.0
                            ],
                            begin: Alignment.centerRight,
                            end: Alignment.centerLeft)),
                    padding: EdgeInsets.only(left: 24.h),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        getCustomFont(event.name, 20.sp,
                            Colors.white, 1,
                            fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                        getVerSpace(4.h),
                        Row(
                          children: [
                            getSvgImage("location.svg",
                                width: 20.h, height: 20.h),
                            getHorSpace(5.h),
                            getCustomFont(event.location,
                                15.sp, Colors.white, 1,
                                fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                          ],
                        ),
                        getVerSpace(22.h),
                        getButton(context, accentColor, "Book Now",
                            Colors.white, () {}, 14.sp,
                            weight: FontWeight.w700,
                            buttonHeight: 40.h,
                            borderRadius: BorderRadius.circular(14.h),
                            buttonWidth: 111.h)
                      ],
                    ),
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget buildSearchWidget(BuildContext context) {
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      getDefaultTextFiledWithLabel(
          context, "Search events...", controller.searchController,
          isEnable: false,
          isprefix: true,
          prefix: Row(
            children: [
              getHorSpace(18.h),
              getSvgImage("search.svg", height: 24.h, width: 24.h),
            ],
          ),
          constraint: BoxConstraints(maxHeight: 24.h, maxWidth: 55.h),
          vertical: 18,
          horizontal: 16),
    );
  }

  Widget buildAppBar() {
    return getPaddingWidget(
      EdgeInsets.only(left: 20.h),
      getToolBarWithIcon(() {},
          leading: getSvgImage('event_logo.svg', height: 35.h, width: 72.h),
          action: [
            Container(
              height: 50.h,
              width: 50.h,
              margin: EdgeInsets.only(top: 18.h, right: 20.h),
              padding: EdgeInsets.symmetric(vertical: 13.h, horizontal: 13.h),
              decoration: BoxDecoration(
                  color: lightColor, borderRadius: BorderRadius.circular(22.h)),
              child: GestureDetector(
                  onTap: () {
                    // Constant.sendToNext(
                    //     context, Routes.notificationScreenRoute);
                  },
                  child: getSvgImage("notification.svg",
                      height: 24.h, width: 24.h)),
            )
          ]),
    );
  }
}
