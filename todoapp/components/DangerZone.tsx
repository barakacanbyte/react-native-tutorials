import { View, Text, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "@/hooks/useThemes";
import { createSettingsStyles } from "@/assets/styles/settings.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const DangerZone = () => {
  const { colors } = useTheme();
  const settingStyles = createSettingsStyles(colors);

  const clearAllTodos = useMutation(api.todos.clearAllTodos);

  const handleResetApp = async () => {
    Alert.alert(
      "Reset App",
      "⚠️ This will delete ALL your todos permanently. This action cannot be undone",
      [
        {text: "Cancel", style: "cancel"},
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await clearAllTodos();
              Alert.alert(
                "App reset",
                `Successfully deleted ${result.deletedCount} todo${result.deletedCount === 1 ? "" : "s"}, your app has been reset`
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to reset app"
              );
            }
          }
        }
      ]
    )
  }

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={settingStyles.section}
    >
      <Text style={settingStyles.actionTextDanger}>Danger Zone</Text>
      <TouchableOpacity
      style={[settingStyles.actionButton, {borderBottomWidth: 0 }]}
      activeOpacity={0.7}
      onPress={handleResetApp}
      >
        <View style={settingStyles.settingLeft}>
          <LinearGradient
            colors={colors.gradients.danger}
            style={settingStyles.settingIcon}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </LinearGradient>
          <Text style={settingStyles.actionTextDanger}>Reset App</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default DangerZone;
