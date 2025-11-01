import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListItem, Text, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";

const ShareOrder = ({ route }) => {
  const { ListId } = route.params;

  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [buttonloader, SetButtonLoader] = useState(false);
  const [userId, SetUserId] = useState("");

  const GetUserList = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    SetUserId(user_id);
    var ApiUrl = "https://reellistapp.com/api/get_all_users";
    var res = await fetch(ApiUrl, {
      mode: "no-cors",
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 1) {
          setUsers(responseJson.Users);
          console.log(responseJson);
        } else {
          alert("Server Timed Out");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    GetUserList();
  }, []);

  const ShareWith = (shareduserid) => {
    setSelectedId(shareduserid);
    // console.log(userid);
  };

  const ShareToUser = () => {
    SetButtonLoader(true);
    var res = fetch("https://reellistapp.com/api/shareorder", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list_id: ListId,
        user_id: userId,
        shared_to_userid: selectedId,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status == 1) {
          alert("List Shared Successfully");
          SetButtonLoader(false);
        } else {
          SetButtonLoader(false);

          alert("Server Timed Out");
        }
        console.log(response);
      });
  };

  return (
    <SafeAreaView className="flex-1 ">
      <Header />
      <Text h4 className="text-center my-5">
        Share With
      </Text>
      <ScrollView className="bg-white">
        {users.map((user, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>
              <TouchableOpacity
                onPress={() => ShareWith(user.id)}
                className="p-1"
              >
                <AntDesign
                  name={selectedId == user.id ? "checkcircle" : "checkcircleo"}
                  size={24}
                  color="#ff521c"
                />
              </TouchableOpacity>
            </ListItem.Subtitle>
          </ListItem>
        ))}
      </ScrollView>
      <Button
        disabled={!selectedId}
        onPress={ShareToUser}
        loading={buttonloader}
        title="Share"
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
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default ShareOrder;
