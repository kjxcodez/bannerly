import React, { forwardRef, useCallback, useEffect } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

// ─── Design token hex values ──────────────────────────────────────────────────
// Used only where Tailwind class strings can't reach: SVG stroke, shadow color,
// and imperative color interpolation. Must stay in sync with tailwind.config.js.
const TOKEN = {
  border: "#E4DBC9",
  coral: "#E8623D",
  inkMuted: "#6B5F5280", // ink-muted at 50% opacity for empty-slot hint
} as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// ─── Types ────────────────────────────────────────────────────────────────────

/** Semantic type of this editable region — drives the empty-state hint icon/label. */
export type SlotType = "text" | "image" | "logo" | "background" | "sticker";

export interface SlotOverlayProps extends Omit<PressableProps, "style"> {
  /** Whether this slot is currently selected (coral outline + glow). */
  isSelected: boolean;
  /**
   * Semantic kind of content this slot holds. Controls the empty-state icon
   * and hint label when `children` is absent. Defaults to 'text'.
   */
  slotType?: SlotType;
  /**
   * Override the auto-generated hint label. E.g. "Add headline" for a specific
   * text slot. Falls back to the slotType default when omitted.
   */
  hintLabel?: string;
  /** Content already placed in this slot. When provided, the empty-state hint is hidden. */
  children?: React.ReactNode;
  /**
   * Border radius (px) applied to both the slot container and the SVG outline.
   * Defaults to 8 (chip/sticker scale). Use 16 for card-scale slots.
   */
  borderRadius?: number;
  /** Optional Tailwind class names for outer container layout/sizing overrides. */
  className?: string;
  /** Inline style overrides for the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ─── Slot hint metadata ───────────────────────────────────────────────────────

type HintMeta = { icon: React.ComponentProps<typeof FontAwesome>["name"]; label: string };

const SLOT_HINTS: Record<SlotType, HintMeta> = {
  text:       { icon: "font",     label: "Tap to edit text"      },
  image:      { icon: "image",    label: "Tap to add image"      },
  logo:       { icon: "star-o",   label: "Tap to add logo"       },
  background: { icon: "th-large", label: "Tap to set background" },
  sticker:    { icon: "smile-o",  label: "Tap to add sticker"    },
};

// ─── SVG animated border ──────────────────────────────────────────────────────

interface SlotBorderProps {
  /** 0 = unselected (dashed neutral), 1 = selected (solid coral). */
  progress: SharedValue<number>;
  borderRadius: number;
}

/**
 * Cross-platform SVG outline that crossfades between a dashed neutral border
 * and a solid coral border as `progress` animates 0 → 1.
 */
function SlotBorder({ progress, borderRadius }: SlotBorderProps) {
  // Dashed rect (border token) fades out as selected
  const dashedProps = useAnimatedProps(() => ({
    strokeOpacity: 1 - progress.value,
  }));

  // Solid coral rect fades in as selected
  const solidProps = useAnimatedProps(() => ({
    strokeOpacity: progress.value,
  }));

  return (
    <Svg
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0 }}
      pointerEvents="none"
    >
      {/* Dashed neutral outline — visible when unselected */}
      <AnimatedRect
        x={1}
        y={1}
        width="99%"
        height="99%"
        rx={borderRadius}
        ry={borderRadius}
        fill="none"
        stroke={TOKEN.border}
        strokeWidth={1.5}
        strokeDasharray="6 5"
        animatedProps={dashedProps}
      />
      {/* Solid coral outline — visible when selected */}
      <AnimatedRect
        x={1}
        y={1}
        width="99%"
        height="99%"
        rx={borderRadius}
        ry={borderRadius}
        fill="none"
        stroke={TOKEN.coral}
        strokeWidth={2}
        animatedProps={solidProps}
      />
    </Svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * SlotOverlay — editable-region indicator rendered on the Bannerly design canvas.
 *
 * Unselected: dashed border in the neutral `border` token color + muted hint.
 * Selected:   coral solid border + warm coral glow shadow + hint text turns coral.
 *
 * When `children` are present (slot has content), the empty-state hint is hidden
 * but the outline + glow remain to indicate editability.
 *
 * @prop isSelected   - Drives the coral border + glow selection state.
 * @prop slotType     - Controls the auto-generated empty-state hint. Default: 'text'.
 * @prop hintLabel    - Override the default hint copy for this specific slot instance.
 * @prop borderRadius - Outline corner radius in px. Default 8 (chip scale).
 */
export const SlotOverlay = forwardRef<View, SlotOverlayProps>(
  (
    {
      isSelected,
      slotType = "text",
      hintLabel,
      children,
      borderRadius = 8,
      className,
      style,
      disabled,
      onPress,
      onPressIn,
      onPressOut,
      accessibilityLabel,
      ...pressableProps
    },
    ref
  ) => {
    const isReduced = useReducedMotion();

    // 0 = unselected, 1 = selected — drives all animated transitions
    const progress = useSharedValue(isSelected ? 1 : 0);
    const pressScale = useSharedValue(1);

    const syncProgress = useCallback(() => {
      const target = isSelected ? 1 : 0;
      progress.value = isReduced
        ? target
        : withTiming(target, { duration: 200 });
    }, [isSelected, isReduced, progress]);

    useEffect(() => {
      syncProgress();
    }, [syncProgress]);

    // ── Animated styles ───────────────────────────────────────────────────────

    // Outer container: coral glow shadow grows as selected
    const containerStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
      shadowColor: TOKEN.coral,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: progress.value * 0.4,
      shadowRadius: progress.value * 12,
      elevation: progress.value * 8,
    }));

    // Hint text: ink-muted → coral as selected
    const hintTextStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        progress.value,
        [0, 1],
        [TOKEN.inkMuted, TOKEN.coral]
      ),
    }));

    // ── Press handlers ────────────────────────────────────────────────────────

    const handlePressIn = (
      e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]
    ) => {
      if (disabled) return;
      pressScale.value = isReduced ? 0.97 : withTiming(0.97, { duration: 150 });
      onPressIn?.(e);
    };

    const handlePressOut = (
      e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]
    ) => {
      if (disabled) return;
      pressScale.value = isReduced ? 1 : withTiming(1, { duration: 200 });
      onPressOut?.(e);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    const hint = SLOT_HINTS[slotType];
    const resolvedLabel = hintLabel ?? hint.label;
    const isEmpty = !children;

    return (
      <AnimatedPressable
        ref={ref}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ??
          (isSelected ? `${resolvedLabel} — selected` : resolvedLabel)
        }
        accessibilityState={{ selected: isSelected }}
        style={[containerStyle, style]}
        className={[
          "relative overflow-hidden min-w-[44px] min-h-[44px]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...pressableProps}
      >
        {/* ── Slot content (filled state) ── */}
        {children}

        {/* ── Empty-state hint ── */}
        {isEmpty && (
          <View className="absolute inset-0 items-center justify-center gap-1.5 px-3">
            {/* Icon — re-renders on isSelected flip to pick up the new color */}
            <FontAwesome
              name={hint.icon}
              size={20}
              color={isSelected ? TOKEN.coral : TOKEN.inkMuted}
            />
            <Animated.Text
              style={[
                hintTextStyle,
                {
                  fontFamily: "Inter-Regular",
                  fontSize: 11,
                  lineHeight: 15,
                  textAlign: "center",
                },
              ]}
              numberOfLines={2}
            >
              {resolvedLabel}
            </Animated.Text>
          </View>
        )}

        {/* ── SVG dashed/solid outline (absolutely covers the slot) ── */}
        <SlotBorder progress={progress} borderRadius={borderRadius} />
      </AnimatedPressable>
    );
  }
);

SlotOverlay.displayName = "SlotOverlay";

// Register with NativeWind for external className overrides
cssInterop(SlotOverlay, { className: "style" });
