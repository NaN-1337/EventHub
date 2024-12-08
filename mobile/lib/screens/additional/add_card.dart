// ignore_for_file: avoid_renaming_method_parameters

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/globals.dart';
import 'package:mobile/utils/routes/app_routes.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';

class AddCardScreen extends StatefulWidget {
  const AddCardScreen({super.key});

  @override
  State<AddCardScreen> createState() => _AddCardScreenState();
}

class _AddCardScreenState extends State<AddCardScreen> {
  EditCardController controller = Get.put(EditCardController());

  void backClick() {
    Constant.backToPrev(context);
  }

  @override
  Widget build(BuildContext context) {
    
    Map<String, dynamic> args = Get.arguments;

    EventModel event = args['event'];
    int numberOfTickets = args['numberOfTickets'];

    final userProvider = Provider.of<UserProvider>(context);
    UserModel? currentUser = userProvider.currentUser;

    controller.cardNameController.text = "";
    controller.cardNumberController.text = "";
    controller.dateController.text = "";
    controller.cvvController.text = "";
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
          title: getCustomFont("Card Details", 24.sp, Colors.black, 1,
              fontWeight: FontWeight.w700, textAlign: TextAlign.center),
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
                    padding: EdgeInsets.symmetric(horizontal: 20.h),
                    primary: true,
                    shrinkWrap: true,
                    children: [
                      getVerSpace(20.h),
                      getCustomFont("Name On Card", 16.sp, Colors.black, 1,
                          fontWeight: FontWeight.w600, txtHeight: 1.5.h),
                      getVerSpace(4.h),
                      getDefaultTextFiledWithLabel(
                        context,
                        "Enter name on card",
                        controller.cardNameController,
                        isEnable: false,
                        height: 60.h,
                      ),
                      getVerSpace(20.h),
                      getCustomFont("Card Number", 16.sp, Colors.black, 1,
                          fontWeight: FontWeight.w600, txtHeight: 1.5.h),
                      getVerSpace(4.h),
                      getDefaultTextFiledWithLabel(
                        context,
                        "Enter card number",
                        controller.cardNumberController,
                        isEnable: false,
                        isPass: true,
                        height: 60.h,
                        length: 19,
                        obscuringCharacter: "x",
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          CardNumberFormatter(),
                        ],
                      ),
                      getVerSpace(20.h),
                      Row(
                        children: [
                          Expanded(
                              flex: 1,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  getCustomFont("MM/YY", 16.sp, Colors.black, 1,
                                      fontWeight: FontWeight.w600,
                                      txtHeight: 1.5.h),
                                  getVerSpace(4.h),
                                  getDefaultTextFiledWithLabel(
                                    context,
                                    "Enter expiry date",
                                    controller.dateController,
                                    isEnable: false,
                                    height: 60.h,
                                  ),
                                ],
                              )),
                          getHorSpace(20.h),
                          Expanded(
                              flex: 1,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  getCustomFont("CVV", 16.sp, Colors.black, 1,
                                      fontWeight: FontWeight.w600,
                                      txtHeight: 1.5.h),
                                  getVerSpace(4.h),
                                  getDefaultTextFiledWithLabel(
                                    context,
                                    "Enter CVV",
                                    controller.cvvController,
                                    isEnable: false,
                                    height: 60.h,
                                    length: 3,
                                    isPass: true,
                                    inputFormatters: [
                                      FilteringTextInputFormatter.digitsOnly,
                                    ],
                                  ),
                                ],
                              ))
                        ],
                      )
                    ],
                  )),
              getPaddingWidget(
                EdgeInsets.symmetric(horizontal: 20.h),
                getButton(context, accentColor, "Purchase", Colors.white, () {
                  for (int i = 0; i < numberOfTickets; i++) {
                    currentUser!.tickets.add(
                      {
                        "eventUid": event.uid,
                        "active": "true",
                        "eventName": event.name,
                        "eventDate": event.date,
                        "eventLocation": event.location,
                        "eventPrice": event.price
                      }
                    );
                  }
                  userRepository.updateUserField(currentUser!.docId!, "tickets", currentUser.tickets);
                  Constant.sendToNext(context, Routes.homeScreenRoute);
                }, 18.sp,
                    weight: FontWeight.w700,
                    buttonHeight: 60.h,
                    borderRadius: BorderRadius.circular(22.h)),
              ),
              getVerSpace(30.h)
            ],
          ),
        ),
      ),
    );
  }
}

class CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue previousValue,
    TextEditingValue nextValue,
  ) {
    var inputText = nextValue.text;

    if (nextValue.selection.baseOffset == 0) {
      return nextValue;
    }

    var bufferString =
    StringBuffer();
    for (int i = 0; i < inputText.length; i++) {
      bufferString.write(inputText[i]);
      var nonZeroIndexValue = i + 1;
      if (nonZeroIndexValue % 4 == 0 && nonZeroIndexValue != inputText.length) {
        bufferString.write(' ');
      }
    }

    var string = bufferString.toString();
    return nextValue.copyWith(
      text: string,
      selection: TextSelection.collapsed(
        offset: string.length,
      ),
    );
  }
}
