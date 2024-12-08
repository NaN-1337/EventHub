import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile/screens/home/tabs/home_tab.dart';
import 'package:mobile/screens/home/tabs/joined_events_tab.dart';
import 'package:mobile/screens/home/tabs/profile_tab.dart';
import 'package:mobile/screens/home/tabs/tickets_tab.dart';
import 'package:mobile/screens/onboarding/controller.dart';
import 'package:mobile/utils/appBar/bar.dart';
import 'package:mobile/utils/appBar/item.dart';
import 'package:mobile/utils/color_data.dart';
import 'package:mobile/utils/constant.dart';
import 'package:mobile/utils/widget_utils.dart';

class NavBar extends StatefulWidget {
  const NavBar({super.key});

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> with TickerProviderStateMixin {
  void backClick() {
    Constant.closeApp();
  }

  CreateEventController createEventController = Get.put(CreateEventController());
  NavBarController controller = Get.put(NavBarController());
  static final List<Widget> _widgetOptions = <Widget>[
    const HomeTab(),
    const JoinedEventsTab(),
    // const CreateEventScreen(),
    const SizedBox(),
    const TicketsTab(),
    const ProfileTab(),
  ];
  TabController? tabcontroller;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    tabcontroller = TabController(length: 5, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    setStatusBarColor(Colors.white);
    return WillPopScope(
      onWillPop: () async {
        if (controller.index.value != 0) {
          controller.onChange(0.obs);
        } else {
          backClick();
        }

        return false;
      },
      child: Scaffold(
        resizeToAvoidBottomInset: true,
        backgroundColor: Colors.white,
        bottomNavigationBar: _buildBottomBar(),
        body: SafeArea(
          child: GetX<NavBarController>(
            init: NavBarController(),
            builder: (controller) => _widgetOptions[controller.index.value],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    return GetX<NavBarController>(
      init: NavBarController(),
      builder: (controller) => ConvexAppBar(
        controller:tabcontroller,
        items: [
          TabItem(
              icon: getSvgImage("home.svg", height: 24.h, width: 24.h),
              activeIcon:
                  getSvgImage("home_bold.svg", height: 24.h, width: 24.h)),
          TabItem(
              icon: getSvgImage("favourite.svg", height: 24.h, width: 24.h),
              activeIcon:
                  getSvgImage("favourite_bold.svg", height: 24.h, width: 24.h)),
          TabItem(
              icon: getSvgImage("add.svg", height: 24.h, width: 24.h),
              activeIcon: getSvgImage("add.svg", height: 24.h, width: 24.h)),
          TabItem(
              icon: getSvgImage("ticket.svg", height: 24.h, width: 24.h),
              activeIcon:
                  getSvgImage("ticket_bold.svg", height: 24.h, width: 24.h)),
          TabItem(
              icon: getSvgImage("profile.svg", height: 24.h, width: 24.h),
              activeIcon:
                  getSvgImage("profile_bold.svg", height: 24.h, width: 24.h))
        ],
        height: 88.h,
        elevation: 5,
        color: accentColor,
        top: -33.h,
        curveSize: 85.h,
        initialActiveIndex: controller.index.value,
        activeColor: accentColor,
        style: TabStyle.fixedCircle,
        backgroundColor: Colors.white,
        onTap: (count) {
          controller.onChange(count.obs);
        },
      ),
    );
  }
}
