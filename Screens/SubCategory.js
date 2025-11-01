import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import {
  SearchBar,
  ListItem,
  Icon,
  Input,
  Button,
  Avatar,
  Badge,
} from "react-native-elements";
import BottomNavigator from "../Components/BottomNavigator";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, selectCartItems } from "../features/CartSlice";

const SubCategory = ({ navigation, route }) => {
  let ProductId = 12;

  const { CategoryId, CategoryName, Universal_Cat_Id } = route.params;
  console.log(CategoryId);
  const [search, SetSearch] = useState("");
  const [createSubcategory, SetCreateSubCategory] = useState(null);
  const [subCategoryDesc, SetSubCategoryDesc] = useState(null);
  const [editSubCategoryId, SetEditSubCategoryId] = useState(null);
  const [editSubCategory, SetEditSubCategory] = useState(null);
  const [editSubCategoryDesc, SetEditSubCategoryDesc] = useState(null);
  const [buttonloader, SetButtonLoader] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [universalModal, setUniversalModal] = useState(false);

  const [activityLoader, setActivityLoader] = useState(false);
  const [sequencedModal, setSequencedModal] = useState(false);

  const [subCategory, SetSubCategories] = useState([]);

  const [userid, SetUserId] = useState(null);
  const input = React.createRef();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [filterdata, SetFilterData] = useState([]);

  const [selectedUSC, setSelectedUSC] = useState([]);

  const OpenModal = () => {
    setAddModalVisible(true);
  };

  const OpenEditModal = (id, subcategory, subcategory_desc) => {
    setEditModalVisible(true);
    SetEditSubCategoryId(id);
    SetEditSubCategory(subcategory);
    SetEditSubCategoryDesc(subcategory_desc);
  };

  const CloseAddModal = () => {
    setAddModalVisible(false);
    SetCreateSubCategory(null);
    input.current.clear();
  };

  const CloseEditModal = () => {
    setEditModalVisible(false);
    SetEditSubCategory(null);
    input.current.clear();
  };

  const selectUSC = (item) => {
    // console.log(item);

    const isSelected = selectedUSC.some(
      (selectedUSC) => selectedUSC.id === item.id
    );

    if (isSelected) {
      setSelectedUSC(
        selectedUSC.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedUSC([...selectedUSC, item]);
    }
  };

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
          SetSubCategories(responseJson.SubCategories);
          SetFilterData(responseJson.SubCategories);
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
    GetSubCategries();
  }, []);

  const AddSubCategory = () => {
    SetButtonLoader(true);

    var res = fetch("https://reellistapp.com/api/add_sub_category", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subcategory: createSubcategory,
        subcategory_desc: subCategoryDesc,
        category_id: CategoryId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          SetButtonLoader(false);

          alert("Subcategory Created Successfully");
          setAddModalVisible(false);
          console.log(response);

          SetSubCategories((subCategory) => [
            ...subCategory,
            ...response.AddedSubCategory,
          ]);

          const newArray = [...subCategory];

          var mergeArray = newArray.concat(response.AddedSubCategory);

          StoreSequencedList(mergeArray);

          GetSubCategries();
        } else {
          SetButtonLoader(false);

          alert("Product Added Failes");
        }
      });
  };

  const EditSubCategory = () => {
    SetButtonLoader(true);
    var res = fetch("https://reellistapp.com/api/edit_sub_category", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subcategory: editSubCategory,
        subcategory_desc: editSubCategoryDesc,
        category_id: editSubCategoryId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          SetButtonLoader(false);
          alert("Subcategory Updated Successfully");
          setEditModalVisible(false);
          GetSubCategries();
        } else {
          SetButtonLoader(false);
          console.log(response);
          alert("Subcategory Update Failes");
        }
      });
  };

  const Deletecategory = (subcategoryid) => {
    var res = fetch("https://reellistapp.com/api/delete_sub_category", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subcategory_id: subcategoryid,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("SubCategory Deleted Successfully");
          GetSubCategries();
        } else {
          alert("Product Deleted Faile");
        }
        console.log(response);
      });
  };

  const DeleteSubCategory = (getsubcategoryid) =>
    Alert.alert("Are you sure?", "Do you want to delete this Subcategory?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => Deletecategory(getsubcategoryid) },
    ]);

  const StoreSequencedList = (Data) => {
    var SequencedSubCategoryIds = Data.map((item) => {
      return item.id;
    });

    var res = fetch(
      "https://reellistapp.com/api/store_subcategory_sequenced_list",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Data: SequencedSubCategoryIds,
          category_id: CategoryId,
          user_id: userid,
        }),
      }
    )
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          console.log(response);
          // alert("Sub-Category Sequenced Successfully");
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
      const newData = subCategory.filter((item) => {
        const itemData = item.subcategory
          ? item.subcategory.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      SetSubCategories(newData);
      SetSearch(text);
    } else {
      SetSubCategories(filterdata);
      SetSearch(text);
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <Header />

      {/* <Modal isVisible={universalModal}>
        <View className="bg-white  p-5 rounded-md w-full ">
          <Text className="self-center font-bold mb-5">
            Select Sub-Category of {CategoryName}
          </Text>

          <FlatList
            data={universalSubCategory}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => selectUSC(item)}
                  className="py-3 border-b w border-gray-200 flex-row justify-between"
                >
                  <Text>{item.sub_catagory_name}</Text>
                  <AntDesign
                    name={
                      selectedUSC.some(
                        (selectedItem) => selectedItem.id === item.id
                      )
                        ? "checkcircle"
                        : "checkcircleo"
                    }
                    size={24}
                    color="#ff521c"
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
          />

          <View className="flex-row justify-evenly w-full mt-5">
            <Button
              onPress={() => setUniversalModal(false)}
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
              onPress={StoreUniversalSubCategory}
              title="Add Category"
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
              disabled={selectedUSC.length > 0 ? false : true}
            />
          </View>
        </View>
      </Modal> */}

      <Modal isVisible={sequencedModal}>
        <View className="bg-white h-10 self-center justify-center items-center rounded-sm w-14 ">
          <ActivityIndicator
            animating={activityLoader}
            size="small"
            color="#ff521c"
          />
        </View>
      </Modal>
      <Modal isVisible={isAddModalVisible}>
        <View className="bg-white p-5 justify-center items-center rounded-lg ">
          <Text>Add Sub Category</Text>
          <Input
            ref={input}
            placeholder="Enter Subcategory Name "
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetCreateSubCategory(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <Input
            ref={input}
            placeholder="Enter Subcategory Description"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetSubCategoryDesc(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <View className="flex-row justify-evenly w-full">
            <Button
              onPress={CloseAddModal}
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
              onPress={AddSubCategory}
              title="Add "
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
              disabled={!createSubcategory}
            />
          </View>
        </View>
      </Modal>
      <Modal isVisible={isEditModalVisible}>
        <View className="bg-white p-5 justify-center items-center rounded-lg ">
          <Text>Edit Product</Text>
          <Input
            value={editSubCategory}
            ref={input}
            placeholder="Enter Category Name"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetEditSubCategory(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <Input
            value={editSubCategoryDesc}
            ref={input}
            placeholder="Enter Description"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetEditSubCategoryDesc(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <View className="flex-row justify-evenly w-full">
            <Button
              onPress={CloseEditModal}
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
              onPress={EditSubCategory}
              title="Update"
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
              disabled={!editSubCategory}
            />
          </View>
        </View>
      </Modal>
      <View className="bg-white flex-row items-center justify-between  py-4 px-4 ">
        <View className="w-full flex-row justify-between">
          <Text>{CategoryName}</Text>
          <View className="flex-row ">
            <View className="mr-5">
              <TouchableOpacity
                onPress={() => navigation.navigate("CartScreen")}
              >
                {/* <AntDesign name="shoppingcart" size={30} color="black" /> */}
                <Entypo name="list" size={24} color="black" />
              </TouchableOpacity>
              <Badge
                status="success"
                value={items.length}
                containerStyle={{ position: "absolute", top: 3, left: 20 }}
              />
            </View>
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
        placeholder="Search For Subcategory..."
        placeholderTextColor={"white"}
        onChangeText={(text) => SearchFilter(text)}
        value={search}
        searchIcon={{ color: "white" }}
        clearIcon={{ color: "white" }}
      />
      {/* <TouchableOpacity
        onPress={() => setUniversalModal(true)}
        className="my-1 items-end p-3 "
      >
        <Text>Select Pre-approved Sub-Category</Text>
      </TouchableOpacity> */}
      {/* <ScrollView>
        {subCategory.map((item, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Product", {
                CategoryId: CategoryId,
                CategoryName: item.category_name,
                SubcategoryId: item.id,
                SubCategoryName: item.subcategory,
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
                      OpenEditModal(
                        item.id,
                        item.subcategory,
                        item.subcategory_desc
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
                    onPress={() => DeleteSubCategory(item.id)}
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
                <ListItem.Title>{item.subcategory}</ListItem.Title>
                <ListItem.Subtitle>{item.subcategory_desc}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Swipeable>
          </TouchableOpacity>
        ))}
      </ScrollView> */}
      <ScrollView className="flex-1">
        <GestureHandlerRootView>
          <DraggableFlatList
            data={subCategory}
            onDragEnd={({ data, from: onenumber, to: twonumber }) => {
              setSequencedModal(true);
              setActivityLoader(true);
              SetSubCategories(data);
              StoreSequencedList(data);
              // await AsyncStorage.setItem("ReoganizedItem", JSON.stringify(data));
              // console.log(onenumber);
              console.log(data);
            }}
            // onRelease={(index) => console.log("From" + index)}
            // renderItem={(item) => (
            //   <View className="py-2 px-6 bg-white border-b border-gray-300">
            //     <Text className="text-base">{item.item.product_name}</Text>
            //     <Text className="text-gray-500">{item.item.product_desc}</Text>
            //   </View>
            // )}
            // )}

            renderItem={({ item, drag, isActive }) => {
              // console.log(item);
              return (
                <ScaleDecorator>
                  <Swipeable
                    renderRightActions={() => (
                      <View className="flex-row w-32">
                        <Button
                          onPress={() =>
                            OpenEditModal(
                              item.id,
                              item.subcategory,
                              item.subcategory_desc
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
                          onPress={() => DeleteSubCategory(item.id)}
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
                    // key={item.id}
                    // item={item}
                    //   ref={(ref) => {
                    //     if (ref && !itemRefs.current.get(item.id)) {
                    //       itemRefs.current.set(item.id, ref);
                    //     }
                    //   }}
                    //   overSwipe={50}
                    //   snapPointsLeft={[100]}
                    //   // snapPointsRight={[50]}
                    //   renderUnderlayLeft={() => <Text>Delete</Text>}
                    //   // renderUnderlayRight={() => <Text>Delete</Text>}
                    //   onChange={({ open }) => {
                    //     console.log(open);
                    //     // if (open) {
                    //     //   for (const [
                    //     //     id,
                    //     //     ref,
                    //     //   ] of props.itemRefs.current.entries()) {
                    //     //     if (id !== id && ref) ref.close();
                    //     //   }
                    //     // }
                    //   }}
                    //   onDragEnd={({ data }) => console.log(data)}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Product", {
                          CategoryId: CategoryId,
                          CategoryName: item.category_name,
                          SubcategoryId: item.id,
                          SubCategoryName: item.subcategory,
                          Universal_Cat_Id: Universal_Cat_Id,
                          Universal_SubCat_Id: item.universal_sub_cat_id,
                        })
                      }
                      onLongPress={drag}
                      // disabled={isActive}
                      className="py-2 px-6 bg-white border-b border-gray-300"
                    >
                      <Text className="text-base">{item.subcategory}</Text>
                      <Text className="text-gray-500">
                        {item.subcategory_desc}
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

export default SubCategory;
