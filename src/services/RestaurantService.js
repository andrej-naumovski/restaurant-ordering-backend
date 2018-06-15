import _ from 'lodash'

// Models
import Restaurant from '../models/persistence/Restaurant'

// Services
import LocationService from './LocationService'

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

export default {
  getNearestRestaurants
}