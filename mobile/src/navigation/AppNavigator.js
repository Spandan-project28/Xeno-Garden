import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/DashboardScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AlertsScreen from "../screens/AlertsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const TABS = [
    {
        name: "Dashboard",
        component: DashboardScreen,
        icon: "grid",
        iconOutline: "grid-outline",
    },
    {
        name: "History",
        component: HistoryScreen,
        icon: "stats-chart",
        iconOutline: "stats-chart-outline",
    },
    {
        name: "Alerts",
        component: AlertsScreen,
        icon: "notifications",
        iconOutline: "notifications-outline",
    },
    {
        name: "Settings",
        component: SettingsScreen,
        icon: "settings",
        iconOutline: "settings-outline",
    },
];

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#1A1A2E",
                        borderTopColor: "#2A2A3E",
                        borderTopWidth: 1,
                        height: 65,
                        paddingBottom: 8,
                        paddingTop: 8,
                    },
                    tabBarActiveTintColor: "#4FC3F7",
                    tabBarInactiveTintColor: "#555",
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: "600",
                    },
                }}
            >
                {TABS.map((tab) => (
                    <Tab.Screen
                        key={tab.name}
                        name={tab.name}
                        component={tab.component}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <Ionicons
                                    name={focused ? tab.icon : tab.iconOutline}
                                    size={22}
                                    color={color}
                                />
                            ),
                        }}
                    />
                ))}
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
