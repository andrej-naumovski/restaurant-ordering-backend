import Order from '../models/persistence/Order'

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

export default {
  getOrderByIdAndRestaurant,
  updateOrderIsCompleted,
}
