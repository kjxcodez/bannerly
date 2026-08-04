import React, { forwardRef, useState } from "react";
import {
  StyleProp,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { cssInterop } from "nativewind";
import { Text } from "./Text";

export interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  /** The descriptive label displayed above the input field */
  label?: string;
  /** Informational description helper text displayed below the input field */
  helperText?: string;
  /** Error message. If provided, applies error styling to borders, overrides helperText, and sets invalid state */
  error?: string;
  /** Optional Tailwind class name for custom outer wrapper margins or layout */
  className?: string;
  /** Optional Tailwind class name for input element overrides */
  inputClassName?: string;
  /** Inline style overrides for the outer wrapper container */
  style?: StyleProp<ViewStyle>;
  /** Inline style overrides for the inner TextInput element */
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * A highly reusable, accessible, and themed TextInput component.
 * Features animated focus state (coral ring), error validation styles, character counting,
 * and passes the native ref to the underlying input element.
 */
export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      inputClassName,
      style,
      inputStyle,
      onFocus,
      onBlur,
      onChangeText,
      value,
      defaultValue,
      maxLength,
      ...textInputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [textCount, setTextCount] = useState(
      value?.length || defaultValue?.length || 0
    );

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      setTextCount(text.length);
      onChangeText?.(text);
    };

    // Border states: focus (coral), error (error red), default (soft border)
    const borderClass = error
      ? "border-error"
      : isFocused
      ? "border-coral"
      : "border-border";

    // Text color matching our placeholder requirements
    const placeholderColor = "#6B5F52"; // ink-muted hex

    return (
      <View
        style={style}
        className={["flex-col w-full", className].filter(Boolean).join(" ")}
      >
        {/* Input Label */}
        {label && (
          <Text variant="body-sm" className="font-inter-semibold text-ink mb-1.5">
            {label}
          </Text>
        )}

        {/* Input Container Wrapper (maintains touch target and border layout) */}
        <View
          className={[
            "h-12 w-full px-4 rounded-xl border bg-cream-deep flex-row items-center",
            borderClass,
          ].join(" ")}
        >
          <RNTextInput
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            placeholderTextColor={placeholderColor}
            accessibilityLabel={textInputProps.accessibilityLabel || label}
            accessibilityState={{
              disabled: textInputProps.editable === false,
            }}
            accessibilityHint={error || helperText}
            className={[
              "flex-1 h-full text-ink font-inter text-[15px]",
              inputClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            style={inputStyle}
            {...textInputProps}
          />
        </View>

        {/* Helper text / error details / character counter row */}
        {(helperText || error || maxLength !== undefined) && (
          <View className="flex-row items-start justify-between mt-1 px-1">
            {/* Left side: Error message or helper text */}
            <View className="flex-1 mr-4">
              {error ? (
                <Text variant="body-sm" className="text-error">
                  {error}
                </Text>
              ) : helperText ? (
                <Text variant="body-sm" className="text-ink-muted">
                  {helperText}
                </Text>
              ) : null}
            </View>

            {/* Right side: Character counter (e.g. 12/50) */}
            {maxLength !== undefined && (
              <Text variant="caption" className="text-ink-muted">
                {textCount}/{maxLength}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
);

TextInput.displayName = "TextInput";

// Register custom component with NativeWind to support styling via className prop
cssInterop(TextInput, { className: "style" });
