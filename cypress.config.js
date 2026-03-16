const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://demoqa.com",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 120000,
    // Block ad/analytics hosts that slow down demoqa.com page loads
    blockHosts: [
      "*.googlesyndication.com",
      "*.googletagmanager.com",
      "*.googletagservices.com",
      "*.doubleclick.net",
      "*.adservice.google.com",
      "*.amazon-adsystem.com",
      "*.moatads.com",
      "*.scorecardresearch.com",
      "*.facebook.net",
      "*.facebook.com",
      "*.yandex.ru",
      "*.hotjar.com",
      "*.cloudflareinsights.com",
      "*.chartbeat.com",
      "pagead2.googlesyndication.com",
      "securepubads.g.doubleclick.net",
    ],
    video: true,
    screenshotOnRunFailure: true,
    specPattern: "cypress/e2e/**/*.cy.js",

    setupNodeEvents(on, config) {
      on('task', {
        // Terminal logging for headless runs
        log(message) {
          console.log(message);
          return null;
        },

        // Parse a CSV file and return an array of objects
        parseCSV(filePath) {
          const absolutePath = path.resolve(filePath);
          const content = fs.readFileSync(absolutePath, "utf-8");
          const lines = content.trim().split("\n");
          const headers = lines[0].split(",").map((h) => h.trim());
          const rows = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim());
            return headers.reduce((obj, header, i) => {
              obj[header] = values[i] ?? "";
              return obj;
            }, {});
          });
          return rows;
        },
      });

      return config;
    },
  },
  env: {
    ...process.env,
  },
});
