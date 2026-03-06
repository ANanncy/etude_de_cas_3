//module.exports = {
  //e2e: {
    //setupNodeEvents(on, config) {
      // pas besoin de changer ici
    //},
    
    //baseUrl: "http://127.0.0.1:8080"
  //}
//};

const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:8080', // garde ton URL locale
    setupNodeEvents(on, config) {
      // Active le plugin Allure
      allureWriter(on, config);

      // Retourne la config comme avant
      return config;
    },
  },
});