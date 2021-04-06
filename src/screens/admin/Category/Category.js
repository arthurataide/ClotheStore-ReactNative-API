import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, TextInput, View, StyleSheet, Keyboard, FlatList, Dimensions, Text, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CustomModal from "../../../components/CustomModal";
import theme from "../../theme";
import * as Toast from "../../../components/Toast";
import { getData, postData, updateData, deleteData  } from "../../../backend/FetchData";


//Screen
export default ({navigation}) => {
    const [searchText, setSearchText] = useState("");

    let [categories, setCategories] = useState([]);
    let [clearCategories, setClearCategories] = useState([]);
    let [loading, setLoading] = useState(false);
    
    let [modalCreateVisibility, setModalCreateVisibility] = useState(false);
    let [modalEditVisibility, setModalEditVisibility] = useState(false);
    
    const [cName, setCName] = useState('');
    const [cat_id, setCat_Id] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [imageurl, setImageUrl] = useState('')

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

    const fetchData = async () => {
        setImageUrl('')
        setBase64Image('')
        setCat_Id('')
        setLoading(true)
        getData('/categories').then((data) => {
            if (data) {
                //console.log(data)
                setCategories(data); 
                setClearCategories(data);
                setLoading(false)
            }
        });
    }

    const onRefresh = () => {
        fetchData();
      };

    const hideCreateModal = () => {
        setModalCreateVisibility(false);
    };
    const hideEditModal = () => {
        setModalEditVisibility(false);
    };

    const createCategory = async (url) => {
        const tmp = {
            name: cName,
            url: url,
            active: true
        }
        try {
            const response = await postData('/categories/', tmp);
            if (response) {
                //Error
                if (response.status >= 400) {
                    response.text().then((text) => Toast.showError(text));
                    return;
                }
                if (response.status === 200) {
                    console.log(cName)
                    hideCreateModal()
                    Toast.show("Category created successfully!")
                    fetchData()
                    setBase64Image('')
                }
              }
       } catch (error) {
            console.error(error);
       }
    }

    const saveCategory = async (type) => {
       if(cName != ''){
            if(base64Image != ''){
                //console.log(base64Image.type)
                try {
                    var tmpImage = {
                        folder: "categories",
                        base64string: base64Image,
                    }
                    const response = await postData('/storage/', tmpImage)

                    if (response) {
                        console.log(response.status)
                        //console.log('here')
                        //Error
                        if (response.status >= 400) {
                            response.text().then((text) => Toast.showError(text));
                            return;
                        }
                        if (response.status === 200) {
                            //console.log('here')
                            response.json().then((data) => {
                                //console.log(data)
                                if(type == "edit"){
                                    console.log("edit")
                                    updateCategory(data.url)
                                } else {
                                    createCategory(data.url)
                                }
                                
                            })
                            //console.log(response)
                        }
                    }
                } catch (error) {
                    console.error(error);
                }  

            } else {
                if(type == "edit"){
                    console.log("edit")
                    updateCategory(imageurl)
                } else {
                    createCategory("https://ui-avatars.com/api/?name=Clothe+Store&size=512")
                }
                
            }
       }
    } 

    const updateStatus = async (id, active) => {
        //console.log(active)
        const tmp = {
            active: active
        }
        try {
             const response = await updateData('/categories/' + id, tmp);

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
                     fetchData()
                 }
               }
        } catch (error) {
             console.error(error);
        }       
    }

    const updateCategory = async (url) => {
        console.log("Update " + cat_id)
            //console.log(cName)
            const tmp = {
                name: cName,
                url: url,
                active: true
            }
            try {
                 const response = await updateData('/categories/' + cat_id, tmp);

                 if (response) {
                     //console.log("response ", response.status)
                     //Error
                     if (response.status >= 400) {
                         response.text().then((text) => Toast.showError(text));
                         return;
                     }
                     if (response.status === 204) {
                         console.log(cName)
                         hideEditModal()
                         Toast.show("Category updated successfully!")
                         fetchData()
                     }
                   }
            } catch (error) {
                 console.error(error);
            }       
    } 

    const searchByCategory = (text) => {
        console.log(text)

        let filteredCat = categories.filter((x) => {
            return x.name.toUpperCase().includes(text.toUpperCase());
        })
        
        setCategories(filteredCat)
        if(text == ''){
            console.log('Empty')
            setCategories(clearCategories)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [16, 10],
          quality: 1,
          base64: true,
        });

        //console.log(result)

        if (!result.cancelled) {
            setImageUrl(result.uri)
            //console.log(result)
            setBase64Image("data:image/jpeg;base64," + result.base64)
        }   
    };

    const renderCategory = (item) => {       
        return (
            <View style={[styles.card, {borderLeftWidth: 8, borderLeftColor: item.active ? theme.COLORS.PRIMARY : theme.COLORS.ERROR}]}>
                <TouchableOpacity style={[styles.cardContent,{width: "80%", flexDirection: 'row',alignItems: "center",}]} onPress={() => {setModalEditVisibility(true), setImageUrl(item.url), setCName(item.name), setCat_Id(item._id)}}>
                     <Text style={styles.cardText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cardContent,{position: "absolute", right: 10}]} onPress={() => {updateStatus(item._id, !item.active)}}>
                    <FontAwesome5 name={"exchange-alt"} size={15} color={theme.COLORS.PRIMARY}/>
                </TouchableOpacity>
            </View>
        )
    }

  return (
    <View style = { styles.container }>
        <CustomModal
            title={"Create Category"}
            animation={true}
            visible={modalCreateVisibility}
            onCancel={() => {hideCreateModal(), setImageUrl('')}}
            onSave={() => saveCategory("create")}
        >
            <View style={styles.imageContainer}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
                    <Image style={styles.img} source={{ uri: imageurl === '' ? "https://ui-avatars.com/api/?name=Clothe+Store&size=512" : imageurl }}/>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={styles.pick} onPress={() => pickImage()}>
                    <FontAwesome5 name={"plus"} color= {"white"} size={25}/>
                </TouchableOpacity>
            </View>
            
            <TextInput
            autoFocus={true}
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => setCName(text)}
            value={cName}
            />
        </CustomModal>
        <CustomModal
            title={"Edit"}
            animation={true}
            visible={modalEditVisibility}
            onCancel={() => {hideEditModal(), setImageUrl('')}}
            onSave={() => saveCategory("edit")}
        >
            <View style={styles.imageContainer}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
                    <Image style={styles.img} source={{ uri: imageurl }}/>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={styles.pick} onPress={() => pickImage()}>
                    <FontAwesome5 name={"plus"} color= {"white"} size={25}/>
                </TouchableOpacity>
            </View>
            <TextInput
            autoFocus={true}
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => setCName(text)}
            value={cName}
            />
        </CustomModal>
        <SearchBar
            containerStyle={styles.searchContainer}
            inputContainerStyle={{ backgroundColor: "transparent" }}
            placeholder="Find Categories..."
            showCancel={true}
            searchIcon={{ size: 24 }}
            cancelIcon={{ size: 24 }}
            value={searchText}
            onChangeText={(text) => {
                setSearchText(text)
                searchByCategory(text)
            }}
        />
        <View style={styles.info}>
            <View style={{marginRight: 5 ,height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.PRIMARY}}/>
            <Text>Active</Text>
            <View style={{marginRight: 5 ,marginLeft: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: theme.COLORS.ERROR}}/>
            <Text>Inactive</Text>
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
            data={categories}
            renderItem={({ item }) => renderCategory(item)}
            keyExtractor={(x) => `${x._id}`}
        />
        <TouchableOpacity style={styles.create} onPress={() => {setModalCreateVisibility(true), setCName('')}}>
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
    imageContainer: {
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get("screen").width - 10,
    },
    pick: {
        position: 'absolute',
        height: 40,
        width: 40,
        bottom: 0,
        right: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.COLORS.PRIMARY,
    },
    img: {
        height: 200,
        width: 150
    },
    input:{
        height: 40,
        width: Dimensions.get("screen").width - 15,
        margin: 12,
        paddingLeft: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    },
    searchContainer: {
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: theme.COLORS.PRIMARY,
    },
  });