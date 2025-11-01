import "nativewind/dist/nativewind.css";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import GetStarted from "./Screens/GetStarted";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import Product from "./Screens/Product";
import { store } from "./store";
import { Provider } from "react-redux";
import CartScreen from "./Screens/CartScreen";
import ThankYou from "./Screens/ThankYou";
import Register from "./Screens/Register";
import FeauturedList from "./Screens/FeauturedList";
import FeauturedItems from "./Screens/FeauturedItems";
import ShareOrder from "./Screens/ShareOrder";
import SharedOrderList from "./Screens/SharedOrderList";
import SubCategory from "./Screens/SubCategory";
import EditFeaturedListCategory from "./Screens/EditFeaturedListCategory";
import EditFeaturedListSubCategory from "./Screens/EditFeaturedListSubCategory";
import EditFeaturedProduct from "./Screens/EditFeaturedProduct";
import EditCart from "./Screens/EditCart";
import MyList from "./Screens/MyList";
const Stack = createNativeStackNavigator();

const ScreenNavigatorStyle = {
  headerShown: false,
  headerStyle: {
    backgroundColor: "red",
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <MenuProvider>
        <Provider store={store}>
          <Stack.Navigator
            initialRouteName="GetStarted"
            screenOptions={ScreenNavigatorStyle}
          >
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="FeauturedList" component={FeauturedList} />
            <Stack.Screen name="FeauturedItems" component={FeauturedItems} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SubCategory" component={SubCategory} />
            <Stack.Screen name="Product" component={Product} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="ThankYou" component={ThankYou} />
            <Stack.Screen name="ShareOrder" component={ShareOrder} />
            <Stack.Screen name="SharedOrderList" component={SharedOrderList} />
            <Stack.Screen name="EditCart" component={EditCart} />
            <Stack.Screen name="MyList" component={MyList} />
            <Stack.Screen
              name="EditFeaturedProduct"
              component={EditFeaturedProduct}
            />
            <Stack.Screen
              name="EditFeaturedListSubCategory"
              component={EditFeaturedListSubCategory}
            />
            <Stack.Screen
              name="EditFeaturedListCategory"
              component={EditFeaturedListCategory}
            />
          </Stack.Navigator>
        </Provider>
      </MenuProvider>
    </NavigationContainer>
  );
}
