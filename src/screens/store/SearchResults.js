import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import theme from "../theme";
import { getData } from "../../backend/FetchData";
import Util from "../../helpers/Util";

//Screen Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    backgroundColor: theme.COLORS.WHITE,
  },
  cardContainer: {
    marginHorizontal: 2.5,
    marginVertical: 3,
    borderWidth: 0.5,
    borderColor: theme.COLORS.TITLE,
  },
  image: {
    width: Dimensions.get("window").width / 2 - 6,
    height: 250,
  },

  textContainer: {
    backgroundColor: theme.COLORS.WHITE,
    paddingVertical: 6,
    paddingHorizontal: 3,
  },
  activity: {
    position: "absolute",
    top: Dimensions.get("window").height / 2,
    right: Dimensions.get("window").width / 2 - 20,
  },
  textResults: {
    fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default ({ route, navigation }) => {
  //let { loading, data: products } = fetchData("product/");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  loadProducts = () => {
    setLoading(true);

    getData('/products/').then((data) => {
      if (data) {
        setProducts(data);
        setLoading(false);
      }
    });
  }

  const {
    productClassification: classification,
    productCategoryId: categoryId,
    productCategoryName: categoryName,
    productName: productName,
  } = route.params;

  //Filters
  const filterByClassAndCat = (x) => {
    return x.classification == classification && x.category == categoryId;
  };

  const filterByProductName = (x) => {
    return x.name.toUpperCase().includes(productName.toUpperCase());
  };

  const filteredProducts = products.filter((x) =>
    productName ? filterByProductName(x) : filterByClassAndCat(x)
  );

  const renderCard = (item) => {
    return (
      <TouchableOpacity onPress = {() => navigation.navigate('item', {item: item})}>
        <View style={styles.cardContainer}>
          <Image style={styles.image} source={{ uri: item.pictures[0].url }} />
          <View style={styles.textContainer}>
            <Text
              style={{
                flexWrap: "wrap",
                fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                textAlign: "right",
                fontWeight: "500",
                fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
              }}
            >
              {`C${Util.formatter.format(item.price)}`}
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
            >{`${filteredProducts.length} RESULTS`}</Text>
          </View>

          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={filteredProducts}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(x) => `${x._id}`}
          />
        </>
      )}
    </View>
  );
};
