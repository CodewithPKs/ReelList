import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { ListItem, Text, Input } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FeauturedItems = ({ route, navigation }) => {
  const {
    ProductList,
    CategoryList,
    ProductQuantities,
    OrderName,
    SharedList,
  } = route.params;

  const [data, SetData] = useState([]);
  const [userid, SetUserId] = useState("");
  const [buttonloader, SetButtonLoader] = useState(false);
  const [email, SetEmail] = useState("");

  console.log(ProductQuantities);

  const GetData = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);

    const ConvertedToArray = ProductQuantities.split(",").map((quantity) =>
      parseInt(quantity.trim(), 10)
    );

    for (let i = 0; i < ProductList.length; i++) {
      ProductList[i].products_quantity = ConvertedToArray[i];
    }
    SetData(ProductList);
    console.log(ProductList);
  };

  useEffect(() => {
    GetData();
  }, []);

  const SendOrder = () => {
    SetButtonLoader(true);
    const ConvertedToArray = ProductQuantities.split(",").map((quantity) =>
      parseInt(quantity.trim(), 10)
    );

    for (let i = 0; i < ProductList.length; i++) {
      ProductList[i].products_quantity = ConvertedToArray[i];
    }

    // Storing Products Ids In Array To Database
    let ProductsIdSArray = [];
    //Storing Products Quanities By Sequence In Array To Database
    let ProductsQuantity = [];

    ProductList.map((item, index) => {
      ProductsIdSArray.push(item.id);
    });

    ConvertedToArray.map((item, index) => {
      ProductsQuantity.push(item);
    });

    console.log(ProductList);
    var res = fetch("https://reellistapp.com/api/make_order", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ordered_products_id: ProductsIdSArray,
        product_quantities: ProductsQuantity,
        // saveConfirm: saveConfirm,
        // ordername: orderName,
        email: email,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          // alert("Order Created Successfully");
          navigation.navigate("ThankYou");
        } else {
          alert("Server Timed Out");
        }
        SetButtonLoader(false);
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
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header />
      <Text h4 className="text-center my-5">
        {OrderName}
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 150 }}
        className="bg-white flex-1"
      >
        {data.map((l, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title className="mb-1">{l.product_name}</ListItem.Title>
              <ListItem.Subtitle>Qty: {l.products_quantity}</ListItem.Subtitle>
              {/* {CategoryList.map(
                (r, g) =>
                  r.id == l.category_id && (
                    <ListItem.Subtitle key={g}>
                      Category: {r.category_name} {"     "}Qty:{" "}
                      {l.products_quantity}
                    </ListItem.Subtitle>
                  )
              )} */}
              {/* <ListItem.Subtitle>{l.product_name}</ListItem.Subtitle> */}
            </ListItem.Content>
            {/* <ListItem.Subtitle>
              <View className="flex-row  border-orange-500 rounded-md items-center">
                <TouchableOpacity
                  //   onPress={() =>
                  //     addItemToCart(item.id, item.product_name, item.category_id)
                  //   }
                  className="p-1"
                >
                  <Feather name="trash-2" size={24} color="orange" />
                </TouchableOpacity>
              </View>
            </ListItem.Subtitle> */}
          </ListItem>
        ))}
      </ScrollView>

      <View className=" w-full absolute bottom-0 bg-white ">
        <Input
          containerStyle={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 0,
            // borderTopWidth: 1,
            // borderWidth: 1,
            height: 50,
            marginTop: 10,
          }}
          inputStyle={{
            fontSize: 15,
          }}
          inputContainerStyle={{
            borderBottomColor: "#78be20",
            width: "80%",
            // paddingTop: 10,
          }}
          placeholder="Enter E-mail"
          onChangeText={(email) => SetEmail(email)}
        />

        <Button
          disabled={!email}
          onPress={SendOrder}
          loading={buttonloader}
          title="SEND TO ORDER"
          buttonStyle={{
            backgroundColor: "#ff521c",
            borderColor: "transparent",
            borderRadius: 5,
            paddingVertical: 10,
            width: "80%",
          }}
          containerStyle={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",

            marginBottom: 10,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FeauturedItems;
