import React, {useState} from 'react'
//import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import HomeIconWithBadge from './src/components/IconWithBadge'
import { Ionicons } from '@expo/vector-icons'


//Navigation
import { createAppContainer, NavigationEvents } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

//Screens
import HomeStackScreen from "./src/navigation/HomeStackNavigator";
import SearchStackScreen from "./src/navigation/SearchStackNavigator";
import FavoriteStackScreen from "./src/navigation/FavoriteStackNavigator";
import CartStackScreen from "./src/navigation/CartStackNavigator";
//Admin
import AdminNavigator from './src/navigation/AdminNavigator'

//Theme
import theme from './src/screens/theme'

//Navigation settings
// const appNavigator = createBottomTabNavigator(
//   {
//     Home: {
//       screen: HomeStackScreen,
//       navigationOptions:{
//         tabBarLabel: () => {return null},
//       }
//     },
//     Search: {
//       screen: SearchStackScreen,
//       navigationOptions:{
//         tabBarLabel: () => {return null},
//       }
//     },
//     Favorites: {
//       screen: FavoriteStackScreen,
//       navigationOptions:{
//         tabBarLabel: () => {return null},
//       }
//     },
//     Cart: {
//       screen: CartStackScreen,
//       navigationOptions:{
//         tabBarLabel: () => {return null},
//       }
//     },
//   },
//   { initialRouteName: 'Home', 
//     defaultNavigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused, tintColor }) => {
//         const { routeName } = navigation.state;
//         let IconComponent = Ionicons;
//         let iconName;
//         let count = 0
//         if (routeName === 'Home') {
//           iconName = focused
//             ? 'home'
//             : 'home-outline';
//         } else if (routeName === 'Search') {
//           iconName = focused ? 'search' : 'search-outline';
//         }
//         else if (routeName === 'Favorites') {
//           iconName = focused ? 'heart' : 'heart-outline';
//         }
//         else if (routeName === 'Cart') {
//           iconName = focused ? 'cart' : 'cart-outline';
//           IconComponent = HomeIconWithBadge;
//         }
//         // You can return any component that you like here!
//         //return <IconComponent name={iconName} size={25} color={tintColor} badgeCount={({ route }) => ({ title: route.params.value })} />;
//         return <IconComponent name={iconName} size={25} color={tintColor} badgeCount={0} />;
//       },
//     }),
//     tabBarOptions: {
//       activeTintColor: theme.COLORS.PRIMARY,
//       inactiveTintColor: 'gray',
//     },
//   }
// );

// let AppNavigator = createAppContainer(appNavigator)


export default function App() {
  return (
    <>
      <AdminNavigator/>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

