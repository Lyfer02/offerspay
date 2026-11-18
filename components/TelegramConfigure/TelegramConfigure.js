import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../src/utils/color';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import NoDataFound from '../NoDataFound/NoDataFound';
import PublicChannelConfig from './PublicChannelConfig';
import PrivateChannelConfig from './PrivateChannelConfig';
import AddChannelModal from './AddChannelModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabContainer from '../TabContainer';
import IconComponent from '../IconComponent';

const TelegramConfigure = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const tabs = [
    { 
      name: 'Public Channel Configuration', 
      label: 'Public Channel Configuration', 
      component: () => <PublicChannelConfig /> 
    },
    { 
      name: 'Private Channel Configuration', 
      label: 'Private Channel Configuration', 
      component: () => <PrivateChannelConfig/> 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      >
        {/* NoDataFound Component */}
        <View style={styles.noDataContainer}>
          <NoDataFound />
        </View>

        <TabContainer
          tabs={tabs}
          initialTab="Public Channel Configuration"
          onTabChange={(tabName) => console.log('Tab changed to:', tabName)}
        />
      </ScrollView>

      {/* Add Channel Button */}
      <TouchableOpacity 
        style={[
          styles.addButtonContainer, 
          defaultStyleSheet.shadowProvider,
          windowWidth >= 1024 ? styles.addButtonContainerLarge : styles.addButtonContainerNormal
        ]} 
        onPress={toggleModal}
      >
        <IconComponent name='add' size={24} color={colors.colorPrimary} />
        <Text style={styles.addButtonText}>Add Channel</Text>
      </TouchableOpacity>

      {/* Add Channel Modal */}
      <AddChannelModal isVisible={isModalVisible} onClose={toggleModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flexGrow: 1,
  },
  noDataContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    backgroundColor: 'white',
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderColor: colors.colorPrimary,
    borderWidth: 1,
    borderRadius: 50,
  },
  addButtonContainerNormal: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 10,
  },
  addButtonContainerLarge: {
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 'auto',
    left: 'auto',
    maxWidth: 300,
    width: 'auto',
    marginHorizontal: 0,
  },
  addButtonText: {
    marginLeft: 5,
    color: colors.colorPrimary,
    fontSize: 16,
  },
});

export default TelegramConfigure;