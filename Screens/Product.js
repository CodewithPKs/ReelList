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

import SwipeableItem, {
  useSwipeableItemParams,
  OpenDirection,
} from "react-native-swipeable-item";

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
import {
  addToCart,
  selectCartItems,
  removeFromBasket,
} from "../features/CartSlice";

let productQuantity = [];

const Product = ({ navigation, route }) => {
  const {
    CategoryId,
    CategoryName,
    SubcategoryId,
    SubCategoryName,
    Universal_Cat_Id,
    Universal_SubCat_Id,
  } = route.params;

  const [search, SetSearch] = useState("");
  const [createproduct, SetCreateProduct] = useState(null);
  const [productDesc, SetProductDesc] = useState(null);
  const [editProductId, SetEditProductId] = useState(null);
  const [editProduct, SetEditProduct] = useState(null);
  const [editProductDesc, SetEditProductDesc] = useState(null);
  const [buttonloader, SetButtonLoader] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const [activityLoader, setActivityLoader] = useState(false);
  const [sequencedModal, setSequencedModal] = useState(false);

  const [product, SetProduct] = useState([]);
  const [filterdata, SetFilterData] = useState([]);

  const [sequenceNumber, SetSequenceNumber] = useState(null);
  const [userid, SetUserId] = useState(null);

  const [universalProduct, SetUniversalProducts] = useState([]);
  const [selectedUP, setSelectedUP] = useState([]);
  const [universalModal, setUniversalModal] = useState(false);

  const input = React.createRef();

  const items = useSelector(selectCartItems);

  const itemRefs = React.useRef(new Map());

  const OpenModal = () => {
    // console.log(MyProducts);
    setAddModalVisible(true);
  };

  const OpenEditModal = (id, productname, productdesc) => {
    setEditModalVisible(true);
    SetEditProductId(id);
    SetEditProduct(productname);
    SetEditProductDesc(productdesc);
  };

  const CloseAddModal = () => {
    setAddModalVisible(false);
    SetCreateProduct(null);
    input.current.clear();
  };

  const CloseEditModal = () => {
    setEditModalVisible(false);
    SetEditProduct(null);
    input.current.clear();
  };

  const dispatch = useDispatch();

  const selectUP = (item) => {
    // console.log(item);

    const isSelected = selectedUP.some(
      (selectedUP) => selectedUP.id === item.id
    );

    if (isSelected) {
      setSelectedUP(
        selectedUP.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedUP([...selectedUP, item]);
    }
  };

  const GetUniversalProducts = async () => {
    var ApiUrl = "https://reellistapp.com/api/get_Universalproduct";
    var res = await fetch(ApiUrl, {
      mode: "no-cors",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Universal_Cat_Id: Universal_Cat_Id,
        Universal_SubCat_Id: Universal_SubCat_Id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 1) {
          console.log(responseJson);
          SetUniversalProducts(responseJson.UniversalProduct);
        } else {
          alert("Server Timed Out");
          // console.log(responseJson);
        }
        console.log(responseJson);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const StoreUniversalProduct = () => {
    // console.log(selectedUC);

    var res = fetch("https://reellistapp.com/api/StoreUniversalProduct", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selecteduniversalproduct: selectedUP,
        category_id: CategoryId,
        sub_category_id: SubcategoryId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status == 1) {
          setUniversalModal(false);
          GetProduct();
          alert("Pre-Approved Product Added Successfully");
        } else {
          alert("Server Timed Out");
        }
        console.log(response);
      });
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
          SetFilterData(responseJson.Products);
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
    GetUniversalProducts();
    productQuantity = [];
  }, [createproduct]);

  const AddProduct = () => {
    SetButtonLoader(true);

    var res = fetch("https://reellistapp.com/api/add_product", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: createproduct,
        sequenceNumber: sequenceNumber,
        product_desc: productDesc,
        category_id: CategoryId,
        sub_category_id: SubcategoryId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          SetButtonLoader(false);

          alert("Product Created Successfully");
          setAddModalVisible(false);
          console.log(response);

          SetProduct((product) => [...product, ...response.getAddedProduct]);

          const newArray = [...product];

          var mergeArray = newArray.concat(response.getAddedProduct);

          StoreSequencedList(mergeArray);

          GetProduct();
        } else {
          SetButtonLoader(false);

          alert("Product Added Failes");
        }
        // console.log(response);
      });
  };

  const EditProduct = () => {
    SetButtonLoader(true);
    var res = fetch("https://reellistapp.com/api/edit_product", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: editProduct,
        product_desc: editProductDesc,
        product_id: editProductId,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          SetButtonLoader(false);
          alert("Product Updated Successfully");
          setEditModalVisible(false);
          GetProduct();
        } else {
          SetButtonLoader(false);
          // console.log(response);
          alert("Product Update Failes");
        }
      });
  };

  const DeleteProduct = (productid) => {
    var res = fetch("https://reellistapp.com/api/delete_product", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productid,
        user_id: userid,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("Product Deleted Successfully");
          GetProduct();
        } else {
          alert("Product Deleted Faile");
        }
        // console.log(response);
      });
  };

  const DeleteProductAlert = (getproductid) =>
    Alert.alert("Are you sure?", "Do you want to delete this product?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => DeleteProduct(getproductid) },
    ]);

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
    productQuantity.push(id);
  };
  // console.log(productQuantity);
  const removeItemFromCart = (id, product_name) => {
    // ToastAndroid.show(`${product_name} Removed From Cart`, ToastAndroid.SHORT);
    dispatch(removeFromBasket({ id }));

    const index = productQuantity.indexOf(id);
    if (index > -1) {
      // only splice array when item is found
      productQuantity.splice(index, 1); // 2nd parameter means remove one item only
    }
  };

  const StoreSequencedList = (Data) => {
    var SequencedProductIds = Data.map((item) => {
      return item.id;
    });

    var res = fetch("https://reellistapp.com/api/store_sequenced_products", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Data: SequencedProductIds,
        user_id: userid,
        category_id: CategoryId,
        sub_category_id: SubcategoryId,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          console.log(response);
          // alert("Product Sequenced Successfully");
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
      const newData = product.filter((item) => {
        const itemData = item.product_name
          ? item.product_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      SetProduct(newData);
      SetSearch(text);
    } else {
      SetProduct(filterdata);
      SetSearch(text);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header />

      {/* <Modal isVisible={universalModal}>
        <View className="bg-white  p-5 rounded-md w-full ">
          <Text className="self-center font-bold mb-5">
            Select Product of {SubCategoryName}
          </Text>

          <FlatList
            data={universalProduct}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => selectUP(item)}
                  className="py-3 border-b w border-gray-200 flex-row justify-between"
                >
                  <Text>{item.product_name}</Text>
                  <AntDesign
                    name={
                      selectedUP.some(
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
              onPress={StoreUniversalProduct}
              title="Add Products"
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
              disabled={selectedUP.length > 0 ? false : true}
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
          <Text>Add Product</Text>
          <Input
            ref={input}
            placeholder="Enter Product Name (15 Character)"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetCreateProduct(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <Input
            ref={input}
            placeholder="Enter Product Description"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetProductDesc(value)}
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
              onPress={AddProduct}
              title="Add Product"
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
              disabled={!createproduct}
            />
          </View>
        </View>
      </Modal>
      <Modal isVisible={isEditModalVisible}>
        <View className="bg-white p-5 justify-center items-center rounded-lg ">
          <Text>Edit Product</Text>
          <Input
            value={editProduct}
            ref={input}
            placeholder="Enter Category Name"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetEditProduct(value)}
            inputStyle={{
              fontSize: 15,
            }}
          />
          <Input
            value={editProductDesc}
            ref={input}
            placeholder="Enter Description"
            // leftIcon={{ type: "font-awesome", name: "box" }}
            onChangeText={(value) => SetEditProductDesc(value)}
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
              onPress={EditProduct}
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
              disabled={!editProduct}
            />
          </View>
        </View>
      </Modal>
      <View className="bg-white flex-row items-center justify-between  py-4 px-4 ">
        <View className="w-full flex-row justify-between">
          <Text>{SubCategoryName}</Text>
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
        placeholder="Search For Products..."
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
        <Text>Select Pre-approved Products</Text>
      </TouchableOpacity> */}

      <ScrollView className="flex-1">
        <GestureHandlerRootView>
          <DraggableFlatList
            data={product}
            onDragEnd={async ({ data }) => {
              setSequencedModal(true);
              setActivityLoader(true);
              SetProduct(data);
              // await AsyncStorage.setItem("ReoganizedItem", JSON.stringify(data));
              StoreSequencedList(data);
              // console.log(data);
            }}
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
                              item.product_name,
                              item.product_desc
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
                          onPress={() => DeleteProductAlert(item.id)}
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
                      onLongPress={drag}
                      // disabled={isActive}
                      className="py-2 px-3 bg-white border-b border-gray-300 flex-row justify-between items-center"
                    >
                      <View className="w-[60%] ">
                        <Text numberOfLines={2} className="text-base">
                          {item.product_name}
                        </Text>
                        <Text className="text-gray-500">
                          {item.product_desc}
                        </Text>
                      </View>

                      <View className="flex-row border border-orange-500 rounded-md items-center">
                        <TouchableOpacity
                          onPress={() =>
                            removeItemFromCart(item.id, item.product_name)
                          }
                          className="p-1"
                        >
                          <Entypo name="minus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="border-x border-orange-500 p-3 font-medium">
                          {/* {items.length} */}
                          {productQuantity.filter((x) => x == item.id).length}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            addItemToCart(item.id, item.product_name)
                          }
                          className="p-1"
                        >
                          <Entypo name="plus" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                </ScaleDecorator>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </GestureHandlerRootView>
      </ScrollView>
      {/* <BottomNavigator /> */}
    </SafeAreaView>
  );
};

export default Product;
