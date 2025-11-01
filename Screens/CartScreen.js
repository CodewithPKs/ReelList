import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";

import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SearchBar,
  ListItem,
  Icon,
  Input,
  Button,
} from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectCartItems,
  selectCartItemsWithId,
  removeFromBasket,
  makeCartEmpty,
} from "../features/CartSlice";
import Dialog from "react-native-dialog";
const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [groupedItemsinBasket, setgroupedItemsinBasket] = useState([]);
  const [userid, SetUserId] = useState(null);
  const [buttonloader, SetButtonLoader] = useState(false);
  const [email, SetEmail] = useState("");
  const [orderName, SetOrderName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // const [saveConfirm, SetSaveConfirm] = useState(false);
  const [visible, setVisible] = useState(false);
  const input = React.createRef();

  let saveConfirm = false;
  const showDialog = () => {
    setVisible(true);
  };

  const CloseModal = () => {
    setModalVisible(false);
    SetOrderName(null);
  };

  const handleNo = () => {
    setVisible(false);
    saveConfirm = false;
    SendOrder();
  };

  const handleYes = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setModalVisible(true);
    setVisible(false);
    saveConfirm = true;
    // SendOrder();
  };

  const SaveOrder = () => {
    setModalVisible(false);
    saveConfirm = true;
    SendOrder();
  };

  const GetProducts = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setgroupedItemsinBasket(groupedItems);
  };

  useEffect(() => {
    GetProducts();
  }, [items]);

  // console.log(groupedItemsinBasket);

  const addItemToCart = (id, product_name) => {
    // ToastAndroid.show(`${product_name} Added To Cart`, ToastAndroid.SHORT);
    dispatch(
      addToCart({
        id,
        product_name,
      })
    );
  };

  const removeItemFromCart = (id, product_name) => {
    // ToastAndroid.show(`${product_name} Removed From Cart`, ToastAndroid.SHORT);
    dispatch(removeFromBasket({ id }));
  };

  const AskToSaveOrder = () => {
    setVisible(true);
  };

  const SendOrder = () => {
    SetButtonLoader(true);
    const OrderItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});

    //Storing Products Ids In Array To Database
    let ProductsIdSArray = [];
    //Storing Products Quanities By Sequence In Array To Database
    let ProductsQuantity = [];
    let ProductCategoryIdSArray = [];

    const orderitems = Object.entries(OrderItems).map(([key, item]) => {
      // console.log(item[0].product_name);
      // console.log(item.length);
      // return orderitems;

      ProductsIdSArray.push(item[0].id);
      ProductCategoryIdSArray.push(item[0].category_id);
      ProductsQuantity.push(item.length);
    });
    // console.log(ProductsIdSArray);
    // console.log(ProductsQuantity);
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
        product_categories: ProductCategoryIdSArray,
        saveConfirm: saveConfirm,
        ordername: orderName,
        email: email,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          // alert("Order Created Successfully");
          dispatch(makeCartEmpty(items));
          SetButtonLoader(false);
          navigation.navigate("ThankYou");
        } else {
          SetButtonLoader(false);

          alert("Server Timed Out");
        }
        console.log(response);
      });
  };

  return (
    // <Text>Hello</Text>

    <SafeAreaView className="flex-1 ">
      <Modal isVisible={isModalVisible}>
        <View className="bg-white p-5 justify-center items-center rounded-lg ">
          <Text>Order Name</Text>
          <Input
            ref={input}
            placeholder="Enter Order Name (15 Character)"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetOrderName(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <View className="flex-row justify-evenly w-full">
            <Button
              onPress={CloseModal}
              title="Cancel"
              loading={false}
              buttonStyle={{
                backgroundColor: "#78be20",
                borderColor: "transparent",
                borderRadius: 5,
                paddingVertical: 10,
              }}
              containerStyle={{
                width: "41.666667%",
              }}
            />

            <Button
              onPress={SaveOrder}
              title="Ok"
              buttonStyle={{
                backgroundColor: "#ff521c",
                borderColor: "transparent",
                borderRadius: 5,
                paddingVertical: 10,
              }}
              containerStyle={{
                width: "41.666667%",
              }}
              disabled={!orderName}
            />
          </View>
        </View>
      </Modal>

      <Dialog.Container visible={visible}>
        <Dialog.Title>Save Order</Dialog.Title>
        <Dialog.Description>Do you want to Save For Future?</Dialog.Description>
        <Dialog.Button label="No" onPress={handleNo} />
        <Dialog.Button label="Yes" onPress={handleYes} />
      </Dialog.Container>
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
        onPress={AskToSaveOrder}
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
    </SafeAreaView>
  );
};

export default CartScreen;
