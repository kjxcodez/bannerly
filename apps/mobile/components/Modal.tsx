import React, { forwardRef, useEffect, useState } from "react";
import {
  Dimensions,
  Modal as RNModal,
  PanResponder,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { Text } from "./Text";
import { IconButton } from "./IconButton";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export interface ModalProps {
  /** Visibility state of the modal/sheet */
  isOpen: boolean;
  /** Triggered when the modal requests dismissal (backdrop tap, header close, or swipe-down) */
  onClose: () => void;
  /** Children elements rendered inside the modal content panel */
  children: React.ReactNode;
  /** Visual presentation style. 'bottom-sheet' slides up; 'dialog' centers and scales. Defaults to 'bottom-sheet' */
  variant?: "bottom-sheet" | "dialog";
  /** Optional title rendered in the modal header */
  title?: string;
  /** Optional Tailwind class name for the modal panel */
  className?: string;
  /** Inline style overrides for the inner panel wrapper */
  style?: StyleProp<ViewStyle>;
}

/**
 * A highly reusable and accessible Modal & BottomSheet component matching the Bannerly Design System.
 * Supports smooth slide-up and scale-in animations, backdrop-fades, close buttons,
 * and swipe-down gestures on the sheet's top drag handle.
 */
export const Modal = forwardRef<View, ModalProps>(
  (
    {
      isOpen,
      onClose,
      children,
      variant = "bottom-sheet",
      title,
      className,
      style,
    },
    ref
  ) => {
    const isReduced = useReducedMotion();
    const [shouldRender, setShouldRender] = useState(isOpen);

    const backdropOpacity = useSharedValue(0);
    const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
    const dialogScale = useSharedValue(0.9);
    const dialogOpacity = useSharedValue(0);

    const handleOpen = () => {
      if (isReduced) {
        backdropOpacity.value = 1;
        sheetTranslateY.value = 0;
        dialogScale.value = 1;
        dialogOpacity.value = 1;
      } else {
        backdropOpacity.value = withTiming(1, { duration: 200 });
        sheetTranslateY.value = withTiming(0, { duration: 250 });
        dialogScale.value = withTiming(1, { duration: 250 });
        dialogOpacity.value = withTiming(1, { duration: 250 });
      }
    };

    const handleClose = (callback?: () => void) => {
      const onFinish = () => {
        setShouldRender(false);
        callback?.();
      };

      if (isReduced) {
        backdropOpacity.value = 0;
        sheetTranslateY.value = SCREEN_HEIGHT;
        dialogScale.value = 0.9;
        dialogOpacity.value = 0;
        onFinish();
      } else {
        backdropOpacity.value = withTiming(0, { duration: 150 });
        dialogScale.value = withTiming(0.9, { duration: 150 });
        dialogOpacity.value = withTiming(0, { duration: 150 });
        sheetTranslateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 200 },
          (finished) => {
            if (finished) {
              runOnJS(onFinish)();
            }
          }
        );
      }
    };

    // Monitor external isOpen state
    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else {
        handleClose();
      }
    }, [isOpen]);

    // Animate once mounted and ready
    useEffect(() => {
      if (shouldRender && isOpen) {
        handleOpen();
      }
    }, [shouldRender, isOpen]);

    // PanResponder for drag-to-dismiss bottom sheet gestures
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Dragging downward
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.value = gestureState.dy;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          // Dragged past threshold - trigger dismissal callback
          handleClose(onClose);
        } else {
          // Snap back to top
          if (isReduced) {
            sheetTranslateY.value = 0;
          } else {
            sheetTranslateY.value = withSpring(0, { damping: 15 });
          }
        }
      },
    });

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    const sheetAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: sheetTranslateY.value }],
    }));

    const dialogAnimatedStyle = useAnimatedStyle(() => ({
      opacity: dialogOpacity.value,
      transform: [{ scale: dialogScale.value }],
    }));

    if (!shouldRender) return null;

    return (
      <RNModal
        transparent
        visible={true}
        animationType="none"
        onRequestClose={() => handleClose(onClose)}
      >
        {/* Full-Screen Backdrop */}
        <Animated.View
          style={backdropAnimatedStyle}
          className="absolute inset-0 bg-ink/50"
        >
          <Pressable
            className="w-full h-full"
            onPress={() => handleClose(onClose)}
            accessibilityRole="button"
            accessibilityLabel="Close modal overlay"
          />
        </Animated.View>

        {/* Modal Container Body */}
        {variant === "bottom-sheet" ? (
          <View className="flex-1 justify-end">
            <Animated.View
              ref={ref}
              style={[sheetAnimatedStyle, style]}
              className={[
                "w-full bg-cream rounded-t-2xl pb-10 border-t border-border shadow-2xl max-h-[85%]",
                className,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Swipe-down drag handle */}
              <View
                {...panResponder.panHandlers}
                className="w-full py-4 items-center"
              >
                <View className="w-12 h-1 bg-border rounded-full" />
              </View>

              {/* Sheet Content padding */}
              <View className="px-6">
                {/* Optional Header Row */}
                {title && (
                  <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-border">
                    <Text variant="title" className="text-ink">
                      {title}
                    </Text>
                    <IconButton
                      variant="secondary"
                      size="sm"
                      accessibilityLabel="Close bottom sheet"
                      icon={<FontAwesome name="times" size={14} color="#6B5F52" />}
                      onPress={() => handleClose(onClose)}
                    />
                  </View>
                )}

                {/* Main Content */}
                {children}
              </View>
            </Animated.View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-6">
            <Animated.View
              ref={ref}
              style={[dialogAnimatedStyle, style]}
              className={[
                "w-full max-w-sm bg-cream rounded-2xl p-6 border border-border shadow-2xl",
                className,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Optional Dialog Header Row */}
              {title && (
                <View className="flex-row items-center justify-between pb-3 mb-4 border-b border-border">
                  <Text variant="title" className="text-ink">
                    {title}
                  </Text>
                  <IconButton
                    variant="secondary"
                    size="sm"
                    accessibilityLabel="Close confirmation dialog"
                    icon={<FontAwesome name="times" size={14} color="#6B5F52" />}
                    onPress={() => handleClose(onClose)}
                  />
                </View>
              )}

              {/* Main Content */}
              {children}
            </Animated.View>
          </View>
        )}
      </RNModal>
    );
  }
);

Modal.displayName = "Modal";

// Register custom component with NativeWind to support styling via className prop
cssInterop(Modal, { className: "style" });
