import React, {useCallback, useState, useLayoutEffect, useEffect, useRef, useMemo} from "react";
import { Image, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text'
import Util from "../../../helpers/Util";
import theme from "../../theme";
import { getData, updateData } from "../../../backend/FetchData";
import * as Toast from '../../../components/Toast'

//Screen
export default ({route, navigation}) => {
    
    const { order_id } = route.params;
    const [order, setOrder] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [items, setItems] = useState([])
    const [orderItems, setOrderItems] = useState([]);


    const loadItems = async () =>{
        try {
            let newItems = []
            const products = await getData('/products/')
    
            items.forEach(i =>{
                const product = products.filter(p => p._id === i.product_id)[0]
                if (product){
                    const newItem =  {...i, 
                            url: product.pictures.length > 0 
                            ?  product.pictures[0].url 
                            : "https://ui-avatars.com/api/?name=Clothe+Store&size=512"}
                    newItems.push(newItem)
                }
            })
            
            console.log(newItems)
            return newItems
        } catch (error) {
            console.error(error)
        }
      }

    useEffect(() => {
        getOrder()
    }, [])

    useEffect(() => {
        loadItems().then(data => setOrderItems(data))
    }, [items])

    useLayoutEffect(() => {
        //fillDetails()
        //checkAuth();
        navigation.setOptions({
          title: order.orderId ,
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation, order]);

    const getOrder = () => {
        getData('/orders/' + order_id).then((data) => {
            if (data) {
                setOrder(data)
                setItems(data.items)
                setAddress(data.address)
                setCity(data.city)
                setState(data.state)
                setZip(data.zip)
            }
        });
    }

    const _getHeader = useMemo(() => (

            <>
                <View style={styles.titleView}>
                    <Text style={styles.title}>Address Information</Text>
                </View>
                <View style={styles.infoContainer}>
                    <TextInput
                    style={styles.inputDisabled}
                    placeholder="Full Name"
                    value={order.fullName}
                    editable={false}
                    />  
                    <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    />  
                    <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    onChangeText={(text) => setCity(text)}
                    />  
                    <TextInput
                    style={styles.input}
                    placeholder="Province"
                    value={state}
                    onChangeText={(text) => setState(text)}
                    />  
                    <TextInput
                    style={styles.input}
                    placeholder="Zip"
                    value={zip}
                    onChangeText={(text) => setZip(text)}
                    />  
                </View>
                <View style={styles.titleView}>
                    <Text style={styles.title}>Products</Text>
                </View>
            </>
        
    ))

    const renderCard = (item, status) => {
        var color = ''
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
        return (
            <View style={[styles.cardContainer, {borderRightColor: color}]}>
                <Image style={styles.image} source={{ uri: item.url }} />
                <View style={styles.textContainer}>
                    {/* First line  */}
                    <Text style={{fontWeight: '700', marginTop: 10}}>{item.name}</Text>
                    <Text>{item.size}  {item.quantity} Items</Text> 
                    <Text>{item.code}</Text>
                    <Text style={styles.priceText}>{`C${Util.formatter.format(item.price)}`}</Text>
                </View>
            </View>
       )
    }

    const getItems = () => {
        var allItems = [];
        
        items.forEach(i => {
            var tmp = <View key={i._id} style={styles.summaryText}>
                <Text style={styles.textConnerLeft}>{i.quantity}X {i.name}</Text>
                <Text style={styles.textConnerRight}>{`C${Util.formatter.format(i.subTotal)}`}</Text>
            </View>
            allItems.push(tmp)
        })
        return allItems 
    }

    const getFooter = () => {
        return (
            <View>
                <View style={styles.summary}>   
                    <Text style={[styles.title, {marginVertical: 5}]}>ORDER SUMMARY</Text>
                    {getItems()}
                    <View style={styles.summaryText}>
                        <Text style={styles.textConnerLeft}>Shipping</Text>
                        <Text style={styles.textConnerRight}>{`C${Util.formatter.format(order.shippingFee)}`}</Text>
                    </View>
                    <View style={styles.summaryText}>
                        <Text style={styles.textConnerLeft}>Tax</Text>
                        <Text style={styles.textConnerRight}>{`C${Util.formatter.format(order.tax)}`}</Text>
                    </View>
                </View>
                <View style={styles.separator}/>
                <View style={styles.total}>
                    <Text style={[styles.textConnerLeft, {color: 'black', fontWeight: '700'}]}>TOTAL</Text>
                    <Text style={[styles.textConnerRight, {fontWeight: '700'}]}>{`C${Util.formatter.format(order.total)}`}</Text>
                </View>
            </View>
        )
    }

    const updateOrder = async () =>{
        if(address.trim() === '' ||  city.trim() === '' || state.trim() === '' || zip.trim() === ''){
            Toast.showError(`Fields can not be empty`)
            return
        }

        const newOrder = {...order, address, city, state, zip}
        const response = updateData('/orders/' + order._id, newOrder)

        console.log((await response).status)

        if ((await response).status >= 200 && (await response).status <= 300){
            Toast.show(`Order #${ order.orderId } was updated successfully!`)
            navigation.goBack();
        }else{
            Toast.showError(`Order #${ order.orderId } could not be updated!`)
        }
    }

    return (
        <View style = { styles.container }>
            <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={orderItems}
            renderItem={({ item }) => renderCard(item, order.status)}
            keyExtractor={(x) => x._id}
            ListHeaderComponent={_getHeader}
            ListFooterComponent={getFooter}
            />     
                
            <TouchableOpacity activeOpacity={0.8} style={styles.saveButton} onPress={()=>updateOrder()} >
                <Text style={{color: "white", fontSize: 20, alignItems: "center", alignContent: "center"}} >Save</Text>
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
    infoContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5
    }, 
    titleView: {
        padding: 5,
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.COLORS.PRIMARY,
    },
    title: {
        textTransform: 'uppercase',
        fontSize: 15,
        fontWeight: '700'
    },
    inputDisabled: {
        height: 40,
        marginVertical: 5,
        paddingLeft: 10,
        borderRadius: 3,
        borderBottomWidth: 1,
        borderColor: theme.COLORS.TITLE,
        backgroundColor: "rgb(234,236,244)"
    },
    input:{
        height: 40,
        marginVertical: 5,
        paddingLeft: 10,
        borderRadius: 3,
        borderBottomWidth: 1,
        borderColor: theme.COLORS.TITLE,
    },
    textConnerLeft: {
        color: theme.COLORS.TITLE
    },
    textConnerRight: {
        flex:1,
        textAlign: 'right',
    },
    summary: {
        paddingTop: 30,
        paddingBottom: 15,
        paddingHorizontal: 10,
    },
    summaryText: {
        flexDirection: 'row', 
        marginVertical: 5,
    },
    total: {
        flexDirection: 'row', 
        paddingTop: 15,
        paddingBottom: 25,
        paddingHorizontal: 10,
        marginBottom: 50
    },  
    saveButton: {
        position: "absolute",
        bottom: 0,
        height: 60,
        width: "100%",
        backgroundColor: theme.COLORS.PRIMARY,
        justifyContent: "center",
        alignItems: "center"
    },
   
    separator:{
        marginVertical: 5,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
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
        backgroundColor:theme.COLORS.WHITE,
        
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
    priceText: {
        textAlign: "left",
        fontWeight: "700",
        fontStyle: "italic",
        fontSize: 14,
        fontFamily: theme.FONT.DEFAULT_FONT_FAMILY,
      },
      priceView: {
        flex: 1,
        alignSelf: 'flex-end'
      },
  });