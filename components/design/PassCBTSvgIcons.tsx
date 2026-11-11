import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Svg, { Path, G, Circle, Rect, Line } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

export type PassCBTIconName =
  | "home"
  | "home-outline"
  | "calendar"
  | "calendar-outline"
  | "notes"
  | "document-text"
  | "document-text-outline"
  | "users"
  | "person"
  | "person-outline"
  | "bell"
  | "notifications"
  | "arrow-left"
  | "arrow-back"
  | "arrow-right"
  | "arrow-forward"
  | "pill-arrow"
  | "briefcase"
  | "briefcase-outline"
  | "user"
  | "book"
  | "clock"
  | "time"
  | "time-outline"
  | "timer-outline"
  | "plus"
  | "add"
  | "add-circle"
  | "target"
  | "graduation"
  | "school"
  | "school-outline"
  | "certificate"
  | "university"
  | "lightning"
  | "sparkles"
  | "sparkles-outline"
  | "bulb"
  | "bulb-outline"
  | "trophy"
  | "search"
  | "check"
  | "checkmark"
  | "checkmark-circle"
  | "checkmark-circle-outline"
  | "checkmark-done-circle"
  | "checkmark-done-circle-outline"
  | "close"
  | "close-circle"
  | "shield"
  | "shield-checkmark"
  | "refresh"
  | "refresh-outline"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "chevron-forward"
  | "ellipsis-horizontal"
  | "grid-outline"
  | "alert-circle-outline"
  | "help-circle-outline"
  | "information-circle-outline"
  | "bar-chart"
  | "bar-chart-outline"
  | "speedometer"
  | "reader"
  | "bookmark"
  | "calculator"
  | "moon"
  | "sunny"
  | "phone-portrait"
  | "volume-high"
  | "server"
  | "cloud-offline"
  | "infinite"
  | "ellipse";

interface PassCBTIconProps {
  name: PassCBTIconName | string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function PassCBTIcon({
  name,
  size = 20,
  color = "#24252C",
  style,
}: PassCBTIconProps) {
  const scaledSize = moderateScale(size);

  const renderContent = () => {
    switch (name) {
      case "home":
      case "home-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="39 118 24 24" fill="none">
            <Path
              d="M59.83 126.01L53.28 120.77C52 119.75 50 119.74 48.73 120.76L42.18 126.01C41.24 126.76 40.67 128.26 40.87 129.44L42.13 136.98C42.42 138.67 43.99 140 45.7 140H56.3C57.99 140 59.59 138.64 59.88 136.97L61.14 129.43C61.32 128.26 60.75 126.76 59.83 126.01ZM51.75 136C51.75 136.41 51.41 136.75 51 136.75C50.59 136.75 50.25 136.41 50.25 136V133C50.25 132.59 50.59 132.25 51 132.25C51.41 132.25 51.75 132.59 51.75 133V136Z"
              fill={color}
            />
          </Svg>
        );

      case "calendar":
      case "calendar-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.74998V2C8.74998 1.59 8.40998 1.25 7.99998 1.25C7.58998 1.25 7.24998 1.59 7.24998 2V3.56C4.54998 3.81 3.23999 5.42 3.03999 7.81C3.01999 8.1 3.25999 8.34 3.53999 8.34H20.46C20.75 8.34 20.99 8.09 20.96 7.81C20.76 5.42 19.45 3.81 16.75 3.56Z"
              fill={color}
            />
            <Path
              opacity={0.35}
              d="M20 9.84C20.55 9.84 21 10.29 21 10.84V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V10.84C3 10.29 3.45 9.84 4 9.84H20Z"
              fill={color}
            />
            <Circle cx="8.5" cy="14" r="1" fill={color} />
            <Circle cx="12" cy="14" r="1" fill={color} />
            <Circle cx="15.5" cy="14" r="1" fill={color} />
            <Circle cx="8.5" cy="17.5" r="1" fill={color} />
            <Circle cx="12" cy="17.5" r="1" fill={color} />
            <Circle cx="15.5" cy="17.5" r="1" fill={color} />
          </Svg>
        );

      case "notes":
      case "document-text":
      case "document-text-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="135 118 24 24" fill="none">
            <Path
              opacity={0.35}
              d="M155.5 128.19H152.61C150.24 128.19 148.31 126.26 148.31 123.89V121C148.31 120.45 147.86 120 147.31 120H143.07C139.99 120 137.5 122 137.5 125.57V134.43C137.5 138 139.99 140 143.07 140H150.93C154.01 140 156.5 138 156.5 134.43V129.19C156.5 128.64 156.05 128.19 155.5 128.19Z"
              fill={color}
            />
            <Path
              d="M150.8 120.21C150.39 119.8 149.68 120.08 149.68 120.65V124.14C149.68 125.6 150.92 126.81 152.43 126.81C153.38 126.82 154.7 126.82 155.83 126.82C156.4 126.82 156.7 126.15 156.3 125.75C154.86 124.3 152.28 121.69 150.8 120.21Z"
              fill={color}
            />
            <Path
              d="M148.5 131.75H142.5C142.09 131.75 141.75 131.41 141.75 131C141.75 130.59 142.09 130.25 142.5 130.25H148.5C148.91 130.25 149.25 130.59 149.25 131C149.25 131.41 148.91 131.75 148.5 131.75Z"
              fill={color}
            />
            <Path
              d="M146.5 135.75H142.5C142.09 135.75 141.75 135.41 141.75 135C141.75 134.59 142.09 134.25 142.5 134.25H146.5C146.91 134.25 147.25 134.59 147.25 135C147.25 135.41 146.91 135.75 146.5 135.75Z"
              fill={color}
            />
          </Svg>
        );

      case "users":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path
              opacity={0.35}
              d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z"
              fill={color}
            />
            <Path
              d="M14.08 14.15C11.29 12.29 6.73996 12.29 3.92996 14.15C2.65996 15 1.95996 16.15 1.95996 17.38C1.95996 18.61 2.65996 19.75 3.91996 20.59C5.31996 21.53 7.15996 22 8.99996 22C10.84 22 12.68 21.53 14.08 20.59C15.34 19.74 16.04 18.6 16.04 17.36C16.03 16.13 15.34 14.99 14.08 14.15Z"
              fill={color}
            />
            <Path
              opacity={0.35}
              d="M19.9901 7.33999C20.1501 9.27999 18.7701 10.98 16.8601 11.21C16.8501 11.21 16.8501 11.21 16.8401 11.21H16.8101C16.7501 11.21 16.6901 11.21 16.6401 11.23C15.6701 11.28 14.7801 10.97 14.1101 10.4C15.1401 9.47999 15.7301 8.09999 15.6101 6.59999C15.5401 5.78999 15.2601 5.04999 14.8401 4.41999C15.2201 4.22999 15.6601 4.10999 16.1101 4.06999C18.0701 3.89999 19.8201 5.35999 19.9901 7.33999Z"
              fill={color}
            />
            <Path
              d="M21.99 16.59C21.91 17.56 21.29 18.4 20.25 18.97C19.25 19.52 17.99 19.78 16.74 19.75C17.46 19.1 17.88 18.29 17.96 17.43C18.06 16.19 17.47 15 16.29 14.05C15.62 13.52 14.84 13.1 13.99 12.79C16.2 12.15 18.98 12.58 20.69 13.96C21.61 14.7 22.08 15.63 21.99 16.59Z"
              fill={color}
            />
          </Svg>
        );

      case "bell":
      case "notifications":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z"
              fill={color}
            />
            <Path
              d="M14.8299 20.01C14.4099 21.17 13.2999 22 11.9999 22C11.2099 22 10.4299 21.68 9.87993 21.11C9.55993 20.81 9.31993 20.41 9.17993 20C9.30993 20.02 9.43993 20.03 9.57993 20.05C9.80993 20.08 10.0499 20.11 10.2899 20.13C10.8599 20.18 11.4399 20.21 12.0199 20.21C12.5899 20.21 13.1599 20.18 13.7199 20.13C13.9299 20.11 14.1399 20.1 14.3399 20.07C14.4999 20.05 14.6599 20.03 14.8299 20.01Z"
              fill={color}
            />
          </Svg>
        );

      case "arrow-left":
      case "arrow-back":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M13.0586 18C12.7412 18 12.4375 17.9266 12.1484 17.7812C11.7874 17.5775 11.4991 17.2549 11.3398 16.876C11.2386 16.6139 11.0798 15.8304 11.0791 15.8125C10.9331 15.0184 10.8491 13.7648 10.8369 12.3604L10.835 12.0068C10.835 10.5352 10.921 9.19297 11.0508 8.31836L11.165 7.77441C11.2283 7.48651 11.3108 7.15858 11.3975 6.99121C11.7148 6.37891 12.3358 6.00018 13 6H13.0586C13.4898 6.01443 14.393 6.39069 14.4014 6.40723C15.8654 7.02151 18.6897 8.87561 19.9941 10.1973L20.373 10.5938C20.4722 10.7012 20.5841 10.8286 20.6533 10.9277C20.8846 11.2339 21 11.6133 21 11.9922C21 12.415 20.8703 12.8083 20.625 13.1299L20.2354 13.5508L20.1484 13.6406C18.9648 14.9239 15.8735 17.0219 14.2568 17.6641L14.0127 17.7578C13.7191 17.863 13.308 17.9883 13.0586 18ZM4.50293 13.5176C3.67305 13.5174 3.00024 12.8379 3 12C3 11.1618 3.67291 10.4816 4.50293 10.4814L8.20215 10.8086C8.85341 10.8086 9.38184 11.3424 9.38184 12C9.3816 12.6585 8.85327 13.1904 8.20215 13.1904L4.50293 13.5176Z"
              fill={color}
            />
          </Svg>
        );

      case "arrow-right":
      case "arrow-forward":
      case "pill-arrow":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <G transform="scale(-1, 1) translate(-24, 0)">
              <Path
                d="M13.0586 18C12.7412 18 12.4375 17.9266 12.1484 17.7812C11.7874 17.5775 11.4991 17.2549 11.3398 16.876C11.2386 16.6139 11.0798 15.8304 11.0791 15.8125C10.9331 15.0184 10.8491 13.7648 10.8369 12.3604L10.835 12.0068C10.835 10.5352 10.921 9.19297 11.0508 8.31836L11.165 7.77441C11.2283 7.48651 11.3108 7.15858 11.3975 6.99121C11.7148 6.37891 12.3358 6.00018 13 6H13.0586C13.4898 6.01443 14.393 6.39069 14.4014 6.40723C15.8654 7.02151 18.6897 8.87561 19.9941 10.1973L20.373 10.5938C20.4722 10.7012 20.5841 10.8286 20.6533 10.9277C20.8846 11.2339 21 11.6133 21 11.9922C21 12.415 20.8703 12.8083 20.625 13.1299L20.2354 13.5508L20.1484 13.6406C18.9648 14.9239 15.8735 17.0219 14.2568 17.6641L14.0127 17.7578C13.7191 17.863 13.308 17.9883 13.0586 18ZM4.50293 13.5176C3.67305 13.5174 3.00024 12.8379 3 12C3 11.1618 3.67291 10.4816 4.50293 10.4814L8.20215 10.8086C8.85341 10.8086 9.38184 11.3424 9.38184 12C9.3816 12.6585 8.85327 13.1904 8.20215 13.1904L4.50293 13.5176Z"
                fill={color}
              />
            </G>
          </Svg>
        );

      case "briefcase":
      case "briefcase-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="375 118 24 24" fill="none">
            <Path
              d="M396.09 124.98C395.24 124.04 393.82 123.57 391.76 123.57H391.52V123.53C391.52 121.85 391.52 119.77 387.76 119.77H386.24C382.48 119.77 382.48 121.86 382.48 123.53V123.58H382.24C380.17 123.58 378.76 124.05 377.91 124.99C376.92 126.09 376.95 127.57 377.05 128.58L377.06 128.65L377.137 129.463C377.152 129.613 377.232 129.748 377.358 129.831C377.598 129.988 377.999 130.246 378.24 130.38C378.38 130.47 378.53 130.55 378.68 130.63C380.39 131.57 382.27 132.2 384.18 132.51C384.27 133.45 384.68 134.55 386.87 134.55C389.06 134.55 389.49 133.46 389.56 132.49C391.6 132.16 393.57 131.45 395.35 130.41C395.41 130.38 395.45 130.35 395.5 130.32C395.897 130.096 396.308 129.819 396.683 129.549C396.797 129.467 396.869 129.341 396.884 129.203L396.9 129.06L396.95 128.59C396.96 128.53 396.96 128.48 396.97 128.41C397.05 127.4 397.03 126.02 396.09 124.98ZM388.09 131.83C388.09 132.89 388.09 133.05 386.86 133.05C385.63 133.05 385.63 132.86 385.63 131.84V130.58H388.09V131.83ZM383.91 123.57V123.53C383.91 121.83 383.91 121.2 386.24 121.2H387.76C390.09 121.2 390.09 121.84 390.09 123.53V123.58H383.91V123.57Z"
              fill={color}
            />
            <Path
              d="M395.874 131.734C396.227 131.566 396.634 131.846 396.599 132.236L396.24 136.19C396.03 138.19 395.21 140.23 390.81 140.23H383.19C378.79 140.23 377.97 138.19 377.76 136.2L377.419 132.452C377.384 132.067 377.782 131.787 378.135 131.946C379.274 132.462 381.377 133.376 382.677 133.717C382.841 133.76 382.974 133.877 383.046 134.031C383.653 135.329 384.969 136.02 386.87 136.02C388.752 136.02 390.085 135.303 390.694 134.001C390.766 133.847 390.899 133.73 391.064 133.687C392.443 133.324 394.682 132.301 395.874 131.734Z"
              fill={color}
            />
          </Svg>
        );

      case "user":
      case "person":
      case "person-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="423 118 24 24" fill="none">
            <Path
              d="M442.51 123.85L436.57 120.42C435.6 119.86 434.4 119.86 433.42 120.42L427.49 123.85C426.52 124.41 425.92 125.45 425.92 126.58V133.42C425.92 134.54 426.52 135.58 427.49 136.15L433.43 139.58C434.4 140.14 435.6 140.14 436.58 139.58L442.52 136.15C443.49 135.59 444.09 134.55 444.09 133.42V126.58C444.08 125.45 443.48 124.42 442.51 123.85ZM435 125.34C436.29 125.34 437.33 126.38 437.33 127.67C437.33 128.96 436.29 130 435 130C433.71 130 432.67 128.96 432.67 127.67C432.67 126.39 433.71 125.34 435 125.34ZM437.68 134.66H432.32C431.51 134.66 431.04 133.76 431.49 133.09C432.17 132.08 433.49 131.4 435 131.4C436.51 131.4 437.83 132.08 438.51 133.09C438.96 133.75 438.48 134.66 437.68 134.66Z"
              fill={color}
            />
          </Svg>
        );

      case "book":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="471 118 24 24" fill="none">
            <Path
              d="M493 122.85V134.74C493 135.71 492.21 136.6 491.24 136.72L490.93 136.76C489.29 136.98 486.98 137.66 485.12 138.44C484.47 138.71 483.75 138.22 483.75 137.51V123.6C483.75 123.23 483.96 122.89 484.29 122.71C486.12 121.72 488.89 120.84 490.77 120.68H490.83C492.03 120.68 493 121.65 493 122.85Z"
              fill={color}
            />
            <Path
              d="M481.71 122.71C479.88 121.72 477.11 120.84 475.23 120.68H475.16C473.96 120.68 472.99 121.65 472.99 122.85V134.74C472.99 135.71 473.78 136.6 474.75 136.72L475.06 136.76C476.7 136.98 479.01 137.66 480.87 138.44C481.52 138.71 482.24 138.22 482.24 137.51V123.6C482.24 123.22 482.04 122.89 481.71 122.71ZM476 125.74H478.25C478.66 125.74 479 126.08 479 126.49C479 126.91 478.66 127.24 478.25 127.24H476C475.59 127.24 475.25 126.91 475.25 126.49C475.25 126.08 475.59 125.74 476 125.74ZM479 130.24H476C475.59 130.24 475.25 129.91 475.25 129.49C475.25 129.08 475.59 128.74 476 128.74H479C479.41 128.74 479.75 129.08 479.75 129.49C479.75 129.91 479.41 130.24 479 130.24Z"
              fill={color}
            />
          </Svg>
        );

      case "clock":
      case "time":
      case "time-outline":
      case "timer-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
            <Path d="M12 7V12L15.5 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "plus":
      case "add":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "add-circle":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Path d="M12 7.5V16.5M7.5 12H16.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "target":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" opacity={0.6} />
            <Circle cx="12" cy="12" r="2.5" fill={color} />
          </Svg>
        );

      case "graduation":
      case "university":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 3L1 9L12 15L23 9L12 3Z" fill={color} />
            <Path d="M5 11.5V17C5 19.5 8.13 21 12 21C15.87 21 19 19.5 19 17V11.5" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.8} />
            <Path d="M23 9V17" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "school":
      case "school-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L2 7V9H22V7L12 2Z" fill={color} />
            <Path d="M4 11V18H6V11H4ZM9 11V18H11V11H9ZM13 11V18H15V11H13ZM18 11V18H20V11H18ZM2 20H22V22H2V20Z" fill={color} opacity={0.85} />
          </Svg>
        );

      case "certificate":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
            <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
            <Path d="M10 14L12 16L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M8 18H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </Svg>
        );

      case "lightning":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill={color} />
          </Svg>
        );

      case "sparkles":
      case "sparkles-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z" fill={color} />
            <Path d="M19 17L20.2 19.8L23 21L20.2 22.2L19 25L17.8 22.2L15 21L17.8 19.8L19 17Z" fill={color} opacity={0.6} />
          </Svg>
        );

      case "bulb":
      case "bulb-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M9 21H15M10 23H14M12 2C7.58 2 4 5.58 4 10C4 12.89 5.53 15.42 7.82 16.78C8.5 17.18 8.91 17.9 8.91 18.69V19H15.09V18.69C15.09 17.9 15.5 17.18 16.18 16.78C18.47 15.42 20 12.89 20 10C20 5.58 16.42 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "trophy":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M7 4H17V9C17 11.76 14.76 14 12 14C9.24 14 7 11.76 7 9V4Z" fill={color} />
            <Path d="M4 6C4 8.21 5.79 10 8 10V8C6.9 8 6 7.1 6 6H4ZM18 10C20.21 10 22 8.21 22 6H20C20 7.1 19.1 8 18 8V10ZM10 14V18H7V20H17V18H14V14H10Z" fill={color} opacity={0.85} />
          </Svg>
        );

      case "search":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" />
            <Path d="M16 16L21 21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        );

      case "check":
      case "checkmark":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M4 12.5L9.5 18L20 6" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "checkmark-circle":
      case "checkmark-circle-outline":
      case "shield-checkmark":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Path d="M7.5 12L10.5 15L16.5 9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "checkmark-done-circle":
      case "checkmark-done-circle-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Path d="M6 12L9 15L15 8M10.5 15L18 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "close":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M6 6L18 18M18 6L6 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        );

      case "close-circle":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Path d="M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "shield":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z" fill={color} opacity={0.3} />
            <Path d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            <Path d="M8.5 11.5L11 14L15.5 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "refresh":
      case "refresh-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M21 4V10H15M3 20V14H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M19.5 15C18.5 17.5 16.2 19.5 13.5 19.9C10.2 20.4 7.1 19 5.3 16.6M4.5 9C5.5 6.5 7.8 4.5 10.5 4.1C13.8 3.6 16.9 5 18.7 7.4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "chevron-down":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "chevron-up":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "chevron-left":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "chevron-right":
      case "chevron-forward":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );

      case "ellipsis-horizontal":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="6" cy="12" r="2" fill={color} />
            <Circle cx="12" cy="12" r="2" fill={color} />
            <Circle cx="18" cy="12" r="2" fill={color} />
          </Svg>
        );

      case "grid-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="4" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.8" />
            <Rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.8" />
            <Rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.8" />
            <Rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.8" />
          </Svg>
        );

      case "alert-circle-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Line x1="12" y1="7" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="12" cy="16.5" r="1.2" fill={color} />
          </Svg>
        );

      case "help-circle-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Path d="M9.5 9.5C9.5 8 10.5 7 12 7C13.5 7 14.5 8 14.5 9.5C14.5 11 12 12 12 13.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="12" cy="16.5" r="1.2" fill={color} />
          </Svg>
        );

      case "information-circle-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
            <Circle cx="12" cy="7.5" r="1.2" fill={color} />
            <Line x1="12" y1="11" x2="12" y2="16.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "bar-chart":
      case "bar-chart-outline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M4 20H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Rect x="6" y="11" width="3" height="7" rx="1" fill={color} />
            <Rect x="11" y="6" width="3" height="12" rx="1" fill={color} />
            <Rect x="16" y="9" width="3" height="9" rx="1" fill={color} />
          </Svg>
        );

      case "speedometer":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M4 17C4 12.58 7.58 9 12 9C16.42 9 20 12.58 20 17" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M12 12L15 9" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="12" cy="16" r="2.5" fill={color} />
          </Svg>
        );

      case "reader":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
            <Line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Line x1="8" y1="16" x2="12" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          </Svg>
        );

      case "bookmark":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M6 4C6 2.9 6.9 2 8 2H16C17.1 2 18 2.9 18 4V22L12 17.5L6 22V4Z" fill={color} />
          </Svg>
        );

      case "calculator":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Rect x="5" y="2" width="14" height="20" rx="3" stroke={color} strokeWidth="2" />
            <Rect x="8" y="5" width="8" height="4" rx="1" stroke={color} strokeWidth="1.5" />
            <Circle cx="8.5" cy="13" r="1.2" fill={color} />
            <Circle cx="12" cy="13" r="1.2" fill={color} />
            <Circle cx="15.5" cy="13" r="1.2" fill={color} />
            <Circle cx="8.5" cy="17" r="1.2" fill={color} />
            <Circle cx="12" cy="17" r="1.2" fill={color} />
            <Circle cx="15.5" cy="17" r="1.2" fill={color} />
          </Svg>
        );

      case "moon":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M21 12.79C20.84 15.53 19.34 18 16.96 19.34C14.58 20.68 11.66 20.68 9.28 19.34C6.9 18 5.4 15.53 5.24 12.79C5.08 10.05 6.29 7.42 8.44 5.71C7.57 7.02 7.27 8.65 7.61 10.22C7.95 11.79 8.9 13.14 10.23 13.94C11.56 14.74 13.16 14.93 14.65 14.46C16.14 13.99 17.37 12.89 18.06 11.45C19.98 12.18 21.05 12.7 21 12.79Z" fill={color} />
          </Svg>
        );

      case "sunny":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
            <Path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "phone-portrait":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="2" />
            <Line x1="11" y1="18" x2="13" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "volume-high":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={color} />
            <Path d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5M19 5C20.9 6.9 22 9.4 22 12C22 14.6 20.9 17.1 19 19" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case "server":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="4" width="18" height="6" rx="2" stroke={color} strokeWidth="2" />
            <Rect x="3" y="14" width="18" height="6" rx="2" stroke={color} strokeWidth="2" />
            <Circle cx="7" cy="7" r="1" fill={color} />
            <Circle cx="7" cy="17" r="1" fill={color} />
          </Svg>
        );

      case "cloud-offline":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" fill={color} opacity={0.3} />
            <Line x1="3" y1="3" x2="21" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          </Svg>
        );

      case "infinite":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Path d="M18.5 8C16.5 8 14.8 9.5 13.8 11.2C12.8 9.5 11.1 8 9.1 8C6.3 8 4 10.2 4 13C4 15.8 6.3 18 9.1 18C11.1 18 12.8 16.5 13.8 14.8C14.8 16.5 16.5 18 18.5 18C21.3 18 23.6 15.8 23.6 13C23.6 10.2 21.3 8 18.5 8Z" stroke={color} strokeWidth="2.2" />
          </Svg>
        );

      case "ellipse":
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="5" fill={color} />
          </Svg>
        );

      default:
        return (
          <Svg width={scaledSize} height={scaledSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          </Svg>
        );
    }
  };

  return <View style={style}>{renderContent()}</View>;
}
