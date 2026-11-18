// import React, { useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Pressable,
// } from 'react-native';

// const AdvancedModeModal = ({ visible = true, onClose }) => {
//   const [isEnabled, setIsEnabled] = useState(false);

//   const handleToggle = (value) => {
//     setIsEnabled(value);
//   };

//   const handleSwitch = () => {
//     // Handle the switch to advanced mode
//     console.log('Switching to advanced mode:', isEnabled);
//     // Add your implementation logic here
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <Pressable 
//         style={styles.overlay} 
//         onPress={onClose}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {/* Title */}
//             <Text style={styles.title}>Advanced mode</Text>
            
//             {/* Description */}
//             <Text style={styles.description}>
//               This mode is dedicated for Telegram users switch to this mode if you want 
//               to use features like Bitly converter, post scheduling, or if you have 
//               multiple Telegram accounts.
//             </Text>
            
//             <Text style={styles.subtitle}>
//               If you want to open advanced mode as default, select Enable
//             </Text>
            
//             {/* Toggle Buttons */}
//             <View style={styles.toggleContainer}>
//               <TouchableOpacity
//                 style={styles.toggleButton}
//                 onPress={() => handleToggle(true)}
//                 activeOpacity={0.8}
//               >
//                 <View style={[
//                   styles.radio,
//                   isEnabled && styles.radioSelected
//                 ]}>
//                   {isEnabled && <View style={styles.radioInner} />}
//                 </View>
//                 <Text style={[
//                   styles.toggleText,
//                   !isEnabled && styles.toggleTextInactive
//                 ]}>Enable</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.toggleButton}
//                 onPress={() => handleToggle(false)}
//                 activeOpacity={0.8}
//               >
//                 <View style={[
//                   styles.radio,
//                   !isEnabled && styles.radioSelected
//                 ]}>
//                   {!isEnabled && <View style={styles.radioInner} />}
//                 </View>
//                 <Text style={[
//                   styles.toggleText,
//                   isEnabled && styles.toggleTextInactive
//                 ]}>Disable</Text>
//               </TouchableOpacity>
//             </View>
            
//             {/* Switch Button */}
//             <TouchableOpacity
//               style={styles.switchButton}
//               onPress={handleSwitch}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.switchButtonText}>
//                 Switch To Advanced Mode
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Pressable>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: Dimensions.get('window').width * 0.85,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   modalContent: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#1A1A1A',
//   },
//   description: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 24,
//     color: '#4A4A4A',
//     lineHeight: 22,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#666666',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 32,
//     marginBottom: 32,
//   },
//   toggleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   radio: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#CCCCCC',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   radioSelected: {
//     borderColor: '#10B981', // emerald-500
//   },
//   radioInner: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: '#10B981', // emerald-500
//   },
//   toggleText: {
//     fontSize: 16,
//     color: '#1A1A1A',
//   },
//   toggleTextInactive: {
//     opacity: 0.5,
//   },
//   switchButton: {
//     backgroundColor: '#10B981', // emerald-500
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   switchButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default AdvancedModeModal;