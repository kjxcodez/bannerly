import React, { forwardRef } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cssInterop } from "nativewind";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type BadgeVariant = "default" | "active" | "premium";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends Omit<PressableProps, "style" | "onPress"> {
  /** The text label displayed inside the badge */
  label: string;
  /** Visual variant style of the badge/chip. Defaults to 'default' */
  variant?: BadgeVariant;
  /** Size level of the badge/chip. Defaults to 'md' */
  size?: BadgeSize;
  /** If true, makes the badge fully circular/pill shaped. Otherwise uses standard 8px radius (rounded-lg). Defaults to true */
  pill?: boolean;
  /** Optional leading icon element (e.g. crown for premium) */
  leftIcon?: React.ReactNode;
  /** Optional trailing icon element (e.g. close 'x' icon for filter chips) */
  rightIcon?: React.ReactNode;
  /** Optional onPress callback. If provided, renders badge as an interactive pressable chip */
  onPress?: (event: any) => void;
  /** Optional Tailwind class name for the badge container layout overrides */
  className?: string;
  /** Optional Tailwind class name for custom text label overrides */
  textClassName?: string;
  /** Inline style overrides for the badge container */
  style?: StyleProp<ViewStyle>;
  /** Inline style overrides for the text label */
  textStyle?: StyleProp<TextStyle>;
}

// Container styling mappings for each variant
const variantClasses = {
  default: "bg-cream-deep border-border",
  active: "bg-coral-tint border-transparent",
  premium: "bg-gold border-transparent",
};

// Text color mappings for each variant
const textColors = {
  default: "text-ink",
  active: "text-coral",
  premium: "text-ink", // rich contrast
};

// Sizing classes defining margins and height constraints
const sizeClasses = {
  sm: "px-2.5 py-0.5 min-h-[22px]",
  md: "px-4 py-1.5 min-h-[32px]",
};

// Text sizing classes matching Bannerly type scale
const textSizeClasses = {
  sm: "text-[11px] font-inter-medium tracking-[0.02em]", // maps to caption
  md: "text-[13px] font-inter", // maps to body-sm
};

/**
 * A highly reusable Badge / Chip component matching the Bannerly Design System.
 * Supports static status tags as well as interactive filter chips with press animations.
 */
export const Badge = forwardRef<View, BadgeProps>(
  (
    {
      label,
      variant = "default",
      size = "md",
      pill = true,
      leftIcon,
      rightIcon,
      onPress,
      className,
      textClassName,
      style,
      textStyle,
      disabled,
      onPressIn,
      onPressOut,
      ...pressableProps
    },
    ref
  ) => {
    const isReduced = useReducedMotion();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    // Apply smooth press feedback animation
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    });

    const handlePressIn = (e: any) => {
      if (disabled) return;
      if (isReduced) {
        scale.value = 0.97;
        opacity.value = 0.8;
      } else {
        scale.value = withTiming(0.97, { duration: 150 });
        opacity.value = withTiming(0.8, { duration: 150 });
      }
      onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
      if (disabled) return;
      if (isReduced) {
        scale.value = 1;
        opacity.value = 1;
      } else {
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      }
      onPressOut?.(e);
    };

    const containerClassName = [
      "flex-row items-center justify-center border",
      variantClasses[variant],
      sizeClasses[size],
      pill ? "rounded-full" : "rounded-lg", // chips 8px vs pill
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Icon spacings based on sizing
    const gapClass = size === "sm" ? "gap-1" : "gap-1.5";

    // Small and Medium badge visual sizes are less than 44px,
    // so we set custom hitSlops to guarantee at least 44x44px touch targets.
    const touchHitSlop =
      size === "sm"
        ? { top: 11, bottom: 11, left: 8, right: 8 }
        : { top: 6, bottom: 6, left: 4, right: 4 };

    if (onPress) {
      return (
        <AnimatedPressable
          ref={ref}
          disabled={disabled}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          hitSlop={touchHitSlop}
          className={containerClassName}
          style={[animatedStyle, style]}
          accessibilityRole="button"
          {...pressableProps}
        >
          <View className={["flex-row items-center justify-center", gapClass].join(" ")}>
            {leftIcon}
            <Text
              className={[
                textColors[variant],
                textSizeClasses[size],
                textClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              style={textStyle}
            >
              {label}
            </Text>
            {rightIcon}
          </View>
        </AnimatedPressable>
      );
    }

    return (
      <View
        ref={ref}
        className={containerClassName}
        style={style}
        {...pressableProps}
      >
        <View className={["flex-row items-center justify-center", gapClass].join(" ")}>
          {leftIcon}
          <Text
            className={[
              textColors[variant],
              textSizeClasses[size],
              textClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            style={textStyle}
          >
            {label}
          </Text>
          {rightIcon}
        </View>
      </View>
    );
  }
);

Badge.displayName = "Badge";

// Register custom component with NativeWind to support styling via className prop
cssInterop(Badge, { className: "style" });
