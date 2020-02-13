
import * as express from 'express';
let router = express.Router()

router.use('/', require('./root'))

router.use('/mocapi', require('./api'))

export default router