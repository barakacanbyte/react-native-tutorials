import { View, Text, Switch } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import useTheme  from '@/hooks/useThemes';
import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { Ionicons } from '@expo/vector-icons';

const Preferences = () => {
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);

  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const settingStyles = createSettingsStyles(colors);
  
  return (
    <LinearGradient
    colors={colors.gradients.surface}
    style={settingStyles.section}
    >
      <Text style={settingStyles.sectionTitle}>Preferences</Text>
      {/* TOGGLE COLOR MODE */}
      <View style={settingStyles.settingItem}>
        <View style={settingStyles.settingLeft}>
          <LinearGradient
          colors={colors.gradients.primary}
          style={settingStyles.settingIcon}
          >
            <Ionicons name="moon" size={18} color="#fff" />
          </LinearGradient>
          <Text style={settingStyles.settingText}>Dark Mode</Text>
        </View>
        <Switch
        value={isDarkMode}
        onValueChange={toggleDarkMode}
        thumbColor={"#fff"}
        trackColor={{false: colors.border, true: colors.primary}}
        />
      </View>
      {/* NOTIFICATIONS */}
      <View style={settingStyles.settingItem}>
        <View style={settingStyles.settingLeft}>
          <LinearGradient
          colors={colors.gradients.warning}
          style={settingStyles.settingIcon}
          >
            <Ionicons name="notifications" size={18} color="#fff" />
          </LinearGradient>
          <Text style={settingStyles.settingText}>Notifications</Text>
        </View>
        <Switch
        value={isNotificationEnabled}
        onValueChange={() => setNotificationEnabled(!isNotificationEnabled)}
        thumbColor={"#fff"}
        trackColor={{false: colors.border, true: colors.warning}}
        />
      </View>
      {/* AUTO SYNC */}
      <View style={settingStyles.settingItem}>
        <View style={settingStyles.settingLeft}>
          <LinearGradient
          colors={colors.gradients.success}
          style={settingStyles.settingIcon}
          >
            <Ionicons name="sync" size={18} color="#fff" />
          </LinearGradient>
          <Text style={settingStyles.settingText}>Auto Sync</Text>
        </View>
        <Switch
        value={isAutoSync}
        onValueChange={() => setIsAutoSync(!isAutoSync)}
        thumbColor={"#fff"}
        trackColor={{false: colors.border, true: colors.success}}
        />
      </View>
    </LinearGradient>
  )
}

export default Preferences