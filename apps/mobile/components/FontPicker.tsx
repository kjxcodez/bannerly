import React, { forwardRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  Text,
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

export interface FontOption {
  /** Unique identifier for the font option (e.g. 'fraunces', 'inter') */
  id: string;
  /** Human-readable display name of the typeface (e.g. 'Fraunces') */
  name: string;
  /** The registered font family name loaded via expo-font (e.g. 'Fraunces-SemiBold') */
  fontFamily: string;
}

export interface FontPickerProps {
  /** Array of font options available to select */
  fonts: FontOption[];
  /** Unique identifier of the currently selected font */
  selectedFontId?: string;
  /** Callback triggered when a font option is selected */
  onSelectFont: (fontId: string) => void;
  /** Optional Tailwind class name for custom layout configurations */
  className?: string;
  /** Inline style overrides for the scroll container wrapper */
  style?: StyleProp<ViewStyle>;
}

interface FontItemProps {
  font: FontOption;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Individual Font picker item representing the live typeface preview.
 */
const FontItem: React.FC<FontItemProps> = ({ font, isSelected, onPress }) => {
  const isReduced = useReducedMotion();
  const pressScale = useSharedValue(1);
  const pressOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressScale.value }],
      opacity: pressOpacity.value,
    };
  });

  const handlePressIn = () => {
    if (isReduced) {
      pressScale.value = 0.97;
      pressOpacity.value = 0.8;
    } else {
      pressScale.value = withTiming(0.97, { duration: 150 });
      pressOpacity.value = withTiming(0.8, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (isReduced) {
      pressScale.value = 1;
      pressOpacity.value = 1;
    } else {
      pressScale.value = withTiming(1, { duration: 150 });
      pressOpacity.value = withTiming(1, { duration: 150 });
    }
  };

  // Resolve visual container style classes based on selection
  const containerClass = isSelected
    ? "bg-coral-tint border-coral"
    : "bg-cream-deep border-border";

  const textColorClass = isSelected ? "text-coral" : "text-ink";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Select font ${font.name}`}
      accessibilityState={{ selected: isSelected }}
      style={animatedStyle}
      className={[
        "px-4 py-2 border rounded-lg flex-row items-center justify-center min-h-[44px]",
        containerClass,
      ].join(" ")}
    >
      {/* Selection checkmark icon (colorblind accessible) */}
      {isSelected && (
        <FontAwesome
          name="check"
          size={12}
          color="#E8623D"
          style={{ marginRight: 6 }}
        />
      )}

      {/* Font preview name rendered in its own typeface */}
      <Text
        style={{ fontFamily: font.fontFamily }}
        className={["text-base", textColorClass].join(" ")}
      >
        {font.name}
      </Text>
    </AnimatedPressable>
  );
};

/**
 * A highly reusable FontPicker component matching the Bannerly Design System.
 * Renders a horizontal scrollable row of custom typefaces as live previews for selection.
 */
export const FontPicker = forwardRef<ScrollView, FontPickerProps>(
  ({ fonts, selectedFontId, onSelectFont, className, style }, ref) => {
    return (
      <ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}
        className={["flex-row py-1", className].filter(Boolean).join(" ")}
        contentContainerStyle={{ gap: 8 }}
      >
        {fonts.map((font) => (
          <FontItem
            key={font.id}
            font={font}
            isSelected={selectedFontId === font.id}
            onPress={() => onSelectFont(font.id)}
          />
        ))}
      </ScrollView>
    );
  }
);

FontPicker.displayName = "FontPicker";

// Register custom component with NativeWind to support styling via className prop
cssInterop(FontPicker, { className: "style" });
