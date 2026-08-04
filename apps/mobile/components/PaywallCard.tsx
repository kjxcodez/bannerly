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
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { Text } from "./Text";
import { Button } from "./Button";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Types ────────────────────────────────────────────────────────────────────

/** Billing frequency of the pricing tier. */
export type PricingPeriod = "monthly" | "yearly" | "lifetime";

export interface PaywallCardProps extends Omit<PressableProps, "style"> {
  /** The billing period this card represents. Drives label defaults and "Best Value" ribbon. */
  period: PricingPeriod;
  /**
   * Main price string to display, e.g. "$4.99" or "$39.99".
   * Rendered large in the Fraunces display font.
   */
  price: string;
  /**
   * Optional secondary price line, e.g. "per month" or "billed annually".
   * Displayed below the main price in body-sm / ink-muted.
   */
  priceNote?: string;
  /**
   * Override the auto-generated period label, e.g. "Annual" instead of "Yearly".
   * Falls back to the capitalized period name when omitted.
   */
  periodLabel?: string;
  /** Feature bullet points shown below the price. Keep to 3–5 for visual balance. */
  features: string[];
  /**
   * When true, renders the "Best Value" gold ribbon in the top-right corner.
   * Automatically true for 'yearly' if not explicitly set.
   */
  showBestValue?: boolean;
  /**
   * Whether this card is the currently selected/active tier.
   * Shows a coral border and fills the CTA button as primary.
   */
  isSelected?: boolean;
  /** Label for the CTA button at the bottom of the card. Defaults to "Get Started". */
  ctaLabel?: string;
  /** Called when the CTA button inside the card is pressed. */
  onCtaPress?: () => void;
  /** If true, renders the CTA button in a loading state. */
  isCtaLoading?: boolean;
  /** Optional Tailwind class names for layout overrides on the outer container. */
  className?: string;
  /** Inline style overrides for the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_LABELS: Record<PricingPeriod, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  lifetime: "Lifetime",
};

// Warm ink-tinted card shadow (same scale as Card.tsx)
const cardShadow: ViewStyle = {
  shadowColor: "#2B2621",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

// Elevated shadow used when the card is selected
const selectedShadow: ViewStyle = {
  shadowColor: "#E8623D",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 5,
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PaywallCard — pricing tier selection card for the Bannerly premium paywall.
 *
 * Supports monthly, yearly (with optional "Best Value" gold ribbon), and
 * lifetime tiers. A `isSelected` state renders a coral border + elevated
 * shadow to highlight the active plan. Contains a press-scale animation
 * on the whole card and a bottom CTA button wired to `onCtaPress`.
 *
 * @prop period        - Billing period; drives ribbon + label defaults.
 * @prop price         - Primary price string (e.g. "$4.99").
 * @prop priceNote     - Secondary price line (e.g. "per month").
 * @prop features      - Array of feature bullet strings (3–5 recommended).
 * @prop showBestValue - Forces the gold "Best Value" ribbon. Auto-true for yearly.
 * @prop isSelected    - Highlights this card as the active tier.
 * @prop ctaLabel      - CTA button label. Defaults to "Get Started".
 * @prop onCtaPress    - Handler for the CTA button press.
 * @prop isCtaLoading  - Puts the CTA button into a loading state.
 */
export const PaywallCard = forwardRef<View, PaywallCardProps>(
  (
    {
      period,
      price,
      priceNote,
      periodLabel,
      features,
      showBestValue,
      isSelected = false,
      ctaLabel = "Get Started",
      onCtaPress,
      isCtaLoading = false,
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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (
      e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]
    ) => {
      if (disabled) return;
      scale.value = isReduced ? 0.97 : withTiming(0.97, { duration: 150 });
      onPressIn?.(e);
    };

    const handlePressOut = (
      e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]
    ) => {
      if (disabled) return;
      scale.value = isReduced ? 1 : withTiming(1, { duration: 200 });
      onPressOut?.(e);
    };

    // "Best Value" ribbon: explicitly set, or auto-applied to yearly
    const hasBestValue = showBestValue ?? period === "yearly";

    const resolvedPeriodLabel = periodLabel ?? PERIOD_LABELS[period];

    // Selected state: coral border; unselected: neutral border
    const borderClass = isSelected
      ? "border-2 border-coral"
      : "border border-border";

    const containerClassName = [
      "rounded-2xl bg-cream overflow-hidden",
      borderClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const shadowStyle = isSelected ? selectedShadow : cardShadow;

    const a11yLabel =
      accessibilityLabel ??
      `${resolvedPeriodLabel} plan, ${price}${priceNote ? `, ${priceNote}` : ""}${isSelected ? ", selected" : ""}`;

    return (
      <AnimatedPressable
        ref={ref}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityState={{ selected: isSelected }}
        style={[animatedStyle, shadowStyle, style]}
        className={containerClassName}
        {...pressableProps}
      >
        {/* ── "Best Value" ribbon ── */}
        {hasBestValue && (
          <View className="absolute top-0 right-0 z-10">
            <View className="bg-gold px-3 pt-1 pb-1.5 rounded-bl-xl rounded-tr-2xl flex-row items-center gap-1">
              <FontAwesome name="star" size={10} color="#2B2621" />
              <Text
                variant="caption"
                className="text-ink font-inter-semibold tracking-wide"
              >
                Best Value
              </Text>
            </View>
          </View>
        )}

        {/* ── Card body ── */}
        <View className="p-6 gap-4">

          {/* Period label row */}
          <View className="flex-row items-center gap-2">
            {/* Dot indicator — coral when selected, muted when not */}
            <View
              className={[
                "w-2 h-2 rounded-full",
                isSelected ? "bg-coral" : "bg-border",
              ].join(" ")}
            />
            <Text
              variant="body-sm"
              className={isSelected ? "text-coral font-inter-semibold" : "text-ink-muted"}
            >
              {resolvedPeriodLabel}
            </Text>
          </View>

          {/* Price block */}
          <View className="gap-0.5">
            <Text variant="display-md" className="text-ink leading-tight">
              {price}
            </Text>
            {priceNote ? (
              <Text variant="body-sm" className="text-ink-muted">
                {priceNote}
              </Text>
            ) : null}
          </View>

          {/* Divider */}
          <View className="h-px bg-border" />

          {/* Feature list */}
          <View className="gap-2">
            {features.map((feature, idx) => (
              <View key={idx} className="flex-row items-start gap-2.5">
                <View className="mt-0.5">
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color={isSelected ? "#E8623D" : "#4A7A5E"}
                  />
                </View>
                <Text
                  variant="body-sm"
                  className="text-ink flex-1"
                  numberOfLines={2}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* CTA button */}
          <Button
            variant={isSelected ? "primary" : "secondary"}
            label={ctaLabel}
            onPress={onCtaPress}
            isLoading={isCtaLoading}
            disabled={disabled}
            accessibilityLabel={`${ctaLabel} — ${resolvedPeriodLabel} plan`}
          />
        </View>
      </AnimatedPressable>
    );
  }
);

PaywallCard.displayName = "PaywallCard";

// Register with NativeWind for external className layout overrides
cssInterop(PaywallCard, { className: "style" });
