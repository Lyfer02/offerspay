import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { TelegramPrivateData } from '../TrendingStoresItemData';
import { colors } from '../../src/utils/color';
import TelegramContentSteps from './TelegramContentSteps';

const PrivateChannelConfig = () => {
  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <View>
          <Text style={styles.title}>Steps For Configuration</Text>
          <Text style={styles.title}>Steps 1 - 8 are same for both public and private  Channels </Text>
          </View>
        )}
        data={TelegramPrivateData}
        renderItem={({ item }) => <TelegramContentSteps item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Ensure the container can grow to fill the available space
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  listContainer: {
    paddingBottom: 20,  // Ensure there is space at the bottom for smooth scrolling
  },
});

export default PrivateChannelConfig;
