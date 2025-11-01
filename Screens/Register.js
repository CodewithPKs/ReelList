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

const Register = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [phone, SetPhone] = useState("");
  const [password, SetPassword] = useState("");
  const [buttonloader, SetButtonLoader] = useState(false);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  const Register = () => {
    SetButtonLoader(true);

    console.log(email);
    console.log(password);

    var ApiUrl = "https://reellistapp.com/api/Register";
    var res = fetch(ApiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          await AsyncStorage.setItem(
            "user_id",
            JSON.stringify(response.Details[0].id)
          );

          alert("Successfully Register");
          navigation.navigate("Home");
        } else {
          alert(response.msg);
          SetButtonLoader(false);
        }
        console.log(response);
        SetButtonLoader(false);
      })

      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        SetButtonLoader(false);
        // ADD THIS THROW error
        throw error;
      });
  };

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
          <Text className="text-lg">Create account</Text>
          <View className="w-full bg-white rounded-lg p-8 elevation mt-5">
            <Text>Name</Text>
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
              placeholder="Name"
              onChangeText={(name) => SetName(name)}
            />
            <Text>Email</Text>
            <Input
              keyboardType="email-address"
              containerStyle={{
                paddingHorizontal: 0,
              }}
              inputStyle={{
                fontSize: 15,
              }}
              inputContainerStyle={{
                borderBottomColor: "#78be20",
              }}
              placeholder="Email"
              onChangeText={(email) => SetEmail(email)}
            />
            <Text>Phone</Text>
            <Input
              keyboardType="numeric"
              containerStyle={{
                paddingHorizontal: 0,
              }}
              inputStyle={{
                fontSize: 15,
              }}
              inputContainerStyle={{
                borderBottomColor: "#78be20",
              }}
              placeholder="Phone Number"
              onChangeText={(phone) => SetPhone(phone)}
            />
            <Text>Password</Text>
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
                onPress={Register}
                title="Register"
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
                // disabled={!password}
              />
            </View>
            <Text className="mt-5">
              Already Have an account?
              <Text
                onPress={() => navigation.navigate("Login")}
                className="text-orange-500"
              >
                {" "}
                Login
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
