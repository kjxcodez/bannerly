import React, { forwardRef, useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  Text,
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

export interface Segment {
  /** Unique key identifier for the segment option */
  id: string;
  /** The text label displayed inside the segment */
  label: string;
  /** Optional custom accessibility label override */
  accessibilityLabel?: string;
}

export interface SegmentedControlProps {
  /** Array of segment items to display (supports 2 or more segments) */
  segments: Segment[];
  /** Index of the currently active segment (0-indexed) */
  selectedIndex: number;
  /** Callback triggered when a segment index is selected */
  onChange: (index: number) => void;
  /** Optional Tailwind class name for layout modifications */
  className?: string;
  /** Inline style overrides for the outer container */
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Tab option sub-component wrapping touch feedback scale and accessibility states.
 */
interface SegmentTabProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

const SegmentTab: React.FC<SegmentTabProps> = ({
  label,
  isSelected,
  onPress,
  accessibilityLabel,
}) => {
  const isReduced = useReducedMotion();
  const pressScale = useSharedValue(1);

  const tabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

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

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={accessibilityLabel || label}
      style={tabStyle}
      className="flex-1 h-full items-center justify-center z-10"
    >
      <Text
        className={[
          "text-sm font-inter-semibold text-center transition-colors duration-150",
          isSelected ? "text-ink" : "text-ink-muted",
        ].join(" ")}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

/**
 * A highly reusable SegmentedControl component matching the Bannerly Design System.
 * Displays a sliding background selection pill behind tab targets. Used for toggles and settings.
 */
export const SegmentedControl = forwardRef<View, SegmentedControlProps>(
  ({ segments, selectedIndex, onChange, className, style }, ref) => {
    const isReduced = useReducedMotion();
    const [containerWidth, setContainerWidth] = useState(0);

    const indicatorTranslateX = useSharedValue(0);

    // Compute segment widths based on outer container size
    const horizontalPadding = 8; // 4px padding on each side of the container (p-1)
    const trackWidth = Math.max(0, containerWidth - horizontalPadding);
    const segmentWidth = segments.length > 0 ? trackWidth / segments.length : 0;

    const onContainerLayout = (event: LayoutChangeEvent) => {
      setContainerWidth(event.nativeEvent.layout.width);
    };

    // Keep translateX offset synchronized with the selectedIndex
    useEffect(() => {
      if (segmentWidth > 0) {
        const targetValue = selectedIndex * segmentWidth;
        if (isReduced) {
          indicatorTranslateX.value = targetValue;
        } else {
          indicatorTranslateX.value = withTiming(targetValue, {
            duration: 200,
          });
        }
      }
    }, [selectedIndex, segmentWidth, isReduced, indicatorTranslateX]);

    const indicatorStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: indicatorTranslateX.value }],
    }));

    return (
      <View
        ref={ref}
        onLayout={onContainerLayout}
        style={style}
        className={[
          "h-11 w-full p-1 bg-cream-deep border border-border rounded-xl flex-row items-center relative overflow-hidden",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        accessibilityRole="tablist"
      >
        {/* Animated Background Selector Pill */}
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              indicatorStyle,
              {
                width: segmentWidth,
                left: 4, // aligns with container p-1
              },
            ]}
            className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm z-0"
          />
        )}

        {/* Tab Selection Targets */}
        {segments.map((segment, index) => (
          <SegmentTab
            key={segment.id}
            label={segment.label}
            isSelected={selectedIndex === index}
            onPress={() => onChange(index)}
            accessibilityLabel={segment.accessibilityLabel}
          />
        ))}
      </View>
    );
  }
);

SegmentedControl.displayName = "SegmentedControl";

// Register custom component with NativeWind to support styling via className prop
cssInterop(SegmentedControl, { className: "style" });
