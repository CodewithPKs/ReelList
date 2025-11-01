import { View, Text } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { makeCartEmpty, selectCartItems } from "../features/CartSlice";

const ThankYou = ({ navigation }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);

  //   useEffect(() => {
  //     const items = useSelector(selectCartItems);
  //     // items.length = 0;
  //     // console.log(items);
  //   }, []);

  //   const GetItems = () => {
  //     console.log(items);
  //     // dispatch(makeCartEmpty());
  //   };

  //   useEffect(() => {
  //     GetItems();
  //   }, [items]);

  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        source={require("../assets/Thanks.json")}
        autoPlay
        loop
        style={{ width: 150 }}
      />
      <Text className="mt-5 mb-3">Thank you your order has been placed</Text>
      <Button
        onPress={() => navigation.navigate("Home")}
        title="Back To Home"
        buttonStyle={{
          backgroundColor: "#ff521c",
          borderColor: "transparent",
          borderRadius: 5,
          paddingVertical: 10,
          width: "80%",
        }}
        containerStyle={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      />
    </View>
  );
};

export default ThankYou;
