import React, {useState, useLayoutEffect, useEffect} from "react";
import { RefreshControl, StatusBar, ScrollView, View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {VictoryChart, VictoryBar, VictoryLegend, VictoryAxis, VictoryPie} from 'victory-native';
import theme from "../theme";
import { getData  } from "../../backend/FetchData";


//Screen
export default ({navigation}) => {
    let [categoryCount, setCategoryCount] = useState(0)
    let [productCount, setProductCount] = useState(0)
    let [orderCount, setOrderCount] = useState(0)
    let [pendingOrderCount, setPedingOrderCount] = useState(0)

    let [loading, setLoading] = useState(false);

    let [dataSalesChart, setDataSalesChart] = useState();
    let [dataOrdersChart, setDataOrdersChart] = useState();


    useLayoutEffect(() => {
        //checkAuth();
        onRefresh()
        
        navigation.setOptions({
          title: 'Dashboard',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('')}>
                  <Ionicons name = { 'person' } size = { 25 } color={theme.COLORS.WHITE} style={{marginRight: 10}}/>  
              </TouchableOpacity>
          ),
        })
    }, [navigation]);

    useEffect(() => {
        console.log("useEffect Reload")
        const reload = navigation.addListener('focus', () => {
          onRefresh()
          console.log("Focus")
        });
        return reload;
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
                    events={[{
                        target: "data",
                        eventHandlers: {
                          onClick: () => {
                            return [
                              {
                                target: "data",
                                mutation: (props) => {
                                  const fill = props.style && props.style.fill;
                                  return fill === "black" ? null : { style: { fill: "black" } };
                                }
                              }
                            ];
                          }
                        }
                      }]}
                    />
                </VictoryChart>
            </View>
        )
    }
    const OrdersChart = () => {
        return (
            <View>
                <VictoryPie
                    animate={{ easing: 'exp' }}
                    data={dataOrdersChart} 
                    colorScale={[theme.COLORS.ERROR, theme.COLORS.WARNING, theme.COLORS.PRIMARY, theme.COLORS.SUCCESS ]}
                    labels={({ datum }) => ""}
                    padAngle={0}
                    innerRadius={115}
                >
                </VictoryPie>
                <VictoryLegend
                    borderPadding={{ left: 10 ,top: 0, bottom: 0 }}
                    height={40}
                    orientation="horizontal"
                    data={[
                        { name: "Completed", symbol: { fill: theme.COLORS.PRIMARY } },
                        { name: "Pending", symbol: { fill: theme.COLORS.ERROR } },
                        { name: "Shipment", symbol: { fill: theme.COLORS.WARNING} },
                        { name: "Shipped", symbol: { fill: theme.COLORS.SUCCESS } }
                    ]}
                />
            </View>
        )
    }

    const loadData = () => {
        setLoading(true)
        getData('/categories').then((data) => {
            if (data) {
                //console.log(data)
                setCategoryCount(data.length);
                setLoading(false);
            }
        });
        setLoading(true)
        getData('/products').then((data) => {
            if (data) {
                //console.log(data)
                setProductCount(data.length);
                setLoading(false);
            }
        });
        setLoading(true)
        getData('/orders').then((data) => {
            if (data) {
                //console.log(data)
                setOrderCount(data.length);
                let count = data.filter((x) => {
                    if (x.status === "PENDING"){
                        return x
                    }
                }).length
                setPedingOrderCount(count)
              setLoading(false);
            }
        });
        getData('/statistics/chart/sales-overview').then((data) => {
            if (data) {
                //console.log(data)
                setDataSalesChart(data)
                
              setLoading(false);
            }
        });
        getData('/statistics/chart/orders-overview').then((data) => {
            if (data) {
                //console.log(data)
                setDataOrdersChart(data)
                setLoading(false);
            }
        });
    }

    const onRefresh = () => {
        loadData();
    };


  return (
    <View style = { styles.container }>
        <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.PRIMARY}></StatusBar>
        <ScrollView 
            refreshControl={
                <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.cardsContainer}>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Category')}>
                        <FontAwesome5 name="layer-group" size={20} color={theme.COLORS.TITLE}/>
                        <Text style={styles.text}>Categories</Text>
                        <Text style={styles.count}>{categoryCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Products')}>
                        <FontAwesome5 name="product-hunt" size={20} color={theme.COLORS.TITLE} />
                        <Text style={styles.text}>Products</Text>
                        <Text style={styles.count}>{productCount}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Orders')}>
                        <FontAwesome5 name="clipboard-list" size={20} color={theme.COLORS.TITLE} />
                        <Text style={styles.text}>Orders</Text>
                        <Text style={styles.count}>{orderCount}</Text>
                    </TouchableOpacity>
                    <View style={styles.menu} >
                        <FontAwesome5 name="list" size={20} color={theme.COLORS.TITLE} />
                        <Text style={styles.text}>Pending Orders</Text>
                        <Text style={styles.count}>{pendingOrderCount}</Text>
                    </View>
                </View>
                
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Sales Overview</Text>
                </View>
                <View style={styles.chartBody}>
                    <SalesChart/>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Orders Overview</Text>
                </View>
                <View style={styles.chartBody}>
                    <OrdersChart/>
                </View>
            </View>
            <View style={{height: 40}}/>
        </ScrollView> 
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