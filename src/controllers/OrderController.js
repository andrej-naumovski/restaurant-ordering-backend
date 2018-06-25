import { Router } from 'express'
import Joi from 'joi'

import OrderService from '../services/OrderService'

const getOrderByIdAndRestaurant = async (req, res) => {
  const { orderId } = req.params
  const { restaurantId } = req.query

  const { error } = validateRestaurantAndOrderId({ orderId, restaurantId })

  if (error) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid params!',
    })
  }

  const order = await OrderService.getOrderByIdAndRestaurant(orderId, restaurantId)

  if (!order) {
    return res.status(500).send({
      status: 500,
      message: 'An error occurred, please try again.',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success',
    payload: {
      order,
    },
  })
}

const updateOrderIsCompleted = async (req, res) => {
  const { orderId } = req.params
  const { restaurantId } = req.query
  const { isCompleted } = req.body

  const { error } = validateRestaurantAndOrderId({ orderId, restaurantId })

  if (error) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid parameters!',
    })
  }

  const isCompletedBoolean = !!isCompleted // to avoid setting isCompleted to null in database

  const isOperationSuccessful = await OrderService.updateOrderIsCompleted(orderId, restaurantId, isCompletedBoolean)

  if (!isOperationSuccessful) {
    return res.status(500).send({
      status: 500,
      message: 'An error occurred, please try again.',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success',
  })
}

const createOrder = async (req, res) => {
  const order = req.body

  const { error } = validateOrderObject(order)

  if (error) {
    return res.status(400).send({
      status: 400,
      message: 'Invalid parameters!',
    })
  }

  const createdOrder = await OrderService.createOrder(order)

  if (!createdOrder) {
    return res.status(500).send({
      status: 500,
      message: 'An error occurred, please try again',
    })
  }

  return res.status(200).send({
    status: 200,
    message: 'Success',
    payload: {
      order: createdOrder,
    },
  })
}

const validateOrderObject = order => {
  const validationSchema = Joi.object().keys({
    restaurantId: Joi.string().required(),
    tableId: Joi.string().required(),
    items: Joi.array().items(Joi.object({
      _id: Joi.string().required(),
      category: Joi.object({
        _id: Joi.string().required()
      }).required(),
    })),
  })

  return Joi.validate(order, validationSchema)
}

const validateRestaurantAndOrderId = idObject => {
  const validationSchema = Joi.object().keys({
    restaurantId: Joi.string().required(),
    orderId: Joi.string().required(),
  })

  return Joi.validate(idObject, validationSchema)
}

const orderRouter = Router()

orderRouter.get('/:orderId', getOrderByIdAndRestaurant)
orderRouter.put('/:orderId', updateOrderIsCompleted)
orderRouter.post('/', createOrder)

export default orderRouter
