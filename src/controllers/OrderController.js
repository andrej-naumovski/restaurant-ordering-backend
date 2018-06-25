import { Router } from 'express'

import OrderService from '../services/OrderService'

const getOrderByIdAndRestaurant = async (req, res) => {
  const { orderId } = req.params
  const { restaurantId } = req.query

  if (!orderId || !restaurantId) {
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

  if (!orderId || !restaurantId) {
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

  if (!validateOrderObject(order)) {
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

// TODO andrej-naumovski 25.06.2018: Update the validation to use Joi
const validateOrderObject = (order) => order.restaurantId && order.tableId && order.items

const orderRouter = Router()

orderRouter.get('/:orderId', getOrderByIdAndRestaurant)
orderRouter.put('/:orderId', updateOrderIsCompleted)
orderRouter.post('/', createOrder)

export default orderRouter
