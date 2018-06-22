import _ from 'lodash'

// Models
import Restaurant from '../models/persistence/Restaurant'

// Services
import LocationService from './LocationService'

const mockRestaurants = [{
  _id: 'id1',
  name: 'test restaurant',
  location: {
    latitude: 42.0017616919817,
    longitude: 21.4065151072028,
  },
  tables: [],
  menu: {
    categories: []
  }
}]

Restaurant.find = () => new Promise(resolve => resolve(mockRestaurants))

Restaurant.findById
  = (id) => new Promise(resolve => resolve(_.find(mockRestaurants, restaurant => restaurant._id === id)))

const getNearestRestaurants = async (userLocation, range = 20) => {
  const restaurants = await Restaurant.find({})

  const restaurantsWithDistances = restaurants
    .filter(restaurant => LocationService.areLocationsWithinRange(userLocation, restaurant.location, range))
    .map(restaurant => ({
      ...restaurant,
      distanceToUser: LocationService.getDistanceBetweenTwoCoordinates(userLocation, restaurant.location)
    }))

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

export default {
  getNearestRestaurants,
  getMenuForRestaurant,
  updateTableReservation,
}