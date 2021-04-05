import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import theme from "../theme";
import * as Toast from "../../components/Toast";
import { getAuthInfo } from "../../backend/AuthStorage";
import { getData, updateData } from "../../backend/FetchData";

TextInput.defaultProps.selectionColor = theme.COLORS.PRIMARY;

export default ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});

  let [userAuth, setUserAuth] = useState();
  let [address, setAddress] = useState("");
  let [state, setState] = useState("");
  let [country, setCountry] = useState("");
  let [city, setCity] = useState("");
  let [zip, setZip] = useState("");

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

  useLayoutEffect(() => {
    checkAuth();
    navigation.setOptions({
      title: "Delivery Address",
    });
  }, [navigation]);

  const save = (id) => {
    const newUserInfo = {
      ...userInfo,
      address: address,
      city: city,
      state: state,
      country: country,
      zip: zip,
    };

    updateData("/auth/user-info/", newUserInfo).then((response) => {
      if (response) {
        console.log("response.status");
        console.log(response.status);
        if (response.status >= 200 && response.status <= 300) {
          Toast.show("New Address 😍 Ready to receive your order !");
        }
      }
    });
  };

  const fetchDetails = (id) => {
    console.log("fetchDetails " + id);
    getData("/auth/user-info/" + id).then((data) => {
      console.log(data);
      if (data) {
        setUserInfo(data);

        setAddress(data.address);
        setCity(data.city);
        setState(data.state);
        setCountry(data.country);
        setZip(data.zip);
      }
    });
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.topHeader}>
          <FontAwesome5
            name="search-location"
            size={50}
            color={theme.COLORS.PRIMARY}
          />
          <Text style={styles.textHeader}>Address Information</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.detailsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={(text) => setAddress(text)}
            value={address}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="City"
            onChangeText={(text) => setCity(text)}
            value={city}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Province/State"
            onChangeText={(text) => setState(text)}
            value={state}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Country"
            onChangeText={(text) => setCountry(text)}
            value={country}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            onChangeText={(text) => setZip(text)}
            value={zip}
          ></TextInput>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={styles.save}
        onPress={() => {
          if (address != "" && state != "" && country != "" && zip != "") {
            save(userAuth);
          } else {
            Toast.showError("Fields can not be empty !");
          }
        }}
      >
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
  topHeader: {
    margin: 10,
    padding: 40,
    alignItems: "center",
  },
  textHeader: {
    paddingTop: 10,
    fontSize: 25,
    textAlign: "center",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  detailsContainer: {
    flex: 4,
    alignContent: "center",
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
  map: {
    width: Dimensions.get("window").width - 20,
    height: 200,
  },
});
