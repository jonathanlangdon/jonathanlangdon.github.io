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
    .then(data => {
      const forecastHourlyUrl = data.properties.forecastHourly
      fetch(forecastHourlyUrl, {
        headers: {
          'User-Agent': 'calvaryeagles.org (langdon@calvaryeagles.org)'
        }
      })
        .then(response => response.json())
        .then(data => {
          const tomorrow7amForecast = data.properties.periods.find(period => {
            return period.startTime.includes('T07:00')
          })
          if (tomorrow7amForecast) {
            document.getElementById('temp').value =
              tomorrow7amForecast.temperature
          } else {
            document
              .getElementById('error-container')
              .insertAdjacentText(
                'beforeend',
                '|| No forecast available for 7am tomorrow ||'
              )
          }
          const tomorrow5amForecast = data.properties.periods.find(period => {
            return period.startTime.includes('T05:00')
          })
          if (tomorrow5amForecast) {
            document.getElementById('precip').value =
              tomorrow5amForecast.probabilityOfPrecipitation.value
          } else {
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
      document
        .getElementById('error-container')
        .insertAdjacentText('beforeend', '|| Error fetching weather data ||')
    })
}

document
  .querySelector('#get-forecast-form')
  .addEventListener('submit', function (event) {
    event.preventDefault()
    getWeather()
  })
