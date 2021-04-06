import React, { useState, useEffect } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import Input from "../../components/Input";
import theme from "../theme";
import { getData, postData } from "../../backend/FetchData";
import { saveAuthInfo } from "../../backend/AuthStorage";
import * as Toast from "../../components/Toast";

const { width, height } = Dimensions.get("screen");

export default ({ route, navigation }) => {
  // let database = FirebaseConfig();
  const [isSelected, setSelection] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let nextScreen = route.params?.nextScreen;
  let cartData = route.params?.cartData;

  const checklogin = async () => {
    if (email != "" && password != "") {

      // if (email === "admin"){
      //   navigation.navigate('adminpanel')
      //   return;
      // }
      const authData = {
        email,
        password,
      };

      //attempt login
      const response = await postData("/auth/signin/", authData);
      try {
        if (response) {
          if (response.status >= 200 && response.status <= 300) {
            //success
            const data = await response.json();
          
            const userInfo = await getData('/auth/user-info/' + data._id)

            //saving auth information (id and token)
            await saveAuthInfo({...data, role: userInfo.role});

            console.log(userInfo)
            if (userInfo.role === 'admin'){
              navigation.replace('adminpanel')
              return;
            }

            if (nextScreen != undefined) {
              navigation.replace(nextScreen, {
                cartData: cartData,
                userId: data._id,
              });
            } else {
              navigation.popToTop();
            }
          } else {
            //fail
            response.text().then((text) => Toast.showError(text));
          }
        }
      } catch (error) {
        console.log(error);
      }

    } else {
      Toast.showError("Email and Password are required");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.mainContainer}>
        {loading ? (
          <ActivityIndicator
            style={styles.activity}
            size="large"
            color={theme.COLORS.PRIMARY}
          />
        ) : (
          <></>
        )}
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ width: "100%", marginTop: 20 }}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Please Sign In</Text>
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
              icon="md-mail"
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(email) => setEmail(email.toLowerCase())}
              // autoCapitalize='none'
            />
            <Input
              icon="key"
              placeholder="Password"
              secureEntry={true}
              textContentType="password"
              value={password}
              onChangeText={(pass) => setPassword(pass.toLowerCase())}
              autoCapitalize='none'
            />
            <BouncyCheckbox
              textDecoration={true}
              isChecked={false}
              value={isSelected}
              textColor="#000"
              borderColor={theme.COLORS.PRIMARY}
              fillColor={theme.COLORS.PRIMARY}
              text="Remember me"
              onValueChange={setSelection}
              style={styles.checkbox}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => checklogin()}>
            <Text style={styles.text}>Sign In</Text>
          </TouchableOpacity>
          <View style={{ margin: 5 }}></View>
        </View>
        <Text>Don't have an account?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("register");
            }}
          >
            <Text style={styles.text}>Register</Text>
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
    marginVertical: 40,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
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
