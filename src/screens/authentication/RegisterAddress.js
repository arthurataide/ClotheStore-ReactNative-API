import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Input from "../../components/Input";
import theme from "../theme";
import * as Toast from "../../components/Toast";
import { postData, updateData } from "../../backend/FetchData";

const { width, height } = Dimensions.get("screen");

export default ({ route, navigation }) => {
  const { user } = route.params;
  let [address, setAddress] = useState("");
  let [city, setCity] = useState("");
  let [state, setState] = useState("");
  let [country, setCountry] = useState("");
  let [zip, setZip] = useState("");

  const saveData = async () => {
    const credentials = {
      email: user.email.toLowerCase(),
      password: user.password,
    };

    const userInfo = {
      email: user.email.toLowerCase(),
      profilePicture: user.profilePicture,
      firstName: user.firstName,
      lastName: user.lastName,
      address: address,
      city: city,
      state: state,
      country: country,
      zip: zip,
    };

    try {
      if (user._id != undefined) {
        const responseUserInfo = await updateData("/auth/user-info/", userInfo);

        if (responseUserInfo) {
          //Error
          if (responseUserInfo.status >= 400) {
            responseUserInfo.text().then((text) => Toast.showError(text));
            return;
          }

          if (responseUserInfo.status === 200) {
            Toast.show("Information updated!")
            navigation.popToTop();
          }
        }
      } else {
        const responseRegister = await postData("/auth/register/", credentials);
        if (responseRegister) {
          //Error
          if (responseRegister.status >= 400) {
            responseRegister.text().then((text) => Toast.showError(text));
            return;
          }

          if (responseRegister.status === 200) {
            const responseUserInfo = await updateData("/auth/user-info/",userInfo);

            if (responseUserInfo) {
              //Error
              if (responseUserInfo.status >= 400) {
                responseUserInfo.text().then((text) => Toast.showError(text));
                return;
              }

              if (responseUserInfo.status === 200) {
                Toast.show("User created successfully!")
                navigation.popToTop();
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validate = () => {
    if (address != "" && state != "" && country != "" && zip != "") {
      return true;
    } else {
      Toast.showError("Fields can not be empty !");
      return false;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Delivery Address",
    });
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.mainContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ width: "100%" }}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Delivery Address</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <Input
              icon="ios-location-sharp"
              placeholder="Address"
              keyboardType="default"
              textContentType="fullStreetAddress"
              onChangeText={(address) => setAddress(address)}
            />
            <Input
              icon="map"
              placeholder="City"
              keyboardType="default"
              textContentType="addressCity"
              onChangeText={(city) => setCity(city)}
            />
            <Input
              icon="map"
              placeholder="Province"
              keyboardType="default"
              textContentType="addressState"
              onChangeText={(state) => setState(state)}
            />
            <Input
              icon="map"
              placeholder="Country"
              keyboardType="default"
              textContentType="countryName"
              onChangeText={(country) => setCountry(country)}
            />
            <Input
              icon="ios-location-sharp"
              placeholder="Postal Code"
              keyboardType="default"
              textContentType="postalCode"
              onChangeText={(zip) => setZip(zip)}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (validate()) {
                saveData();
              }
            }}
          >
            <Text style={styles.text}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <Text>© Team South - 2021</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  button: {
    backgroundColor: theme.COLORS.PRIMARY,
    padding: 10,
    width: width / 1.2,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  text: {
    color: theme.COLORS.WHITE,
    fontSize: 18,
    fontWeight: "600",
  },
  headerContainer: {
    width: "100%",
    padding: 10,
    marginVertical: 25,
  },
  headerTitleContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
