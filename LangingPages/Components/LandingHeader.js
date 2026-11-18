import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import defaultStyleSheet from '../../src/styles/defaultStylesSheet'
import { colors } from '../../src/utils/color'
import { useNavigation } from '@react-navigation/native'

const LandingHeader = () => {
  const navigation = useNavigation();
  return (
    
    <View style={[styles.headers]}>
    <Text style={styles.headerTitle}>Marcadeo</Text>
    <TouchableOpacity 
    activeOpacity={0.7}
    onPress={()=>{
      navigation.navigate('AboutUs');
    }}>
      <Text style={styles.title}>About Us</Text></TouchableOpacity>
    {/* <TouchableOpacity
    
    activeOpacity={0.7}
    onPress={()=>{
      
      navigation.navigate('Login');
    }}
    >
    <Text style={styles.title}>How It Works?</Text></TouchableOpacity> */}

    <TouchableOpacity 
    activeOpacity={0.7}
    onPress={()=>{
      console.log('going to login');
      
      navigation.navigate('Login');
    }}
    ><Text style={styles.title}>Login/Signup</Text></TouchableOpacity>
  </View>
    
  )
}

export default LandingHeader

const styles = StyleSheet.create({
    headers: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: colors.white,
        

      },
      headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.colorPrimary,
        maxHeight: 90,
        padding: 10,
        flex: 1,
      },
      title: {
        padding: 10,
        fontSize: 18,
        fontWeight: '500',
        color: colors.black,
      },
})