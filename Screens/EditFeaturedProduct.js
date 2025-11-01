import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

import {
  SearchBar,
  ListItem,
  Icon,
  Input,
  Button,
  Avatar,
  Badge,
} from "react-native-elements";

let productQuantity = [];

const EditFeaturedProduct = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  const { CategoryId, SubcategoryId, OrderName } = route.params;

  const [product, SetProduct] = useState([]);
  const [userid, SetUserId] = useState(null);
  const [search, SetSearch] = useState("");
  const [itemsQuantity, SetitemsQuantity] = useState([]);

  const GetCart = async () => {
    const list = await AsyncStorage.getItem("cart");
    SetitemsQuantity(JSON.parse(list));
  };

  const GetProduct = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);

    var ApiUrl = "https://reellistapp.com/api/get_products";
    var res = await fetch(ApiUrl, {
      mode: "no-cors",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        category_id: CategoryId,
        sub_category_id: SubcategoryId,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status == 1) {
          // let ReoganizedItem = await AsyncStorage.getItem("ReoganizedItem");
          // SetUserId(user_id);
          // let jsonData = JSON.parse(ReoganizedItem);
          // console.log(jsonData);
          // if (jsonData != null) {
          //   SetProduct(jsonData);
          // } else {
          // }
          SetProduct(responseJson.Products);

          // console.log(responseJson);
        } else {
          alert("Server Timed Out");
        }
        // console.log(responseJson);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    GetProduct();
    GetCart();
  }, [isFocused]);

  const addItemToCart = async (id, product_name) => {
    productQuantity.push(id);
    const currentCart = await AsyncStorage.getItem("cart");
    let updatedCart = [];

    if (currentCart) {
      updatedCart = JSON.parse(currentCart);
    }

    updatedCart.push({ id, product_name });

    // Save the updated cart to AsyncStorage
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));

    const list = await AsyncStorage.getItem("cart");
    SetitemsQuantity(JSON.parse(list));
    console.log(JSON.parse(list));
  };

  const removeFromCart = async (itemID) => {
    const index = productQuantity.indexOf(itemID);
    if (index > -1) {
      // only splice array when item is found
      productQuantity.splice(index, 1); // 2nd parameter means remove one item only
    }

    const currentCart = await AsyncStorage.getItem("cart");

    // if (currentCart) {
    //   const updatedCart = JSON.parse(currentCart).filter(
    //     (item) => item.id !== itemID
    //   );

    //   // Save the updated cart to AsyncStorage
    //   await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));

    //   const list = await AsyncStorage.getItem("cart");
    //   SetitemsQuantity(JSON.parse(list));
    //   console.log(JSON.parse(list));
    // }

    if (currentCart) {
      const cartItems = JSON.parse(currentCart);
      const itemToRemoveIndex = cartItems.findIndex(
        (item) => item.id === itemID
      );

      if (itemToRemoveIndex !== -1) {
        // Remove only one occurrence of the item
        cartItems.splice(itemToRemoveIndex, 1);

        // Save the updated cart to AsyncStorage
        await AsyncStorage.setItem("cart", JSON.stringify(cartItems));

        // Update cart quantity by decrementing it by 1
        const list = await AsyncStorage.getItem("cart");
        SetitemsQuantity(JSON.parse(list));
      }
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("cart");
      const list = await AsyncStorage.getItem("cart");
      productQuantity = [];
      SetitemsQuantity([]);
      navigation.navigate("FeauturedList");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header />
      <View className="w-full flex-row justify-between h-16 items-center p-2">
        <Text className="font-semibold text-lg">Edit {OrderName} List</Text>
        <View className="flex-row ">
          <View className="mr-5">
            <TouchableOpacity onPress={() => navigation.navigate("EditCart")}>
              {/* <AntDesign name="shoppingcart" size={30} color="black" /> */}
              <Entypo name="list" size={24} color="black" />
            </TouchableOpacity>
            <Badge
              status="success"
              value={itemsQuantity.length}
              containerStyle={{ position: "absolute", top: 3, left: 20 }}
            />
          </View>
        </View>
      </View>
      <SearchBar
        containerStyle={{
          backgroundColor: "#ff521c",
          borderWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        }}
        inputContainerStyle={{ backgroundColor: "#ff521c" }}
        inputStyle={{ color: "white", fontSize: 15 }}
        placeholder="Search For Products..."
        placeholderTextColor={"white"}
        onChangeText={(text) => SearchFilter(text)}
        value={search}
        searchIcon={{ color: "white" }}
        clearIcon={{ color: "white" }}
      />
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={product}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              // disabled={isActive}
              className="py-2 px-3 bg-white border-b border-gray-300 flex-row justify-between items-center"
            >
              <View className="w-[60%] ">
                <Text numberOfLines={2} className="text-base">
                  {item.product_name}
                  {item.id}
                </Text>
                <Text className="text-gray-500">{item.product_desc}</Text>
              </View>

              <View className="flex-row border border-orange-500 rounded-md items-center">
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  className="p-1"
                >
                  <Entypo name="minus" size={24} color="black" />
                </TouchableOpacity>
                <Text className="border-x border-orange-500 p-3 font-medium">
                  {/* {items.length} */}
                  {productQuantity.filter((x) => x == item.id).length}
                </Text>
                <TouchableOpacity
                  onPress={() => addItemToCart(item.id, item.product_name)}
                  className="p-1"
                >
                  <Entypo name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View className="flex-row justify-evenly w-full absolute bottom-0 bg-white h-20 items-center">
        <Button
          onPress={clearCart}
          title="Cancel"
          loading={false}
          buttonStyle={{
            backgroundColor: "#78be20",
            borderColor: "transparent",
            borderRadius: 5,
            paddingVertical: 10,
          }}
          containerStyle={{
            width: "90%",
          }}
        />

        {/* <Button
        // onPress={EditProduct}
        title="Update"
        // loading={buttonloader}
        buttonStyle={{
          backgroundColor: "#ff521c",
          borderColor: "transparent",
          borderRadius: 5,
          paddingVertical: 10,
        }}
        containerStyle={{
          width: "41.666667%",
        }}
        // disabled={!editProduct}
      /> */}
      </View>
    </SafeAreaView>
  );
};

export default EditFeaturedProduct;
