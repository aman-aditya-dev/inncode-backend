const passport = require('passport');
module.exports = (app) => {
  const Iot = require('../controllers/iot.controller.js');
  app.get('/room', Iot.room);
  
}