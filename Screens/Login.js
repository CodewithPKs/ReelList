import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, Input, Switch, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Login = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [buttonloader, SetButtonLoader] = useState(false);
  const [passSecurity, SetPassSecurity] = useState(true);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  const ShowPassword = () => {
    SetPassSecurity(!passSecurity);
  };

  const Login = () => {
    if (email == "") {
      alert("Email Required");
      return;
    } else if (password == "") {
      alert("Password Required");
      return;
    }

    const RemovedSpace = email.replace(/\s+/g, "");

    SetButtonLoader(true);

    console.log(email);
    console.log(password);

    var ApiUrl = "https://reellistapp.com/api/login";
    var res = fetch(ApiUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: RemovedSpace,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          await AsyncStorage.setItem(
            "user_id",
            JSON.stringify(response.Details.id)
          );
          SetButtonLoader(false);

          // alert("Successfully Login");
          navigation.navigate("Home");
        } else {
          alert("User Not Found");
          SetButtonLoader(false);
        }
        console.log(response);
      })
      .catch(function (error) {
        SetButtonLoader(false);
        alert("Server Timed Out");

        console.log(
          "There has been a problem with your fetch operation: " + error
        );

        // ADD THIS THROW error
        throw error;
      });
    console.log(ApiUrl);
  };

  // const Login = async () => {
  //   var ApiUrl = "https://reellistapp.com/api/get_Universalcategories";
  //   var res = await fetch(ApiUrl, {
  //     method: "get",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json", // I added this line
  //     },
  //   })
  //     .then((response) => response.text())
  //     .then((responseJson) => {
  //       if (responseJson.status == 1) {
  //         console.log(responseJson);
  //         SetUniversalCategory(responseJson.UniversalCategory);
  //       } else {
  //         alert("Server Timed Out");
  //         // console.log(responseJson);
  //       }
  //       console.log(responseJson);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white"
      >
        <View className="flex-1 bg-white justify-center items-center p-4">
          <Image
            className="w-48 h-20"
            resizeMode="contain"
            source={require("../assets/logo.png")}
          />
          <Divider color="red" className="w-full my-6" />
          <Text className="text-lg">Login or create account</Text>
          <View className="w-full bg-white rounded-lg p-8 elevation mt-9">
            <Text>Phone or Email</Text>
            <Input
              containerStyle={{
                paddingHorizontal: 0,
              }}
              inputStyle={{
                fontSize: 15,
              }}
              inputContainerStyle={{
                borderBottomColor: "#78be20",
              }}
              placeholder="Valid Phone or Email"
              onChangeText={(email) => SetEmail(email)}
            />
            <Text>Password</Text>
            <Input
              secureTextEntry={passSecurity}
              rightIcon={
                <Ionicons
                  onPress={ShowPassword}
                  name="md-eye-off-sharp"
                  size={24}
                  color="black"
                />
              }
              containerStyle={{
                paddingHorizontal: 0,
              }}
              inputStyle={{
                fontSize: 15,
              }}
              inputContainerStyle={{
                borderBottomColor: "#78be20",
              }}
              placeholder="**********"
              onChangeText={(password) => SetPassword(password)}
            />
            <View className="flex-row  items-center">
              <Switch
                style={{ marginLeft: -10 }}
                color="#FFA500"
                trackColor={{ false: "#767577", true: "#FFA500" }}
                value={checked}
                onValueChange={(value) => setChecked(value)}
              />
              <Text className="ml-2 mr-6">Remember Me</Text>
              <Button
                onPress={Login}
                title="Login"
                loading={buttonloader}
                buttonStyle={{
                  backgroundColor: "#ff521c",
                  borderColor: "transparent",
                  borderRadius: 50,
                  paddingVertical: 10,
                }}
                containerStyle={{
                  width: "41.666667%",
                }}
                disabled={!password}
              />
            </View>
            <Text className="mt-5">
              Forgot your password?
              <Text className="text-orange-500"> Click Here</Text>
            </Text>
          </View>
        </View>
        <View className="h-52 mt-10">
          <ImageBackground
            source={require("../assets/LoginLayer.png")}
            resizeMode="cover"
            className="w-full h-full justify-center items-center"
          >
            <Text className="text-white">DON'T HAVE AN ACCOUNT?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              className="bg-white py-3 px-12 rounded-full mt-4"
            >
              <Text className="text-orange-500">CREATE YOUR ACCOUNT</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
