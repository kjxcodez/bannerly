import React, { forwardRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { cssInterop } from "nativewind";
import { Text } from "./Text";
import { Button, ButtonProps } from "./Button";

export interface EmptyStateProps {
  /** Main headline text rendered in the Bannerly Serif (Fraunces) style */
  title: string;
  /** Informational description text detailing the empty state and offering guidance */
  description: string;
  /** The illustration or icon component rendered at the top of the empty state */
  illustration?: React.ReactNode;
  /** Optional button label. If provided, renders an action button below the description */
  actionLabel?: string;
  /** Callback triggered when the optional action button is tapped */
  onActionPress?: () => void;
  /** Optional style configuration overrides passed to the Action Button component */
  actionButtonProps?: Partial<ButtonProps>;
  /** Optional Tailwind class name for custom margins/alignment */
  className?: string;
  /** Inline style overrides for the outer wrapper container */
  style?: StyleProp<ViewStyle>;
}

/**
 * A highly reusable EmptyState component matching the Bannerly typographic and button guidelines.
 * Used to prompt users when there are no items in a list, drafts, or search results.
 */
export const EmptyState = forwardRef<View, EmptyStateProps>(
  (
    {
      title,
      description,
      illustration,
      actionLabel,
      onActionPress,
      actionButtonProps,
      className,
      style,
    },
    ref
  ) => {
    return (
      <View
        ref={ref}
        style={style}
        className={[
          "flex-col items-center justify-center p-8 bg-transparent max-w-sm self-center",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        accessibilityRole="summary"
      >
        {/* Optional Illustration Container */}
        {illustration && <View className="mb-6">{illustration}</View>}

        {/* Serif Headline Title */}
        <Text variant="display-md" className="text-center text-ink mb-2">
          {title}
        </Text>

        {/* Sans-serif Description */}
        <Text variant="body" className="text-center text-ink-muted mb-6">
          {description}
        </Text>

        {/* Optional Action Button */}
        {actionLabel && (
          <Button
            variant="primary"
            label={actionLabel}
            onPress={onActionPress}
            {...actionButtonProps}
          />
        )}
      </View>
    );
  }
);

EmptyState.displayName = "EmptyState";

// Register custom component with NativeWind to support styling via className prop
cssInterop(EmptyState, { className: "style" });
