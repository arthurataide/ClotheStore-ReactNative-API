import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CustomModal from "../../../components/CustomModal";
import {Picker} from '@react-native-picker/picker';
import * as Toast from "../../../components/Toast";
import { getData, postData, updateData, deleteData  } from "../../../backend/FetchData";
import Moment from 'moment';

import theme from "../../theme";

//Screen
export default ({route, navigation}) => {
    const [searchText, setSearchText] = useState("");
    const [modalVisibility, setModalVisibility] = useState(false)

    let [orders, setOrders] = useState([]);
    let [clearOrders, setClearOrders] = useState([]);
    let [loading, setLoading] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedId, setSelectedId] = useState('');

    useLayoutEffect(() => {
        onRefresh()
        navigation.setOptions({
          title: route.params != undefined ? 'User Orders' : 'Orders',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    useEffect(() => {
        console.log("useEffect Reload")
        const reload = navigation.addListener('focus', () => {
          onRefresh()
          console.log("Focus")
        });
        return reload;
      }, [navigation, orders]);

    const fetchData = async (id) => {
        setLoading(true)

        if(id != undefined){
            console.log(id)
            getData('/orders').then((data) => {
                //console.log(tmp)
                if (data) {
                    var tmp = []
                    //console.log(data)
                    data.forEach((x) => {
                        if (x.user_id == id){
                            tmp.push(x)
                        }
                    });
                    //console.log(data)
                    setOrders(tmp); 
                    setClearOrders(tmp);
                    setLoading(false)
                }
            });
        } else {
            getData('/orders').then((data) => {
                if (data) {
                    //console.log(data)
                    setOrders(data); 
                    setClearOrders(data);
                    setLoading(false)
                }
            });
        }
        
    }

    const search = (text) => {
        console.log(text)
        //Add Filter for Order Number and City
        let filtered = orders.filter((x) => {
            var result;
            if (x.orderId.toUpperCase().includes(text.toUpperCase())){
                result = x.orderId.toUpperCase().includes(text.toUpperCase())
            } 
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

    const updateStatus = async () => {
        //console.log(active)
        const tmp = {
            status: selectedStatus
        }
        try {
             const response = await updateData('/orders/' + selectedId, tmp);

             if (response) {
                 //console.log("response ", response.status)
                 //Error
                 if (response.status >= 400) {
                     response.text().then((text) => Toast.showError(text));
                     return;
                 }
                 if (response.status === 204) {
                     //console.log(cName)
                     Toast.show("Status updated successfully!")
                     setModalVisibility(false)
                     fetchData()
                 }
               }
        } catch (error) {
             console.error(error);
        }       
    }

    const onRefresh = () => {
        if(route.params){
            let {user_id} = route.params
            console.log("Params - " + user_id)
            fetchData(user_id);
        } else {
            fetchData();
            console.log("No Params")
        }
        
    };

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
                <View style={[styles.card, {borderLeftWidth: 8, borderLeftColor: getBackground(item.status)}]}>
                    <TouchableOpacity style={[styles.cardContent,{flexDirection:'column', width: "85%"}]} onPress={() => navigation.navigate('Update', {order_id: item._id})}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardTitles}>
                                Order: 
                            </Text>
                            <Text style={[styles.cardText, {paddingLeft: 5}]}>
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
                    <TouchableOpacity style={[styles.cardContent,{position: "absolute", right: 10}]} onPress={() => {setModalVisibility(true), setSelectedStatus(item.status), setSelectedId(item._id)}} >
                        <FontAwesome5 name={"exchange-alt"} size={15} color={theme.COLORS.PRIMARY}/>
                    </TouchableOpacity>
                </View>
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
                onSave={() => updateStatus()}
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
            <View style={styles.info}>
                <View style={{marginRight: 5 ,height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.ERROR}}/>
                <Text>Pending</Text>
                <View style={{marginRight: 5 ,marginLeft: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.WARNING}}/>
                <Text>Ready to Ship</Text>
                <View style={{marginRight: 5 ,marginLeft: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.SUCCESS}}/>
                <Text>Shipped</Text>
                <View style={{marginRight: 5 ,marginLeft: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.PRIMARY}}/>
                <Text>Completed</Text>
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
                data={orders}
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