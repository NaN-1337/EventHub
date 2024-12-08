// ignore_for_file: avoid_renaming_method_parameters

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/widget_utils.dart';

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

    EventModel event = Get.arguments;

    controller.cardNameController.text = "Jenny Wilson";
    controller.cardNumberController.text = "1234567891012345021";
    controller.dateController.text = "12/24";
    controller.cvvController.text = "123";
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
          title: getCustomFont("Edit Card", 24.sp, Colors.black, 1,
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
                                    onChanged: (value) {
                                      setState(() {
                                        value =
                                            value.replaceAll(RegExp(r"\D"), "");
                                        switch (value.length) {
                                          case 0:
                                            controller
                                                    .dateController.selection =
                                                const TextSelection.collapsed(
                                                    offset: 0);
                                            break;
                                          case 1:
                                            controller.dateController.text =
                                                "$value/";
                                            controller
                                                    .dateController.selection =
                                                const TextSelection.collapsed(
                                                    offset: 1);
                                            break;
                                          case 2:
                                            controller.dateController.text =
                                                "$value/";
                                            controller
                                                    .dateController.selection =
                                                const TextSelection.collapsed(
                                                    offset: 2);
                                            break;
                                          case 3:
                                            controller.dateController.text =
                                                "${value.substring(0, 2)}/${value.substring(2)}";
                                            controller
                                                    .dateController.selection =
                                                const TextSelection.collapsed(
                                                    offset: 4);
                                            break;
                                          case 4:
                                            controller.dateController.text =
                                                "${value.substring(0, 2)}/${value.substring(2, 4)}";
                                            controller
                                                    .dateController.selection =
                                                const TextSelection.collapsed(
                                                    offset: 5);
                                            break;
                                        }
                                        if (value.length > 4) {
                                          controller.dateController.text =
                                              "${value.substring(0, 2)}/${value.substring(2, 4)}";
                                          controller.dateController.selection =
                                              const TextSelection.collapsed(
                                                  offset: 5);
                                        }
                                      });
                                    },
                                    inputFormatters: [
                                      FilteringTextInputFormatter.digitsOnly,
                                    ],
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
                                    "Enter cvv",
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
                getButton(context, accentColor, "Save Card", Colors.white, () {
                  // backClick();
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
