function errorGettingWeather() {
  document
    .getElementById('error-container')
    .insertAdjacentText('beforeend', '|| Error fetching weather data ||')
}

function getWeather() {
  const latitude = document.querySelector('#latitude').value
  const longitude = document.querySelector('#longitude').value
  //https://www.weather.gov/documentation/services-web-api  --> documentation for this API
  const weatherUrl = `https://api.weather.gov/points/${latitude},${longitude}`
  fetch(weatherUrl, {
    headers: {
      'User-Agent': 'calvaryeagles.org (langdon@calvaryeagles.org)'
    }
  })
    .then(response => response.json())
    // Get forecast data
    .then(data => {
      const snowToday = data.properties.forecast
      fetch(snowToday, {
        headers: {
          'User-Agent': 'calvaryeagles.org (langdon@calvaryeagles.org)'
        }
      })
        .then(response => response.json())
        // Get Snow inches tonight
        .then(data => {
          const forecastTonight = data.properties.periods.find(period => {
            return period.name.includes('Tonight')
          })
          if (forecastTonight) {
            const forecastDescription = forecastTonight.detailedForecast
            const regex = /\b(\d+(\.\d+)?)\s*(inch|inches)\b/
            const match = forecastDescription.match(regex)
            if (match) {
              const inches = parseFloat(match[1])
              document.querySelector('snow-today').value = inches
            } else {
              document.querySelector('snow-today').value = 0
            }
          } else {
            errorGettingWeather
          }
        })
    })
    // Get hourly forecast data
    .then(data => {
      const forecastHourlyUrl = data.properties.forecastHourly
      fetch(forecastHourlyUrl, {
        headers: {
          'User-Agent': 'calvaryeagles.org (langdon@calvaryeagles.org)'
        }
      })
        .then(response => response.json())
        // Get 7am temp forecast
        .then(data => {
          const tomorrow7amForecast = data.properties.periods.find(period => {
            return period.startTime.includes('T07:00')
          })
          if (tomorrow7amForecast) {
            document.getElementById('temp').value =
              tomorrow7amForecast.temperature
          } else {
            document.getElementById('temp').value = ''
            document
              .getElementById('error-container')
              .insertAdjacentText(
                'beforeend',
                '|| No forecast available for 7am tomorrow ||'
              )
          }
          // Get 5am precipitation
          const tomorrow5amForecast = data.properties.periods.find(period => {
            return period.startTime.includes('T05:00')
          })
          if (tomorrow5amForecast) {
            document.getElementById('precip').value =
              tomorrow5amForecast.probabilityOfPrecipitation.value
          } else {
            document.getElementById('precip').value = ''
            document
              .getElementById('error-container')
              .insertAdjacentText(
                'beforeend',
                '|| No forecast available for 5am tomorrow ||'
              )
          }
        })
    })
    .catch(error => {
      console.error('Error fetching weather data:', error)
      document.getElementById('temp').value = ''
      document.getElementById('precip').value = ''
      errorGettingWeather
    })
}

document
  .querySelector('#get-forecast-form')
  .addEventListener('submit', function (event) {
    document.querySelector('#error-container').innerHTML = ''
    event.preventDefault()
    getWeather()
  })
