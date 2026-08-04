import React, { forwardRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

export interface HeaderProps {
  /** The screen title text rendered in the Bannerly Serif (Fraunces) style */
  title: string;
  /** Callback triggered when the back button is pressed. If omitted, the back button is hidden */
  onBackPress?: () => void;
  /** Optional React element (e.g. IconButton or Text button) rendered on the right side */
  rightAction?: React.ReactNode;
  /** Optional Tailwind class name for custom layout modifications */
  className?: string;
  /** Inline style overrides for the wrapper container */
  style?: StyleProp<ViewStyle>;
}

/**
 * A highly reusable Header component matching the Bannerly Design System.
 * Renders a centered display Serif title, an optional back button, and an optional right-side action slot.
 */
export const Header = forwardRef<View, HeaderProps>(
  ({ title, onBackPress, rightAction, className, style }, ref) => {
    return (
      <View
        ref={ref}
        style={style}
        className={[
          "flex-row items-center justify-between h-14 px-4 bg-cream border-b border-border relative w-full",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        accessibilityRole="header"
      >
        {/* Left column: Back Button slot */}
        <View className="z-10 min-w-[44px] justify-center items-start">
          {onBackPress && (
            <IconButton
              variant="secondary"
              size="sm"
              accessibilityLabel="Go back"
              icon={
                <FontAwesome
                  name="chevron-left"
                  size={14}
                  color="#2B2621"
                  style={{ marginRight: 2 }} // center the chevron visually
                />
              }
              onPress={onBackPress}
            />
          )}
        </View>

        {/* Center column: Absolute Centered Serif Title */}
        <View className="absolute inset-x-16 inset-y-0 items-center justify-center">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-fraunces text-xl text-ink text-center"
          >
            {title}
          </Text>
        </View>

        {/* Right column: Action slot */}
        <View className="z-10 min-w-[44px] justify-center items-end">
          {rightAction}
        </View>
      </View>
    );
  }
);

Header.displayName = "Header";

// Register custom component with NativeWind to support styling via className prop
cssInterop(Header, { className: "style" });
