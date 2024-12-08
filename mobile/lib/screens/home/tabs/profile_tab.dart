import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/models/user_model.dart';
import 'package:mobile/providers/user_provider.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/widget_utils.dart';
import 'package:provider/provider.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  var interestList = {"Art", "Music", "Food", "Technology", "Party"};

  @override
  Widget build(BuildContext context) {

    final userProvider = Provider.of<UserProvider>(context);
    UserModel? currentUser = userProvider.currentUser;

    return Column(
      children: [
        AppBar(
          backgroundColor: Colors.white,
          toolbarHeight: 73.h,
          elevation: 0,
          title: getCustomFont("Profile", 24.sp, Colors.black, 1,
              fontWeight: FontWeight.w700),
          centerTitle: true,
          actions: [
            GestureDetector(
                onTap: () {
                  // Constant.sendToNext(context, Routes.settingRoute);
                },
                child: getSvgImage("setting.svg", height: 24.h, width: 24.h)),
            getHorSpace(20.h)
          ],
        ),
        Divider(color: dividerColor, thickness: 1.h, height: 1.h),
        Expanded(
            flex: 1,
            child: ListView(
              primary: true,
              shrinkWrap: true,
              children: [
                buildProfileSection(currentUser!),
                getVerSpace(20.h),
                getPaddingWidget(
                  EdgeInsets.symmetric(horizontal: 20.h),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      buildAboutWidget(),
                      getVerSpace(30.h),
                      buildInterestWidget(currentUser)
                    ],
                  ),
                )
              ],
            ))
      ],
    );
  }

  Column buildInterestWidget(UserModel currentUser) {
    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            getCustomFont("Interests", 18.sp, Colors.black, 1,
                                fontWeight: FontWeight.w600),
                            getHorSpace(3.h),
                            getSvgImage('edit.svg',
                                color: Colors.black,
                                height: 24.h,
                                width: 24.h)
                          ],
                        ),
                        getVerSpace(10.h),
                        Wrap(
                            alignment: WrapAlignment.start,
                            spacing: 10.h,
                            runSpacing: 10.h,
                            children: currentUser.preferences.keys.toSet()
                                .map((e) => Container(
                                      padding: EdgeInsets.symmetric(
                                          horizontal: 20.h, vertical: 6.h),
                                      decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(27.h),
                                          border: Border.all(
                                              color: accentColor,
                                              width: 1.h)),
                                      child: getCustomFont(
                                          e[0].toUpperCase() + e.substring(1).toLowerCase(), 15.sp, accentColor, 1,
                                          fontWeight: FontWeight.w600),
                                    ))
                                .toList())
                      ],
                    );
  }

  Column buildAboutWidget() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        getCustomFont("About", 18.sp, Colors.black, 1,
            fontWeight: FontWeight.w600, txtHeight: 1.5.h),
        getVerSpace(4.h),
        getMultilineCustomFont(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            15.sp,
            Colors.black,
            fontWeight: FontWeight.w500,
            txtHeight: 1.46.h,
            textAlign: TextAlign.start)
      ],
    );
  }

  Container buildProfileSection(UserModel currentUser) {
    return Container(
      color: accentColor.withOpacity(0.05),
      width: double.infinity,
      child: Column(
        children: [
          getVerSpace(31.h),
          Stack(
            alignment: Alignment.bottomRight,
            children: [
              getAssetImage("view1.png", width: 110.h, height: 110.h),
              Positioned(
                  child: Container(
                height: 30.h,
                width: 30.h,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20.h),
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                          color: shadowColor,
                          offset: const Offset(0, 8),
                          blurRadius: 27)
                    ]),
                padding: EdgeInsets.all(5.h),
                child: getSvgImage("edit.svg", width: 20.h, height: 20.h),
              ))
            ],
          ),
          getVerSpace(15.h),
          getCustomFont(currentUser.name, 18.sp, Colors.black, 1,
              fontWeight: FontWeight.w600, txtHeight: 1.5.h),
          getVerSpace(20.h),
          getPaddingWidget(
            EdgeInsets.symmetric(horizontal: 20.h),
            Row(
              children: [
                Expanded(
                    child: Container(
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22.h),
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                            color: shadowColor,
                            offset: const Offset(0, 8),
                            blurRadius: 27),
                      ]),
                  child: Column(
                    children: [
                      getVerSpace(20.h),
                      getCustomFont(currentUser.xpPoints.toString(), 22.sp, accentColor, 1,
                          fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                      getVerSpace(2.h),
                      getCustomFont("XP Points", 15.sp, Colors.black, 1,
                          fontWeight: FontWeight.w500, txtHeight: 1.46.h),
                      getVerSpace(20.h),
                    ],
                  ),
                )),
                getHorSpace(20.h),
                Expanded(
                    child: Container(
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22.h),
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                            color: shadowColor,
                            offset: const Offset(0, 8),
                            blurRadius: 27),
                      ]),
                  child: Column(
                    children: [
                      getVerSpace(20.h),
                      getCustomFont(currentUser.level.toString(), 22.sp, accentColor, 1,
                          fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                      getVerSpace(2.h),
                      getCustomFont("Level", 15.sp, Colors.black, 1,
                          fontWeight: FontWeight.w500, txtHeight: 1.46.h),
                      getVerSpace(20.h),
                    ],
                  ),
                )),
                getHorSpace(20.h),
                Expanded(
                    child: Container(
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22.h),
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                            color: shadowColor,
                            offset: const Offset(0, 8),
                            blurRadius: 27),
                      ]),
                  child: Column(
                    children: [
                      getVerSpace(20.h),
                      getCustomFont(currentUser.joinedEvents.length.toString(), 22.sp, accentColor, 1,
                          fontWeight: FontWeight.w700, txtHeight: 1.5.h),
                      getVerSpace(2.h),
                      getCustomFont("Events", 15.sp, Colors.black, 1,
                          fontWeight: FontWeight.w500, txtHeight: 1.46.h),
                      getVerSpace(20.h),
                    ],
                  ),
                ))
              ],
            ),
          ),
          getVerSpace(30.h),
        ],
      ),
    );
  }
}
