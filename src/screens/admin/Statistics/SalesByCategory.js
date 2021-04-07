import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getData, postData, updateData, deleteData  } from "../../../backend/FetchData";
import Util from "../../../helpers/Util";
import theme from "../../theme";

//Screen
export default ({navigation}) => {
    const [report, setReport] = useState([])

    let [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        fetchData()
        navigation.setOptions({
          title: 'Sales',
        })
    }, [navigation]);

    const fetchData = () => {
        setLoading(true)
        getData('/statistics/sales/categories/').then((data) => {
            //console.log(tmp)
            if (data) {
                setReport(data)
                setLoading(false)
            }
        });
    } 

    const onRefresh = () => {
        setReport([])
        fetchData();
    };

    const renderItem = (item) => {       
        return (  
            <View style={styles.card}>
                <View style={styles.cardContent}>
                        <Text style={styles.left}>
                            {item.name} 
                        </Text>
                        <Text style={styles.right}>
                            {`C${Util.formatter.format(item.sales)}`}
                        </Text>
                </View>
            </View>
        )
    }
    return (
        <View style = { styles.container }>
            <View style={styles.info}>
                <Text style={[styles.left, {fontWeight: '500',}]}>Category</Text>
                <Text style={[styles.right, {fontWeight: '500',}]}>Total Sales ($)</Text>
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
                data={report}
                renderItem={({ item }) => renderItem(item)}
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
        backgroundColor: 'rgb(234,236,244)'
    },
    cardContent: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    left: {
        fontSize: 18,
    },
    right: {
        flex: 1,
        textAlign: "right",
        fontSize: 18,
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