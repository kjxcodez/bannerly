import React, { forwardRef } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
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

export type CardPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface CardProps extends Omit<PressableProps, "style" | "onPress"> {
  /** Internal padding scale of the card. Defaults to 'md' (16px) */
  padding?: CardPadding;
  /** Optional onPress callback. If provided, renders card as an interactive, scaling pressable */
  onPress?: (event: any) => void;
  /** Optional Tailwind class name for layout customizations */
  className?: string;
  /** Inline style overrides for the card container */
  style?: StyleProp<ViewStyle>;
  /** React children rendered inside the card */
  children?: React.ReactNode;
}

// Maps typographic padding values to Tailwind classes.
const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  xs: "p-1", // 4px
  sm: "p-2", // 8px
  md: "p-4", // 16px (Default, space-md)
  lg: "p-6", // 24px
  xl: "p-8", // 32px
  "2xl": "p-12", // 48px
};

// Warm-tinted elevation styling matching the Bannerly system (0 2px 8px rgba(43, 38, 33, 0.08))
const cardShadow: ViewStyle = {
  shadowColor: "#2B2621",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

/**
 * A highly reusable Card layout container matching the Bannerly Design System.
 * Automatically wraps elements in a cream-deep container with a 16px radius, soft border,
 * and warm-tinted shadow. Becomes an animated button when onPress is passed.
 */
export const Card = forwardRef<View, CardProps>(
  (
    {
      padding = "md",
      onPress,
      className,
      style,
      children,
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

    // Apply press scale and opacity feedback
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
      "rounded-2xl bg-cream-deep border border-border overflow-hidden",
      paddingClasses[padding],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // If onPress is provided, render as an interactive Pressable card
    if (onPress) {
      return (
        <AnimatedPressable
          ref={ref}
          disabled={disabled}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={containerClassName}
          style={[animatedStyle, cardShadow, style]}
          accessibilityRole="button"
          {...pressableProps}
        >
          {children}
        </AnimatedPressable>
      );
    }

    // Otherwise, render as a static View card
    return (
      <View
        ref={ref}
        className={containerClassName}
        style={[cardShadow, style]}
        {...pressableProps}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = "Card";

// Register custom component with NativeWind to support styling via className prop
cssInterop(Card, { className: "style" });
