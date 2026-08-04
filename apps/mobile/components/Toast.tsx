import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

export type ToastType = "success" | "error";

export interface ToastOptions {
  /** Variant type of the toast. Defaults to 'success' */
  type?: ToastType;
  /** Auto-dismiss duration in milliseconds. Defaults to 2500 */
  duration?: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Static Toast Service API allowing trigger from anywhere
type ToastListener = (message: string, options?: ToastOptions) => void;
let activeToastListener: ToastListener | null = null;

export const toast = {
  /** Show a toast notification with custom message and options */
  show: (message: string, options?: ToastOptions) => {
    if (activeToastListener) {
      activeToastListener(message, options);
    }
  },
};

// Warm shadow matching Bannerly design system for modals/sheets
const toastShadow: ViewStyle = {
  shadowColor: "#2B2621",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 4,
};

interface ToastComponentProps {
  toastData: ToastMessage;
  onClose: () => void;
}

/**
 * Animated Toast banner component. Handles its own intro, countdown bar, and exit transitions.
 */
const ToastBanner = ({ toastData, onClose }: ToastComponentProps) => {
  const { message, type, duration } = toastData;
  const isReduced = useReducedMotion();
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);
  const progress = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const triggerDismiss = () => {
    if (isReduced) {
      opacity.value = 0;
      onClose();
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(60, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
    }
  };

  useEffect(() => {
    if (isReduced) {
      opacity.value = 1;
      translateY.value = 0;
      const timer = setTimeout(() => {
        triggerDismiss();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      // Intro animation
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          // Progress countdown animation
          progress.value = withTiming(0, { duration }, (progressFinished) => {
            if (progressFinished) {
              runOnJS(triggerDismiss)();
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReduced, duration]);

  const handleManualClose = () => {
    cancelAnimation(progress);
    triggerDismiss();
  };

  const accentColorClass = type === "success" ? "bg-success" : "bg-error";

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[containerStyle, toastShadow]}
      className="absolute bottom-10 left-6 right-6 bg-cream-deep border border-border rounded-xl flex-row overflow-hidden min-h-[52px]"
    >
      {/* Left Accent Line */}
      <View className={["w-1.5", accentColorClass].join(" ")} />

      {/* Main Toast Content */}
      <View className="flex-1 p-3.5 flex-row items-center justify-between">
        <Text className="text-ink font-inter text-sm flex-1 mr-4">
          {message}
        </Text>

        {/* Close Button */}
        <Pressable
          onPress={handleManualClose}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Dismiss message"
          className="active:opacity-60"
        >
          <FontAwesome name="times" size={14} color="#6B5F52" />
        </Pressable>
      </View>

      {/* Countdown Progress Indicator */}
      {!isReduced && (
        <Animated.View
          style={progressStyle}
          className={["absolute bottom-0 left-1.5 h-[2px]", accentColorClass].join(
            " "
          )}
        />
      )}
    </Animated.View>
  );
};

const ToastContext = createContext<((message: string, options?: ToastOptions) => void) | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * ToastProvider should wrap the root layout of the application.
 * Manages toast queue-safety, ensuring only one toast is visible at any given time.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [queue, setQueue] = useState<ToastMessage[]>([]);
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, options?: ToastOptions) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(),
      message,
      type: options?.type || "success",
      duration: options?.duration || 2500,
    };
    setQueue((prev) => [...prev, newToast]);
  };

  useEffect(() => {
    activeToastListener = showToast;
    return () => {
      activeToastListener = null;
    };
  }, []);

  useEffect(() => {
    if (!currentToast && queue.length > 0) {
      const nextToast = queue[0];
      setCurrentToast(nextToast);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, currentToast]);

  const handleClose = () => {
    setCurrentToast(null);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {currentToast && (
        <ToastBanner
          key={currentToast.id}
          toastData={currentToast}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
