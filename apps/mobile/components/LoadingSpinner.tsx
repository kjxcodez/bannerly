import React, { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
  useReducedMotion,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

export type SpinnerColor = "coral" | "ink" | "white" | "ink-muted" | string;
export type SpinnerSize = "sm" | "md" | "lg" | number;

export interface LoadingSpinnerProps {
  /** The theme color of the spinner. Can be a predefined token or raw hex string. Defaults to 'coral' */
  color?: SpinnerColor;
  /** Predefined size ('sm' | 'md' | 'lg') or a numeric size value. Defaults to 'md' */
  size?: SpinnerSize;
  /** If true, centers the spinner in a full-screen container with the primary bg-cream theme. Defaults to false */
  fullScreen?: boolean;
  /** Optional Tailwind class name for custom container layout overrides */
  className?: string;
  /** Inline style overrides for the spinner container */
  style?: StyleProp<ViewStyle>;
}

// Maps color tokens to hex values from the design system
const colorTokens: Record<string, string> = {
  coral: "#E8623D",
  ink: "#2B2621",
  white: "#FFFFFF",
  "ink-muted": "#6B5F52",
};

// Maps sizing tokens to numeric icon sizes
const sizeTokens: Record<string, number> = {
  sm: 16, // inline (e.g. inside buttons)
  md: 24, // section/medium loading
  lg: 40, // full screen loading
};

/**
 * A highly reusable custom loading spinner component.
 * Uses Reanimated to run smooth 60fps rotation on the native UI thread, themed to Bannerly.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = "coral",
  size = "md",
  fullScreen = false,
  className,
  style,
}) => {
  const isReduced = useReducedMotion();
  const rotation = useSharedValue(0);

  // Animate the rotation property infinitely
  useEffect(() => {
    if (isReduced) {
      rotation.value = 0;
    } else {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1, // infinite repeat
        false // do not reverse
      );
    }
    return () => cancelAnimation(rotation);
  }, [isReduced, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Resolve color token or raw hex
  const resolvedColor = colorTokens[color] || color;

  // Resolve size token or raw number
  const resolvedSize = typeof size === "number" ? size : sizeTokens[size] || 24;

  const containerClassName = fullScreen
    ? "flex-1 items-center justify-center bg-cream"
    : "items-center justify-center";

  return (
    <View
      className={[containerClassName, className].filter(Boolean).join(" ")}
      style={style}
      accessibilityRole="progressbar"
      accessibilityLabel={fullScreen ? "Loading content, please wait" : "Loading"}
    >
      <Animated.View style={isReduced ? undefined : animatedStyle}>
        <FontAwesome name="circle-o-notch" size={resolvedSize} color={resolvedColor} />
      </Animated.View>
    </View>
  );
};

LoadingSpinner.displayName = "LoadingSpinner";

// Register custom component with NativeWind to support styling via className prop
cssInterop(LoadingSpinner, { className: "style" });
