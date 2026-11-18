import { Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../src/utils/color';
import IconComponent from '../../components/IconComponent';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';

const ConfigureBitly = () => {
  const [isBitlyEnabled, setIsBitlyEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bitlyToken, setBitlyToken] = useState('');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <IconComponent
        color={colors.gray}
        name='search'
        size={24}
        />
      <TextInput
        style={defaultStyleSheet.txtInput}
        placeholder="Search for Tokens"
      /></View>
      
      {/* Bitly Config Toggle */}
      <View style={styles.configRow}>
        <Text style={styles.allTokensText}>All Tokens(0)</Text>
        <View style={styles.switchContainer}>
          <Text style={{fontSize:16,padding:4}}>Bitly Config</Text>
          <Switch
            value={isBitlyEnabled}
            onValueChange={(value) => setIsBitlyEnabled(value)}
          />
        </View>
        {/* web add bitly  btn  */}
        {Platform.OS== 'web' && <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setModalVisible(true)} // Open the modal
      style={styles.addBitlyBtnContainer}>
        <Text style={styles.addTokenText}>+ Add Bitly Token</Text>
      </TouchableOpacity>}
        </View>
      
      {/* No Tokens Message */}
      <Text style={styles.noTokensText}>No tokens</Text>
      
      {/* How to Activate Bitly */}
      <TouchableOpacity style={styles.howToActivateContainer}
      activeOpacity={0.7}>
        <Text style={styles.howToActivateText}>How to activate Bitly</Text>
        <IconComponent
        size={24}
        name='chevron-down'
        />
      </TouchableOpacity>

      {/* Add Bitly Token Button */}
      {(Platform.OS == 'android') && <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setModalVisible(true)} // Open the modal
      style={styles.addTokenButton}>
        <Text style={styles.addTokenText}>+ Add Bitly Token</Text>
      </TouchableOpacity>}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)} // Handles back button behavior on Android
>
  {/* Overlay to detect taps outside the modal */}
  <TouchableWithoutFeedback
    onPress={() => setModalVisible(false)} // Close modal when tapping outside
  >
    <View style={defaultStyleSheet.modalContainer}>
      {/* Content container to prevent taps on modal content from closing the modal */}
      <TouchableWithoutFeedback>
        <View style={defaultStyleSheet.modalContent}>
          <Text style={defaultStyleSheet.inputLabel}>
            Add Your First Bitly Access Token
          </Text>
          <View
            style={[
              defaultStyleSheet.shadowProvider,
              { padding: 10, borderRadius: 8, marginVertical: 12 },
            ]}
          >
            <TextInput
              style={defaultStyleSheet.txtInput}
              placeholder="Enter Bitly Access Token"
              value={bitlyToken}
              onChangeText={setBitlyToken}
              onFocus={() => {}}
            />
          </View>
          <View style={styles.modalButtons}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={() => setModalVisible(false)} // Close the modal on Cancel
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.7}
              onPress={() => {
                console.log('Bitly Token Saved:', bitlyToken);
                setModalVisible(false); // Close the modal on Save
              }}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>


    </ScrollView>
  )
}

export default ConfigureBitly

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    alignItems:'center',
    flexDirection:'row',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  allTokensText: {
    fontSize: 16,
    flex:1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noTokensText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  howToActivateContainer: {
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    marginBottom: 32,
  },
  howToActivateText: {
    flex:1,
    fontSize: 16,
    color: '#000',
  },
  addTokenButton: {
    backgroundColor: colors.colorPrimary,
    borderRadius: 8,
    position:'absolute',
    bottom:5,
    left:5,
    right:5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addTokenText: {
    color: colors.white,
    fontWeight:'700',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth:1024,
    alignSelf:'center',
    width:'100%',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#00C48C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: '#000',
  },
  saveText: {
    color: '#fff',
  },
  addBitlyBtnContainer:{
    paddingHorizontal:12,
    paddingVertical:8,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8,
    overflow:'hidden',
    backgroundColor:colors.colorPrimary,
    marginStart:10,
  }
})