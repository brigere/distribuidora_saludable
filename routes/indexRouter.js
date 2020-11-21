const
    express = require('express'),
    router = express.Router(),
    indexCtrl = require('../controllers/indexCtrl'),
    validator = require('../middlewares/validators')
    ;

router
    .get('/',indexCtrl.index)
    .get('/login',indexCtrl.login)
    .post('/login',validator.loginForm,indexCtrl.authUser)
    .get('/logout',indexCtrl.logout)
    // .get('/locales',indexCtrl.locales)
    // .get('/about',indexCtrl.about)
    .get('/cart',indexCtrl.cart)
    // .get('/search',indexCtrl.search)
    ;

module.exports = router;