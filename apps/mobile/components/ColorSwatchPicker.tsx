import React, { forwardRef, useEffect } from "react";
import {
  Pressable,
  ScrollView,
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
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

export interface ColorSwatch {
  /** Unique identifier for the color swatch */
  id: string;
  /** Hex color code to display (e.g. '#E8623D') */
  value: string;
  /** Accessibility label describing the color (e.g. 'Coral Accent') */
  label: string;
}

export type SwatchSize = "sm" | "md";

export interface ColorSwatchPickerProps {
  /** Array of swatches available to choose from */
  swatches: ColorSwatch[];
  /** Unique identifier of the currently selected swatch color */
  selectedColorId?: string;
  /** Callback triggered when a swatch is selected */
  onSelectColor: (colorId: string) => void;
  /** Predefined size for color swatches. Defaults to 'md' */
  size?: SwatchSize;
  /** Optional Tailwind class name for custom margins or layouts */
  className?: string;
  /** Inline style overrides for the scroll container */
  style?: StyleProp<ViewStyle>;
}

// Helper to determine checkmark contrast (YIQ Contrast Formula)
const getContrastColor = (hexColor: string) => {
  const cleanHex = hexColor.replace("#", "");
  // Fallback if not a 6-digit hex
  if (cleanHex.length !== 6) return "#2B2621";
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#2B2621" : "#FFFFFF"; // ink vs white
};

interface SwatchItemProps {
  swatch: ColorSwatch;
  isSelected: boolean;
  size: SwatchSize;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Individual Swatch Item containing internal Reanimated focus ring timing.
 */
const SwatchItem: React.FC<SwatchItemProps> = ({
  swatch,
  isSelected,
  size,
  onPress,
}) => {
  const isReduced = useReducedMotion();
  const ringScale = useSharedValue(isSelected ? 1 : 0);
  const pressScale = useSharedValue(1);

  // Animate selection ring appearance
  useEffect(() => {
    if (isReduced) {
      ringScale.value = isSelected ? 1 : 0;
    } else {
      ringScale.value = withTiming(isSelected ? 1 : 0, { duration: 180 });
    }
  }, [isSelected, isReduced, ringScale]);

  const ringStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: ringScale.value }],
      opacity: ringScale.value,
    };
  });

  const pressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressScale.value }],
    };
  });

  const handlePressIn = () => {
    if (isReduced) {
      pressScale.value = 0.97;
    } else {
      pressScale.value = withTiming(0.97, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (isReduced) {
      pressScale.value = 1;
    } else {
      pressScale.value = withTiming(1, { duration: 150 });
    }
  };

  const contrastColor = getContrastColor(swatch.value);

  // Sizing definitions (keeps touch target at 44x44px regardless of circle size)
  const circleSizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const ringSizeClass = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  const checkmarkSize = size === "sm" ? 10 : 14;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Select color ${swatch.label}`}
      accessibilityState={{ selected: isSelected }}
      style={pressStyle}
      className="w-11 h-11 items-center justify-center relative"
    >
      {/* Outer Selection Ring (scales up/down) */}
      <Animated.View
        style={ringStyle}
        className={["border-2 border-coral rounded-full absolute", ringSizeClass].join(
          " "
        )}
      />

      {/* Solid Color Swatch Circle */}
      <View
        style={{ backgroundColor: swatch.value }}
        className={["rounded-full items-center justify-center shadow-sm", circleSizeClass].join(
          " "
        )}
      >
        {/* Checkmark indicator for accessibility (colorblind-safe) */}
        {isSelected && (
          <FontAwesome name="check" size={checkmarkSize} color={contrastColor} />
        )}
      </View>
    </AnimatedPressable>
  );
};

/**
 * A highly reusable ColorSwatchPicker component matching the Bannerly Design System.
 * Renders a row of tappable color swatches with animated focus rings and contrast-safe checkmarks.
 */
export const ColorSwatchPicker = forwardRef<ScrollView, ColorSwatchPickerProps>(
  (
    {
      swatches,
      selectedColorId,
      onSelectColor,
      size = "md",
      className,
      style,
    },
    ref
  ) => {
    return (
      <ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}
        className={["flex-row py-1", className].filter(Boolean).join(" ")}
        contentContainerStyle={{ gap: 8 }}
      >
        {swatches.map((swatch) => (
          <SwatchItem
            key={swatch.id}
            swatch={swatch}
            isSelected={selectedColorId === swatch.id}
            size={size}
            onPress={() => onSelectColor(swatch.id)}
          />
        ))}
      </ScrollView>
    );
  }
);

ColorSwatchPicker.displayName = "ColorSwatchPicker";

// Register custom component with NativeWind to support styling via className prop
cssInterop(ColorSwatchPicker, { className: "style" });
