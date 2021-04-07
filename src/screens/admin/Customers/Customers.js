import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
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
    //const [modalVisibility, setModalVisibility] = useState(false)

    let [customers, setCustomers] = useState([]);
    let [clearCustomers, setClearCustomers] = useState([]);
    let [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState();


    useLayoutEffect(() => {

        fetchData()
        navigation.setOptions({
          title: 'Customers',
        })
    }, [navigation]);

    const fetchData = async () => {
        setLoading(true)
        fetch(
            "https://clothestore-wearesouth01-gmailcom.vercel.app/api/auth/user-info/",
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
        ).then((response) => {
            if (response) {
              response.json().then((data) => {
                //console.log(data);
                setCustomers(data); 
                setClearCustomers(data);
                setLoading(false)
              });
            }
        });
    }

    const search = (text) => {
        // console.log(text)
        // //Add Filter for Order Number and City
        // let filtered = orders.filter((x) => {
        //     var result;
        //     if (x.fullName.toUpperCase().includes(text.toUpperCase())){
        //         result = x.fullName.toUpperCase().includes(text.toUpperCase())
        //     } 
        //     else if (x.state.toUpperCase().includes(text.toUpperCase())){
        //         result = x.state.toUpperCase().includes(text.toUpperCase())
        //     }
        //     else if (x.address.toUpperCase().includes(text.toUpperCase())){
        //         result = x.address.toUpperCase().includes(text.toUpperCase())
        //     }
        //     //console.log(searchCat(text))
        //     return result;
        // })
        
        // setOrders(filtered)
        // if(text == ''){
        //     console.log('Empty')
        //     setOrders(clearOrders)
        // }
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

    const renderProduct = (item) => {       
        return (  
                <View style={[styles.card, {borderLeftWidth: 8, borderLeftColor: item.role === 'customer' ? theme.COLORS.SUCCESS : theme.COLORS.PRIMARY }]}>
                    <View style={[styles.cardContent,{flexDirection:'column', width: "85%"}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.email} 
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.address + ", " + item.city + ", " + item.state + ', ' + item.zip}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                Account since: 
                            </Text>
                            <Text style={[styles.cardText, {paddingLeft: 5}]}>
                                {Moment(item.createdAt).format('D MMM, YY')}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                Status: 
                            </Text>
                            <Text style={[styles.cardText, {paddingLeft: 5}]}>
                                {item.active ? "Active" : "Inactive"}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.cardContent,{position: "absolute", right: 10}]} onPress={() => navigation.navigate('Orders-users', {user_id: item._id})}>
                        <FontAwesome5 name={"list"} size={20} color={theme.COLORS.PRIMARY}/>
                    </TouchableOpacity>
                </View>
        )
    }
    return (
        <View style = { styles.container }>
            <SearchBar
                containerStyle={styles.searchContainer}
                inputContainerStyle={{ backgroundColor: "transparent" }}
                placeholder="Find Customers..."
                showCancel={true}
                searchIcon={{ size: 24 }}
                cancelIcon={{ size: 24 }}
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text)
                    search(text)
                }}
            />
            <View style={styles.info}>
                <View style={{marginRight: 5 ,height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.SUCCESS}}/>
                <Text>Customer</Text>
                <View style={{marginRight: 5 ,marginLeft: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.PRIMARY}}/>
                <Text>Administrator</Text>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    />
                }
                vertical
                showsVerticalScrollIndicator={false}
                data={customers}
                renderItem={({ item }) => renderProduct(item)}
                keyExtractor={(x) => `${x._id}`}
            
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
    info: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
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
        bottom: 20,
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