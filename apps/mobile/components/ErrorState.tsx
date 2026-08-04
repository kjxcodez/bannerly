import React, { forwardRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { cssInterop } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "./Text";
import { Button, ButtonProps } from "./Button";

export interface ErrorStateProps {
  /** The detailed description explaining what went wrong and how to fix it */
  description: string;
  /** Main error title. Defaults to 'Something went wrong' */
  title?: string;
  /** The illustration or icon component rendered at the top. Defaults to a large red warning icon */
  illustration?: React.ReactNode;
  /** Label text for the action retry button. Defaults to 'Try again' */
  retryLabel?: string;
  /** Callback triggered when the retry button is pressed */
  onRetry?: () => void;
  /** If true, renders a spinner inside the retry button and disables interaction */
  isRetrying?: boolean;
  /** Optional custom prop configuration passed directly to the retry Button */
  retryButtonProps?: Partial<ButtonProps>;
  /** Optional Tailwind class name for custom container layout overrides */
  className?: string;
  /** Inline style overrides for the error state wrapper */
  style?: StyleProp<ViewStyle>;
}

/**
 * A highly reusable ErrorState component matching the Bannerly typographic guidelines.
 * Displays error-toned warning feedback (using text-error and warning icons) and supports retrying.
 */
export const ErrorState = forwardRef<View, ErrorStateProps>(
  (
    {
      description,
      title = "Something went wrong",
      illustration,
      retryLabel = "Try again",
      onRetry,
      isRetrying = false,
      retryButtonProps,
      className,
      style,
    },
    ref
  ) => {
    // Default illustration renders an exclamation-circle icon in the Bannerly error theme color
    const defaultIllustration = (
      <FontAwesome name="exclamation-circle" size={48} color="#B14538" />
    );

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
        {/* Error Illustration Slot */}
        <View className="mb-6">{illustration || defaultIllustration}</View>

        {/* Error-toned Serif Headline */}
        <Text variant="display-md" className="text-center text-error mb-2">
          {title}
        </Text>

        {/* Sans-serif Description */}
        <Text variant="body" className="text-center text-ink-muted mb-6">
          {description}
        </Text>

        {/* Retry CTA Action */}
        {onRetry && (
          <Button
            variant="primary"
            label={retryLabel}
            onPress={onRetry}
            isLoading={isRetrying}
            {...retryButtonProps}
          />
        )}
      </View>
    );
  }
);

ErrorState.displayName = "ErrorState";

// Register custom component with NativeWind to support styling via className prop
cssInterop(ErrorState, { className: "style" });
