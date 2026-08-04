import React, { forwardRef } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cssInterop } from "nativewind";

export type TextVariant =
  | "display-lg"
  | "display-md"
  | "title"
  | "body"
  | "body-sm"
  | "caption";

export interface TextProps extends RNTextProps {
  /** The design system typography variant. Defaults to 'body' */
  variant?: TextVariant;
  /** Optional Tailwind class name for styling overrides (e.g. colors, margins) */
  className?: string;
}

// Maps type scale tokens to Tailwind classes.
// Display fonts use Fraunces (serif). Body and UI elements use Inter (sans-serif).
// Line heights and tracking follow the DESIGN.md specifications.
const variantClasses: Record<TextVariant, string> = {
  "display-lg": "text-[32px] font-fraunces leading-[37px] text-ink",
  "display-md": "text-[24px] font-fraunces leading-[28px] text-ink",
  title: "text-[18px] font-inter-semibold leading-[25px] text-ink",
  body: "text-[15px] font-inter leading-[21px] text-ink",
  "body-sm": "text-[13px] font-inter leading-[18px] text-ink",
  caption: "text-[11px] font-inter-medium leading-[15px] tracking-[0.02em] text-ink-muted",
};

/**
 * A reusable, typed wrapper around React Native's Text component.
 * Ensures strict adherence to the Bannerly typographic hierarchy.
 */
export const Text = forwardRef<RNText, TextProps>(
  ({ variant = "body", className, style, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={[variantClasses[variant], className].filter(Boolean).join(" ")}
        style={style}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

// Register custom component with NativeWind to support styling via className prop
cssInterop(Text, { className: "style" });
