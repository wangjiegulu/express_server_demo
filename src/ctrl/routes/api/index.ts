import * as express from 'express';
let router = express.Router()

// router.use('/f', require('./file'))

router.use('/account', require('./account'))
// ...

module.exports = router