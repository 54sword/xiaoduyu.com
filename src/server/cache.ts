import featureConfig from '@config/feature.config';

var LRU = require("lru-cache")
  , options = { max: 100, maxAge: featureConfig.cache }
  , cache = new LRU(options);

// if (!featureConfig.cache) {
  cache = {
    get: () => '',
    set: () => ''
  }
// }

export default cache;