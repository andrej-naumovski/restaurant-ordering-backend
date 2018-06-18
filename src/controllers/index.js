import { Router } from 'express'

import restaurantRouter from './RestaurantController'

const baseRouter = Router()

baseRouter.use('/restaurants', restaurantRouter)

export default baseRouter
