import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import {
  SearchBar,
  ListItem,
  Icon,
  Input,
  Button,
} from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";

const EditCart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [groupedItemsinBasket, setgroupedItemsinBasket] = useState([]);
  const [buttonloader, SetButtonLoader] = useState(false);
  const [userid, SetUserId] = useState("");
  const [orderId, SetOrderId] = useState("");

  const GetCart = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);

    let Futured_List_OrderId = await AsyncStorage.getItem("FuturedListOrderId");
    SetOrderId(Futured_List_OrderId);
    console.log(Futured_List_OrderId);

    const list = await AsyncStorage.getItem("cart");
    // console.log(JSON.parse(list));
    const CartsArray = JSON.parse(list);
    console.log(CartsArray);
    const groupedItems = CartsArray.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setgroupedItemsinBasket(groupedItems);
  };

  const addItemToCart = async (id, product_name) => {
    const currentCart = await AsyncStorage.getItem("cart");
    let updatedCart = [];

    if (currentCart) {
      updatedCart = JSON.parse(currentCart);
    }

    updatedCart.push({ id, product_name });

    // Save the updated cart to AsyncStorage
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));

    const list = await AsyncStorage.getItem("cart");
    // SetitemsQuantity(JSON.parse(list));
    const CartsArray = JSON.parse(list);

    const groupedItems = CartsArray.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setgroupedItemsinBasket(groupedItems);
  };

  const removeItemFromCart = async (itemID) => {
    const currentCart = await AsyncStorage.getItem("cart");

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

        const list = await AsyncStorage.getItem("cart");
        const CartsArray = JSON.parse(list);

        // const CartsArray = JSON.stringify(cartItems);
        // console.log(CartsArray);

        const groupedItems = CartsArray.reduce((results, item) => {
          (results[item.id] = results[item.id] || []).push(item);
          return results;
        }, {});
        setgroupedItemsinBasket(groupedItems);
      }
    }
  };

  useEffect(() => {
    GetCart();
  }, []);

  const UpdateOrder = async () => {
    SetButtonLoader(true);

    const list = await AsyncStorage.getItem("cart");
    const CartsArray = JSON.parse(list);

    const OrderItems = CartsArray.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});

    //Storing Products Ids In Array To Database
    let ProductsIdSArray = [];
    //Storing Products Quanities By Sequence In Array To Database
    let ProductsQuantity = [];
    let ProductCategoryIdSArray = [];

    const orderitems = Object.entries(OrderItems).map(([key, item]) => {
      ProductsIdSArray.push(item[0].id);
      ProductCategoryIdSArray.push(item[0].category_id);
      ProductsQuantity.push(item.length);
    });
    // console.log(ProductsIdSArray);
    // console.log(ProductsQuantity);
    var res = fetch("https://reellistapp.com/api/update_featured_order", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ordered_products_id: ProductsIdSArray,
        product_quantities: ProductsQuantity,
        product_categories: ProductCategoryIdSArray,
        order_id: orderId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("Passed Orders Updated Successfully");
          await AsyncStorage.removeItem("cart");
          navigation.navigate("FeauturedList");
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
    <SafeAreaView className="flex-1">
      <Header />
      <View className="flex-row items-center justify-center my-5 ">
        <AntDesign name="shoppingcart" size={30} color="#ff521c" />
        <Text className="font-bold mx-1">Cart</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {Object.entries(groupedItemsinBasket).map(([key, items]) => (
          <ListItem key={key} bottomDivider>
            <Icon name={items.icon} />
            <ListItem.Content>
              <ListItem.Title>{items[0].product_name}</ListItem.Title>
              {/* <ListItem.Subtitle>
                Category : {items[0].CategoryName}
              </ListItem.Subtitle> */}
            </ListItem.Content>
            <ListItem.Subtitle>
              <View className="flex-row border border-orange-500 rounded-md items-center">
                <TouchableOpacity
                  onPress={() =>
                    removeItemFromCart(items[0].id, items[0].product_name)
                  }
                  className="p-1"
                >
                  <Entypo name="minus" size={24} color="black" />
                </TouchableOpacity>
                <Text className="border-x border-orange-500 p-3 font-medium">
                  {items.length}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    addItemToCart(items[0].id, items[0].product_name)
                  }
                  className="p-1"
                >
                  <Entypo name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </ListItem.Subtitle>
          </ListItem>
        ))}
      </ScrollView>
      <View className="flex-row justify-evenly w-full absolute bottom-0 bg-white h-20 items-center">
        <Button
          onPress={UpdateOrder}
          title="Update List"
          loading={buttonloader}
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

export default EditCart;
