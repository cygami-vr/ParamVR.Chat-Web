export default {
    isProduction: window.origin.indexOf('localhost') !== 7 && window.origin.indexOf('127.0.0.1') !== 7,
    developmentPort: 8080
}
