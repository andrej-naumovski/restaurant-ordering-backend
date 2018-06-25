import Order from '../models/persistence/Order'

const getOrderByIdAndRestaurant = async (id, restaurantId) =>
    await Order.findOne({
        _id: id,
        restaurantId,
    })

export default {
    getOrderByIdAndRestaurant,
}
