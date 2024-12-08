import 'dart:ui';

Color accentColor = "#46BCC3".toColor();
Color bgColor = "#F5F9F9".toColor();
Color greyColor = "#7C8788".toColor();
Color borderColor = "#BCCCCD".toColor();
Color dividerColor = "#F1F5F5".toColor();
Color errorColor = "#DD3333".toColor();
Color lightGrey = "#FAFAFA".toColor();
Color lightColor = "#F5F9F9".toColor();
Color lightAccent = '#F4FAFA'.toColor();
Color shadowColor = "#2690B7B9".toColor();
Color darkShadow = "#99000000".toColor();
Color lightShadow = "#00000000".toColor();

extension ColorExtension on String {
  toColor() {
    var hexColor = replaceAll("#", "");
    if (hexColor.length == 6) {
      hexColor = "FF$hexColor";
    }
    if (hexColor.length == 8) {
      return Color(int.parse("0x$hexColor"));
    }
  }
}
