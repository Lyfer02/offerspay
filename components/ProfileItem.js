import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../src/utils/color';
import { useNavigation } from '@react-navigation/native';

import IconComponent from './IconComponent';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';

const ProfileItem = ({ family, iconName, itemName, showRightArrow = true , goTo}) => {
  return (
    <TouchableOpacity  
    activeOpacity={0.7}
    
  underlayColor={colors.lightGray}
    onPress={goTo}
      // onPress={()=>{
      // console.log("pressed"+ navigationTarget);
      // navigation.navigate(navigationTarget)} }
      
      >
        <View style={[styles.itemContainer]}> 
      <IconComponent name={iconName} size={20} color={colors.colorPrimary} family={family}/>
      <Text
      allowFontScaling={false}
      style={styles.itemName}>{itemName}</Text>
      {showRightArrow && (<IconComponent name={'arrow-forward-ios'} size={18} color={colors.colorPrimary}
      family='material'/>)}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    borderRadius:10,
    borderBottomWidth:1,
    borderBottomColor:colors.lightGray,
    marginHorizontal:10,
    paddingVertical:10,
    paddingHorizontal:18
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    marginStart: 8,
    padding: 4,
    fontWeight:'500',
    color:colors.black,
  },
});
