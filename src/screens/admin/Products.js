import React, {useState, useLayoutEffect, useEffect} from "react";
import { ActivityIndicator, ScrollView, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import theme from "../theme";


//Screen
export default ({navigation}) => {

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

  return (
    <View style = { styles.container }>
       <Text>Products</Text>
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
    cardsContainer: {
        marginVertical: 10,
        marginHorizontal: 5,
    },
    chartContainer: {
        marginVertical: 5,
        marginHorizontal: 5,
    },
    chartTitleContainer: {
        flex:1,
        alignItems: 'center',
        borderWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderColor: theme.COLORS.PRIMARY,
        backgroundColor: 'rgba(90,45,130, 0.1)'
    },
    chartTitle: {
        color:theme.COLORS.PRIMARY,
        padding: 5,
        fontSize:17
    },
    chartBody: {
        borderTopWidth:0,
        borderWidth: 1,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderColor: theme.COLORS.TITLE,
    },
    menu: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        height: 60,
        width: "49%",
        marginVertical: 5,
        borderColor: theme.COLORS.TITLE,
        borderWidth: 1,
        borderRadius: 5,
        borderLeftWidth: 5,
        
    },
    separator:{
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    },
    text: {
        fontSize: 16,
        paddingHorizontal: 10
    },
    count: {
        position: 'absolute',
        right: 5,
        fontSize: 20,
        color: theme.COLORS.PRIMARY,
        fontWeight: '700'
    },
  });