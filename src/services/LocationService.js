import geodist from 'geodist'

const geodistOptions = {
  unit: 'meters',
}

const getDistanceBetweenTwoCoordinates = (first, second) => geodist(first, second, geodistOptions)

const areLocationsWithinRange = (first, second, range = 20) => geodist(first, second, {
  ...geodistOptions,
  limit: range,
})

export default {
  getDistanceBetweenTwoCoordinates,
  areLocationsWithinRange,
}