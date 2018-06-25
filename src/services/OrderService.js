import _ from 'lodash'

import Order from '../models/persistence/Order'

import Money from '../models/domain/Money'

import RestaurantService from './RestaurantService'

const getOrderByIdAndRestaurant = async (id, restaurantId) =>
  await Order.findOne({
    _id: id,
    restaurantId,
  })

const updateOrderIsCompleted = async (orderId, restaurantId, isCompleted) => {
  try {
    await Order.findOneAndUpdate({
      _id: orderId,
      restaurantId,
    }, {
      isCompleted,
    })
    return true
  } catch (e) {
    return false
  }

}

const createOrder = async orderDetails => {
  const totalValue = Money.ZERO

  try {
    const {
      restaurantId,
      items,
      tableId,
    } = orderDetails

    const restaurantMenu = await RestaurantService.getMenuForRestaurant(restaurantId)

    if (!restaurantMenu) {
      return null
    }

    items.forEach(async item => {
      const category = _.find(restaurantMenu.categories, category => category.id === item.category._id)

      if (!category) {
        return
      }

      const menuItem = _.find(category.items, itemToFind => itemToFind._id.toString() === item._id)

      if (!menuItem) {
        return
      }

      const { price } = menuItem

      totalValue.add(price)
    })

    const itemIds = items.map(item => item._id)

    const orderToSave = {
      restaurantId,
      items: itemIds,
      tableId,
      isCompleted: false,
      totalValue: totalValue.toJSON(),
    }

    return await Order.create(orderToSave)
  } catch (e) {
    return null
  }
}

export default {
  getOrderByIdAndRestaurant,
  updateOrderIsCompleted,
  createOrder,
}
