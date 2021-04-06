import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getData, postData, updateData, deleteData  } from "../../../backend/FetchData";
import Util from "../../../helpers/Util";
import * as Toast from "../../../components/Toast";
import theme from "../../theme";

//Screen
export default ({navigation}) => {
    const [searchText, setSearchText] = useState("");
    const [report, setReport] = useState([])

    let [orders, setOrders] = useState([]);
    let [categories, setCategories] = useState([]);
    let [products, setProducts] = useState([]);

    let [loading, setLoading] = useState(false);

    let data = [
        {cat_id: 1, cat: "Test1", total: "100,00"},
        {cat_id: 2, cat: "Test2", total: "130,00"},
        {cat_id: 3, cat: "Test3", total: "110,00"},
        {cat_id: 4, cat: "Test4", total: "110,00"},
    ]
     
    useLayoutEffect(() => {
        setReport(data)
        //fetchData()
        navigation.setOptions({
          title: 'Sales by Category',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    const SalesChart = () => {
        return (
            <View>
                <VictoryChart
                domainPadding={{ x: 12 }}
                width={410}
                >
                    <VictoryAxis style={{axisLabel: {padding: 30}}}/>
                    <VictoryAxis dependentAxis/>
                    <VictoryBar 
                    data={dataSalesChart} 
                    barRatio={1}
                    alignment="middle" 
                    style={{data: {fill: theme.COLORS.PRIMARY}}}
                    animate={{
                        duration: 500,
                        onLoad: { duration: 2000 }
                    }}
                    />
                </VictoryChart>
            </View>
        )
    }


    const onRefresh = () => {
        //fetchData();
    };

    // const searchByNameClassAndCat = (text) => {
    //     console.log(text)

    //     let filtered = products.filter((x) => {
    //         var result;
    //         if (x.name.toUpperCase().includes(text.toUpperCase())){
    //             result = x.name.toUpperCase().includes(text.toUpperCase())
    //         } 
    //         else if (searchCat(text).length > 0){
    //             //console.log(searchCat(text)[0]._id)
    //             //console.log("-------------------")
    //             if(x.category_id.includes(searchCat(text)[0]._id)){
    //                 result = x.category_id.includes(searchCat(text)[0]._id);
    //             }
    //         }
    //         else if (x.classification.toUpperCase().includes(text.toUpperCase())){
    //             result = x.classification.toUpperCase().includes(text.toUpperCase())
    //         }
    //         //console.log(searchCat(text))
    //         return result;
    //     })
        
    //     setProducts(filtered)
    //     if(text == ''){
    //         console.log('Empty')
    //         setProducts(clearProducts)
    //     }
    // }

    const renderItem = (item) => {       
        return (  
            <View style={styles.card}>
                <View style={[styles.cardContent,{flexDirection:'column', width: "85%"}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.cardTitles}>
                            {item.cat} {item.total}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    
    return (
        <View style = { styles.container }>
            <FlatList
                refreshControl={
                    <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    />
                }
                vertical
                showsVerticalScrollIndicator={false}
                data={report}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(x) => `${x.cat_id}`}
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