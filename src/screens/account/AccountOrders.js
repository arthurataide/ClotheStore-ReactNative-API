import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import theme from "../theme";
import Util from "../../helpers/Util";
import Moment from "moment";
import { getData } from "../../backend/FetchData";
import { getAuthInfo } from "../../backend/AuthStorage";

export default ({ navigation }) => {
  let [userAuth, setUserAuth] = useState();
  let [loading, setLoading] = useState();
  let [ordersData, setOrderData] = useState("");
  let [productsImages, setProductsImages] = useState("");

  Moment.locale("en");

  const checkAuth = () => {

   getAuthInfo().then((user) => {
       console.log("USER")
       console.log(user)
      if (user) {
        setLoading(true)
        setUserAuth(user._id);
        fetchDetails(user._id);
      } else {
        navigation.navigate("home");
      }
    });
  };

  const fetchDetails = async (id) => {
    let tmpProducts = []

    const orders = await getData("/orders/byuser/" + id);
    setOrderData(orders);

    const products = await getData("/products/");

    products.forEach(p => {
      if (p.pictures.length > 0) {
        tmpProducts.push({productID: p._id, url: p.pictures[0].url })
      }
    });

    console.log("IMAGES")
    console.log(tmpProducts)

    setProductsImages(tmpProducts)
    setLoading(false)
  };

  const fetchItemImage = (itemId) => {
    var url = "https://ui-avatars.com/api/?name=Clothe+Store&size=512";

    console.log("itemId")
      console.log(itemId)
      productsImages.forEach((x) => {
        if (x.productID === itemId) {
          url = x.url;
          return url;
        }
      });
    
      return url;
  };

  const countItems = (items) => {
    var total = 0;
    items.forEach((i) => {
      total = total + parseInt(i.quantity);
    });
    return total;
  };

  useLayoutEffect(() => {
    checkAuth();
    navigation.setOptions({
      title: "My Orders",
    });
  }, [navigation]);

  const renderCard = (item) => {
    var color = "";
    switch (item.status) {
      case "COMPLETED":
        color = theme.COLORS.PRIMARY;
        break;
      case "PENDING":
        color = theme.COLORS.ERROR;
        break;
      case "READY":
        color = theme.COLORS.WARNING;
        break;
      case "SHIPPED":
        color = theme.COLORS.SUCCESS;
        break;
      default:
        break;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate("ordersview", { order: item });
        }}
      >
        <View style={[styles.cardContainer, { borderRightColor: color }]}>
          <Image
            style={styles.image}
            source={{ uri: fetchItemImage(item.items[0].product_id) }}
          />
          <View style={styles.textContainer}>
            {/* First line  */}
            <Text style={styles.nameText}>
              <Text style={{ fontWeight: "700" }}>Order: </Text>
              {item.orderId}
            </Text>
            <Text style={styles.nameText}>
              Ordered on: {Moment(item.dateTime).format("d MMM, YY")}
            </Text>
            <Text style={styles.nameText}>Items: {countItems(item.items)}</Text>
            <Text style={styles.nameText}>
              Total:{" "}
              <Text style={styles.priceText}>{`C${Util.formatter.format(
                item.total
              )}`}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.activity}
          size="large"
          color={theme.COLORS.PRIMARY}
        />
      ) : (
        <>
          <View>
            <Text
              style={styles.textResults}
            >{`${ordersData.length} ORDERS`}</Text>
          </View>
          <View style={styles.separator} />
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={ordersData}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(x) => x.orderId}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    backgroundColor: theme.COLORS.WHITE,
  },
  separator: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: theme.COLORS.PRIMARY,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 6,
    borderWidth: 0.5,
    borderTopColor: theme.COLORS.TITLE,
    borderLeftColor: theme.COLORS.TITLE,
    borderBottomColor: theme.COLORS.TITLE,
    borderRadius: 5,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    borderRightWidth: 10,
    elevation: 5,
  },
  image: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },

  textContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  activity: {
    position: "absolute",
    top: Dimensions.get("window").height / 2,
    right: Dimensions.get("window").width / 2 - 20,
  },
  textResults: {
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
    color: theme.COLORS.PRIMARY,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  priceText: {
    textAlign: "left",
    fontWeight: "700",
    fontStyle: "italic",
    fontSize: 16,
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
  },
  nameText: {
    flexWrap: "wrap",
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
    fontSize: 15,
    flex: 10,
  },
});
