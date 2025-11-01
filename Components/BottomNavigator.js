import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, EvilIcons, Feather, Entypo } from "@expo/vector-icons";
// import ChatUsers from "../Components/Chats/ChatUsers";
// import UpdateProfile from "./UpdateProfile";
// import Header from "../Components/Header";

const Tab = createBottomTabNavigator();
const BottomNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 55,
          backgroundColor: "white",
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "black",
      }}
    >
      <Tab.Screen
        options={{
          //   tabBarShowLabel: false,

          tabBarIcon: ({ focused: boolean, color: string }) => (
            <Ionicons name="chatbox-outline" size={24} color={"#5B21B6"} />
          ),
        }}
        name="Chats"
        component={Chats}
      />
      <Tab.Screen
        options={{
          //   tabBarShowLabel: false,

          tabBarIcon: ({ focused: boolean, color: string }) => (
            <Ionicons name="call-outline" size={24} color={"#5B21B6"} />
          ),
        }}
        name="Calls"
        component={Calls}
      />
      <Tab.Screen
        options={{
          //   tabBarShowLabel: false,

          tabBarIcon: ({ focused: boolean, color: string }) => (
            <EvilIcons name="user" size={32} color={"#5B21B6"} />
          ),
        }}
        name="Profile"
        component={Profile}
      />
      <Tab.Screen
        options={{
          //   tabBarShowLabel: false,

          tabBarIcon: ({ focused: boolean, color: string }) => (
            <Feather name="user-plus" size={24} color={"#5B21B6"} />
          ),
        }}
        name="Invite"
        component={Invite}
      />
    </Tab.Navigator>
  );
};

function Chats({ navigation }) {
  return <Text>1</Text>;
}

function Calls() {
  return <Text>Calls</Text>;
}

function Profile({ navigation }) {
  return <Text>1</Text>;
}

function Invite() {
  return <Text>Invite</Text>;
}

export default BottomNavigator;

const styles = StyleSheet.create({
  HeaderIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
