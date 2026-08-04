import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { IconButton } from "../components/IconButton";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { toast } from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Index() {
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isLgLoading, setIsLgLoading] = useState(false);
  const [isIconLoading, setIsIconLoading] = useState(false);
  const [cardPressCount, setCardPressCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState("all");

  const tags = ["all", "posters", "flyers", "invitations", "business"];

  const triggerFullScreenLoading = () => {
    setIsFullScreenLoading(true);
    setTimeout(() => setIsFullScreenLoading(false), 2000);
  };

  const triggerMultipleToasts = () => {
    toast.show("First message in the queue! (Success)", { type: "success" });
    toast.show("Second message waiting in line! (Error)", { type: "error" });
    toast.show("Third message, queue-safe! (Success)", { type: "success" });
  };

  // Renders the full screen spinner during showroom testing
  if (isFullScreenLoading) {
    return <LoadingSpinner fullScreen={true} color="coral" />;
  }

  return (
    <ScrollView 
      className="flex-1 bg-cream p-6"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="mb-8 mt-12">
        <Text variant="display-lg" className="mb-2">
          Make something today
        </Text>
        <Text variant="body" className="text-ink-muted">
          A showcase of our production component library styled with NativeWind and animated with Reanimated.
        </Text>
      </View>

      {/* LoadingSpinners Showroom */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Loading Spinners (Reanimated rotation)
        </Text>
        <View className="gap-6">
          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Spinner Colors</Text>
            <View className="flex-row gap-6 items-center">
              <View className="items-center">
                <LoadingSpinner color="coral" size="md" />
                <Text variant="caption" className="mt-1">coral</Text>
              </View>
              <View className="items-center">
                <LoadingSpinner color="ink" size="md" />
                <Text variant="caption" className="mt-1">ink</Text>
              </View>
              <View className="items-center">
                <LoadingSpinner color="ink-muted" size="md" />
                <Text variant="caption" className="mt-1">ink-muted</Text>
              </View>
              <View className="items-center bg-ink p-2 rounded-lg">
                <LoadingSpinner color="white" size="md" />
                <Text variant="caption" className="text-white mt-1">white</Text>
              </View>
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Spinner Sizes</Text>
            <View className="flex-row gap-6 items-center">
              <View className="items-center">
                <LoadingSpinner color="coral" size="sm" />
                <Text variant="caption" className="mt-1">sm (16px)</Text>
              </View>
              <View className="items-center">
                <LoadingSpinner color="coral" size="md" />
                <Text variant="caption" className="mt-1">md (24px)</Text>
              </View>
              <View className="items-center">
                <LoadingSpinner color="coral" size="lg" />
                <Text variant="caption" className="mt-1">lg (40px)</Text>
              </View>
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Spinner Layouts</Text>
            <Button
              variant="secondary"
              label="Trigger Full-Screen Loader (2s)"
              onPress={triggerFullScreenLoading}
            />
          </View>
        </View>
      </View>

      {/* Toasts Showroom */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Toast Notifications (Queue-Safe & Self-Dismissing)
        </Text>
        <View className="gap-4">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Button
                variant="primary"
                label="Trigger Success"
                onPress={() => toast.show("Design saved successfully!", { type: "success" })}
              />
            </View>
            <View className="flex-1">
              <Button
                variant="destructive"
                label="Trigger Error"
                onPress={() => toast.show("Failed to export image. Try again.", { type: "error" })}
              />
            </View>
          </View>
          <Button
            variant="secondary"
            label="Trigger 3 Toasts in Sequence (Queue Check)"
            onPress={triggerMultipleToasts}
          />
        </View>
      </View>

      {/* Badges / Chips Showroom */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Badges & Chips (Category Filters)
        </Text>
        <View className="gap-6">
          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Static Status Badges</Text>
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="default" label="Draft" />
              <Badge variant="active" label="Published" />
              <Badge 
                variant="premium" 
                label="Premium" 
                leftIcon={<FontAwesome name="star" size={10} color="#2B2621" style={{ marginRight: 2 }} />}
              />
              <Badge variant="default" pill={false} label="Default 8px Radius" />
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Sizes (sm vs md)</Text>
            <View className="flex-row items-center gap-2">
              <Badge size="sm" variant="active" label="Small Chip" />
              <Badge size="md" variant="active" label="Medium Chip" />
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Interactive Chips (Filter UI Example)</Text>
            <View className="flex-row flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "active" : "default"}
                  label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                  onPress={() => setSelectedTag(tag)}
                  accessibilityLabel={`Filter by ${tag}`}
                />
              ))}
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Chips with Trailing Icons (e.g., Close/Remove)</Text>
            <View className="flex-row gap-2">
              <Badge
                variant="default"
                label="Branding"
                rightIcon={<FontAwesome name="times-circle" size={14} color="#6B5F52" style={{ marginLeft: 4 }} />}
                onPress={() => console.log("Remove chip")}
                accessibilityLabel="Remove branding filter"
              />
              <Badge
                variant="active"
                label="Typography"
                rightIcon={<FontAwesome name="times-circle" size={14} color="#E8623D" style={{ marginLeft: 4 }} />}
                onPress={() => console.log("Remove typography")}
                accessibilityLabel="Remove typography filter"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Cards Showroom */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Cards & Containers
        </Text>
        <View className="gap-6">
          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Static Card (default padding: md)</Text>
            <Card>
              <Text variant="title" className="mb-1">Friendly Print Shop</Text>
              <Text variant="body" className="text-ink-muted">
                This is a static container card. It has a warm-tinted shadow, 16px border-radius, and a subtle border.
              </Text>
            </Card>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Interactive Card (onPress + scale transition)</Text>
            <Card 
              onPress={() => setCardPressCount(prev => prev + 1)}
              accessibilityLabel="Tap to increment count"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text variant="title" className="mb-1">Selectable Template</Text>
                  <Text variant="body-sm" className="text-ink-muted">
                    This card acts as a button. Tap it to see the feedback scale animation.
                  </Text>
                </View>
                <View className="bg-coral-tint p-3 rounded-full">
                  <Text variant="body-sm" className="text-coral font-inter-semibold">
                    {cardPressCount}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Card Padding Scales (sm vs lg)</Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Card padding="sm" className="h-28 justify-center">
                  <Text variant="title" className="text-center">Small</Text>
                  <Text variant="caption" className="text-center uppercase text-coral">8px padding</Text>
                </Card>
              </View>
              <View className="flex-1">
                <Card padding="lg" className="h-28 justify-center">
                  <Text variant="title" className="text-center">Large</Text>
                  <Text variant="caption" className="text-center uppercase text-coral">24px padding</Text>
                </Card>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Typography Showroom */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Typography Scale
        </Text>
        <View className="gap-4">
          <View>
            <Text variant="caption" className="uppercase text-coral">display-lg</Text>
            <Text variant="display-lg">Make something today</Text>
          </View>
          <View>
            <Text variant="caption" className="uppercase text-coral">display-md</Text>
            <Text variant="display-md">Create template</Text>
          </View>
          <View>
            <Text variant="caption" className="uppercase text-coral">title</Text>
            <Text variant="title">Small print studio aesthetic</Text>
          </View>
          <View>
            <Text variant="caption" className="uppercase text-coral">body</Text>
            <Text variant="body">Primary body text. Fully styled and spaced for reading comfort.</Text>
          </View>
          <View>
            <Text variant="caption" className="uppercase text-coral">body-sm</Text>
            <Text variant="body-sm">Secondary body text. Used for descriptions and card details.</Text>
          </View>
          <View>
            <Text variant="caption" className="uppercase text-coral">caption</Text>
            <Text variant="caption">TAGS, COUNTERS, AND TIMESTAMPS (+0.02em tracking)</Text>
          </View>
        </View>
      </View>

      {/* IconButton Section */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Icon Buttons (Circular)
        </Text>
        <View className="gap-6">
          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Variants</Text>
            <View className="flex-row gap-4">
              <IconButton
                variant="primary"
                accessibilityLabel="Add item"
                icon={<FontAwesome name="plus" size={20} color="#FFFFFF" />}
                onPress={() => console.log("Primary icon pressed")}
              />
              <IconButton
                variant="secondary"
                accessibilityLabel="Share template"
                icon={<FontAwesome name="share" size={18} color="#2B2621" />}
                onPress={() => console.log("Secondary icon pressed")}
              />
              <IconButton
                variant="premium"
                accessibilityLabel="Favorite item"
                icon={<FontAwesome name="star" size={20} color="#2B2621" />}
                onPress={() => console.log("Premium icon pressed")}
              />
              <IconButton
                variant="destructive"
                accessibilityLabel="Delete item"
                icon={<FontAwesome name="trash" size={18} color="#B14538" />}
                onPress={() => console.log("Destructive icon pressed")}
              />
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">Sizes (sm/md/lg with minimum 44px hit targets)</Text>
            <View className="flex-row items-center gap-4">
              <IconButton
                variant="primary"
                size="sm"
                accessibilityLabel="Edit small"
                icon={<FontAwesome name="pencil" size={14} color="#FFFFFF" />}
              />
              <IconButton
                variant="primary"
                size="md"
                accessibilityLabel="Edit medium"
                icon={<FontAwesome name="pencil" size={18} color="#FFFFFF" />}
              />
              <IconButton
                variant="primary"
                size="lg"
                accessibilityLabel="Edit large"
                icon={<FontAwesome name="pencil" size={22} color="#FFFFFF" />}
              />
            </View>
          </View>

          <View>
            <Text variant="body-sm" className="text-ink-muted mb-2">States</Text>
            <View className="flex-row gap-4">
              <IconButton
                variant="secondary"
                isLoading={true}
                accessibilityLabel="Loading action"
                icon={<FontAwesome name="plus" size={18} color="#2B2621" />}
              />
              <IconButton
                variant="secondary"
                disabled={true}
                accessibilityLabel="Disabled action"
                icon={<FontAwesome name="plus" size={18} color="#2B2621" />}
              />
              <IconButton
                variant="primary"
                isLoading={isIconLoading}
                accessibilityLabel="Click to load action"
                icon={<FontAwesome name="refresh" size={18} color="#FFFFFF" />}
                onPress={() => {
                  setIsIconLoading(true);
                  setTimeout(() => setIsIconLoading(false), 2000);
                }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Button Section */}
      <View className="mb-8">
        <Text variant="title" className="mb-4 border-b border-border pb-2">
          Regular Buttons
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
        <Text variant="title" className="mb-4 border-b border-border pb-2">
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
        <Text variant="title" className="mb-4 border-b border-border pb-2">
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
