import React, { forwardRef } from "react";
import {
  Image,
  ImageSourcePropType,
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
import { Text } from "./Text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Aspect ratio options for the card thumbnail. Defaults to 'portrait' (3:4). */
export type TemplateCardAspect = "portrait" | "landscape" | "square";

export interface TemplateCardProps
  extends Omit<PressableProps, "style" | "onPress"> {
  /** Display name of the template shown below the thumbnail */
  name: string;
  /** Category label rendered as a chip overlaid on the thumbnail */
  category: string;
  /** Image source for the thumbnail — local require() or { uri } remote */
  thumbnail: ImageSourcePropType;
  /** When true, renders a gold premium ribbon in the top-right corner */
  isPremium?: boolean;
  /** Aspect ratio of the thumbnail. Defaults to 'portrait' */
  aspect?: TemplateCardAspect;
  /** Callback fired when the card is tapped */
  onPress?: (event: any) => void;
  /** Optional Tailwind class names for layout overrides on the outer container */
  className?: string;
  /** Inline style overrides for the outer container */
  style?: StyleProp<ViewStyle>;
}

const aspectClasses: Record<TemplateCardAspect, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

// Warm-tinted card elevation matching the Bannerly shadow system
const cardShadow: ViewStyle = {
  shadowColor: "#2B2621",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

/**
 * TemplateCard — gallery grid item for browsing banner/poster templates.
 *
 * Renders a thumbnail image with an overlaid category chip, a template name
 * below the thumbnail, and an optional premium gold ribbon badge in the top-right
 * corner. Applies a 0.97 press-scale animation on tap.
 *
 * @prop thumbnail  - Image source (local or remote) for the preview thumbnail.
 * @prop isPremium  - When true, adds a ✦ Premium ribbon to the top-right corner.
 * @prop aspect     - Controls thumbnail aspect ratio: 'portrait' (default), 'landscape', 'square'.
 */
export const TemplateCard = forwardRef<View, TemplateCardProps>(
  (
    {
      name,
      category,
      thumbnail,
      isPremium = false,
      aspect = "portrait",
      onPress,
      className,
      style,
      disabled,
      onPressIn,
      onPressOut,
      accessibilityLabel,
      ...pressableProps
    },
    ref
  ) => {
    const isReduced = useReducedMotion();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (e: any) => {
      if (disabled) return;
      scale.value = isReduced ? 0.97 : withTiming(0.97, { duration: 150 });
      onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
      if (disabled) return;
      scale.value = isReduced ? 1 : withTiming(1, { duration: 200 });
      onPressOut?.(e);
    };

    const containerClassName = ["rounded-2xl overflow-hidden", className]
      .filter(Boolean)
      .join(" ");

    return (
      <AnimatedPressable
        ref={ref}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${name} template`}
        style={[animatedStyle, cardShadow, style]}
        className={containerClassName}
        {...pressableProps}
      >
        {/* ── Thumbnail area ── */}
        <View className={["w-full relative", aspectClasses[aspect]].join(" ")}>
          <Image
            source={thumbnail}
            resizeMode="cover"
            className="absolute inset-0 w-full h-full"
            accessibilityIgnoresInvertColors
          />

          {/* Category chip — bottom-left overlay */}
          <View className="absolute bottom-2 left-2">
            <View className="bg-ink/60 rounded-lg px-2.5 py-1">
              <Text
                variant="caption"
                className="text-cream font-inter-medium tracking-wide"
                numberOfLines={1}
              >
                {category}
              </Text>
            </View>
          </View>

          {/* Premium ribbon — top-right corner */}
          {isPremium && (
            <View className="absolute top-0 right-0">
              {/* Diagonal ribbon background */}
              <View
                className="bg-gold px-2.5 pt-1 pb-1.5 rounded-bl-lg rounded-tr-2xl
                           flex-row items-center gap-1"
              >
                <Text
                  variant="caption"
                  className="text-ink font-inter-semibold tracking-wide"
                >
                  ✦ PRO
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Name label below thumbnail ── */}
        <View className="bg-cream px-3 py-2.5">
          <Text
            variant="body-sm"
            className="text-ink font-inter-medium"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </AnimatedPressable>
    );
  }
);

TemplateCard.displayName = "TemplateCard";

// Register with NativeWind so external className overrides are compiled
cssInterop(TemplateCard, { className: "style" });
