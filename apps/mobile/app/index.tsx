import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "../components/Button";

export default function Index() {
  const [isLgLoading, setIsLgLoading] = useState(false);

  return (
    <ScrollView 
      className="flex-1 bg-cream p-6"
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      <View className="mb-8 mt-12">
        <Text className="text-3xl font-fraunces text-ink mb-2">
          Bannerly Buttons
        </Text>
        <Text className="text-sm font-inter text-ink-muted">
          A showcase of our production component library styled with NativeWind and animated with Reanimated.
        </Text>
      </View>

      {/* Variants Section */}
      <View className="mb-8">
        <Text className="text-lg font-inter-semibold text-ink mb-4 border-b border-border pb-2">
          Button Variants
        </Text>
        <View className="gap-4">
          <Button 
            variant="primary" 
            label="Primary Action" 
            onPress={() => console.log("Primary pressed")}
          />
          <Button 
            variant="secondary" 
            label="Secondary Action" 
            onPress={() => console.log("Secondary pressed")}
          />
          <Button 
            variant="premium" 
            label="Upgrade to Premium" 
            onPress={() => console.log("Premium pressed")}
          />
          <Button 
            variant="destructive" 
            label="Delete Design" 
            onPress={() => console.log("Destructive pressed")}
          />
        </View>
      </View>

      {/* Sizes Section */}
      <View className="mb-8">
        <Text className="text-lg font-inter-semibold text-ink mb-4 border-b border-border pb-2">
          Button Sizes
        </Text>
        <View className="gap-4 items-start">
          <Button 
            variant="primary" 
            size="sm" 
            label="Small Button" 
          />
          <Button 
            variant="primary" 
            size="md" 
            label="Medium Button (Default)" 
          />
          <Button 
            variant="primary" 
            size="lg" 
            label="Large Button" 
          />
        </View>
      </View>

      {/* States Section */}
      <View className="mb-8">
        <Text className="text-lg font-inter-semibold text-ink mb-4 border-b border-border pb-2">
          Button States
        </Text>
        <View className="gap-4">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Button 
                variant="primary" 
                isLoading={true} 
                label="Loading..." 
              />
            </View>
            <View className="flex-1">
              <Button 
                variant="secondary" 
                disabled={true} 
                label="Disabled State" 
              />
            </View>
          </View>

          <Button 
            variant="premium" 
            isLoading={isLgLoading}
            label={isLgLoading ? "Processing..." : "Tap to Load (Premium)"}
            onPress={() => {
              setIsLgLoading(true);
              setTimeout(() => setIsLgLoading(false), 2000);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
