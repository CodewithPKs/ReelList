import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";
import Header from "../Components/Header";
import { ListItem, Text, Input, Button } from "react-native-elements";

const FeauturedList = ({ navigation }) => {
  const isFocused = useIsFocused();
  const input = React.createRef();
  const [orderList, SetOrderList] = useState([]);
  const [productList, SetProductList] = useState([]);
  const [categoryList, SetCategoryList] = useState([]);
  const [orderName, SetOrderName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [buttonloader, SetButtonLoader] = useState(false);
  const FeauturedList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    var ApiUrl = "https://reellistapp.com/api/get_futured_orders";
    var res = await fetch(ApiUrl, {
      mode: "no-cors",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 1) {
          SetOrderList(responseJson[0]);
          //   SetProductList(responseJson[0].products);
          //   SetCategoryList(responseJson[0].categories);
          //   console.log(responseJson[0].);
          //   responseJson[0].products.map((element) => {
          //     // SetOrderList(element);
          //   });
          console.log(responseJson[0]);
        } else {
          alert("Server Timed Out");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const DeleteList = (listid) => {
    var ApiUrl = "https://reellistapp.com/api/delete_feautured_list";
    var res = fetch(ApiUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: listid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("Feautured List Deleted Succesfully");
          FeauturedList();
        } else {
          alert("Server Timed Out");
        }
        console.log(response);
      })
      .catch(function (error) {
        alert("Server Timed Out");

        console.log(
          "There has been a problem with your fetch operation: " + error
        );

        // ADD THIS THROW error
        throw error;
      });
  };

  useEffect(() => {
    FeauturedList();
  }, [isFocused]);

  const SaveOrder = (ListId) => {
    SetButtonLoader(true);
    console.log(ListId);
    var ApiUrl = "https://reellistapp.com/api/duplicate_shared_list";
    var res = fetch(ApiUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list_id: ListId,
        order_name: orderName,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("List Duplicated Successfully");
          FeauturedList();
        } else {
          alert("Server Time Out");
        }
        SetButtonLoader(false);

        setModalVisible(false);
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

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header />
      <Text h4 className="text-center my-5">
        Feautured List
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        className="bg-white"
      >
        {orderList.map((l, i) => (
          <>
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
                    onPress={() => setModalVisible(false)}
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
                    onPress={() => SaveOrder(l.id)}
                    title="Ok"
                    loading={buttonloader}
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

            <ListItem
              key={i}
              bottomDivider
              onPress={() =>
                navigation.navigate("FeauturedItems", {
                  FutureList: true,
                  ProductList: l.products,
                  CategoryList: l.categories,
                  ProductQuantities: l.product_quantities,
                  OrderName: l.ordername,
                })
              }
              // containerStyle={{ backgroundColor: "transparent" }}
            >
              <ListItem.Content>
                <ListItem.Title>{l.ordername}</ListItem.Title>
                <ListItem.Subtitle>
                  {l.my_list == 1 && (
                    <Text className="text-gray-400">Copied</Text>
                  )}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Subtitle>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditFeaturedListCategory", {
                      EditFeautedList: true,
                      ProductList: l.products,
                      ProductQuantities: l.product_quantities,
                      OrderName: l.ordername,
                      OrderId: l.id,
                    })
                  }
                  className="p-1"
                >
                  <FontAwesome name="pencil" size={24} color="#ff521c" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => DeleteList(l.id)}
                  className="p-1"
                >
                  <Feather name="trash-2" size={24} color="#ff521c" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ShareOrder", {
                      ListId: l.id,
                    })
                  }
                  className="p-1"
                >
                  <FontAwesome
                    name="share-square-o"
                    size={24}
                    color="#ff521c"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="p-1"
                >
                  <AntDesign name="copy1" size={24} color="#ff521c" />
                </TouchableOpacity>
              </ListItem.Subtitle>
            </ListItem>
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeauturedList;
