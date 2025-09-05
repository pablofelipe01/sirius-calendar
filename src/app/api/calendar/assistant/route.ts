import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getWeatherForecast, analyzeWeatherForAgriculture } from '@/lib/weather/service'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Definir tipos para las actividades
interface Activity {
  id: string
  name: string
  type: string
  scheduled_date: string
  duration: number
  priority: string
  status: string
}

// Definir tipos para las sugerencias
interface Suggestion {
  type: 'warning' | 'optimization' | 'recommendation'
  priority: 'high' | 'medium' | 'low'
  text: string
  action: {
    activity_id: string
    recommended_date: string
    reason: string
  }
}

// Definir tipo para los días de riesgo
interface RiskyDay {
  date: string
  risk: string
}

export async function POST(request: Request) {
  // Crear cliente de Supabase si lo necesitas
  const supabase = createRouteHandlerClient({ cookies })
  
  const { activities, coordinates, context } = await request.json()
  
  console.log('Assistant API - Received coordinates:', coordinates)
  console.log('Assistant API - API Key exists:', !!process.env.OPENWEATHER_API_KEY)
  
  // Validar coordenadas
  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    console.error('Assistant API - Invalid coordinates')
    return NextResponse.json({
      error: 'Se requieren coordenadas válidas',
      suggestions: [],
      weather_alerts: ['No se pudo obtener el pronóstico sin coordenadas']
    }, { status: 400 })
  }
  
  // Obtener pronóstico del clima con las coordenadas proporcionadas
  console.log('Assistant API - Fetching weather forecast...')
  const weatherForecast = await getWeatherForecast(coordinates, 15)
  console.log(`Assistant API - Weather forecast received: ${weatherForecast.length} days`)
  
  const weatherAnalysis = analyzeWeatherForAgriculture(weatherForecast)
  console.log('Assistant API - Weather analysis completed')
  
  // Si no hay datos del clima, informar al usuario
  if (weatherForecast.length === 0) {
    console.warn('Assistant API - No weather data available')
  }
  
  // Log de ubicación
  console.log(`Analizando clima para ubicación: ${coordinates.latitude}, ${coordinates.longitude}`)

  // Prepara el contexto mejorado con datos del clima y ubicación
  const prompt = `
    Eres un experto agrónomo especializado en CULTIVO DE PALMA AFRICANA con 20 años de experiencia. 
    Analiza este calendario considerando las condiciones climáticas reales y las necesidades específicas de la palma.
    
    UBICACIÓN DE LA FINCA:
    - Latitud: ${coordinates.latitude}
    - Longitud: ${coordinates.longitude}
    - CULTIVO: PALMA AFRICANA (Elaeis guineensis)
    
    ACTIVIDADES PROGRAMADAS:
    ${JSON.stringify(activities.map((a: Activity) => ({
      id: a.id,
      nombre: a.name,
      tipo: a.type,
      fecha: a.scheduled_date,
      duracion_horas: a.duration / 60,
      prioridad: a.priority
    })), null, 2)}
    
    PRONÓSTICO DEL CLIMA (próximos días) para esta ubicación:
    ${JSON.stringify(weatherForecast, null, 2)}
    
    ANÁLISIS CLIMÁTICO PARA AGRICULTURA:
    - Días con lluvia fuerte: ${weatherAnalysis.rainy_days.join(', ') || 'Ninguno'}
    - Días óptimos para siembra: ${weatherAnalysis.optimal_planting_days.join(', ') || 'Ninguno'}
    - Días que requieren riego: ${weatherAnalysis.irrigation_needed.join(', ') || 'Ninguno'}
    - Riesgos climáticos: ${JSON.stringify(weatherAnalysis.risky_days)}
    
    REGLAS AGRÍCOLAS CRÍTICAS CONSIDERANDO EL CLIMA:
    1. NUNCA fumigar si hay lluvia en las próximas 24-48 horas (el producto se lava)
    2. NO fertilizar antes de lluvia fuerte (pérdida de nutrientes)
    3. AUMENTAR riego en días con temperatura > 30°C
    4. EVITAR siembra en días con lluvia torrencial
    5. PROTEGER cultivos si hay riesgo de heladas (temp < 10°C)
    6. APROVECHAR días con lluvia moderada para reducir riego
    7. NO cosechar en días muy lluviosos (daño al producto)
    8. ADELANTAR fumigación si se pronostica periodo lluvioso largo
    9. POSPONER trasplantes en días de calor extremo (>35°C)
    10. PROGRAMAR mantenimiento de equipos en días lluviosos
    
    REGLAS ESPECÍFICAS PARA PALMA AFRICANA:
    1. Aplicación Preventiva de Biológicos cada 15-21 días durante época lluviosa
    2. Control de Plagas más frecuente en época seca (cada 10-14 días)
    3. Mantenimiento de maquinaria antes y después de temporadas intensivas
    4. NO aplicar biológicos con temperaturas >32°C (pierden efectividad)
    5. Control de plagas temprano en la mañana (6-9 AM) para mayor efectividad
    6. Reparación de maquinaria en días lluviosos cuando no se puede trabajar el campo
    7. Aplicar biológicos 24-48 horas antes de lluvia para mejor adherencia
    8. Control de plagas debe evitar días con viento >8 m/s (deriva del producto)
    
    CONTEXTO ESTACIONAL PARA PALMA:
    - Época seca: Mayor incidencia de plagas, requiere control más frecuente
    - Época lluviosa: Ideal para biológicos, mayor crecimiento vegetativo
    - Transición seca-lluvia: Momento crítico para mantenimiento preventivo
    
    ANALIZA Y DEVUELVE:
    1. Conflictos entre actividades programadas y pronóstico del clima
    2. Sugerencias de reprogramación basadas en condiciones climáticas
    3. Optimizaciones para aprovechar o evitar condiciones climáticas
    4. Alertas de riesgo por clima adverso
    
    IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido.
    {
      "suggestions": [
        {
          "type": "warning|optimization|recommendation",
          "priority": "high|medium|low",
          "text": "descripción clara del problema relacionado con el clima",
          "action": {
            "activity_id": "id de la actividad afectada",
            "recommended_date": "nueva fecha ISO sugerida basada en clima",
            "reason": "explicación de cómo el clima afecta esta actividad"
          }
        }
      ],
      "weather_alerts": ["alertas específicas del clima"],
      "critical_errors": ["errores que el clima empeora"],
      "risk_analysis": "análisis de riesgos considerando clima y actividades"
    }
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un agrónomo experto que analiza calendarios agrícolas considerando pronósticos meteorológicos reales. Responde SIEMPRE con JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2500,
    })

    const response = completion.choices[0].message.content
    const suggestions = JSON.parse(response?.trim() || '{}')
    
    // Agregar información del clima al response
    suggestions.weather_data = {
      forecast_days: weatherForecast.length,
      rainy_days: weatherAnalysis.rainy_days.length,
      irrigation_needed: weatherAnalysis.irrigation_needed.length
    }

    // En la respuesta, incluir información de la ubicación
    suggestions.location_info = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      weather_data: {
        forecast_days: weatherForecast.length,
        rainy_days: weatherAnalysis.rainy_days.length,
        irrigation_needed: weatherAnalysis.irrigation_needed.length
      }
    }

    console.log('IA Analysis con clima exitoso:', {
      totalSuggestions: suggestions.suggestions?.length || 0,
      weatherAlerts: suggestions.weather_alerts?.length || 0
    })

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error con OpenAI:', error)
    
    // Fallback con análisis básico del clima
    return NextResponse.json({
      suggestions: [{
        type: 'warning',
        priority: 'high',
        text: 'No se pudo completar el análisis con IA, pero se detectaron condiciones climáticas importantes.',
        action: {
          activity_id: '',
          recommended_date: '',
          reason: `Días con lluvia próximos: ${weatherAnalysis.rainy_days.join(', ')}. Revise fumigaciones y fertilizaciones.`
        }
      }],
      weather_alerts: weatherAnalysis.risky_days.map((r: RiskyDay) => r.risk),
      critical_errors: ['Revisar actividades vs pronóstico del clima'],
      risk_analysis: 'Análisis limitado. Considere el pronóstico del clima al programar actividades.',
      weather_data: {
        forecast_days: weatherForecast.length,
        rainy_days: weatherAnalysis.rainy_days.length,
        irrigation_needed: weatherAnalysis.irrigation_needed.length
      }
    })
  }
}

// En la función analyzeManually, agrega estos casos específicos para Palma:
function analyzeManually(activities: Activity[]) {
  const suggestions: Suggestion[] = []
  const critical_errors: string[] = []
  
  // NUEVOS análisis específicos para Palma
  activities.forEach((activity) => {
    // Verificar aplicación de biológicos en temperatura alta
    if (activity.type === 'aplicacion_biologicos') {
      suggestions.push({
        type: 'recommendation',
        priority: 'medium',
        text: `${activity.name}: Verificar temperatura del día. Los biológicos pierden efectividad >32°C`,
        action: {
          activity_id: activity.id,
          recommended_date: activity.scheduled_date,
          reason: 'Aplicar biológicos en horas frescas del día (antes 9 AM o después 4 PM)'
        }
      })
    }
    
    // Verificar control de plagas en días ventosos
    if (activity.type === 'control_plagas') {
      suggestions.push({
        type: 'recommendation',
        priority: 'medium',
        text: `${activity.name}: Verificar condiciones de viento. Evitar días >8 m/s`,
        action: {
          activity_id: activity.id,
          recommended_date: activity.scheduled_date,
          reason: 'El viento fuerte causa deriva del producto y reduce efectividad'
        }
      })
    }
  })
  
  return {
    suggestions: suggestions.length > 0 ? suggestions : [{
      type: 'recommendation' as const,
      priority: 'medium' as const,
      text: 'Análisis básico para cultivo de Palma completado.',
      action: {
        activity_id: '',
        recommended_date: '',
        reason: 'Considere: aplicar biológicos en temperaturas frescas, controlar plagas sin viento, y mantener maquinaria en días lluviosos.'
      }
    }],
    critical_errors: critical_errors.length > 0 ? critical_errors : ['Revisar calendario específico para Palma'],
    risk_analysis: 'Análisis adaptado para cultivo de Palma Africana. Considere condiciones climáticas específicas para cada tipo de aplicación.'
  }
}