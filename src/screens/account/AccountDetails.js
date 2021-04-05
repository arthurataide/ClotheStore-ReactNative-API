import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import theme from "../theme";
import * as Toast from '../../components/Toast';
import { getData, updateData } from "../../backend/FetchData";
import { getAuthInfo } from "../../backend/AuthStorage";

TextInput.defaultProps.selectionColor = theme.COLORS.PRIMARY;

export default ({ navigation }) => {
  let [userAuth, setUserAuth] = useState();
  let [userInfo, setUserInfo] = useState({});

  let [fName, setFname] = useState("");
  let [lName, setLname] = useState("");
  let [email, setEmail] = useState("");
  let [profilePic, setProfile] = useState();

  const checkAuth = () => {
    
    getAuthInfo().then((user) => {
      if (user) {
        setUserAuth(user._id);
        fetchDetails(user._id);
      } else {
        navigation.navigate("home");
      }
    });
  };

  const save = (id) => {

    const newUserInfo = {
        ...userInfo,
        firstName: fName,
        lastName: lName,
    }

    updateData("/auth/user-info/", newUserInfo)
    .then(response =>{
      if(response){
        console.log("response.status")
        console.log(response.status)
        if (response.status >= 200 && response.status <= 300){
          Toast.show('Name updated !!');
        }
      }
    })
  };

  const profilePicture = () => {
    if (profilePic != undefined) {
      return <Image style={styles.img} source={{ uri: profilePic }}></Image>;
    } else {
      return (
        <Image
          style={styles.img}
          source={{
            uri:
              "https://ui-avatars.com/api/?size=256&background=5a2d82&color=fff&name=John+Doe",
          }}
        ></Image>
      );
    }
  };

  const fetchDetails = (id) => {
    //console.log("fetchDetails " + id);
    getData("/auth/user-info/" + id)
    .then(data => {
      console.log(data)
      if (data){
        setUserInfo(data)

        setFname(data.firstName);
        setLname(data.lastName);
        setEmail(data.email);
        setProfile(data.url);
      }
    })
  };

  useLayoutEffect(() => {
    checkAuth();
    navigation.setOptions({
      title: "Account Details",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.imgContainer}>{profilePicture()}</View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.detailsContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setFname(text)}
            value={fName}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(text) => setLname(text)}
            value={lName}
          ></TextInput>
          <TextInput
            style={styles.inputdisabled}
            defaultValue={email}
            placeholder="Email"
            editable={false}
          ></TextInput>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity style={styles.save} onPress={() => save(userAuth)}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    backgroundColor: theme.COLORS.WHITE,
  },
  imgContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  detailsContainer: {
    flex: 4,
    alignContent: "center",
  },
  inputdisabled: {
    height: 40,
    margin: 12,
    paddingLeft: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
    backgroundColor: "lightgrey",
  },
  input: {
    height: 40,
    margin: 12,
    paddingLeft: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
  },
  separator: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
  },
  text: {
    fontSize: 15,
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  saveText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    alignSelf: "center",
  },
  save: {
    position: "absolute",
    justifyContent: "center",
    height: 50,
    width: "100%",
    backgroundColor: theme.COLORS.PRIMARY,
    bottom: 0,
  },
});
