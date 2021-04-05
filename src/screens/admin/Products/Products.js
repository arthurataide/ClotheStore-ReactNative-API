import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import Util from "../../../helpers/Util";

import theme from "../../theme";

//Screen
export default ({navigation}) => {
    const [searchText, setSearchText] = useState("");

    let [products, setProducts] = useState([]);
    let [clearProducts, setClearProducts] = useState([]);
    let [loading, setLoading] = useState(false);

    let [categories, setCategories] = useState([]);

    useLayoutEffect(() => {
        //checkAuth();
        // setProducts(data)
        // setClearProducts(data)
        fetchData()
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
        setLoading(true)
        fetch(
            "https://clothestore-wearesouth01-gmailcom.vercel.app/api/products",
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
        ).then((response) => {
            if (response) {
              response.json().then((data) => {
                //console.log(data);
                setProducts(data); 
                setClearProducts(data);
                setLoading(false)
              });
            }
        });
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
                setCategories(data); 
                setLoading(false)
              });
            }
        });
    }

    const onRefresh = () => {
        fetchData();
    };

    const getCategory = (id) => {
        var name
        categories.map((x) => {
            if(x._id === id){
                name = x.name
            }
        })
        return name
    }

    const searchCat = (text) => {
        return categories.filter((x) => {
            return x.name.toUpperCase().includes(text.toUpperCase())
        })
    }

    const searchByNameClassAndCat = (text) => {
        console.log(text)

        let filtered = products.filter((x) => {
            var result;
            if (x.name.toUpperCase().includes(text.toUpperCase())){
                result = x.name.toUpperCase().includes(text.toUpperCase())
            } 
            else if (searchCat(text).length > 0){
                //console.log(searchCat(text)[0]._id)
                console.log("-------------------")
                if(x.category_id.includes(searchCat(text)[0]._id)){
                    result = x.category_id.includes(searchCat(text)[0]._id);
                }
            }
            else if (x.classification.toUpperCase().includes(text.toUpperCase())){
                result = x.classification.toUpperCase().includes(text.toUpperCase())
            }
            //console.log(searchCat(text))
            return result;
        })
        
        setProducts(filtered)
        if(text == ''){
            console.log('Empty')
            setProducts(clearProducts)
        }
    }

    const renderProduct = (item) => {       
        return (
            <Swipeout autoClose={true} backgroundColor={'transparent'} buttonWidth= {70} right={[{text: 'Delete', backgroundColor: 'red',onPress:() =>  console.log("delete")}]}>    
                <View style={[styles.card, {borderLeftWidth: 8, borderLeftColor: item.active ? theme.COLORS.PRIMARY : theme.COLORS.ERROR}]}>
                    <TouchableOpacity style={[styles.cardContent,{flexDirection:'column', width: "80%"}]} onPress={() => console.log("Change Status " + item.name)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.name}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.cardText}>
                                {item.classification} | {getCategory(item.category_id)}
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
            <SearchBar
                containerStyle={styles.searchContainer}
                inputContainerStyle={{ backgroundColor: "transparent" }}
                placeholder="Find Products..."
                showCancel={true}
                searchIcon={{ size: 24 }}
                cancelIcon={{ size: 24 }}
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text)
                    searchByNameClassAndCat(text)
                }}
            />
            <FlatList
                refreshControl={
                    <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    />
                }
                vertical
                showsVerticalScrollIndicator={false}
                data={products}
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
        borderTopColor: theme.COLORS.TITLE,
        borderRightColor: theme.COLORS.TITLE,
        borderBottomColor: theme.COLORS.TITLE,
        borderWidth: 1,
        borderRadius: 5,
    },
    cardContent: {
        paddingHorizontal: 15,
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
    searchContainer: {
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: theme.COLORS.PRIMARY,
    },
  });