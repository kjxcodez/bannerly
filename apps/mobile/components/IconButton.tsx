import React, { forwardRef } from "react";
import {
  ActivityIndicator,
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

// Visual style classes mapped to tailwind config extend.colors
const variantClasses = {
  primary: "bg-coral border-transparent active:bg-coral-pressed",
  secondary: "bg-cream-deep border-coral active:bg-coral-tint",
  premium: "bg-gold border-transparent active:bg-gold-tint",
  destructive: "bg-transparent border-error active:bg-error/10",
};

// Size classes defining circular dimensions
const sizeClasses = {
  sm: "w-9 h-9 rounded-full border items-center justify-center",
  md: "w-12 h-12 rounded-full border items-center justify-center",
  lg: "w-14 h-14 rounded-full border items-center justify-center",
};

// Spinner colors corresponding to text colors of the same variant
const spinnerColors = {
  primary: "#FFFFFF",
  secondary: "#2B2621",
  premium: "#2B2621",
  destructive: "#B14538",
};

export interface IconButtonProps
  extends Omit<PressableProps, "style" | "accessibilityLabel"> {
  /** The design style variant of the button. Defaults to 'primary' */
  variant?: "primary" | "secondary" | "premium" | "destructive";
  /** The sizing style of the button. Defaults to 'md' */
  size?: "sm" | "md" | "lg";
  /** The icon node to render inside the button (e.g. Vector Icon component) */
  icon: React.ReactNode;
  /** If true, disables interaction and renders a loading spinner instead of the icon */
  isLoading?: boolean;
  /** Mandatory accessibility label describing the action of this button (critical for screen readers) */
  accessibilityLabel: string;
  /** Optional Tailwind class name for custom layout rules (e.g. margins) */
  className?: string;
  /** Inline style overrides for the button container */
  style?: StyleProp<ViewStyle>;
}

/**
 * A highly reusable, accessible, circular icon-only button component.
 * Requires an accessibility label and supports the standard Bannerly variants and sizes.
 */
export const IconButton = forwardRef<View, IconButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      isLoading = false,
      accessibilityLabel,
      className,
      style,
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

    // Apply press scale and opacity transitions
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

    // Small circular button is 36x36px. We add a 4px hitSlop to ensure >= 44x44px touch target.
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
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{
          disabled: !!isButtonDisabled,
          busy: !!isLoading,
          ...pressableProps.accessibilityState,
        }}
        className={[
          "border",
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
          icon
        )}
      </AnimatedPressable>
    );
  }
);

IconButton.displayName = "IconButton";

// Register custom component with NativeWind to support styling via className prop
cssInterop(IconButton, { className: "style" });
