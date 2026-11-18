import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

// Icon name mappings for native
const nameMapping = {
  material: {
    'arrow-back': 'arrow-back',
    'person': 'person',
    'mail': 'mail',
    'lock-closed': 'lock',
    'eye-off': 'visibility-off',
    'eye': 'visibility',
    'phone-portrait': 'phone-android',
    'gift': 'card-giftcard',
    'search': 'search',
    'currency-rupee': 'currency-rupee',
    'arrow-forward-ios': 'arrow-forward-ios',
    'keyboard-arrow-up': 'keyboard-arrow-up',
    'keyboard-arrow-down': 'keyboard-arrow-down',
    'filter-alt': 'filter-alt',
    'download': 'download',
    'calendar-month': 'calendar-month',
    'person-4': 'person',
    'add': 'add'
  },
  ionicons: {
    'arrow-back': 'arrow-back',
    'person': 'person-outline',
    'mail': 'mail-outline',
    'lock-closed': 'lock-closed-outline',
    'eye-off': 'eye-off-outline',
    'eye': 'eye-outline',
    'phone-portrait': 'phone-portrait-outline',
    'gift': 'gift-outline',
    'search': 'search-outline',
    'currency-rupee': 'logo-usd',
    'arrow-forward-ios': 'chevron-forward'
  },
  fontawesome: {
    'arrow-back': 'arrow-left',
    'person': 'user',
    'mail': 'envelope',
    'lock-closed': 'lock',
    'eye-off': 'eye-slash',
    'eye': 'eye',
    'phone-portrait': 'mobile',
    'gift': 'gift',
    'search': 'search',
    'currency-rupee': 'rupee',
    'arrow-forward-ios': 'arrow-right',
    'exclamation-circle': 'exclamation-circle',
    'circle': 'circle'
  },
  feather: {
    'arrow-back': 'arrow-left',
    'person': 'user',
    'mail': 'mail',
    'lock-closed': 'lock',
    'eye-off': 'eye-off',
    'eye': 'eye',
    'phone-portrait': 'smartphone',
    'gift': 'gift',
    'search': 'search',
    'arrow-forward-ios': 'arrow-right'
  }
};

const iconFamilies = {
  ionicons: Ionicons,
  material: MaterialIcons,
  fontawesome: FontAwesome,
  feather: Feather,
};

const IconComponent = ({ 
  name, 
  size = 24, 
  color = 'black', 
  family = 'ionicons',
  style = {} 
}) => {
  const IconFamily = iconFamilies[family];
  
  if (!IconFamily) {
    console.warn(`Icon family ${family} not found`);
    return null;
  }
  
  const iconName = nameMapping[family]?.[name] || name;
  
  return (
    <IconFamily 
      name={iconName} 
      size={size} 
      color={color} 
      style={style} 
    />
  );
};

export default IconComponent;