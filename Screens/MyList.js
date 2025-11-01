import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Feather, Entypo } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import Header from "../Components/Header";
import { ListItem, Text } from "react-native-elements";

const MyList = ({ navigation }) => {
  const [mylist, SetMyList] = useState([]);
  const isFocused = useIsFocused();

  const FeauturedList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    var ApiUrl = "https://reellistapp.com/api/get_my_list";
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
          SetMyList(responseJson.mylist);
          //   SetProductList(responseJson[0].products);
          //   SetCategoryList(responseJson[0].categories);
          //   console.log(responseJson[0].);
          //   responseJson[0].products.map((element) => {
          //     // SetMyList(element);
          //   });
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
          alert("List Deleted Succesfully");
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

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header />
      <Text h4 className="text-center my-5">
        My List
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        className="bg-white"
      >
        {mylist.map((l, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() =>
              navigation.navigate("FeauturedItems", {
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyList;
