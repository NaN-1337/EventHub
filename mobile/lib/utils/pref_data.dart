import 'package:mobile/utils/globals.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PrefData {
  static String prefName = packageName;

  static String isIntro = "${prefName}isIntro";
  static String inSignIn = "${prefName}isSignIn";
  static String isSelect = "${prefName}isSelect";

  static setIsIntro(bool sizes) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool(isIntro, sizes);
  }

  static getIsIntro() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool intValue = prefs.getBool(isIntro) ?? true;
    return intValue;
  }

  static getIsSignIn() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool(inSignIn) ?? false;
  }

  static setIsSignIn(bool isFav) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setBool(inSignIn, isFav);
  }

  static getSelectInterest() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool(isSelect) ?? false;
  }

  static setSelectInterest(bool isFav) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setBool(isSelect, isFav);
  }
}
