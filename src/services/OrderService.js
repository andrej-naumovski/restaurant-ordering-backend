import _ from 'lodash'

import Order from '../models/persistence/Order'
import MenuItem from '../models/persistence/MenuItem'

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

    const restaurantMenu = RestaurantService.getMenuForRestaurant(restaurantId)

    if (!restaurantMenu) {
      return null
    }

    items.forEach(async item => {
      const category = _.find(restaurantMenu.categories, category => category.name === item.category.name)
      if (!category) {
        return
      }

      const menuItem = await MenuItem.findOne({
        _id: item._id,
        category: category._id,
      })

      if (!menuItem) {
        return
      }

      const { price } = menuItem

      totalValue.add(price.value)
    })

    const itemIds = items.map(item => item._id)

    const orderToSave = {
      restaurantId,
      items: itemIds,
      tableId,
      isCompleted: false,
      totalValue,
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
