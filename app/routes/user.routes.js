const passport = require('passport');
module.exports = (app) => {
  const User = require('../controllers/user.controller.js');
  app.post('/login', User.login);
  app.post('/create', User.create);
  app.get('/profile:_id',  passport.authenticate('jwt', { session: false }), User.findOne)
  app.put('/auth/update/:_id', passport.authenticate('jwt', { session: false }), User.updateProfile)
}
