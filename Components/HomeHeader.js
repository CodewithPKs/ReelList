import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
const HomeHeader = () => {
  const navigation = useNavigation();

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
