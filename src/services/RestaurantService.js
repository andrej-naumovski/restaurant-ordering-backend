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
    return await Restaurant.create({
      ...restaurant,
      menu: {
        categories: []
      },
    })
  } catch (e) {
    return null
  }
}

const addTableToRestaurant = async (restaurantId, tableData) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId)

    if (!restaurant) {
      return false
    }

    restaurant.tables.push({ ...tableData, isAvailable: true })

    await restaurant.save()

    return true
  } catch (e) {
    return false
  }
}

const addCategoryToMenu = async (restaurantId, category) => {
  try {
    let restaurant = await Restaurant.findById(restaurantId)

    if(!restaurant) {
      return false
    }

    const { items } = category

    category.items = []

    restaurant.menu.categories.push(category)
    restaurant = await restaurant.save()

    const { menu } = restaurant

    const savedCategory = menu.categories[menu.categories.length - 1]

    const { _id } = savedCategory

    menu.categories[menu.categories.length - 1].items = items.map(item => ({ ...item, category: _id }))

    restaurant.menu = menu

    await restaurant.save()

    return true
  } catch (e) {
    return false
  }
}

export default {
  getNearestRestaurants,
  getMenuForRestaurant,
  updateTableReservation,
  createNewRestaurant,
  addTableToRestaurant,
  addCategoryToMenu,
}