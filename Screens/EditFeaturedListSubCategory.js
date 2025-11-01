import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar, Button, Badge } from "react-native-elements";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const EditFeaturedListSubCategory = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  const { CategoryId, CategoryName, OrderName } = route.params;

  const [subcategory, SetSubCategory] = useState([]);
  const [userid, SetUserId] = useState("");
  const [search, SetSearch] = useState("");
  const [itemsQuantity, SetitemsQuantity] = useState([]);

  const GetSubCategries = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);
    var ApiUrl = "https://reellistapp.com/api/get_sub_categories";
    var res = await fetch(ApiUrl, {
      mode: "no-cors",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_id: CategoryId,
        user_id: user_id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 1) {
          SetSubCategory(responseJson.SubCategories);
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

  const GetCart = async () => {
    const list = await AsyncStorage.getItem("cart");
    SetitemsQuantity(JSON.parse(list));
  };

  useEffect(() => {
    GetSubCategries();
    GetCart();
  }, [isFocused]);

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("cart");
      const list = await AsyncStorage.getItem("cart");
      SetitemsQuantity([]);
      navigation.navigate("FeauturedList");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header />
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
        placeholder="Search For Sub Categories..."
        placeholderTextColor={"white"}
        onChangeText={(text) => SearchFilter(text)}
        value={search}
        searchIcon={{ color: "white" }}
        clearIcon={{ color: "white" }}
      />
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
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={subcategory}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditFeaturedProduct", {
                  CategoryId: CategoryId,
                  CategoryName: item.category_name,
                  SubcategoryId: item.id,
                  SubCategoryName: item.subcategory,
                  OrderName: OrderName,
                  //   Universal_Cat_Id: Universal_Cat_Id,
                  //   Universal_SubCat_Id: item.universal_sub_cat_id,
                })
              }
              className="py-2 px-6 bg-white border-b border-gray-300"
            >
              <Text className="text-base">{item.subcategory}</Text>
              <Text className="text-gray-500">{item.subcategory_desc}</Text>
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

export default EditFeaturedListSubCategory;
