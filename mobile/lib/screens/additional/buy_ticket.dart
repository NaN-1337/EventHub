import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';

class BuyTicket extends StatefulWidget {
  const BuyTicket({super.key});

  @override
  State<BuyTicket> createState() => _BuyTicketState();
}

class _BuyTicketState extends State<BuyTicket> {
  void backClick() {
    Constant.backToPrev(context);
  }

  int selectedNGO = 0;
  BuyTicketController controller = Get.put(BuyTicketController());

  @override
  Widget build(BuildContext context) {

    EventModel event = Get.arguments;

    setStatusBarColor(Colors.white);
    return WillPopScope(
      onWillPop: () async {
        backClick();
        return false;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: getToolBar(
          () {
            backClick();
          },
          title: getCustomFont("Buy Ticket", 24.sp, Colors.black, 1,
              fontWeight: FontWeight.w700, textAlign: TextAlign.center),
        ),
        body: SafeArea(
          child: Column(
            children: [
              Divider(color: dividerColor, thickness: 1.h, height: 1.h),
              Expanded(
                  flex: 1,
                  child: ListView(
                    children: [
                      getVerSpace(15.h),
                      buildInfoCard(context),
                      getVerSpace(20.h),
                      buildChooseNGO(),
                      getVerSpace(30.h),
                      buildSeatWidget(),
                    ],
                  )),
              buildTotalWidget(context, event)
            ],
          ),
        ),
      ),
    );
  }

  Widget buildTotalWidget(BuildContext context, EventModel event) {
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              getCustomFont("Total", 22.sp, Colors.black, 1,
                  fontWeight: FontWeight.w700, txtHeight: 1.5.h),
              getCustomFont("\$${controller.count.value * double.parse(event.price)}", 22.sp, accentColor, 1,
                  fontWeight: FontWeight.w700, txtHeight: 1.5.h)
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              getCustomFont("Will be donated", 18.sp, Colors.black, 1,
                  fontWeight: FontWeight.w400, txtHeight: 1.5.h),
              getCustomFont("\$${0.25 * controller.count.value * double.parse(event.price)}", 18.sp, accentColor, 1,
                  fontWeight: FontWeight.w400, txtHeight: 1.5.h)
            ],
          ),
          getVerSpace(30.h),
          getButton(context, accentColor, "Checkout", Colors.white, () {
            Constant.sendToNext(context, Routes.addCardRoute, arguments: event);
          }, 18.sp,
              weight: FontWeight.w700,
              buttonHeight: 60.h,
              borderRadius: BorderRadius.circular(22.h)),
          getVerSpace(30.h),
        ],
      ),
    );
  }

  Column buildSeatWidget() {
    return Column(
      children: [
        getPaddingWidget(
          EdgeInsets.symmetric(horizontal: 20.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              getCustomFont("Number of Tickets", 17.sp, Colors.black, 1,
                  fontWeight: FontWeight.w600, txtHeight: 1.5.h),
            ],
          ),
        ),
        getVerSpace(10.h),
        GetX<BuyTicketController>(
          init: BuyTicketController(),
          builder: (controller) => Container(
            margin: EdgeInsets.symmetric(horizontal: 20.h),
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: borderColor, width: 1.h),
                borderRadius: BorderRadius.circular(22.h)),
            padding: EdgeInsets.symmetric(horizontal: 6.h, vertical: 6.h),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  child: Container(
                    decoration: BoxDecoration(
                        color: "#E8F6F6".toColor(),
                        borderRadius: BorderRadius.circular(18.h)),
                    height: 68.h,
                    width: 68.h,
                    padding: EdgeInsets.all(22.h),
                    child: getSvgImage("minus.svg", width: 24.h, height: 24.h),
                  ),
                  onTap: () {
                    if (controller.count.value == 0) {
                    } else {
                      controller.countChange(controller.count.obs.value--);
                    }
                    setState(() {});
                  },
                ),
                getCustomFont(
                    controller.count.value.toString(), 22.sp, Colors.black, 1,
                    fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                GestureDetector(
                  onTap: () {
                    controller.countChange(controller.count.obs.value++);
                    setState(() {});
                  },
                  child: Container(
                    decoration: BoxDecoration(
                        color: "#E8F6F6".toColor(),
                        borderRadius: BorderRadius.circular(18.h)),
                    height: 68.h,
                    width: 68.h,
                    padding: EdgeInsets.all(22.h),
                    child: getSvgImage("add.svg",
                        width: 24.h, height: 24.h, color: Colors.black),
                  ),
                )
              ],
            ),
          ),
        )
      ],
    );
  }

  Column buildChooseNGO() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        getPaddingWidget(
          EdgeInsets.symmetric(horizontal: 20.h),
          getCustomFont("Choose NGO", 17.sp, Colors.black, 1,
              fontWeight: FontWeight.w600, txtHeight: 1.5.h),
        ),
        getVerSpace(10.h),
        GestureDetector(
          onTap: () {
            setState(() {
              selectedNGO = 0;
            });
          },
          child: Container(
            margin: EdgeInsets.symmetric(horizontal: 20.h),
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: borderColor, width: 1.h),
                borderRadius: BorderRadius.circular(22.h)),
            padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 15.h),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    getAssetImage("salvaticopiii.png", width: 40.h, height: 40.h),
                    getHorSpace(10.h),
                    getCustomFont("Salvati Copiii", 16.sp, Colors.black, 1,
                        fontWeight: FontWeight.w500, txtHeight: 1.5.h)
                  ],
                ),
                GetX<PaymentController>(
                  builder: (controller) => getSvgImage(
                      selectedNGO == 0
                          ? "checkRadio.svg"
                          : "uncheckRadio.svg",
                      width: 24.h,
                      height: 24.h),
                  init: PaymentController(),
                )
              ],
            ),
          ),
        ),
        getVerSpace(15.h),
        GestureDetector(
          onTap: () {
            setState(() {
              selectedNGO = 1;
            });
          },
          child: Container(
            margin: EdgeInsets.symmetric(horizontal: 20.h),
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: borderColor, width: 1.h),
                borderRadius: BorderRadius.circular(22.h)),
            padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 15.h),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    getAssetImage("adouacasa.png", width: 40.h, height: 40.h),
                    getHorSpace(10.h),
                    getCustomFont("Adouacasa", 16.sp, Colors.black, 1,
                        fontWeight: FontWeight.w500, txtHeight: 1.5.h)
                  ],
                ),
                GetX<PaymentController>(
                  builder: (controller) => getSvgImage(
                      selectedNGO == 1
                          ? "checkRadio.svg"
                          : "uncheckRadio.svg",
                      width: 24.h,
                      height: 24.h),
                  init: PaymentController(),
                )
              ],
            ),
          ),
        ),
        getVerSpace(15.h),
        GestureDetector(
          onTap: () {
            setState(() {
              selectedNGO = 2;
            });
          },
          child: Container(
            margin: EdgeInsets.symmetric(horizontal: 20.h),
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: borderColor, width: 1.h),
                borderRadius: BorderRadius.circular(22.h)),
            padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 15.h),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    getAssetImage("kolakariola.jpg", width: 40.h, height: 40.h),
                    getHorSpace(10.h),
                    getCustomFont("Kola Kariola", 16.sp, Colors.black, 1,
                        fontWeight: FontWeight.w500, txtHeight: 1.5.h)
                  ],
                ),
                GetX<PaymentController>(
                  builder: (controller) => getSvgImage(
                      selectedNGO == 2
                          ? "checkRadio.svg"
                          : "uncheckRadio.svg",
                      width: 24.h,
                      height: 24.h),
                  init: PaymentController(),
                )
              ],
            ),
          ),
        ),
        getVerSpace(15.h),
        GestureDetector(
          onTap: () {
            setState(() {
              selectedNGO = 3;
            });
          },
          child: Container(
            margin: EdgeInsets.symmetric(horizontal: 20.h),
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: borderColor, width: 1.h),
                borderRadius: BorderRadius.circular(22.h)),
            padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 15.h),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    getAssetImage("roha.jpg", width: 40.h, height: 40.h),
                    getHorSpace(10.h),
                    getCustomFont("Asociația ROHA", 16.sp, Colors.black, 1,
                        fontWeight: FontWeight.w500, txtHeight: 1.5.h)
                  ],
                ),
                GetX<PaymentController>(
                  builder: (controller) => getSvgImage(
                      selectedNGO == 3
                          ? "checkRadio.svg"
                          : "uncheckRadio.svg",
                      width: 24.h,
                      height: 24.h),
                  init: PaymentController(),
                )
              ],
            ),
          ),
        )
      ],
    );
  }

  Widget buildInfoCard(BuildContext context) {
    return getPaddingWidget(
      EdgeInsets.symmetric(horizontal: 20.h),
      Container(
        width: double.infinity,
        decoration: BoxDecoration(
            color: '#F4FEFE'.toColor(),
            borderRadius: BorderRadius.circular(22.h),
            border: Border.all(color: accentColor, width: 0.5.h)
          ),
        padding: EdgeInsets.symmetric(horizontal: 20.h, vertical: 20.h),
        child: getCustomFont(
                    "Organizer decided to donate 25% of its income to various NGOs.", 16.sp, accentColor, 10,
                    fontWeight: FontWeight.w600, txtHeight: 1.46.h),
      )
    );
  }
}
