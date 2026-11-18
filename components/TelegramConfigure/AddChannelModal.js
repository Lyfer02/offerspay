import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../src/utils/color';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';

const AddChannelModal = ({ isVisible, onClose }) => {
  const [token, setToken] = useState('');
  const [channelUsername, setChannelUsername] = useState('');
  const [status, setStatus] = useState('');
  const [autoPost, setAutoPost] = useState('');

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
    >
      <TouchableOpacity
        style={defaultStyleSheet.modalContainer} // Touchable area outside modal content
        activeOpacity={0.7}
        onPress={onClose}  // Close modal when tapping outside
      >
        
          <TouchableOpacity
            activeOpacity={0.7}  // Ensure touches within modal content are not closing it
            style={[defaultStyleSheet.modalContent,defaultStyleSheet.shadowProvider]}
          >
            <Text style={defaultStyleSheet.modalTitle}>Add your Telegram Channel</Text>
            
            {/* Token Input */}
            <View style={[defaultStyleSheet.shadowProvider,styles.inputContainer]}>
          
            <TextInput
              style={defaultStyleSheet.txtInput}
              placeholder="Token"
              value={token}
              onChangeText={setToken}
            /></View>

            {/* Channel Username Input */}
            <View style={[defaultStyleSheet.shadowProvider,styles.inputContainer]}>
          
            <TextInput
              style={defaultStyleSheet.txtInput}
              placeholder="Channel Username"
              value={channelUsername}
              onChangeText={setChannelUsername}
            /></View>

            {/* Select Status Dropdown */}
            <View style={[defaultStyleSheet.shadowProvider,styles.inputContainer]}>
          
            <TextInput
              style={defaultStyleSheet.txtInput}
              placeholder="Select Status"
              value={status}
              onChangeText={setStatus}
            />
            </View>

            {/* Auto Post Dropdown */}
            <View style={[defaultStyleSheet.shadowProvider,styles.inputContainer]}>
          
            <TextInput
              style={defaultStyleSheet.txtInput}
              placeholder="Auto Post"
              value={autoPost}
              onChangeText={setAutoPost}
            />
            </View>

            {/* Description Text */}
            <Text style={styles.description}>
              (Please note that If Auto Post is enabled then all converted posts will be auto sent on that Telegram Channel when you click on Convert/Bitly Convert and if you are using ExtraPe Bot for Link Conversion the converted Posts will be Auto Posted to respective Telegram Channels.)
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}
            
            >
              <TouchableOpacity onPress={onClose} style={styles.closeButton}
              activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addButton}
              activeOpacity={0.7}>
                <Text style={styles.addButtonText}>Add Channel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputContainer:{
    padding:10,
    borderRadius:8,
    marginVertical:8,
  },
  description: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'justify',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color:colors.black,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.colorPrimary,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: colors.white,
    textAlign: 'center',
  },
});

export default AddChannelModal;
