import _ from 'lodash'

// Models
import Restaurant from '../models/persistence/Restaurant'

// Services
import LocationService from './LocationService'

const getNearestRestaurants = async (userLocation, range = 20) => {
  const restaurants = await Restaurant.find({})

  const restaurantsWithDistances = restaurants
    .filter(restaurant => {
      const { latitude, longitude } = restaurant.location
      return LocationService.areLocationsWithinRange(userLocation, { latitude, longitude }, range)
    })
    .map(restaurant => {
      const { latitude, longitude } = restaurant.location
      return {
        ...restaurant._doc,
        distanceToUser: LocationService.getDistanceBetweenTwoCoordinates(userLocation, { latitude, longitude })
      }
    })

  const sortedRestaurants = _.sortBy(restaurantsWithDistances, restaurant => restaurant.distanceToUser)

  return sortedRestaurants.slice(0, 3)
}

const getMenuForRestaurant = async restaurantId => {
  const restaurant = await Restaurant.findById(restaurantId)

  if (!restaurant) {
    return null
  }

  return restaurant.menu
}

const updateTableReservation = async (restaurantId, tableId, isReserved) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId)

    if (!restaurant) {
      return false
    }

    const restaurantTable = _.find(restaurant.tables, table => table._id === tableId)

    if (!restaurantTable || restaurantTable.isAvailable !== isReserved) {
      return false
    }

    await Restaurant.findOneAndUpdate({ '_id': restaurantId, 'tables._id': tableId }, {
      '$set': {
        'tables.$.isAvailable': !isReserved,
      },
    })
    return true
  } catch (e) {
    return false
  }
}

const createNewRestaurant = async restaurant => {
  try {
    return await Restaurant.create(restaurant)
  } catch (e) {
    return null
  }
}

export default {
  getNearestRestaurants,
  getMenuForRestaurant,
  updateTableReservation,
  createNewRestaurant,
}