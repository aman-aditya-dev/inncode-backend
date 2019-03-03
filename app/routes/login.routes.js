module.exports = (app) => {
    const User = require('../controllers/login.controller.js');
    app.post('/users/login', User.post);

}
 