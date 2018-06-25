import { Router } from 'express'

import restaurantRouter from './RestaurantController'
import orderRouter from './OrderController'

const baseRouter = Router()

baseRouter.use('/restaurants', restaurantRouter)
baseRouter.use('/orders', orderRouter)

export default baseRouter
