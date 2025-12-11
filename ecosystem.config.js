module.exports = {
    //pm2 start ecosystem.config.js

  apps: [
    {
      name: "auth-service",
      script: "./auth-service/index.js",
      watch: true,
      env: {
        PORT: 3050
      }
    },
    {
      name: "property-service-1",
      script: "./property-service/src/app.js",
      watch: true,
      env: {
        PORT: 3000
      }
    },
    {
      name: "property-service-2",
      script: "./property-service/src/app.js",
      watch: true,
      env: {
        PORT: 3001
      }
    },
    {
      name: "property-service-3",
      script: "./property-service/src/app.js",
      watch: true,
      env: {
        PORT: 3002
      }
    },
    {
      name: "booking-service",
      script: "./booking-service/src/app.js",
      watch: true,
      env: {
        PORT: 3010
      }
    },
    {
      name: "user-service",
      script: "./user-service/src/app.js",
      watch: true,
      env: {
        PORT: 3020
      }
    }
  ]
};
