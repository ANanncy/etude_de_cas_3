//module.exports = {
  //e2e: {
    //setupNodeEvents(on, config) {
      // pas besoin de changer ici
    //},
    
    //baseUrl: "http://127.0.0.1:8080"
  //}
//};

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mocha',
    overwrite: false,
    html: false,   // On génère le HTML via marge après la fusion
    json: true,
  },
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {},
  },
})