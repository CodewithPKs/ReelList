import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
const HomeHeader = () => {
  const navigation = useNavigation();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: deleteAccount },
      ]
    );
  };

  async function deleteAccount() {
    try {
      setLoadingDelete(true);
      const user_id = await AsyncStorage.getItem("user_id");
      if (!user_id) {
        Alert.alert("Error", "No user is currently logged in.");
        setLoadingDelete(false);
        return;
      }

      const res = await fetch("https://reellistapp.com/api/deleteaccount", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });

      const json = await res.json().catch(() => null);

      if (json && json.status == 1) {
        await AsyncStorage.removeItem("user_id");
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } else {
        Alert.alert("Error", (json && json.message) || "Server timed out or returned an error.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to delete account. Please try again later.");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      <View
        style={{ backgroundColor: "#033333" }}
        className="h-16 bg-black flex-row  items-center justify-between p-2"
      >
        <TouchableOpacity
          className="flex-row items-center"
          //   onPress={() => navigation.goBack()}
        >
          {/* <Ionicons name="chevron-back-sharp" size={24} color="white" /> */}
          <Text className="text-white ml-2">Home</Text>
        </TouchableOpacity>

        <Image
          className="w-20 h-12"
          resizeMode="contain"
          source={require("../assets/OrgIcon.png")}
        />
        <View className="flex-row">
          <FontAwesome name="bell-o" size={24} color="white" />
          <Menu>
            <MenuTrigger>
              <Entypo
                style={{ marginLeft: 10 }}
                name="dots-three-vertical"
                size={24}
                color="white"
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() => navigation.navigate("FeauturedList")}
                text="Passed Orders"
              />
              <MenuOption
                onSelect={() => navigation.navigate("SharedOrderList")}
              >
                <Text>Shared Orders</Text>
              </MenuOption>
              {/* <MenuOption onSelect={() => navigation.navigate("MyList")}>
                <Text>My List</Text>
              </MenuOption> */}
              <MenuOption onSelect={confirmDeleteAccount}>
                <Text style={{ color: "red" }}>Delete Account</Text>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate("Login")}>
                <Text style={{ color: "red" }}>Logout</Text>
              </MenuOption>
              {/* <MenuOption
                onSelect={() => alert(`Not called`)}
                disabled={true}
                text="Disabled"
              /> */}
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </>
  );
};

export default HomeHeader;
