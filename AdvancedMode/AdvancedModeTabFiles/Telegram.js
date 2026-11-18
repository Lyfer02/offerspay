import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../src/utils/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import PrivateChannelConfig from '../../components/TelegramConfigure/PrivateChannelConfig';
import PublicChannelConfig from '../../components/TelegramConfigure/PublicChannelConfig';
import IconComponent from '../../components/IconComponent';

const Telegram = () => {
  const [showTelegramForm, setShowTelegramForm] = useState(true);
  const [showScheduledPosts, setShowScheduledPosts] = useState(false);
  const [showSentPosts, setShowSentPosts] = useState(false);
  const [showPublicConfiguration, setShowPublicConfiguration] = useState(false);
  const [showPrivateConfiguration, setShowPrivateConfiguration] = useState(false);
  
  const [token, setToken] = useState('');
  const [channelName, setChannelName] = useState('');
  const [status, setStatus] = useState('Enable');
  const [autoPost, setAutoPost] = useState('Enable');
  
  const options = ['Enable', 'Disable'];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}>
      
      <View style={styles.container}>
        {/* Telegram Form Section */}
        <View style={[styles.card, defaultStyleSheet.shadowProvider]}>
          <TouchableOpacity 
            style={styles.cardHeader}
            activeOpacity={0.7}
            onPress={() => setShowTelegramForm(!showTelegramForm)}
          >
            <Text style={styles.cardTitle}>Telegram Channel</Text>
            <IconComponent
              size={22}
              name={showTelegramForm ? 'chevron-up' : 'chevron-down'}
              color={colors.black}
            />
          </TouchableOpacity>
          
          {showTelegramForm && (
            <View style={styles.cardContent}>
              {/* Token Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Token</Text>
                <View style={[styles.inputWrapper, defaultStyleSheet.shadowProvider]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter Token'
                    placeholderTextColor={colors.lightGray}
                    value={token}
                    onChangeText={setToken}
                  />
                </View>
              </View>

              {/* Channel Name Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Channel Name</Text>
                <View style={[styles.inputWrapper, defaultStyleSheet.shadowProvider]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Enter Channel Name'
                    placeholderTextColor={colors.lightGray}
                    value={channelName}
                    onChangeText={setChannelName}
                  />
                </View>
              </View>

              {/* Status Section */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.radioContainer}>
                  {options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      style={styles.radioOption}
                      onPress={() => setStatus(option)}
                    >
                      <IconComponent
                        name={status === option ? 'radio-button-on' : 'radio-button-off'}
                        size={24}
                        color={status === option ? colors.colorPrimary : '#888'}
                      />
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Auto Post Section */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Auto Post</Text>
                <View style={styles.radioContainer}>
                  {options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      style={styles.radioOption}
                      onPress={() => setAutoPost(option)}
                    >
                      <IconComponent
                        name={autoPost === option ? 'radio-button-on' : 'radio-button-off'}
                        size={24}
                        color={autoPost === option ? colors.colorPrimary : '#888'}
                      />
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Add Button */}
              <TouchableOpacity 
                style={styles.addButton}
                activeOpacity={0.8}
              >
                <IconComponent 
                  name='add' 
                  size={20} 
                  color={colors.white}
                  family='material' 
                />
                <Text style={styles.addButtonText}>Add Channel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Scheduled Posts Section */}
        <View style={[styles.card, defaultStyleSheet.shadowProvider]}>
          <TouchableOpacity 
            style={styles.cardHeader}
            activeOpacity={0.7}
            onPress={() => setShowScheduledPosts(!showScheduledPosts)}
          >
            <Text style={styles.cardTitle}>Scheduled Posts (0)</Text>
            <IconComponent
              size={22}
              name={showScheduledPosts ? 'chevron-up' : 'chevron-down'}
              color={colors.black}
            />
          </TouchableOpacity>
          
          {showScheduledPosts && (
            <View style={styles.cardContent}>
              <Text style={styles.emptyText}>No scheduled posts</Text>
            </View>
          )}
        </View>

        {/* Sent Posts Section */}
        <View style={[styles.card, defaultStyleSheet.shadowProvider]}>
          <TouchableOpacity 
            style={styles.cardHeader}
            activeOpacity={0.7}
            onPress={() => setShowSentPosts(!showSentPosts)}
          >
            <Text style={styles.cardTitle}>Sent Posts (0)</Text>
            <IconComponent
              size={22}
              name={showSentPosts ? 'chevron-up' : 'chevron-down'}
              color={colors.black}
            />
          </TouchableOpacity>
          
          {showSentPosts && (
            <View style={styles.cardContent}>
              <Text style={styles.emptyText}>No sent posts</Text>
            </View>
          )}
        </View>

        {/* Public Configuration Section */}
        <View style={[styles.card, defaultStyleSheet.shadowProvider]}>
          <TouchableOpacity 
            style={styles.cardHeader}
            activeOpacity={0.7}
            onPress={() => setShowPublicConfiguration(!showPublicConfiguration)}
          >
            <Text style={styles.cardTitle}>Steps for Public Configuration</Text>
            <IconComponent
              size={22}
              name={showPublicConfiguration ? 'chevron-up' : 'chevron-down'}
              color={colors.black}
            />
          </TouchableOpacity>
          
          {showPublicConfiguration && (
            <View style={styles.cardContent}>
              <PublicChannelConfig />
            </View>
          )}
        </View>

        {/* Private Configuration Section */}
        <View style={[styles.card, defaultStyleSheet.shadowProvider]}>
          <TouchableOpacity 
            style={styles.cardHeader}
            activeOpacity={0.7}
            onPress={() => setShowPrivateConfiguration(!showPrivateConfiguration)}
          >
            <Text style={styles.cardTitle}>Steps for Private Configuration</Text>
            <IconComponent
              size={22}
              name={showPrivateConfiguration ? 'chevron-up' : 'chevron-down'}
              color={colors.black}
            />
          </TouchableOpacity>
          
          {showPrivateConfiguration && (
            <View style={styles.cardContent}>
              <PrivateChannelConfig />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default Telegram

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: Platform.OS === 'web' ? 16 : 12,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  container: {
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  cardTitle: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '600',
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 8 : 4,
  },
  textInput: {
    fontSize: 16,
    color: colors.black,
    paddingVertical: 8,
    minHeight: 40,
    outlineStyle: 'none', // Web only - removes focus outline
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginRight: 16,
  },
  radioText: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    minWidth: 150,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      },
    }),
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.lightGray,
    textAlign: 'center',
    paddingVertical: 16,
  },
})