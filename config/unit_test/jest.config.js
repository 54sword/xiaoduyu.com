module.exports = {
  "rootDir": "../../__test__",
  "testRegex": ".*/.*.test.jsx?$",
  "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/config/unit_test/fileMock.js",
      "\\.(css|less|scss)$": "identity-obj-proxy"
    },
  "globals": {
    "__SERVER__": false
  }
}
