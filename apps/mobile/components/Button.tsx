import React, { forwardRef } from "react";
import {
  ActivityIndicator,
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
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Visual style classes mapped to tailwind config extend.colors
const variantClasses = {
  primary: "bg-coral border-transparent active:bg-coral-pressed",
  secondary: "bg-cream-deep border-coral active:bg-coral-tint",
  premium: "bg-gold border-transparent active:bg-gold-tint",
  destructive: "bg-transparent border-error active:bg-error/10",
};

// Text color classes corresponding to each variant
const textColors = {
  primary: "text-white",
  secondary: "text-ink",
  premium: "text-ink",
  destructive: "text-error",
};

// Button sizing classes (height, padding, border radius)
const sizeClasses = {
  sm: "min-h-[36px] px-4 py-2 rounded-xl border",
  md: "min-h-[48px] px-6 py-3 rounded-xl border",
  lg: "min-h-[56px] px-8 py-4 rounded-xl border",
};

// Text sizing classes matching Bannerly type scale
const textSizeClasses = {
  sm: "text-xs font-inter-semibold",
  md: "text-base font-inter-semibold",
  lg: "text-lg font-inter-semibold",
};

// Spinner colors corresponding to text colors
const spinnerColors = {
  primary: "#FFFFFF", // text-white
  secondary: "#2B2621", // text-ink
  premium: "#2B2621", // text-ink
  destructive: "#B14538", // text-error
};

export interface ButtonProps extends Omit<PressableProps, "style"> {
  /** The design style variant of the button. Defaults to 'primary' */
  variant?: "primary" | "secondary" | "premium" | "destructive";
  /** The sizing style of the button. Defaults to 'md' */
  size?: "sm" | "md" | "lg";
  /** Text label displayed inside the button. Replaced by a spinner when loading */
  label: string;
  /** If true, disables interaction and renders a loading spinner instead of label */
  isLoading?: boolean;
  /** Optional icon element rendered before the text label */
  leftIcon?: React.ReactNode;
  /** Optional icon element rendered after the text label */
  rightIcon?: React.ReactNode;
  /** Optional styling class name for custom container layout rules (e.g. margins) */
  className?: string;
  /** Optional Tailwind class name for custom text customization */
  textClassName?: string;
  /** Inline style overrides for the button container */
  style?: StyleProp<ViewStyle>;
  /** Inline style overrides for the text label */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A highly reusable, accessible, and animated Button component matching the Bannerly design system.
 * Supports four variants, three sizes, loading/disabled states, and interactive press states.
 */
export const Button = forwardRef<View, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      label,
      isLoading = false,
      leftIcon,
      rightIcon,
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

    const isButtonDisabled = disabled || isLoading;

    const handlePressIn = (e: any) => {
      if (isButtonDisabled) return;
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
      if (isButtonDisabled) return;
      if (isReduced) {
        scale.value = 1;
        opacity.value = 1;
      } else {
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      }
      onPressOut?.(e);
    };

    // Calculate dynamic padding/margin based on size for default premium icon
    const premiumIconSize = size === "sm" ? 14 : size === "md" ? 18 : 22;
    const premiumIconStyle = { marginRight: size === "sm" ? 4 : 8 };

    // Default premium leading icon if none is provided
    const defaultPremiumIcon =
      variant === "premium" && !leftIcon ? (
        <FontAwesome
          name="star"
          size={premiumIconSize}
          color={spinnerColors.premium}
          style={premiumIconStyle}
        />
      ) : null;

    // Small size has height 36px, so we add a 4px hitSlop to ensure >= 44px touch target
    const buttonHitSlop =
      size === "sm" ? { top: 4, bottom: 4, left: 4, right: 4 } : undefined;

    return (
      <AnimatedPressable
        ref={ref}
        disabled={isButtonDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={buttonHitSlop}
        accessibilityRole="button"
        accessibilityLabel={pressableProps.accessibilityLabel || label}
        accessibilityState={{
          disabled: !!isButtonDisabled,
          busy: !!isLoading,
          ...pressableProps.accessibilityState,
        }}
        className={[
          "flex-row items-center justify-center border",
          variantClasses[variant],
          sizeClasses[size],
          isButtonDisabled ? "opacity-40" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={[animatedStyle, style]}
        {...pressableProps}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={spinnerColors[variant]}
            accessibilityLabel="Loading indicator"
          />
        ) : (
          <>
            {leftIcon || defaultPremiumIcon}
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
          </>
        )}
      </AnimatedPressable>
    );
  }
);

Button.displayName = "Button";

// Register custom component with NativeWind to support styling via className prop
cssInterop(Button, { className: "style" });
