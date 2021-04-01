import React, {useState, useLayoutEffect, useEffect} from "react";
import { ActivityIndicator, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import CustomModal from "../../../components/CustomModal";

import theme from "../../theme";

//Screen
export default ({navigation}) => {
    let [products, setProducts] = useState([]);
    l
    let [cName, setCName] = useState('');

    useLayoutEffect(() => {
        //checkAuth();
        navigation.setOptions({
          title: 'Products',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    const fetchData = async () => {
        fetch(
            "https://clothestore-wearesouth01-gmailcom.vercel.app/api/categories",
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
        ).then((response) => {
            if (response) {
              response.json().then((data) => {
                //console.log(data);
                setProducts(data); 
              });
            }
        });
    }

    return (
        <View style = { styles.container }>
       <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={products}
            renderItem={({ item }) => renderProduct(item)}
            keyExtractor={(x) => `${x._id}`}
            style={{marginTop: 5}}
        />
        <TouchableOpacity style={styles.create} onPress={() => console.log("create")}>
            <FontAwesome5 name={"plus"} color= {"white"} size={25}/>
        </TouchableOpacity>
        </View>
    );
};

//Screen Style
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignContent:'center',
        backgroundColor: theme.COLORS.WHITE,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        marginHorizontal: 5,
        marginVertical: 5,
        borderColor: theme.COLORS.TITLE,
        borderWidth: 1,
        borderRadius: 5,
    },
    cardContent: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    cardText: {
        fontSize: 17,
        fontWeight: '500'
    },
    create: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: theme.COLORS.PRIMARY,
        bottom: 60,
        right: 20,
    },
    input:{
        height: 40,
        width: Dimensions.get("screen").width - 10,
        margin: 12,
        paddingLeft: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    }
  });