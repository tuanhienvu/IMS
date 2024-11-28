import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='login'></Stack.Screen>   
        <Stack.Screen name='foodpage'></Stack.Screen>             
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})