import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const renderIcon = (
    name: React.ComponentProps<typeof Feather>["name"],
    color: string
  ) => (
    <View style={styles.iconContainer}>
      <Feather name={name} size={24} color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "orange",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={50}
              tint={colorScheme ?? "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={styles.androidTabBackground} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => renderIcon("home", color),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          tabBarIcon: ({ color }) => renderIcon("archive", color),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          tabBarIcon: ({ color }) => renderIcon("box", color),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          tabBarIcon: ({ color }) => renderIcon("align-justify", color),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    marginHorizontal: 16,
    bottom: 30,
    borderRadius: 18,
    height: 40,
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    overflow: "hidden",
    backgroundColor:
      Platform.OS === "android" ? "rgba(255,255,255,0.95)" : "transparent",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  androidTabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 22,
  },
});
