function errorGettingWeather() {
  document
    .getElementById('error-container')
    .insertAdjacentText('beforeend', '|| Error fetching weather data ||')
}

function getWeatherUrl() {
  const latitude = document.querySelector('#latitude').value
  const longitude = document.querySelector('#longitude').value
  console.log(`https://api.weather.gov/points/${latitude},${longitude}`)
  return `https://api.weather.gov/points/${latitude},${longitude}`
}

function fetchWeatherData(url) {
  return fetch(url, {
    headers: {
      'User-Agent': 'calvaryeagles.org (langdon@calvaryeagles.org)'
    }
  }).then(response => response.json())
}

function getForecastForTime(data, time) {
  return data.properties.periods.find(period => period.startTime.includes(time))
}

function updateElementValue(elementId, value) {
  console.log(value)
  document.getElementById(elementId).value = value
}

function displayError(message) {
  document
    .getElementById('error-container')
    .insertAdjacentText('beforeend', message)
}

function handleTemperatureForecast(data) {
  const tomorrow7amForecast = getForecastForTime(data, 'T07:00')

  if (tomorrow7amForecast) {
    console.log(tomorrow7amForecast.temperature)
    updateElementValue('temp', tomorrow7amForecast.temperature)
  } else {
    updateElementValue('temp', '')
    displayError('|| No forecast available for 7am tomorrow ||')
  }
}

function handlePrecipitationForecast(data) {
  const tomorrow5amForecast = getForecastForTime(data, 'T05:00')

  if (tomorrow5amForecast) {
    console.log(tomorrow5amForecast.probabilityOfPrecipitation.value)
    updateElementValue(
      'precip',
      tomorrow5amForecast.probabilityOfPrecipitation.value
    )
  } else {
    updateElementValue('precip', '')
    displayError('|| No forecast available for 5am tomorrow ||')
  }
}

function handleForecastHourly(url) {
  fetch(url, {
    headers: {
      'User-Agent': 'calvaryeagles.org (langdon@calvaryeagles.org)'
    }
  })
    .then(response => response.json())
    .then(data => {
      handleTemperatureForecast(data)
      handlePrecipitationForecast(data)
    })
}

function handleSnowToday(data) {
  const forecastTonight = data.properties.periods.find(period =>
    period.name.includes('Tonight')
  )

  if (forecastTonight) {
    const forecastDescription = forecastTonight.detailedForecast
    const regex = /\b(\d+(\.\d+)?)\s*(inch|inches)\b/
    const match = forecastDescription.match(regex)
    document.querySelector('#snow-today').value = match
      ? parseFloat(match[1])
      : 0
  } else {
    errorGettingWeather()
  }
}

function handleSnowTomorrow(data) {
  console.log(data)
  const forecastTomorrow = data.properties.periods[1]
  if (forecastTomorrow) {
    const forecastDescription = forecastTomorrow.detailedForecast
    console.log(forecastDescription)
    const regex = /\b(\d+(\.\d+)?)\s*(inch|inches)\b/
    const match = forecastDescription.match(regex)
    document.querySelector('#snow-tomorrow').value = match
      ? parseFloat(match[1])
      : 0
  } else {
    errorGettingWeather()
  }
}

function getWeather() {
  const weatherUrl = getWeatherUrl()
  fetchWeatherData(weatherUrl)
    .then(initialData => {
      const forecastHourlyUrl = initialData.properties.forecastHourly
      const forecastUrl = initialData.properties.forecast
      return fetchWeatherData(forecastUrl)
        .then(forecastData => {
          handleSnowToday(forecastData)
          handleSnowTomorrow(forecastData)
        })
        .then(() => {
          return forecastHourlyUrl
        })
    })
    .then(forecastHourlyUrl => {
      return handleForecastHourly(forecastHourlyUrl)
    })
    .catch(error => {
      console.error('Error fetching weather data:', error)
      errorGettingWeather()
    })
}

document
  .querySelector('#get-forecast-form')
  .addEventListener('submit', function (event) {
    document.querySelector('#error-container').innerHTML = ''
    event.preventDefault()
    getWeather()
  })
