module.exports = {
    //pm2 start ecosystem.config.js

  apps: [
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
    }
  ]
};
