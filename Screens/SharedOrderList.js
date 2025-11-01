import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import { ListItem, Text, Button } from "react-native-elements";
import Dialog from "react-native-dialog";
const SharedOrderList = ({ navigation }) => {
  const [orderlist, setOrderList] = useState([]);
  const [userid, SetUserId] = useState("");
  const [visible, setVisible] = useState(false);
  const SharedOrderList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);
    var ApiUrl = "https://reellistapp.com/api/get_shared_orders";
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
          // responseJson[0].map((n) => setOrderList(n));
          setOrderList(responseJson[0]);
          //   SetOrderList(responseJson[0]);
          //   SetProductList(responseJson[0].products);
          //   SetCategoryList(responseJson[0].categories);
          //   console.log(responseJson[0].);
          //   responseJson[0].products.map((element) => {
          //     // SetOrderList(element);
          //   });
          console.log(responseJson);
        } else {
          alert("Server Timed Out");
          console.log(responseJson);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const DeleteSharedOrderList = (list_id) => {
    console.log(list_id);
    console.log(userid);
    var res = fetch("https://reellistapp.com/api/delete_sharedlist", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list_id: list_id,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("List Deleted Successfully");
          SharedOrderList();
        } else {
          alert("List Deleted Failed");
        }
        console.log(response);
      });
  };

  useEffect(() => {
    SharedOrderList();
  }, []);

  const handleNo = () => {
    setVisible(false);
    saveConfirm = false;
    SendOrder();
  };

  const handleYes = (ListId) => {
    console.log(ListId);
    setVisible(false);
    var ApiUrl = "https://reellistapp.com/api/duplicate_shared_list";
    var res = fetch(ApiUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list_id: ListId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("List Added to Future list");
          navigation.navigate("FeauturedList");
        } else {
          alert("Server Time Out");
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
    console.log(ApiUrl);
  };

  // const DuplicateList = (ListId) => {
  //   console.log("first");

  // };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header />

      <Text h4 className="text-center my-5">
        Shared Order List
      </Text>

      <ScrollView className="bg-white">
        {orderlist.map((l, i) => (
          <>
            <Dialog.Container visible={visible}>
              <Dialog.Title>Add this order to future list</Dialog.Title>
              <Dialog.Description>
                Do you want to add this in future order?
              </Dialog.Description>
              <Dialog.Button label="No" onPress={() => setVisible(false)} />
              <Dialog.Button label="Yes" onPress={() => handleYes(l.list_id)} />
            </Dialog.Container>
            <ListItem
              key={i}
              bottomDivider
              onPress={() =>
                navigation.navigate("FeauturedItems", {
                  SharedList: true,
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
                {/* <ListItem.Subtitle>
                {l.subtitle} {"  "}Age:12
              </ListItem.Subtitle> */}
              </ListItem.Content>
              <ListItem.Subtitle>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  className="p-1"
                >
                  <AntDesign name="copy1" size={24} color="#ff521c" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => DeleteSharedOrderList(l.list_id)}
                  className="p-1"
                >
                  <Feather name="trash-2" size={24} color="#ff521c" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ShareOrder", {
                    ListId: l.id,
                  })
                }
                className="p-1"
              >
                <FontAwesome name="share-square-o" size={24} color="#ff521c" />
              </TouchableOpacity> */}
              </ListItem.Subtitle>
            </ListItem>
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SharedOrderList;
