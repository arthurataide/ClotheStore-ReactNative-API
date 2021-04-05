import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import theme from "../theme";
// import FirebaseConfig from "../../backend/FirebaseConfig";
// import firebase from "firebase";
import Util from "../../helpers/Util";
import Moment from "moment";
import { getData } from "../../backend/FetchData";

export default ({ route, navigation }) => {
  let { order } = route.params;
  //console.log(order);
  let [loading, setLoading] = useState();
  let [items, setOrderData] = useState("");
  let [orderItems, setOrderItems] = useState([]);
  //let database = FirebaseConfig();
  //Moment.locale("en");

//   const checkAuth = () => {
//       navigation.navigate("home");
//   };

  useLayoutEffect(() => {
      //checkAuth();
      navigation.setOptions({
        title: "Order Details",
      });

      loadItems().then(data => setOrderItems(data))
  }, []);

  const loadItems = async () =>{
    
    try {
        let newItems = []
        console.log("order.items.forEach")
        const products = await getData('/products/')

        order.items.forEach(i =>{
            const product = products.filter(p => p._id === i.product_id)[0]
            console.log(product.pictures.length)
            if (product){
                const newItem =  {...i, 
                        url: product.pictures.length > 0 
                        ?  product.pictures[0].url 
                        : "https://ui-avatars.com/api/?name=Clothe+Store&size=512"}
                newItems.push(newItem)
                // console.log(newItems)
                
                //{ ...req.body, user_id: _id }

                    // newItems.push( {...i, 
                    //     url: product.pictures[0].length > 0 
                    //     ?  product.pictures[0].url 
                    //     : "https://ui-avatars.com/api/?name=Clothe+Store&size=512"} )
            }
        })
        
        console.log("newItems")
        console.log(newItems)
        return newItems
    } catch (error) {
        console.error(error)
    }

    
  }

//   const fetchItemImage = (itemId) => {
//     let url = "https://ui-avatars.com/api/?name=Clothe+Store&size=512";
//     getData("/products/" + itemId).then((product) => {
//       if (product.pictures.length > 0) {
//         url = product.pictures[0].url;
//       }
//     });

//     return ( <Image style={styles.image} source={{ uri: url }} /> );

//     // //console.log(itemId)
//     // const orderRef = database.database().ref("product/");

//     // orderRef
//     // .orderByChild("id")
//     // .equalTo(itemId)
//     // .on("value", function (snapshot) {
//     //     snapshot.forEach(function (childSnapshot) {
//     //         //console.log(childSnapshot.val().pictures[0].url)
//     //         url = childSnapshot.val().pictures[0].url
//     //     })
//     // })
//     // return (
//     //     <Image style={styles.image} source={{ uri: url }} />
//     // )
//   };

  const renderCard = (item, status) => {
    var color = "";
    switch (status) {
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
      <View style={[styles.cardContainer, { borderRightColor: color }]}>
         <Image style={styles.image} source={{ uri: item.url }} />
         <View style={styles.textContainer}>
          <Text style={{ fontWeight: "700", marginTop: 10 }}>{item.name}</Text>
          <Text>
            {item.size} {item.quantity} Items
          </Text>
          <Text>{item.code}</Text>
          <Text style={styles.priceText}>{`C${Util.formatter.format(
            item.price
          )}`}</Text>
        </View>
      </View>
    );
  };

  const getHeader = () => {
    return (
      <View>
        <View style={styles.topContainer}>
          <View
            style={{
              paddingVertical: 35,
              paddingHorizontal: 35,
              flexDirection: "row",
            }}
          >
            <Ionicons name="location-outline" size={26} color="black" />
            <View style={{ paddingHorizontal: 15 }}>
              <Text>{order.fullName}</Text>
              <Text>{order.address}</Text>
              <Text>
                {order.state} {order.zip}
              </Text>
              <Text>{order.country}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={[styles.middleContainer]}>
          <Text style={styles.textConnerLeft}>Order Number</Text>
          <Text style={styles.textConnerRight}>{order.orderId}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.middleContainer}>
          <Text style={styles.textConnerLeft}>Order Time</Text>
          <Text style={styles.textConnerRight}>
            {Moment(order.dateTime).format("MMM d, YYYY, h:mm A")}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.middleContainer}>
          <Text style={styles.textConnerLeft}>Payment</Text>
          <Text style={[styles.textConnerRight, { marginRight: 5 }]}>
            <FontAwesome5 name="cc-visa" size={22} color="black" />
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.shipment}>
          <Text style={styles.title}>Shipment</Text>
          <View style={{ flexDirection: "row", marginVertical: 5 }}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={20}
              color="gray"
            />
            <Text style={styles.statusShipment}>{order.status}</Text>
          </View>
          <Text style={{ fontWeight: "700", marginTop: 10 }}>
            Estimated Delivery:
          </Text>
          <Text>Wednesday, Mar 13</Text>
        </View>
      </View>
    );
  };

  const getFooter = () => {
    return (
      <View>
        <View style={styles.summary}>
          <Text style={[styles.title, { marginVertical: 5 }]}>
            ORDER SUMMARY
          </Text>
          {getItems()}
          <View style={styles.summaryText}>
            <Text style={styles.textConnerLeft}>Shipping</Text>
            <Text style={styles.textConnerRight}>{`C${Util.formatter.format(
              order.shippingFee
            )}`}</Text>
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.textConnerLeft}>Tax</Text>
            <Text style={styles.textConnerRight}>{`C${Util.formatter.format(
              order.tax
            )}`}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.total}>
          <Text
            style={[
              styles.textConnerLeft,
              { color: "black", fontWeight: "700" },
            ]}
          >
            TOTAL
          </Text>
          <Text
            style={[styles.textConnerRight, { fontWeight: "700" }]}
          >{`C${Util.formatter.format(order.total)}`}</Text>
        </View>
      </View>
    );
  };

  const getItems = () => {
    var allItems = [];
    <View>
    <View style={styles.summaryText}>
    <Text style={styles.textConnerLeft}>Item Name</Text>
    <Text style={styles.textConnerRight}>{order.orderId}</Text>
    </View>
    </View>

    order.items.forEach(i => {
        var tmp = <View key={i._id} style={styles.summaryText}>
            <Text style={styles.textConnerLeft}>{i.quantity}X {i.name}</Text>
            <Text style={styles.textConnerRight}>{`C${Util.formatter.format(i.price * i.quantity)}`}</Text>
        </View>
        allItems.push(tmp)
    })
    return allItems;
  };

  return (
    <View style={styles.container}>
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        data={orderItems}
        renderItem={({ item }) => renderCard(item, order.status)}
        keyExtractor={(x) => x.product_id}
        ListHeaderComponent={getHeader}
        ListFooterComponent={getFooter}
      />
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
    borderColor: theme.COLORS.TITLE,
    opacity: 0.3,
  },
  topContainer: {
    flex: 1,
  },
  middleContainer: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  textConnerLeft: {
    color: theme.COLORS.TITLE,
  },
  textConnerRight: {
    flex: 1,
    textAlign: "right",
  },
  shipment: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  statusShipment: {
    textTransform: "lowercase",
    textTransform: "capitalize",
    marginStart: 5,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "700",
  },
  summary: {
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  summaryText: {
    flexDirection: "row",
    marginVertical: 5,
  },
  total: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 10,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 6,
    borderWidth: 0.4,
    borderTopColor: theme.COLORS.TITLE,
    borderLeftColor: theme.COLORS.TITLE,
    borderBottomColor: theme.COLORS.TITLE,
    borderRadius: 5,
    backgroundColor: theme.COLORS.WHITE,

    borderRightWidth: 10,
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
  addText: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: "600",
    color: theme.COLORS.TITLE,
  },
  addTouch: {
    flex: 1,
    alignSelf: "flex-end",
    marginHorizontal: 3,
  },
  priceText: {
    textAlign: "left",
    fontWeight: "700",
    fontStyle: "italic",
    fontSize: 14,
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
  },
  priceView: {
    flex: 1,
    alignSelf: "flex-end",
  },
  nameText: {
    flexWrap: "wrap",
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
    fontSize: 15,
    flex: 10,
  },
});
