import React, {useState, useLayoutEffect, useEffect} from "react";
import { ActivityIndicator, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import CustomModal from "../../../components/CustomModal";
import theme from "../../theme";


//Screen
export default ({navigation}) => {
    let [categories, setCategories] = useState([]);
    let [modalVisibility, setModalVisibility] = useState(false);
    let [Cname, setCName] = useState('');
    useEffect(()=> {
        fetchData();
    }, [])

    useLayoutEffect(() => {
        //checkAuth();
        navigation.setOptions({
          title: 'Categories',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    const fetchData = () => {
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
                setCategories(data)
              });
            }
        });
    }
    const hideModal = () => {
        setModalVisibility(false);
    };

    const renderCategory = (item) => {       
        return (
            <Swipeout backgroundColor={'transparent'} buttonWidth= {70} right={[{text: 'Delete', backgroundColor: 'red',onPress:() =>  console.log("delete")}]}>    
                <View style={styles.card}>
                    <TouchableOpacity style={[styles.cardContent,{width: "80%", flexDirection: 'row',alignItems: "center",}]} onPress={() => console.log("Change Status " + item.name)}>
                        <View style={{marginRight:10, height: 10, width: 10, borderRadius: 10, backgroundColor: item.active ? theme.COLORS.PRIMARY : theme.COLORS.ERROR}}/>
                        <Text style={styles.cardText}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cardContent,{position: "absolute", right: 10}]} onPress={() => navigation.navigate('createupdate', {item: item})}>
                        <FontAwesome5 name={"edit"} size={15} color={theme.COLORS.PRIMARY}/>
                    </TouchableOpacity>
                </View>
            </Swipeout>
        )
    }

  return (
    <View style = { styles.container }>
        <CustomModal
            title={"Create"}
            visible={modalVisibility}
            onCancel={() => hideModal()}
            onSave={() => console.log("save")}
        >
            <TextInput
            autoFocus={true}
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => setCName(text)}
            />
        </CustomModal>
       <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => renderCategory(item)}
            keyExtractor={(x) => `${x._id}`}
            style={{marginTop: 5}}
        />
        <TouchableOpacity style={styles.create} onPress={() => setModalVisibility(true)}>
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
    input:{
        height: 40,
        width: Dimensions.get("screen").width - 10,
        margin: 12,
        paddingLeft: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    }
  });