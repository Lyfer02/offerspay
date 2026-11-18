import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

if (typeof document !== 'undefined') {
  const iconFontStyles = `
    @font-face {
      font-family: 'Ionicons';
      src: url('react-native-vector-icons/Fonts/Ionicons.ttf') format('truetype');
    }
    @font-face {
      font-family: 'FontAwesome';
      src: url('react-native-vector-icons/Fonts/FontAwesome.ttf') format('truetype');
    }
    @font-face {
      font-family: 'FontAwesome6Free-Regular';
      src: url('react-native-vector-icons/Fonts/FontAwesome6_Regular.ttf') format('truetype');
    }
    @font-face {
      font-family: 'MaterialCommunityIcons';
      src: url('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Fontisto';
      src: url('react-native-vector-icons/Fonts/Fontisto.ttf') format('truetype');
    }
    @font-face {
      font-family: 'MaterialIcons';
      src: url('react-native-vector-icons/Fonts/MaterialIcons.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Feather';
      src: url('react-native-vector-icons/Fonts/Feather.ttf') format('truetype');
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(iconFontStyles));
  document.head.appendChild(style);
}

export {
  Ionicons,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  Fontisto,
  MaterialIcons,
  Feather,
};
