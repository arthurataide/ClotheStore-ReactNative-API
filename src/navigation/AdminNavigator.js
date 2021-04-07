import * as React from 'react';
import {StatusBar, Text, View, StyleSheet} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import HomeScreenAdmin from '../screens/admin/Main';
import CategoryScreen from '../screens/admin/Category/Category';
import ProductsScreen from '../screens/admin/Products/Products';
import CreateUpdateProductScreen from '../screens/admin/Products/CreateUpdate';
import OrdersScreen from '../screens/admin/Orders/Orders';
import UpdateOrderScreen from '../screens/admin/Orders/Update'
import CustomersScreen from '../screens/admin/Customers/Customers';
import SalesCategoryScreen from '../screens/admin/Statistics/SalesByCategory'; 
import SalesProductsScreen from '../screens/admin/Statistics/SalesByProduct'; 
import { deleteAuthInfo } from "../backend/AuthStorage";

import theme from '../screens/theme';

const MyTheme = {
  dark: false,
  colors: {
      primary: theme.COLORS.WHITE,
      card: theme.COLORS.PRIMARY,
      text: theme.COLORS.WHITE,
  },
};
const Stack = createStackNavigator();

const backButton = (navigation) => (props)=>(
  <HeaderBackButton
    {...props}
    label="Sign Out"
    onPress={()=>{
      deleteAuthInfo().then(()=>navigation.popToTop())
    }}
  />
  )

function HomeStack({ navigation }) {
  return (
      <Stack.Navigator  initialRouteName="Home" mode="modal">
        <Stack.Screen 
        name="Home" 
        component={HomeScreenAdmin} 
        options={{ headerLeft: backButton(navigation)}}
        />
      </Stack.Navigator>
  )
}

function CategoryStack({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Category" mode="modal">
        <Stack.Screen 
        name="Category" 
        component={CategoryScreen}  
        options={{ headerLeft: backButton(navigation) }}
        />
      </Stack.Navigator>
  )
}

function ProductsStack({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Products" mode="modal">
        <Stack.Screen 
        name="Products" 
        component={ProductsScreen} 
        options={{ headerLeft: backButton(navigation) }}
        />
        <Stack.Screen 
        name="CreateUpdate" 
        component={CreateUpdateProductScreen} 
        />
      </Stack.Navigator>
  )
}

function OrdersStack({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Orders" mode="modal">
        <Stack.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ headerLeft: backButton(navigation) }}
        />
        <Stack.Screen 
        name="Update" 
        component={UpdateOrderScreen} 
        />
      </Stack.Navigator>

  )
}

function SalesCategoryStack({ navigation }) {
  return (
      <Stack.Navigator  initialRouteName="SalesCat" mode="modal">
        <Stack.Screen 
        name="SalesCat" 
        component={SalesCategoryScreen} 
        options={{ headerLeft: backButton(navigation) }}
        />
      </Stack.Navigator>
  )
}


function SalesProductsStack({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="SalesProd" mode="modal">
        <Stack.Screen 
        name="SalesProd" 
        component={SalesProductsScreen} 
        options={{ headerLeft: backButton(navigation) }}
        />
      </Stack.Navigator>
  )
}


function CustomersStack({ navigation }) {
  return (
      <Stack.Navigator  initialRouteName="Customers" mode="modal">
        <Stack.Screen 
        name="Customers" 
        component={CustomersScreen} 
        options={{ headerLeft: backButton(navigation) }}
        />
        <Stack.Screen 
        name="Orders-users" 
        component={OrdersScreen} 
        />
      </Stack.Navigator>
  )
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ progress, state, color, navigation, ...props }) {

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <View style={{flex: 1, flexDirection:'row', padding: 20}}>
          <FontAwesome5 name={"toolbox"} color= {'white'} size={25}/>
          <Text style={{color: "white", fontWeight: "700", fontSize: 25, marginLeft: 10}}>CS Admin</Text>
        </View>
        <View style={styles.separator}/>

        <DrawerItem 
        label= "Dashboard"
        icon={({color, size}) => <FontAwesome5 name={"tachometer-alt"} color= {color} size={size}/>}
        focused
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Home')}/>
        <View style={styles.separator}/>
        <View style={{flex: 1, flexDirection:'row', padding: 10}}>
          <Text style={{color: 'rgba(255,255,255, 0.4)', fontWeight: "700", fontSize: 12}}>REGISTER</Text>
        </View>
        <DrawerItem 
        label= "Categories" 
        icon={({color, size}) => <FontAwesome5 name={"layer-group"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Category')}/>
        <DrawerItem 
        label= "Products" 
        icon={({color, size}) => <FontAwesome5 name={"product-hunt"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Products')}/>
        <View style={styles.separator}/>
        <View style={{flex: 1, flexDirection:'row', padding: 10}}>
          <Text style={{color: 'rgba(255,255,255, 0.4)', fontWeight: "700", fontSize: 12}}>MANAGEMENT</Text>
        </View>
        <DrawerItem 
        label= "Orders" 
        icon={({color, size}) => <FontAwesome5 name={"list"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Orders')}/>
        <DrawerItem 
        label= "Customers" 
        icon={({color, size}) => <FontAwesome5 name={"user-alt"} color= {color} size={size }/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Customers')}/>
        <View style={styles.separator}/>
        <View style={{flex: 1, flexDirection:'row', padding: 10}}>
          <Text style={{color: 'rgba(255,255,255, 0.4)', fontWeight: "700", fontSize: 12}}>STATISTICS FOR SALES</Text>
        </View>
        <DrawerItem 
        label= "Category" 
        icon={({color, size}) => <FontAwesome5 name={"chart-area"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('SalesCategory')}/>
        <DrawerItem 
        label= "Product" 
        icon={({color, size}) => <FontAwesome5 name={"chart-area"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('SalesProducts')}/>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

function App({navigation}) {

  //navigation.setOptions({ headerShown: false })

  return ( 
    // <NavigationContainer theme={MyTheme}>
    //   <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}
      minSwipeDistance={20} 
      edgeWidth={120} 
      drawerType="back" 
      backBehavior="initialRoute" 
      initialRouteName="Home" 
      mode="modal"
      drawerStyle={{
        backgroundColor: theme.COLORS.PRIMARY,
        width: 220,
      }}
      >
        <Drawer.Screen 
        
        name="Home" 
        component={HomeStack} 
        />
        <Drawer.Screen 
        name="Category" 
        component={CategoryStack} 
        />
        <Drawer.Screen 
        name="Products" 
        component={ProductsStack} 
        />
        <Drawer.Screen 
        name="Orders" 
        component={OrdersStack} 
        />
        <Drawer.Screen 
        name="Customers" 
        component={CustomersStack} 
        />
        <Drawer.Screen 
        name="SalesCategory" 
        component={SalesCategoryStack}
        options={{ headerLeft: backButton(navigation) }}
        /> 
        <Drawer.Screen 
        name="SalesProducts" 
        component={SalesProductsStack}
        options={{ headerLeft: backButton(navigation) }}
        /> 
      </Drawer.Navigator>
    //  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  separator:{
      marginHorizontal:10,
      borderBottomWidth: 1,
      borderColor: 'rgba(255,255,255, 0.4)',
  },
});

export default App;