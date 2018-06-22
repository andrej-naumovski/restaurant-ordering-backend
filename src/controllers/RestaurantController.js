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

const validateTableReservationRequest = reservationBody => {
  const validationSchema = Joi.object().keys({
    tableId: Joi.string().required(),
    isReserved: Joi.boolean().required(),
  })

  return Joi.validate(reservationBody, validationSchema)
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
    message: 'Success',
    payload: {
      restaurantList: nearestRestaurants,
    },
  })
}

const updateTableReservation = async (req, res) => {
  if (!validateTableReservationRequest(req.body)) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid parameters!',
    })
  }

  const { restaurantId } = req.params
  const { tableId, isReserved } = req.body

  const isReservationSuccessful = RestaurantService.updateTableReservation(restaurantId, tableId, isReserved)

  if (isReservationSuccessful) {
    return res.status(200).send({
      status: 200,
      message: 'Reservation is successful!',
    })
  }

  return res.status(500).send({
    status: 500,
    message: 'Reservation unsuccessful, please try again.',
  })
}

const getMenuForRestaurant = async (req, res) => {
  const { restaurantId } = req.params

  if (!restaurantId) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid parameters!',
    })
  }

  const menu = await RestaurantService.getMenuForRestaurant(restaurantId)

  if (!menu) {
    return res.status(500).send({
      status: 500,
      message: 'Error while fetching menu, please try again.',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success',
    payload: {
      menu
    }
  })
}

restaurantRouter.get('/nearest', getNearestRestaurants)
restaurantRouter.put('/:restaurantId/reserve', updateTableReservation)
restaurantRouter.get('/:restaurantId/menu', getMenuForRestaurant)

export default restaurantRouter
