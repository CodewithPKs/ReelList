import { View, Image, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
const GetStarted = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1">
      <View className="h-3/6 bg-white justify-center items-center p-4">
        <Image
          className="w-48 h-20"
          resizeMode="contain"
          source={require("../assets/logo.png")}
        />
        <Divider className="w-full my-6" />
        <Text className="text-lg">Create a Film/Video Order</Text>
      </View>
      <View className="bg-zinc-900">
        <AntDesign
          name="arrowdown"
          size={24}
          color="black"
          style={{
            backgroundColor: "white",
            borderRadius: 50,
            alignSelf: "center",
            marginTop: -25,
            zIndex: 100,
            padding: 10,
          }}
        />
      </View>
      <View className="bg-zinc-900 h-3/6 justify-evenly items-center p-10">
        <Text className="text-sm text-white text-center">
          Reel List is the best way where you can create order list for the
          film/video industry
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="bg-orange-500 py-4 px-10 rounded-full"
        >
          <Text className="text-white">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GetStarted;
