import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { SearchBar } from "react-native-elements";
import TabOptions from "../../components/TabOptions";
import { getData } from "../../backend/FetchData";
import { getAuthInfo } from "../../backend/AuthStorage";
import { NavigationEvents } from "react-navigation";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
// import firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 5,
    height: Dimensions.get("window").height - 300,
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: theme.COLORS.TITLE,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  categoryText: {
    fontSize: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
  },
  categoryImage: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
});

export default ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [classificationIndex, setClassificationIndex] = useState("0");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const ref = useRef(null);

  const load = (payload) => {
    //console.log("onDidFocus");
    if (payload && payload.action.routeName === "Search") {
      loadCategories();
    }
  };

  const loadCategories = () => {
    console.log('loading categories')
    setLoading(true)

    getData('/categories/').then((data) => {
      if (data) {
        var tmp = []
        data.forEach((x) => {
          if(x.active){
            tmp.push(x)
          }
        })
        setCategories([])
        setCategories(tmp);
        setLoading(false);
      }
    });
  }

  //SettingUp the top Header style
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "ClotheStore",
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          checkAuth().then(route =>{
            navigation.navigate(route)
          })

        }}>
          <Ionicons
            name={"person"}
            size={25}
            color={theme.COLORS.WHITE}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const checkAuth = async () => {
    const user = await getAuthInfo()
    if (user){
      return user.role === 'admin' ? 'adminpanel' : 'account'
    }else{
      return 'signin'
    }
  };

  //Options configuration
  const [tabOptions, setTabOptions] = useState([
    { key: "0", name: "Women", checked: true, onPress: () => {} },
    { key: "1", name: "Men", checked: false, onPress: () => {} },
    { key: "2", name: "Kids", checked: false, onPress: () => {} },
  ]);

  //Check option onPreess event
  const checkOption = (key) => {
    let newTabOptions = [];

    tabOptions.forEach((x) => {
      if (x.key == key) {
        x.checked = true;
      } else {
        x.checked = false;
      }
      newTabOptions.push(x);
    });

    setTabOptions(newTabOptions);
    setClassificationIndex(key);

    console.log("key " + key);
    console.log("classificationIndex " + classificationIndex);
  };

  //Assign function
  useEffect(() => {
    let newTabOptions = [];
    tabOptions.forEach((x) => {
      //onPress function
      x.onPress = checkOption;
      newTabOptions.push(x);
    });

    setTabOptions(newTabOptions);

    loadCategories()
  }, []);

  //Search products events
  const searchByCategory = (categoryName, categoryId) => {
    //Go to home and search by classification and category
    navigation.navigate("searchResults", {
      productClassification:
        tabOptions[tabOptions.findIndex((x) => x.checked)].name,
      productCategoryId: categoryId,
      productCategoryName: categoryName,
    });
  };

  const searchByProductName = () => {
    //Go to home and search by classification and category
    navigation.navigate("searchResults", {
      productName: searchText,
    });
  };

  //Render carousel
  const renderItem = useCallback(
    ({ item, index }, parallaxProps) => (
      <TouchableWithoutFeedback
        onPress={() => searchByCategory(item.name, item._id)}
      >
        <View style={styles.card}>
          <ParallaxImage
            source={{ uri: item.url }}
            containerStyle={styles.imageContainer}
            style={styles.categoryImage}
            parallaxFactor={0.4}
            {...parallaxProps}
          />
          <View style={{ alignSelf: "stretch", height: 49 }}>
            <Text style={styles.categoryText}>
              {item.name.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavigationEvents onDidFocus={(payload) => load(payload)}
      />
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.COLORS.PRIMARY}
      ></StatusBar>
      <SearchBar
        containerStyle={styles.searchContainer}
        inputContainerStyle={{ backgroundColor: "transparent" }}
        placeholder={"Find products..."}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        showCancel={true}
        searchIcon={{ size: 24 }}
        cancelIcon={{ size: 24 }}
        onSubmitEditing={() => searchByProductName()}
      />
      <TabOptions
        options={tabOptions}
        highlightColor={theme.COLORS.PRIMARY}
        titleColor={theme.COLORS.TITLE}
      />
      <View style={{ alignSelf: "center" }}>
        <Carousel
          layout={"default"}
          ref={ref}
          data={categories}
          sliderWidth={400}
          itemWidth={320}
          renderItem={renderItem}
          hasParallaxImages={true}
        />
      </View>
    </SafeAreaView>
  );
};
