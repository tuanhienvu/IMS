import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { IMAGES } from '../FoodAppData/FoodData' 
import { NHOMMONAN } from '../FoodAppData/FoodData'
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CUAHANG } from '../FoodAppData/FoodData';

export default function foodpage() {
    const data = [
        { label: 'Chọn địa điểm', value: '' },
        { label: 'Đà Nẵng, Việt Nam', value: '1' },
        { label: 'TP.HCM, Việt Nam', value: '2' },
        { label: 'Hà Nội, Việt Nam', value: '3' },
        { label: 'Cần Thơ, Việt Nam', value: '4' },        
      ];    
    const [value, setValue] = useState({});
    const [selectedValue, setSelectedValue] = useState('');    
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={styles.row}>
            <TouchableOpacity onPress={router.back}>
                <FontAwesome name='arrow-left' size={24}></FontAwesome>
            </TouchableOpacity>
            <View>
                <Text>Giao đến</Text>
                <Dropdown data={data}
                    labelField='label'
                    valueField='value'
                    value={selectedValue}
                    onChange={item=>{setSelectedValue(item.value); setValue(item);}}
                    style={{width:170}}
                    ></Dropdown>
            </View>
            <TouchableOpacity>
                <FontAwesome name='list' size={24}></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity>
                <FontAwesome name='bell' size={24}></FontAwesome>
            </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={styles.search_bar}>
          <FontAwesome name='search' size={24}></FontAwesome>
          <TextInput placeholder='    Bạn đang thèm gì nào ?'></TextInput>
        </View>
        <View style={styles.list_food}>
          <FlatList data={NHOMMONAN}
                    renderItem={(a)=>{return(
                      <TouchableOpacity style={styles.item}>
                        <Image source={a.item.icon} style={{width:60,height:60,borderRadius:50}}></Image>
                        <Text style={{textAlign:'center',fontWeight:'500'}}>{a.item.name}</Text>
                      </TouchableOpacity>
                    )}}
                    keyExtractor={(item)=>item.id.toString()}
                    horizontal={true}></FlatList>
        </View>
        
        <View>
          <Text style={{fontSize:20,fontWeight:'700',marginLeft:20}}>Cửa hàng tốt nhất trong khu vực</Text>
          <FlatList data={CUAHANG}
                    renderItem={(b)=>{return(
                      <View style={styles.select_food}>
                        <Image source={b.item.photo} style={{width:120,height:120,borderRadius:10}}></Image>
                        <Text style={{fontWeight:'500'}}>{b.item.name}</Text>
                        <Text> * * * * * 4.1</Text>
                      </View>
                    )}}
                    keyExtractor={(item)=>item.id.toString()}
                    horizontal={true}></FlatList>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',   
    },
    bar: {
        height: 150,
        backgroundColor: '#5CACEE',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    search_bar: {
      flexDirection: 'row',
      backgroundColor: '#f5f5f5',
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      paddingHorizontal: 20,
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: {width:0, height:2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1,
      position: 'absolute',
      width: '90%',
      marginTop: -25
    },
    list_food:{
      marginTop: 30,
      paddingHorizontal: 20,
      marginBottom:20
    },
    item:{
      padding:10
    },
    select_food: {
      width: 130,
      paddingHorizontal: 10,
      paddingTop: 20
    }
})