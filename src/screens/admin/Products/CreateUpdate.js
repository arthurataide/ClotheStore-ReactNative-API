import React, {useCallback, useState, useLayoutEffect, useEffect, useRef} from "react";
import { ScrollView, TextInput, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text'
import Carousel, {
    ParallaxImage,
    Pagination,
} from "react-native-snap-carousel";
const { width: screenWidth } = Dimensions.get("window");
import * as ImagePicker from 'expo-image-picker';
import RadioButtonRN from 'radio-buttons-react-native';
import {Picker} from '@react-native-picker/picker';
import TabOptions from "../../../components/TabOptions";
import theme from "../../theme";
import * as Toast from "../../../components/Toast";
import { getData, postData, updateData, deleteData  } from "../../../backend/FetchData";
import { MailComposer } from "expo";

//Screen
export default ({route, navigation}) => {
    
    const ref = useRef(null);
    const [loading, setLoading] = useState(false);
    //const { item } = route.params;

    const [categories, setCategories] = useState([]);

    const [dataImages, setDataImages] = useState([]);
    const [readyDataImages, setReadyDataImages] = useState([]);
    const [activeSlide, setActiveSlide] = useState();

    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [classification, setClassification] = useState('');
    const [selectedClassification, setSelectedClassification] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState();
    const [sizesSelected, setSizesSelected] = useState([]);

    useEffect(() => {
        let newTabOptions = [];
        tabOptions.forEach((x) => {
          //onPress function
          x.onPress = checkOption;
          newTabOptions.push(x);
        });
    
        setTabOptions(newTabOptions);
      }, []);

    useLayoutEffect(() => {
        fetchCategories()
        fillDetails()
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

    const sizes = () => {
        let itemSizes = [
          { key: 0, name: "XS", checked: false, onPress: () => {}, disable: false },
          { key: 1, name: "S", checked: false, onPress: () => {}, disable: false },
          { key: 2, name: "M", checked: false, onPress: () => {}, disable: false },
          { key: 3, name: "L", checked: false, onPress: () => {}, disable: false },
          { key: 4, name: "XL", checked: false, onPress: () => {}, disable: false },
          { key: 5, name: "2XL", checked: false, onPress: () => {}, disable: false },
        ];
        
        return itemSizes;
      };

    //Options configuration
    const [tabOptions, setTabOptions] = useState(sizes());

    //Check option onPreess event
    const checkOption = (key) => {
        let newTabOptions = [];

        tabOptions.forEach((x) => {
        if (x.key == key) {
            if(x.checked){
                x.checked = false;
                setSizes(x.name, false);
            }else {
                x.checked = true;
                setSizes(x.name, true);
            }
        } 
        newTabOptions.push(x);
        });
        setTabOptions(newTabOptions);
    };

    const fillDetails = () => {
        if(route.params){
            //console.log('Params exists')
            let {item} = route.params

            setDataImages(item.pictures)
            setID(item.code)
            setName(item.name)
            setDescription(item.description)
            setPrice(item.price)
            setStock(item.stock)
            
            switch (item.classification) {
                case "Men":
                    setSelectedClassification(1)
                    break;
                case "Women":
                    setSelectedClassification(2)
                    break;
                case "Kids":
                    setSelectedClassification(3)
                    break;
                default:
                    break;
            }
            setSelectedCategory(item.category_id) 
            //setSizesSelected(item.size) 

            let newTabOptions = [];

            tabOptions.forEach((x) => {
                item.size.forEach((si) => {
                    //console.log("Option")
                    if(si == x.name){
                        //console.log(si + ' equal to ' + x.name)
                        x.checked = true;
                        setSizes(x.name, true)
                    }
                });
                newTabOptions.push(x);
            });
            setTabOptions(newTabOptions); 
            //console.log(sizesSelected)
             
        }
    }

    const fetchCategories = async () => {
        getData('/categories').then((data) => {
            if (data) {
                //console.log(data)
                setCategories(data); 
            }
        });
    }

    const createImageArray = (newItem) => {
        //console.log("Function")
        const image = dataImages;
        image.push(newItem)
        //console.log(image)
        return image
    }

    const postProduct = async (uploadedImages) => {
        // console.log("Starting to upload the product")
        // console.log(readyDataImages)
        const pictures = []
        uploadedImages.forEach(i => {
            if (i != undefined && i.status === 200){
                pictures.push({
                    name: i.data.id,
                    url: i.data.url,
                })
            }
        })

        console.log("pictures")
        console.log(pictures)
        const newProduct = {
            code: id,
            name: name,
            description: description,
            price: convertStringToNumber(price),
            stock: parseInt(stock),
            classification: classification,
            category_id: selectedCategory,
            size: sizesSelected,
            pictures: pictures,
            active: true
        }
        try {
            const response = await postData('/products/', newProduct);
            if (response) {
                //Error
                if (response.status >= 400) {
                    response.text().then((text) => Toast.showError(text));
                    return;
                }
                if (response.status === 200) {
                    Toast.show("Category created successfully!")
                    setReadyDataImages([])
                    setLoading(false)
                    navigation.goBack()
                }
              }
       } catch (error) {
            console.error(error);
       }
    }

    const setSizes = (name, check) => {
        const array = sizesSelected
        if(check){
            array.push(name)
            setSizesSelected(array)
            //console.log("Check: " + name)
        } else {
            let index = array.indexOf(name);
            //console.log(index)
            array.splice(index, 1);
            //console.log("Uncheck: " + name)
        }
        //console.log(array)
        setSizesSelected(array)
        //console.log(sizesSelected)
    }

    const saveProduct = async () => {
        setLoading(true)
        console.log('HERE')

        try {
            const promises = dataImages.map( image => uploadImage(image.base64string) )
            const resultUploadImage = await Promise.all(promises)
            
            console.log(resultUploadImage)
            await postProduct(resultUploadImage)
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }

    }

    const uploadImage = async (base64String) =>{
        try {
            var tmpImage = {
                folder: "products",
                base64string: base64String,
            }
            const response = await postData('/storage/', tmpImage)
            if (response) {
                if (response.status == 200){
                    const data = await response.json()

                    console.log("data")
                    console.log(data)

                    return {
                      status: response.status,
                      data,
                    }
                }else{
                    const text = await response.text()
                    return {
                        status: response.status,
                        data: text,
                      }
                }  
            }
        } catch (error) {
            //console.error("ERROR ", error)
        }
    }

    const convertStringToNumber = (string) => {
        var regex = /\d+/g;
        var matches = string.match(regex);  // creates array from matches

        //console.log(parseInt(matches[0]))
        let num = parseInt(matches[0] + matches[1])
        return parseFloat(num)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });
    
        //console.log(result);
        //Still have to fix the add image. 
        //console.log("Pictures Array - Before")
            //console.log(tmp)
        if (!result.cancelled) {
            let newImg = {
                url: result.uri,
                base64string: "data:image/jpeg;base64," + result.base64,
            }
            let newArray = createImageArray(newImg);
            //tmp.push()
            //console.log("Pictures Array")
            //console.log(newArray.length)
            setDataImages([]);
            setDataImages(newArray);
        }   
    };

    const deleteImg = (index) => {
        console.log("delete: " + index)
        const newArray = dataImages;
        if (index > -1) {
            newArray.splice(index, 1);
        }
        setActiveSlide(0);
        setDataImages([]);
        
        setDataImages(newArray);

        if(newArray.length == 0){
            setDataImages([])
        }
    }

    const renderItem = useCallback(
        ({ item, index }, parallaxProps) => (
          <View style={styles.card} key={index}>
            <ParallaxImage
              source={{ uri: item.url }}
              containerStyle={styles.imageContainer}
              style={styles.image}
              parallaxFactor={0.2}
              shouldComponentUpdate={true}
              {...parallaxProps}
            />
            <TouchableOpacity style={styles.trash} onPress={() => deleteImg(index)}>
                <FontAwesome5 name={"trash"} size={20} color={theme.COLORS.PRIMARY}/>
            </TouchableOpacity>
          </View>
        ),
        [dataImages]
    );

    return (
        <View style = { styles.container }>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.picContainer}>
                    <Carousel
                        ref={ref}
                        data={dataImages}
                        extraData={dataImages}
                        sliderWidth={screenWidth}
                        sliderHeight={screenWidth}
                        itemWidth={screenWidth - 60}
                        renderItem={renderItem}
                        hasParallaxImages={true}
                        enableMomentum={true}
                        decelerationRate={0.9}
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <TouchableOpacity style={styles.pickImg} onPress={pickImage}>
                        <FontAwesome5 name={"plus"} size={30} color={theme.COLORS.PRIMARY}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.detailsContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Product ID"
                        value={id}
                        onChangeText={(text) => setID(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Product Name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <View style={styles.textArea}>
                        <TextInput
                        style={styles.inputDescription}
                        underlineColorAndroid="transparent"
                        multiline = {true}
                        numberOfLines = {5}
                        placeholder="Description"
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        />
                    </View>
                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                        <TextInputMask
                            style={[styles.input, {width: '49%'}]}
                            type={'money'}
                            placeholder= "Price"
                            options={{
                                precision: 2,
                                separator: '.',
                                delimiter: ',',
                                unit: 'C$',
                                suffixUnit: ''
                            }}
                            value={price}
                            onChangeText={(text) => setPrice(text)}
                        />
                        <TextInputMask
                            style={[styles.input, {width: '49%'}]}
                            type={'only-numbers'}
                            placeholder= "Stock"
                            value={stock}
                            onChangeText={(text) => setStock(text)}
                        />
                    </View>
                    <RadioButtonRN
                        data={[{label: "Men"},{label:"Women"}, {label: "Kids"}]}
                        style={{marginBottom: 10, }}
                        textColor={theme.COLORS.PRIMARY}
                        boxActiveBgColor={"white"}
                        box={true}
                        initial={selectedClassification}
                        activeColor={theme.COLORS.PRIMARY}
                        deactiveColor={theme.COLORS.PRIMARY}
                        selectedBtn={(e) => setClassification(e.label)}
                    />
                    <Text>Category</Text>
                    <View style={styles.separator}/>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedCategory(itemValue)
                        }
                        dropdownIconColor={theme.COLORS.PRIMARY}
                        >
                            <Picker.Item label="Select the category" value="0" />
                        {
                            categories.map((x) => {
                                return (
                                    <Picker.Item key={x._id} label={x.name} value={x._id} />
                                )
                            })
                        }
                    </Picker>
                    <View style={{marginTop: 5, marginBottom: 30}}>
                        <Text>Size</Text>
                        <View style={[{marginBottom: 20},styles.separator]}/>
                        <TabOptions
                            options={tabOptions}
                            highlightColor={theme.COLORS.PRIMARY}
                            titleColor={theme.COLORS.TITLE}
                        />
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity activeOpacity={0.8} style={styles.saveButton} onPress={() => saveProduct()}>
                {loading 
                ?
                <ActivityIndicator
                    size="large"
                    color={theme.COLORS.WHITE}
                />
                    :
                    <Text style={{color: "white", fontSize: 20, alignItems: "center", alignContent: "center"}} >Save</Text>
                }  
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
    picContainer: {
        height: 400,
    },
    card: {
        width: screenWidth - 60,
        height: 400,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: theme.COLORS.WHITE,
        borderRadius: 8,
    },
    scrollContainer: {
        flex:1,
        marginBottom: 60,
    },
    detailsContainer: {
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    input:{
        height: 40,
        marginVertical: 5,
        paddingLeft: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    },
    textArea: {
        marginVertical: 5,
        paddingLeft: 10,
        paddingTop: 5,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    },
    inputDescription: {
        height: 140,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
    },
    picker: {
        color: theme.COLORS.TITLE
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
    pickImg: {
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems:"center"
    },
    trash: {
        position: "absolute",
        top: 10,
        right: 10,
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems:"center"
    },
   
    separator:{
        marginVertical: 5,
        borderBottomWidth: 1,
        borderColor: theme.COLORS.PRIMARY,
    },
  });