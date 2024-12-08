import 'package:dotted_line/dotted_line.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/providers/events_provider.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';

class TicketDetail extends StatefulWidget {
  const TicketDetail({super.key});

  @override
  State<TicketDetail> createState() => _TicketDetailState();
}

class _TicketDetailState extends State<TicketDetail> {
  void backClick() {
    Constant.sendToNext(context, Routes.homeScreenRoute);
  }

  @override
  Widget build(BuildContext context) {

    Map<String, String> ticket = Get.arguments;

    final eventsProvider = Provider.of<EventsProvider>(context);
    List<EventModel> events = eventsProvider.events;

    // get from the list of events the event that has the uid field equal to the ticket['eventUid']
    EventModel event = events.firstWhere((event) => event.uid == ticket['eventUid']);

    setStatusBarColor(Colors.white);
    return WillPopScope(
      onWillPop: () async {
        backClick();
        return false;
      },
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          toolbarHeight: 73.h,
          title: getCustomFont("My Ticket", 24.sp, Colors.black, 1,
              fontWeight: FontWeight.w700),
          centerTitle: true,
          leading: getPaddingWidget(
              EdgeInsets.only(top: 26.h, bottom: 23.h),
              GestureDetector(
                  onTap: () {
                    backClick();
                  },
                  child: getSvgImage("arrow_back.svg",
                      height: 24.h, width: 24.h))),
          actions: [
            getSvgImage("download.svg", width: 24.h, height: 24.h),
            getHorSpace(20.h)
          ],
        ),
        body: SafeArea(
          child: Column(
            children: [
              getDivider(
                dividerColor,
                1.h,
              ),
              getVerSpace(20.h),
              Container(
                margin: EdgeInsets.symmetric(horizontal: 20.h),
                width: double.infinity,
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22.h),
                    boxShadow: [
                      BoxShadow(
                          color: shadowColor,
                          offset: const Offset(0, 8),
                          blurRadius: 27)
                    ]),
                padding: EdgeInsets.symmetric(horizontal: 16.h),
                child: Column(
                  children: [
                    getVerSpace(16.h),
                    Container(
                      height: 183.h,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(22.h),
                          image: DecorationImage(
                              image: AssetImage(
                                  (int.tryParse(event.uid)! >= 1 && int.tryParse(event.uid)! <= 14) ? "${Constant.assetImagePath}${event.uid}.png" : "${Constant.assetImagePath}default.png"),
                              fit: BoxFit.fill)),
                    ),
                    getVerSpace(15.h),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            getCustomFont("Name", 15.sp, greyColor, 1,
                                fontWeight: FontWeight.w500, txtHeight: 1.46.h),
                            getVerSpace(4.h),
                            getCustomFont(
                                event.name, 18.sp, Colors.black, 1,
                                fontWeight: FontWeight.w600, txtHeight: 1.5.h)
                          ],
                        ),
                        getAssetImage("code.png", height: 50.h, width: 50.h)
                      ],
                    ),
                    getVerSpace(16.5.h),
                    DottedLine(
                      dashColor: borderColor,
                      dashGapLength: 3.h,
                      lineThickness: 1.h,
                    ),
                    getVerSpace(16.5.h),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          flex: 1,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              getCustomFont("Date", 15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500,
                                  txtHeight: 1.46.h),
                              getVerSpace(4.h),
                              getCustomFont(event.date, 18.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600,
                                  txtHeight: 1.5.h),
                              getVerSpace(30.h),
                              getCustomFont("Location", 15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500,
                                  txtHeight: 1.46.h),
                              getVerSpace(4.h),
                              getCustomFont(
                                  event.location, 18.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600,
                                  txtHeight: 1.5.h),
                              getVerSpace(30.h),
                              getCustomFont("Organizer", 15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500,
                                  txtHeight: 1.46.h),
                              getVerSpace(4.h),
                              getCustomFont(
                                  event.organizerName, 18.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600,
                                  txtHeight: 1.5.h),
                            ],
                          ),
                        ),
                        Expanded(
                          flex: 1,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              getCustomFont("Time", 15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500,
                                  txtHeight: 1.46.h),
                              getVerSpace(4.h),
                              getCustomFont("03:00 PM", 18.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600,
                                  txtHeight: 1.5.h),
                              getVerSpace(30.h),
                              getCustomFont("Seat", 15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500,
                                  txtHeight: 1.46.h),
                              getVerSpace(4.h),
                              getCustomFont("966", 18.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600,
                                  txtHeight: 1.5.h),
                              getVerSpace(30.h),
                              getCustomFont("Price", 15.sp, greyColor, 1,
                                  fontWeight: FontWeight.w500,
                                  txtHeight: 1.46.h),
                              getVerSpace(4.h),
                              getCustomFont("\$${event.price}", 18.sp, Colors.black, 1,
                                  fontWeight: FontWeight.w600,
                                  txtHeight: 1.5.h),
                            ],
                          ),
                        )
                      ],
                    ),
                    getVerSpace(16.h),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
