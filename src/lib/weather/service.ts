import axios, { AxiosError } from 'axios'

interface WeatherData {
  date: string
  temp_max: number
  temp_min: number
  humidity: number
  precipitation: number
  description: string
  wind_speed: number
}

interface Coordinates {
  latitude: number
  longitude: number
}

export async function getWeatherForecast(
  coordinates: Coordinates, 
  days: number = 15
): Promise<WeatherData[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  
  console.log('Weather service - API Key exists:', !!apiKey)
  console.log('Weather service - Coordinates:', coordinates)
  
  if (!apiKey) {
    console.error('ERROR: Falta OPENWEATHER_API_KEY en .env.local')
    return []
  }

  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    console.error('ERROR: Coordenadas inválidas:', coordinates)
    return []
  }

  try {
    // URL correcta para la API de OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}&units=metric&lang=es`
    
    console.log('Fetching weather from:', url.replace(apiKey, 'API_KEY_HIDDEN'))
    
    const response = await axios.get(url)
    
    if (!response.data || !response.data.list) {
      console.error('Respuesta inválida de OpenWeather:', response.data)
      return []
    }
    
    const forecast: WeatherData[] = []
    const data = response.data.list
    
    console.log(`OpenWeather response: ${data.length} items`)
    
    // Procesar datos (API gratuita da cada 3 horas, máximo 5 días)
    // Tomamos uno cada 8 items (cada 24 horas)
    for (let i = 0; i < Math.min(data.length, 40); i += 8) {
      const day = data[i]
      if (!day) continue
      
      forecast.push({
        date: day.dt_txt,
        temp_max: day.main?.temp_max || 0,
        temp_min: day.main?.temp_min || 0,
        humidity: day.main?.humidity || 0,
        precipitation: day.rain ? (day.rain['3h'] || 0) : 0,
        description: day.weather?.[0]?.description || 'Sin datos',
        wind_speed: day.wind?.speed || 0
      })
    }
    
    console.log(`Weather forecast processed: ${forecast.length} days`)
    return forecast
    
  } catch (error) {
    // Verificar si es un error de Axios
    if (axios.isAxiosError(error)) {
      console.error('ERROR obteniendo clima:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      // Si es error 401, la API key es inválida
      if (error.response?.status === 401) {
        console.error('API Key inválida. Verifica tu OPENWEATHER_API_KEY en .env.local')
      }
    } else if (error instanceof Error) {
      // Si es otro tipo de Error
      console.error('ERROR obteniendo clima:', {
        message: error.message
      })
    } else {
      // Error desconocido
      console.error('ERROR obteniendo clima: Error desconocido', error)
    }
    
    return []
  }
}

// Análisis específico para agricultura
export function analyzeWeatherForAgriculture(weather: WeatherData[]) {
  const analysis = {
    rainy_days: [] as string[],
    dry_periods: [] as { start: string, end: string }[],
    optimal_planting_days: [] as string[],
    risky_days: [] as { date: string, risk: string }[],
    irrigation_needed: [] as string[]
  }
  
  if (!weather || weather.length === 0) {
    console.log('No hay datos de clima para analizar')
    return analysis
  }
  
  weather.forEach((day, index) => {
    // Días lluviosos (más de 5mm de lluvia)
    if (day.precipitation > 5) {
      analysis.rainy_days.push(day.date)
      analysis.risky_days.push({
        date: day.date,
        risk: `Lluvia fuerte (${day.precipitation}mm) - evitar fumigación y fertilización`
      })
    }
    
    // Días óptimos para siembra (temperatura moderada, humedad adecuada)
    if (day.temp_max < 30 && day.temp_min > 15 && day.humidity > 60 && day.humidity < 85) {
      analysis.optimal_planting_days.push(day.date)
    }
    
    // Días que necesitan riego (poca lluvia, alta temperatura)
    if (day.precipitation < 2 && day.temp_max > 28) {
      analysis.irrigation_needed.push(day.date)
    }
    
    // Riesgos por temperatura extrema
    if (day.temp_max > 35) {
      analysis.risky_days.push({
        date: day.date,
        risk: `Temperatura extrema (${day.temp_max}°C) - aumentar riego y evitar trasplantes`
      })
    }
    
    if (day.temp_min < 10) {
      analysis.risky_days.push({
        date: day.date,
        risk: `Posible helada (${day.temp_min}°C) - proteger cultivos sensibles`
      })
    }
    
    // Riesgo por viento fuerte
    if (day.wind_speed > 10) {
      analysis.risky_days.push({
        date: day.date,
        risk: `Viento fuerte (${day.wind_speed} m/s) - evitar fumigación`
      })
    }
  })
  
  console.log('Weather analysis completed:', {
    rainy_days: analysis.rainy_days.length,
    irrigation_needed: analysis.irrigation_needed.length,
    risky_days: analysis.risky_days.length
  })
  
  return analysis
}