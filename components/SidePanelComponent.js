// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import IconComponent from './IconComponent'
// import { colors } from '../src/utils/color'
// import defaultStyleSheet from '../src/styles/defaultStylesSheet'

// const SidePanelComponent = ({
//     IconName = 'exclamation-circle',
//   IconFamilyName = 'fontawesome',
//   IconColor = '#efefef',
//   ComponentName = 'Component',
//   isSelected = false,
//   onPress,
// }) => {
//   return (
//     <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.7}
//     style={[styles.sideComponent, isSelected && [styles.selectedComponent,
//      defaultStyleSheet.shadowProvider]]}>
//     <IconComponent
//       name={IconName}
//       size={22}
//       color={isSelected ? colors.white : IconColor}
//       family={IconFamilyName}
//       style={{margin: 5}}
//     />
//     <Text
//       style={[
//         styles.sideComponentName,
//         isSelected && styles.selectedComponentText,
//       ]}>
//       {ComponentName}
//     </Text>
//   </TouchableOpacity>
//   )
// }

// export default SidePanelComponent

// const styles = StyleSheet.create({
//      sideComponent: {
//     flexDirection: 'row',
//     padding: 8,
//     alignItems: 'center',
//     borderRadius: 4,
//     marginHorizontal:8,
//   },
//   selectedComponent: {
//     backgroundColor: colors.colorPrimary,
    
//   },
//   sideComponentName: {
//     flex: 1,
//     fontSize: 18,
//     padding: 4,
//     marginStart:10,
//   },
//   selectedComponentText: {
//     color: colors.white,
//     fontWeight:'600',
//   },
// })