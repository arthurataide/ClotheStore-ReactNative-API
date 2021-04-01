import * as React from 'react';
import {StatusBar, Text, View, StyleSheet} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import HomeScreenAdmin from '../screens/admin/Main';
import CategoryScreen from '../screens/admin/Category/Category';
import ProductsScreen from '../screens/admin/Products/Products';
import OrdersScreen from '../screens/admin/Orders';
import CustomersScreen from '../screens/admin/Customers';

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

function HomeStack() {
  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
      <Stack.Navigator initialRouteName="Home" mode="modal">
        <Stack.Screen 
        name="Home" 
        component={HomeScreenAdmin} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function CategoryStack() {
  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
      <Stack.Navigator initialRouteName="Category" mode="modal">
        <Stack.Screen 
        name="Category" 
        component={CategoryScreen}  
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function ProductsStack() {
  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
      <Stack.Navigator initialRouteName="Products" mode="modal">
        <Stack.Screen 
        name="Products" 
        component={ProductsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function OrdersStack() {
  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
      <Stack.Navigator initialRouteName="Orders" mode="modal">
        <Stack.Screen 
        name="Orders" 
        component={OrdersScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function CustomersStack() {
  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
      <Stack.Navigator initialRouteName="Customers" mode="modal">
        <Stack.Screen 
        name="Customers" 
        component={CustomersScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
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
          <Text style={{color: 'rgba(255,255,255, 0.4)', fontWeight: "700", fontSize: 12}}>STATISTICS</Text>
        </View>
        <DrawerItem 
        label= "Sales by category" 
        icon={({color, size}) => <FontAwesome5 name={"chart-area"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Category')}/>
        <DrawerItem 
        label= "Sales by product" 
        icon={({color, size}) => <FontAwesome5 name={"chart-area"} color= {color} size={size}/>}
        activeTintColor={theme.COLORS.WHITE}
        inactiveTintColor={'rgba(255,255,255, 0.8)'}
        inactiveBackgroundColor
        activeBackgroundColor 
        onPress={() => navigation.navigate('Category')}/>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

function App() {

  return ( 
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
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
      </Drawer.Navigator>
    </NavigationContainer>
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