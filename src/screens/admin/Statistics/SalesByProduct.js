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

    let [products, setProducts] = useState([]);
    let [clearProducts, setClearProducts] = useState([]);
    let [loading, setLoading] = useState(false);

    let [categories, setCategories] = useState([]);

    useLayoutEffect(() => {
        //fetchData()
        navigation.setOptions({
          title: 'Sales by Products',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    const fetchData = async () => {
        setLoading(true)
        getData('/products').then((data) => {
            if (data) {
                setProducts(data); 
                setClearProducts(data);
            }
        })
    
        getData('/categories').then((data) => {
            if (data) {
                setCategories(data); 
                setLoading(false)
            }
        })
    }


    const onRefresh = () => {
        fetchData();
    };

    const searchByNameClassAndCat = (text) => {
        console.log(text)

        let filtered = products.filter((x) => {
            var result;
            if (x.name.toUpperCase().includes(text.toUpperCase())){
                result = x.name.toUpperCase().includes(text.toUpperCase())
            } 
            else if (searchCat(text).length > 0){
                //console.log(searchCat(text)[0]._id)
                //console.log("-------------------")
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

    
    return (
        <View style = { styles.container }>
            <View style={styles.info}>
                <View style={{marginRight: 5 ,height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.PRIMARY}}/>
                <Text>Active</Text>
                <View style={{marginRight: 5 ,marginLeft: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.ERROR}}/>
                <Text>Inactive</Text>
            </View>
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