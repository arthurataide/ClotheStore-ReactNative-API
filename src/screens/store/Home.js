import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../../components/Card";
import Block from "../../components/Block";
import theme from "../theme";
import Util from "../../helpers/Util";
import Storage from "../../backend/LocalStorage";
import { getAuthInfo  } from "../../backend/AuthStorage";
import { getData  } from "../../backend/FetchData";
import { NavigationEvents, NavigationActions } from "react-navigation";

//Screen Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  list: {
    marginTop: 5,
    alignSelf: "stretch",
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "white",
  },
  cardImage: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  activity: {
    position: "absolute",
    top: Dimensions.get("window").height / 2,
    right: Dimensions.get("window").width / 2 - 20,
  },
});

//Screen
export default ({ navigation }) => {
  const [arrayFavorites, setArrayFavorites] = useState([]);

  let onEndReachedCallDuringMomentum = false;

  let [products, setProducts] = useState([]);
  let [loading, setLoading] = useState(false);
  let [isMoreLoading, setIsMoreLoading] = useState(false);
  let userRoute;

  const onRefresh = () => {
    loadProducts();
  };

  function loadFavorites() {
    //console.log('loadFavorites')
    setArrayFavorites([])
    Storage.getIdsForKey("favorite").then((favorites) => {
      setArrayFavorites(favorites);
      setLoading(false);
    });
  }

  function checkfavorites(itemId) {
    //console.log('checkfavorites')
    var icon = "heart-outline";
    arrayFavorites.forEach((i) => {
      if (i == itemId) {
        icon = "heart";
      }
    });
    return icon;
  }

  useEffect(() => {
    loadProducts();
    //loadFavorites();
  }, []);

  loadProducts = () => {
    setLoading(true);

    getData('/products/').then((data) => {
      if (data) {
        setProducts(data);
        setLoading(false);
        loadFavorites();
      }
    });
  };

  renderFooter = () => {
    if (!isMoreLoading) return true;
    return (
      <ActivityIndicator
        style={{ marginBottom: 10 }}
        size="large"
        color={theme.COLORS.PRIMARY}
      />
    );
  };

  useLayoutEffect(() => {
    checkAuth();
    navigation.setOptions({
      title: "ClotheStore",
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate(userRoute)}>
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

  const checkAuth = () => {
    getAuthInfo()
      .then(user =>{
        if (user.length > 0){
          userRoute = 'account'
        }else{
          userRoute = 'signin'
        }
      })
  };

  const reloadData = (payload) => {
    if (payload && payload.action.routeName === "Home") {
      setLoading(true);
      loadFavorites();
    }
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onDidFocus={(payload) => reloadData(payload)} />
      {loading ? (
        <ActivityIndicator
          style={styles.activity}
          size="large"
          color={theme.COLORS.PRIMARY}
        />
      ) : (
        <FlatList
          data={products}
          style={styles.list}
          keyExtractor={(x) => x._id}
          renderItem={({ item }) => {
            return (
              <Block space="between">
                <Card
                  style={styles.card}
                  flex
                  borderLess
                  shadowColor={theme.COLORS.BLACK}
                  title={item.name}
                  itemId={item._id}
                  activeIcon={checkfavorites(item._id)}
                  location={"C" + Util.formatter.format(item.price)}
                  imageStyle={styles.cardImage}
                  image={item.pictures[0].url}
                  onPress={() => {
                    navigation.navigate("item", {
                      item: item,
                    });
                  }}
                />
              </Block>
            );
          }}
          ListFooterComponent={renderFooter}
          initialNumToRender={4}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.2}
          onMomentumScrollBegin={() => {
            onEndReachedCallDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!onEndReachedCallDuringMomentum && !isMoreLoading) {
              //getMore();
            }
          }}
        />
      )}
    </View>
  );
};
