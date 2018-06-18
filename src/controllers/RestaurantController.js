import { Router } from 'express'
import Joi from 'joi'

import RestaurantService from '../services/RestaurantService'

const validateLocation = location => {
  const validationSchema = Joi.object().keys({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  })

  return Joi.validate(location, validationSchema)
}

const restaurantRouter = Router()

const getNearestRestaurants = async (req, res) => {
  const { latitude, longitude } = req.query
  const userLocation = {
    latitude,
    longitude,
  }
  const { error } = validateLocation(userLocation)

  if (error) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid parameters!',
    })
  }

  const nearestRestaurants = await RestaurantService.getNearestRestaurants(userLocation)

  return res.status(200).send({
    status: 200,
    message: {
      restaurantList: nearestRestaurants,
    },
  })
}

restaurantRouter.get('/nearest', getNearestRestaurants)

export default restaurantRouter
