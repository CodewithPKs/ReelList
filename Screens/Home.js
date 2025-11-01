import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";

import {
  SearchBar,
  ListItem,
  Icon,
  Input,
  Button,
} from "react-native-elements";

import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

import SwipeableItem, {
  useSwipeableItemParams,
  OpenDirection,
} from "react-native-swipeable-item";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import HomeHeader from "../Components/HomeHeader";
import {
  addToCart,
  selectCartItems,
  removeFromBasket,
} from "../features/CartSlice";
import { useIsFocused } from "@react-navigation/native";
const Home = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [search, SetSearch] = useState("");
  const [createcategory, SetCreateCategory] = useState(null);
  const [categoryDesc, SetCategoryDesc] = useState(null);
  const [editCategoryId, SetEditCategoryId] = useState(null);
  const [buttonloader, SetButtonLoader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [universalModal, setUniversalModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [category, SetCategory] = useState([]);
  const [universalCategory, SetUniversalCategory] = useState([]);
  const [userid, SetUserId] = useState(null);
  const input = React.createRef();

  const [activityLoader, setActivityLoader] = useState(false);
  const [sequencedModal, setSequencedModal] = useState(false);
  const [filterdata, SetFilterData] = useState([]);

  const [selectedUC, setSelectedUC] = useState([]);

  const items = useSelector(selectCartItems);

  const EditMode = (id, categoryname, categorydesc) => {
    setEditMode(true);
    setModalVisible(true);
    SetEditCategoryId(id);
    SetCreateCategory(categoryname);
    SetCategoryDesc(categorydesc);
  };

  const OpenModal = () => {
    setModalVisible(true);
    setEditMode(false);
  };

  const CloseModal = () => {
    setModalVisible(false);
    setEditMode(false);
    SetCreateCategory(null);
    input.current.clear();
  };

  const GetCategories = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);
    var ApiUrl = "https://reellistapp.com/api/get_categories";
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
          SetCategory(responseJson.Data.Category);
          // SetCommomCategory(responseJson.Data.CommonCategory);
          SetFilterData(responseJson.Data.Category);
          // console.log(responseJson);
        } else {
          alert("Server Timed Out");
          // console.log(responseJson);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const dispatch = useDispatch();

  const addItemToCart = (id, product_name, CategoryName, category_id) => {
    // ToastAndroid.show(`${product_name} Added To Cart`, ToastAndroid.SHORT);
    dispatch(
      addToCart({
        id,
        product_name,
        CategoryName,
        category_id,
      })
    );
    // productQuantity.push(id);
  };

  useEffect(() => {
    GetCategories();
    // console.log(items);

    // if (route.params) {
    //   console.log(route.params);
    //   if (route.params.EditFeautedList === true) {
    //     route.params.ProductList.map((item) => {
    //       console.log(item);
    //       addItemToCart(item.id, item.product_name, "cat", "cat");
    //     });
    //   }
    // }
  }, [isFocused]);

  const AddCategory = () => {
    SetButtonLoader(true);
    // console.log(createcategory);
    var res = fetch("https://reellistapp.com/api/add_category", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_name: createcategory,
        category_desc: categoryDesc,
        user_id: userid,
        editMode: editMode,
        category_id: editCategoryId,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          SetButtonLoader(false);
          alert(response.msg);
          console.log(response);
          setEditMode(false);
          setModalVisible(false);
          SetCategoryDesc(null);
          SetCreateCategory(null);

          // console.log(response.GetLatestCategory[0]);
          SetCategory((category) => [
            ...category,
            ...response.GetLatestCategory,
          ]);

          // const newArray = [...category];

          // var mergeArray = newArray.concat(response.GetLatestCategory);

          // StoreSequencedList(mergeArray);

          // console.log(mergeArray);
          GetCategories();
        } else {
          SetButtonLoader(false);
          console.log(response);

          alert("Category Added Failes");
        }
      });
  };

  const DeleteCategory = (categoryid) => {
    var res = fetch("https://reellistapp.com/api/delete_category", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_id: categoryid,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("Category Deleted Successfully");
          GetCategories();
        } else {
          alert("Category Deleted Faile");
        }
      });
  };

  const DeleteCategoryAlert = (getcategoryid) =>
    Alert.alert("Are you sure?", "Do you want to delete this category?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => DeleteCategory(getcategoryid) },
    ]);

  const StoreSequencedList = (Data) => {
    var SequencedCategoryIds = Data.map((item) => {
      return item.id;
    });

    var res = fetch("https://reellistapp.com/api/store_sequenced_list", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Data: SequencedCategoryIds,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          console.log(response);

          GetCategories();
          // alert("Category Sequenced Successfully");
        } else {
          console.log(response);

          alert("Server Timed Out");
        }
        setSequencedModal(false);
        setActivityLoader(false);
      });
  };

  const SearchFilter = (text) => {
    if (text) {
      const newData = category.filter((item) => {
        const itemData = item.category_name
          ? item.category_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      SetCategory(newData);
      SetSearch(text);
    } else {
      SetCategory(filterdata);
      SetSearch(text);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <HomeHeader />
      <Modal isVisible={sequencedModal}>
        <View className="bg-white h-10 self-center justify-center items-center rounded-sm w-14 ">
          <ActivityIndicator
            animating={activityLoader}
            size="small"
            color="#ff521c"
          />
        </View>
      </Modal>

      <Modal isVisible={isModalVisible}>
        <View className="bg-white p-5 justify-center items-center rounded-lg ">
          {editMode ? <Text>Edit Category</Text> : <Text>Add Category</Text>}

          <Input
            value={editMode ? createcategory : null}
            ref={input}
            placeholder="Enter Category Name"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetCreateCategory(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <Input
            value={editMode ? categoryDesc : null}
            ref={input}
            placeholder="Enter Description"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetCategoryDesc(value)}
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
              onPress={AddCategory}
              title={editMode ? "Update" : "Add Category"}
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
              disabled={!createcategory}
            />
          </View>
        </View>
      </Modal>
      <View className="bg-white flex-row items-center justify-center  py-4  ">
        <View style={{ width: "37%" }}></View>
        <View className="w-2/4 flex-row justify-between">
          <Text>All Lists</Text>
          <View className="flex-row ">
            <TouchableOpacity onPress={OpenModal}>
              <Entypo
                style={{ marginRight: 10 }}
                name="plus"
                size={24}
                color="#78be20"
              />
            </TouchableOpacity>
            <Entypo name="dots-three-horizontal" size={24} color="black" />
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
        placeholder="Search For Categories..."
        placeholderTextColor={"white"}
        onChangeText={(text) => SearchFilter(text)}
        value={search}
        searchIcon={{ color: "white" }}
        clearIcon={{ color: "white" }}
      />
      {/* <TouchableOpacity
        onPress={() => setUniversalModal(!universalModal)}
        className="my-1 items-end p-3 "
      >
        <Text>Select Pre-approved Category</Text>
      </TouchableOpacity> */}
      {/* <ScrollView>
        {commomcategory.map((item, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SubCategory", {
                CategoryId: item.id,
                CategoryName: item.category_name,
              })
            }
          >
            <ListItem.Swipeable
              key={i}
              bottomDivider
              rightStyle={{ backgroundColor: "white" }}
              rightContent={
                <View className="flex-row w-full">
                  <Button
                    onPress={() => DeleteCommonCategory(item.id)}
                    containerStyle={{
                      width: "100%",
                    }}
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{
                      minHeight: "100%",
                      backgroundColor: "red",
                      borderRadius: 0,
                    }}
                  />
                </View>
              }
            >
              <Icon name={item.icon} />
              <ListItem.Content>
                <ListItem.Title>{item.category_name}</ListItem.Title>
                <ListItem.Subtitle>{item.category_desc}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Swipeable>
          </TouchableOpacity>
        ))}
        {category.map((item, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SubCategory", {
                CategoryId: item.id,
                CategoryName: item.category_name,
              })
            }
          >
            <ListItem.Swipeable
              key={i}
              bottomDivider
              rightStyle={{ backgroundColor: "white" }}
              rightContent={
                <View className="flex-row w-full">
                  <Button
                    onPress={() =>
                      EditMode(item.id, item.category_name, item.category_desc)
                    }
                    containerStyle={{
                      width: "50%",
                    }}
                    icon={{ name: "edit", color: "white" }}
                    buttonStyle={{
                      minHeight: "100%",
                      borderRadius: 0,
                    }}
                  />
                  <Button
                    onPress={() => DeleteCategoryAlert(item.id)}
                    containerStyle={{
                      width: "50%",
                    }}
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{
                      minHeight: "100%",
                      backgroundColor: "red",
                      borderRadius: 0,
                    }}
                  />
                </View>
              }
            >
              <Icon name={item.icon} />
              <ListItem.Content>
                <ListItem.Title>{item.category_name}</ListItem.Title>
                <ListItem.Subtitle>{item.category_desc}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Swipeable>
          </TouchableOpacity>
        ))}
      </ScrollView> */}
      <ScrollView className="flex-1">
        <GestureHandlerRootView>
          <DraggableFlatList
            containerStyle={{ paddingBottom: 180 }}
            data={category}
            onDragEnd={({ data, from: onenumber, to: twonumber }) => {
              setSequencedModal(true);
              setActivityLoader(true);
              SetCategory(data);
              StoreSequencedList(data);
            }}
            renderItem={({ item, drag, isActive }) => {
              return (
                <ScaleDecorator>
                  <Swipeable
                    key={(item) => item.id}
                    renderRightActions={() => (
                      <View className="flex-row w-32">
                        <Button
                          onPress={() =>
                            EditMode(
                              item.id,
                              item.category_name,
                              item.category_desc
                            )
                          }
                          containerStyle={{
                            width: "50%",
                          }}
                          icon={{ name: "edit", color: "white" }}
                          buttonStyle={{
                            minHeight: "100%",
                            borderRadius: 0,
                          }}
                        />
                        <Button
                          onPress={() => DeleteCategoryAlert(item.id)}
                          containerStyle={{
                            width: "50%",
                          }}
                          icon={{ name: "delete", color: "white" }}
                          buttonStyle={{
                            minHeight: "100%",
                            backgroundColor: "red",
                            borderRadius: 0,
                          }}
                        />
                      </View>
                    )}
                  >
                    <TouchableOpacity
                      key={(item) => item.id}
                      onPress={() =>
                        navigation.navigate("SubCategory", {
                          CategoryId: item.id,
                          CategoryName: item.category_name,
                          Universal_Cat_Id: item.universal_cat_id,
                        })
                      }
                      onLongPress={drag}
                      // disabled={isActive}
                      className="py-2 px-6 bg-white border-b border-gray-300"
                    >
                      <Text className="text-base">{item.category_name}</Text>
                      <Text className="text-gray-500">
                        {item.category_desc}
                      </Text>
                    </TouchableOpacity>
                  </Swipeable>
                </ScaleDecorator>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </GestureHandlerRootView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
