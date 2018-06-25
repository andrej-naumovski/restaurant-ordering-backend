import { Router } from 'express';

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
            order
        }
    })
}

const orderRouter = Router()

orderRouter.get('/:orderId', getOrderByIdAndRestaurant)

export default orderRouter
