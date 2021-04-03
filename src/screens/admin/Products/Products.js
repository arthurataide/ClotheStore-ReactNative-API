import React, {useState, useLayoutEffect, useEffect} from "react";
import { ActivityIndicator, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import Util from "../../../helpers/Util";

import theme from "../../theme";

//Screen
export default ({navigation}) => {
    let [products, setProducts] = useState([]);
    
    const data = [
        {
            "active" : true,
            "category" : "Shorts",
            "classification" : "Men",
            "dateTime" : "2021-03-03 12:13:47",
            "description" : "Nike's first lifestyle Air Max brings you style, comfort and big Air in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's major innovation with its large window for a sleek look.",
            "_id" : "001",
            "name" : "Nike Air Max 270",
            "pictures" : [ {
              "name" : "4205496_a1.png",
              "storagePath" : "1614791518679.png",
              "url" : "https://firebasestorage.googleapis.com/v0/b/clothestore-484a8.appspot.com/o/pictures%2F1614791552302.png?alt=media&token=cd3eb025-f0ce-41e7-ad7c-9c679db7b71b"
            }, {
              "name" : "4205496_a2.png",
              "storagePath" : "1614791552302.png",
              "url" : "https://firebasestorage.googleapis.com/v0/b/clothestore-484a8.appspot.com/o/pictures%2F1614791552302.png?alt=media&token=cd3eb025-f0ce-41e7-ad7c-9c679db7b71b"
            }, {
              "name" : "4205496_a2.png",
              "storagePath" : "1614791669657.png",
              "url" : "https://firebasestorage.googleapis.com/v0/b/clothestore-484a8.appspot.com/o/pictures%2F1614791669657.png?alt=media&token=79d3655f-2eca-4c2c-b52f-870656004437"
            } ],
            "price" : 190,
            "size" : [ "S", "M", "L" ],
            "stock" : 80
        },
        {
            "active" : true,
            "category" : "Pants",
            "classification" : "Kids",
            "dateTime" : "2021-03-03 12:16:40",
            "description" : "With a sleek, streamline silhouette, our No Sweat Jogger in our ever popular proprietary No Sweat N2X™ fabric blend, let's you do all you do in a day with style, comfort, and ease. Thanks to triple stitching for added durability and the integration of TENCEL for moisture control, this commuter pant is sure to be your go to for every day of the week.",
            "_id" : "002",
            "name" : "NO SWEAT JOGGER",
            "pictures" : [ {
              "name" : "Mustard-Athletic-Jogger-Back_600x.jpg",
              "storagePath" : "1614791764536.jpg",
              "url" : "https://firebasestorage.googleapis.com/v0/b/clothestore-484a8.appspot.com/o/pictures%2F1614791764536.jpg?alt=media&token=91fef0b9-3683-434b-97f9-2f7d70428757"
            }, {
              "name" : "Black-Athletic-Jogger-Front_600x.jpg",
              "storagePath" : "1614791770640.jpg",
              "url" : "https://firebasestorage.googleapis.com/v0/b/clothestore-484a8.appspot.com/o/pictures%2F1614791770640.jpg?alt=media&token=26a91927-8ee9-46ad-8e54-c3d3c9643f33"
            }, {
              "name" : "Mustard-Athletic-Jogger-Side_600x.jpg",
              "storagePath" : "1614791783593.jpg",
              "url" : "https://firebasestorage.googleapis.com/v0/b/clothestore-484a8.appspot.com/o/pictures%2F1614791783593.jpg?alt=media&token=df52616e-d315-4061-86aa-62191497b555"
            } ],
            "price" : 110,
            "size" : [ "XS", "M", "L" ],
            "stock" : 15
        },
    ]

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

    const renderProduct = (item) => {       
        return (
            <Swipeout autoClose={true} backgroundColor={'transparent'} buttonWidth= {70} right={[{text: 'Delete', backgroundColor: 'red',onPress:() =>  console.log("delete")}]}>    
                <View style={styles.card}>
                    <View style={{marginHorizontal:10, height: 10, width: 10, borderRadius: 10, backgroundColor: item.active ? theme.COLORS.PRIMARY : theme.COLORS.ERROR}}/>
                    <TouchableOpacity style={[styles.cardContent,{flexDirection:'column', width: "80%"}]} onPress={() => console.log("Change Status " + item.name)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.name}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.classification} | {item.category}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {`C${Util.formatter.format(item.price)}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cardContent,{position: "absolute", right: 10}]} onPress={() => navigation.navigate('CreateUpdate', {item: item})}>
                        <FontAwesome5 name={"edit"} size={15} color={theme.COLORS.PRIMARY}/>
                    </TouchableOpacity>
                </View>
            </Swipeout>
        )
    }
    return (
        <View style = { styles.container }>
       <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => renderProduct(item)}
            keyExtractor={(x) => `${x._id}`}
            style={{marginTop: 5}}
        />
        <TouchableOpacity style={styles.create} onPress={() => navigation.navigate('CreateUpdate')}>
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
  });