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

const validateRestaurant = restaurant => {
  const validationSchema = {
    name: Joi.string().required(),
    location: {
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }
  }

  return Joi.validate(restaurant, validationSchema)
}

const restaurantRouter = Router()

const getNearestRestaurants = async (req, res) => {
  const { latitude, longitude } = req.query
  const userLocation = {
    latitude: Number(latitude),
    longitude: Number(longitude),
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

const createRestaurant = async (req, res) => {
  const restaurant = req.body

  const { error } = validateRestaurant(restaurant)

  if (error) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid parameters!',
    })
  }
  const createdRestaurant = await RestaurantService.createNewRestaurant(restaurant)

  if (!createdRestaurant) {
    return res.status(500).send({
      status: 500,
      message: 'An error occurred, please try again.',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success',
    payload: {
      restaurant: createdRestaurant,
    },
  })
}

const addTableToRestaurant = async (req, res) => {
  const { restaurantId } = req.params
  const tableData = req.body

  const isTableAdded = await RestaurantService.addTableToRestaurant(restaurantId, tableData)

  if (!isTableAdded) {
    return res.status(500).send({
      status: 500,
      message: 'An error occurred, please try again later.',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success',
  })
}

const addCategoryToRestaurantMenu = async (req, res) => {
  const { restaurantId } = req.params
  const category = req.body

  const isCategoryAdded = RestaurantService.addCategoryToMenu(restaurantId, category)

  if (!isCategoryAdded) {
    return res.status(500).send({
      status: 500,
      message: 'An error occurred, please try again later',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success'
  })
}

restaurantRouter.get('/nearest', getNearestRestaurants)
restaurantRouter.put('/:restaurantId/reserve', updateTableReservation)
restaurantRouter.get('/:restaurantId/menu', getMenuForRestaurant)
restaurantRouter.post('/', createRestaurant)
restaurantRouter.post('/:restaurantId/table', addTableToRestaurant)
restaurantRouter.post('/:restaurantId/category', addCategoryToRestaurantMenu)

export default restaurantRouter
