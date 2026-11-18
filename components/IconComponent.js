// components/IconComponent.js

import { isWeb } from '../src/utils/dimension';


let IconComponent;
if (isWeb) {
  IconComponent = require('./IconComponent.web').default;
} else {
  IconComponent = require('./IconComponent.native').default;
}

export default IconComponent;