import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/events_provider.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';

class JoinedEventsTab extends StatefulWidget {
  const JoinedEventsTab({super.key});

  @override
  State<JoinedEventsTab> createState() => _JoinedEventsTabState();
}

class _JoinedEventsTabState extends State<JoinedEventsTab> {
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
      // logger.i("Joined Events: $joinedEvents");
      // logger.i("currentUser.joinedEvents: ${currentUser.joinedEvents}");
      // logger.i("events: $events");
    }

    return Column(
      children: [
        buildAppBar(),
        Divider(color: dividerColor, thickness: 1.h, height: 1.h),
        joinedEvents.isEmpty
            ? buildNullListWidget()
            : buildJoinedEventsList(joinedEvents)
      ],
    );
  }

  Expanded buildJoinedEventsList(List<EventModel> events) {
    return Expanded(
      flex: 1,
      child: GridView.builder(
          padding:
              EdgeInsets.only(left: 20.h, right: 20.h, bottom: 40.h, top: 20.h),
          itemCount: events.length,
          primary: true,
          shrinkWrap: true,
          itemBuilder: (context, index) {
            EventModel event = events[index];
            return Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22.h),
                  boxShadow: [
                    BoxShadow(
                        color: shadowColor,
                        offset: const Offset(0, 8),
                        blurRadius: 27)
                  ]),
              padding: EdgeInsets.only(top: 10.h, right: 10.h, left: 10.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 137.h,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(22.h),
                        image: DecorationImage(
                            image: AssetImage((int.tryParse(event.uid)! >= 1 && int.tryParse(event.uid)! <= 14) ? "${Constant.assetImagePath}${event.uid}.png" : "${Constant.assetImagePath}default.png"),
                            fit: BoxFit.cover)),
                    padding:
                        EdgeInsets.only(top: 10.h, left: 10.h, right: 10.h),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Wrap(
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                  color: '#B2000000'.toColor(),
                                  borderRadius: BorderRadius.circular(12.h)),
                              padding: EdgeInsets.symmetric(
                                  vertical: 4.h, horizontal: 10.h),
                              alignment: Alignment.center,
                              child: getCustomFont(
                                event.date,
                                13.sp,
                                Colors.white,
                                1,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        getAssetImage("favourite_select.png",
                            width: 24.h, height: 24.h)
                      ],
                    ),
                  ),
                  getVerSpace(12.h),
                  getCustomFont(
                      event.name, 18.sp, Colors.black, 1,
                      fontWeight: FontWeight.w600, txtHeight: 1.5.h),
                  getVerSpace(2.h),
                  Row(
                    children: [
                      getSvgImage("location.svg",
                          height: 20.h, width: 20.h, color: greyColor),
                      getHorSpace(5.h),
                      SizedBox(
                        width: 135.w,
                        child: getCustomFont(
                            event.location, 15.sp, greyColor, 1,
                            fontWeight: FontWeight.w500, txtHeight: 1.5.h),
                      )
                    ],
                  ),
                  getVerSpace(10.h),
                  Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 12.h, vertical: 6.h),
                    decoration: BoxDecoration(
                        color: lightAccent,
                        borderRadius: BorderRadius.circular(12.h)),
                    child: getCustomFont(
                        "${event.points} Points", 15.sp, accentColor, 1,
                        fontWeight: FontWeight.w600),
                  )
                ],
              ),
            );
          },
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 20.h,
              crossAxisSpacing: 20.h,
              mainAxisExtent: 266.h)),
    );
  }

  AppBar buildAppBar() {
    return getToolBar(() {},
        title: getCustomFont("Joined Events", 24.sp, Colors.black, 1,
            fontWeight: FontWeight.w700, textAlign: TextAlign.center),
        leading: false);
  }

  Expanded buildNullListWidget() {
    return Expanded(
        flex: 1,
        child: getPaddingWidget(
          EdgeInsets.symmetric(horizontal: 20.h),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                height: 208.h,
                width: 208.h,
                padding: EdgeInsets.symmetric(horizontal: 52.h, vertical: 47.h),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(187.h),
                    color: lightColor),
                child:
                    getAssetImage("valentine.png", height: 114.h, width: 114.h),
              ),
              getVerSpace(28.h),
              getCustomFont("No Joined Events Yet!", 20.sp, Colors.black, 1,
                  fontWeight: FontWeight.w700, txtHeight: 1.5.h),
              getVerSpace(8.h),
              getMultilineCustomFont(
                  "Explore more and shortlist events.", 16.sp, Colors.black,
                  fontWeight: FontWeight.w500, txtHeight: 1.5.h)
            ],
          ),
        ));
  }
}
