import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import CustomModal from "../../../components/CustomModal";
import {Picker} from '@react-native-picker/picker';
import Moment from 'moment';

import theme from "../../theme";

//Screen
export default ({navigation}) => {
    const [searchText, setSearchText] = useState("");
    const [modalVisibility, setModalVisibility] = useState(false)

    let [orders, setOrders] = useState([]);
    let [clearOrders, setClearOrders] = useState([]);
    let [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState();


    useLayoutEffect(() => {

        fetchData()
        navigation.setOptions({
          title: 'Orders',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    const fetchData = async () => {
        setLoading(true)
        fetch(
            "https://clothestore-wearesouth01-gmailcom.vercel.app/api/orders",
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
        ).then((response) => {
            if (response) {
              response.json().then((data) => {
                //console.log(data);
                setOrders(data); 
                setClearOrders(data);
                setLoading(false)
              });
            }
        });
    }

    const search = (text) => {
        console.log(text)
        //Add Filter for Order Number and City
        let filtered = orders.filter((x) => {
            var result;
            if (x.fullName.toUpperCase().includes(text.toUpperCase())){
                result = x.fullName.toUpperCase().includes(text.toUpperCase())
            } 
            else if (x.state.toUpperCase().includes(text.toUpperCase())){
                result = x.state.toUpperCase().includes(text.toUpperCase())
            }
            else if (x.address.toUpperCase().includes(text.toUpperCase())){
                result = x.address.toUpperCase().includes(text.toUpperCase())
            }
            //console.log(searchCat(text))
            return result;
        })
        
        setOrders(filtered)
        if(text == ''){
            console.log('Empty')
            setOrders(clearOrders)
        }
    }

    const onRefresh = () => {
        fetchData();
    };

    // const getProducts = (items) => {
    //     console.log(items[0].product_id)
    //     var tst = "606926c9f774560009eda7c0"
    //     console.log(products.length)
    //     let result = products.filter((x) => {
    //         console.log(x._id)
    //         return x._id.includes(tst)
    //     })
    //     console.log(result[0].pictures)
    // }

    const getBackground = (status) => {
        var color;
        switch (status) {
            case "COMPLETED":
                color = theme.COLORS.PRIMARY
                break;
            case "PENDING":
                color = theme.COLORS.ERROR
                break;
            case "READY":
                color = theme.COLORS.WARNING
                break;
            case "SHIPPED":
                color = theme.COLORS.SUCCESS
                break; 
            default:
                break;
        }
        return color;
    }

    const renderProduct = (item) => {       
        return (
            <Swipeout autoClose={true} backgroundColor={'transparent'} buttonWidth= {70} right={[{text: 'Delete', backgroundColor: 'red',onPress:() =>  console.log("delete")}]}>    
                <View style={[styles.card, {borderLeftWidth: 8, borderLeftColor: getBackground(item.status)}]}>
                    <TouchableOpacity style={[styles.cardContent,{flexDirection:'column', width: "85%"}]} onPress={() => {setModalVisibility(true), setSelectedStatus(item.status)}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                Order: 
                            </Text>
                            <Text style={styles.cardText}>
                                {item.orderId}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.fullName} 
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.address + ", " + item.city + ", " + item.state + ', ' + item.zip}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                Items: 
                            </Text>
                            <Text style={[styles.cardText, {paddingLeft: 5}]}>
                                {item.items.length}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                Ordered on: 
                            </Text>
                            <Text style={[styles.cardText, {paddingLeft: 5}]}>
                                {Moment(item.createdAt).format('D MMM, YY')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cardContent,{position: "absolute", right: 10}]} onPress={() => navigation.navigate('Update', {order_id: item._id})}>
                        <FontAwesome5 name={"edit"} size={15} color={theme.COLORS.PRIMARY}/>
                    </TouchableOpacity>
                </View>
            </Swipeout>
        )
    }
    return (
        <View style = { styles.container }>
            <SearchBar
                containerStyle={styles.searchContainer}
                inputContainerStyle={{ backgroundColor: "transparent" }}
                placeholder="Find Orders..."
                showCancel={true}
                searchIcon={{ size: 24 }}
                cancelIcon={{ size: 24 }}
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text)
                    search(text)
                }}
            />
            <CustomModal
                title={"Change Status"}
                animation={true}
                visible={modalVisibility}
                onCancel={() => setModalVisibility(false)}
                onSave={() => console.log("Status Changed")}
            >
                <Picker
                    selectedValue={selectedStatus}
                    onValueChange={(itemValue, itemIndex) =>
                    setSelectedStatus(itemValue)
                    }
                    style={styles.picker}
                    dropdownIconColor={theme.COLORS.PRIMARY}
                >
                    <Picker.Item label="Pending" value="PENDING" />
                    <Picker.Item label="Ready for Shipment" value="READY" />
                    <Picker.Item label="Shipped" value="SHIPPED" />
                    <Picker.Item label="Completed" value="COMPLETED" />
                </Picker>
            </CustomModal>
            <FlatList
                refreshControl={
                    <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    />
                }
                vertical
                showsVerticalScrollIndicator={false}
                data={orders}
                renderItem={({ item }) => renderProduct(item)}
                keyExtractor={(x) => `${x._id}`}
                style={{marginTop: 5}}
            />
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
        borderTopColor: theme.COLORS.TITLE,
        borderRightColor: theme.COLORS.TITLE,
        borderBottomColor: theme.COLORS.TITLE,
        borderWidth: 1,
        borderRadius: 5,
    },
    cardContent: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    cardTitles: {
        fontSize: 16,
        fontWeight: '700'
    },
    cardText: {
        fontSize: 15,
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
    searchContainer: {
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: theme.COLORS.PRIMARY,
    },
    picker: {
        color: theme.COLORS.TITLE,
        width: Dimensions.get("screen").width - 10,
        
    },
  });