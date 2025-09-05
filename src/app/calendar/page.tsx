'use client'

import { ActionButton, LoadingSpinner } from '@/components/ActionButton'
import { useEffect, useState, FormEvent, useMemo } from 'react'

interface Activity {
  id: string
  name: string
  type: string
  scheduled_date: string
  duration: number
  priority: string
  status: string
  reason?: string
  planned_hectares?: number  // Hectáreas planificadas
  completed_hectares?: number  // Hectáreas realizadas
}

// Interfaz para eventos de reprogramación
interface RescheduleEvent {
  id: string
  activity_id: string
  old_date: string
  new_date: string
  reason: string
  created_at: string
}

// Tipos para las sugerencias de IA
interface IASuggestionAction {
  activity_id?: string
  recommended_date?: string
  reason: string
}

interface IASuggestion {
  type: 'warning' | 'optimization' | 'recommendation'
  priority: 'high' | 'medium' | 'low'
  text: string
  action?: IASuggestionAction
}

interface IAResponse {
  suggestions: IASuggestion[]
  critical_errors?: string[]
  risk_analysis?: string
  weather_alerts?: string[]
  location_info?: {
    latitude: number
    longitude: number
    weather_data: {
      forecast_days: number
      rainy_days: number
      irrigation_needed: number
    }
  }
}

const initialForm = {
  name: '',
  type: 'aplicacion_biologicos',
  scheduled_date: '',
  duration: 240, // 4 horas por defecto para aplicaciones de palma
  priority: 'media',
  status: 'programada',
}

// Función para formatear fecha y hora
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Función para obtener color del estado
function getStatusColor(status: string): string {
  switch (status) {
    case 'completada':
      return 'bg-green-900 text-green-300'
    case 'aplazada':
      return 'bg-yellow-900 text-yellow-300'
    case 'suspendida':
      return 'bg-red-900 text-red-300'
    case 'programada':
      return 'bg-blue-900 text-blue-300'
    case 'cancelada':
      return 'bg-red-900 text-red-300'
    default:
      return 'bg-gray-900 text-gray-300'
  }
}

// Función para obtener información visual del estado
function getStatusInfo(status: string) {
  switch (status) {
    case 'completada':
      return { 
        badge: 'bg-green-900 text-green-300', 
        icon: '✅', 
        description: 'Completada' 
      }
    case 'aplazada':
      return { 
        badge: 'bg-yellow-900 text-yellow-300', 
        icon: '⏳', 
        description: 'Aplazada' 
      }
    case 'suspendida':
      return { 
        badge: 'bg-red-900 text-red-300', 
        icon: '⏸️', 
        description: 'Suspendida' 
      }
    case 'programada':
      return { 
        badge: 'bg-blue-900 text-blue-300', 
        icon: '📅', 
        description: 'Programada' 
      }
    default:
      return { 
        badge: 'bg-gray-900 text-gray-300', 
        icon: '❓', 
        description: status 
      }
  }
}

// Componente StatusBadge (UNA SOLA DECLARACIÓN)
function StatusBadge({ status }: { status: string }) {
  const statusInfo = getStatusInfo(status)
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.badge}`}>
      {statusInfo.icon} {statusInfo.description}
    </span>
  )
}

// Función mejorada para obtener información específica de cada actividad incluyendo colores por bloque
function getActivityInfo(type: string, activityName: string = '') {
  // Colores únicos para cada bloque
  const blockColors = {
    'Bloque 90': 'text-indigo-400',  // PRIMERO el bloque 90
    'Bloque 11': 'text-red-400',
    'Bloque 9': 'text-yellow-400',   // DESPUÉS el bloque 9
    'Bloque 2': 'text-emerald-400',
    'Bloque 3': 'text-blue-400', 
    'Bloque 4': 'text-purple-400',
    'Bloque 5': 'text-pink-400',
    'Bloque 6': 'text-orange-400',
    'Bloque 7': 'text-cyan-400'
  }

  // Función mejorada para detectar el bloque en el nombre de la actividad
  function getBlockColor(name: string): string {
    // Buscar primero patrones más específicos (números de 2 dígitos) antes que los de 1 dígito
    const blockPatterns = [
      'Bloque 90', // Primero los de 2 dígitos
      'Bloque 11',
      'Bloque 2',  // Después los de 1 dígito
      'Bloque 3',
      'Bloque 4',
      'Bloque 5',
      'Bloque 6',
      'Bloque 7',
      'Bloque 9'
    ]
    
    for (const pattern of blockPatterns) {
      if (name.includes(pattern)) {
        return blockColors[pattern as keyof typeof blockColors]
      }
    }
    
    // Color por defecto según el tipo si no se encuentra bloque
    switch (type) {
      case 'aplicacion_biologicos': return 'text-green-400'
      case 'control_plagas': return 'text-red-400'
      case 'reparacion_maquinaria': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  switch (type) {
    case 'aplicacion_biologicos':
      return { 
        icon: '🧪', 
        description: 'Biológicos', 
        color: getBlockColor(activityName) 
      }
    case 'control_plagas':
      return { 
        icon: '🐛', 
        description: 'Control Plagas', 
        color: getBlockColor(activityName) 
      }
    case 'reparacion_maquinaria':
      return { 
        icon: '🔧', 
        description: 'Mantenimiento', 
        color: getBlockColor(activityName) 
      }
    default:
      return { 
        icon: '📋', 
        description: type, 
        color: 'text-gray-400' 
      }
  }
}

// Función para agrupar actividades por mes
function groupByMonth(activities: Activity[]) {
  if (!activities || !Array.isArray(activities)) {
    console.warn('groupByMonth: activities no es un array válido:', activities)
    return {}
  }

  return activities.reduce((groups: { [key: string]: Activity[] }, activity) => {
    const date = new Date(activity.scheduled_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!groups[monthKey]) {
      groups[monthKey] = []
    }
    groups[monthKey].push(activity)
    
    return groups
  }, {})
}

// Funciones de utilidad para cálculos de progreso
function extractBlockNumber(name: string): number | null {
  const match = name.match(/Bloque (\d+)/)
  return match ? parseInt(match[1]) : null
}

function getCycleFromDate(date: string): { name: string; number: number } | null {
  const month = new Date(date).getMonth() + 1
  
  if ([2, 3].includes(month)) {
    return { name: 'Feb-Mar', number: 1 }
  } else if ([5, 6].includes(month)) {
    return { name: 'May-Jun', number: 2 }
  } else if ([8, 9].includes(month)) {
    return { name: 'Aug-Sep', number: 3 }
  } else if ([11, 12].includes(month)) {
    return { name: 'Nov-Dec', number: 4 }
  }
  
  return null
}

// Función para calcular estadísticas por bloque
function calculateBlockStatistics(activities: Activity[]) {
  const blockStats: { [key: number]: {
    blockNumber: number
    totalActivities: number
    completedActivities: number
    plannedHectares: number
    completedHectares: number
    pendingHectares: number
    progressPercentage: number
    cycles: { [key: string]: { activities: number; completed: number } }
  }} = {}

  activities.forEach(activity => {
    const blockNumber = extractBlockNumber(activity.name)
    const cycle = getCycleFromDate(activity.scheduled_date)
    
    if (blockNumber && cycle) {
      if (!blockStats[blockNumber]) {
        blockStats[blockNumber] = {
          blockNumber,
          totalActivities: 0,
          completedActivities: 0,
          plannedHectares: 0,
          completedHectares: 0,
          pendingHectares: 0,
          progressPercentage: 0,
          cycles: {}
        }
      }

      const stats = blockStats[blockNumber]
      stats.totalActivities++
      stats.plannedHectares += activity.planned_hectares || 60

      if (activity.status === 'completada') {
        stats.completedActivities++
        stats.completedHectares += activity.completed_hectares || 0
      }

      // Estadísticas por ciclo
      if (!stats.cycles[cycle.name]) {
        stats.cycles[cycle.name] = { activities: 0, completed: 0 }
      }
      stats.cycles[cycle.name].activities++
      if (activity.status === 'completada') {
        stats.cycles[cycle.name].completed++
      }
    }
  })

  // Calcular porcentajes y hectáreas pendientes
  Object.values(blockStats).forEach(stats => {
    stats.pendingHectares = stats.plannedHectares - stats.completedHectares
    stats.progressPercentage = stats.plannedHectares > 0 
      ? Math.round((stats.completedHectares / stats.plannedHectares) * 100)
      : 0
  })

  return blockStats
}

// Función para calcular estadísticas generales
function calculateGeneralStatistics(activities: Activity[]) {
  const stats = {
    totalActivities: activities.length,
    completedActivities: activities.filter(a => a.status === 'completada').length,
    programmedActivities: activities.filter(a => a.status === 'programada').length,
    deferredActivities: activities.filter(a => a.status === 'aplazada').length,
    totalPlannedHectares: activities.reduce((sum, a) => sum + (a.planned_hectares || 60), 0),
    totalCompletedHectares: activities.reduce((sum, a) => sum + (a.completed_hectares || 0), 0),
    totalPendingHectares: 0,
    overallProgress: 0
  }

  stats.totalPendingHectares = stats.totalPlannedHectares - stats.totalCompletedHectares
  stats.overallProgress = stats.totalPlannedHectares > 0 
    ? Math.round((stats.totalCompletedHectares / stats.totalPlannedHectares) * 100)
    : 0

  return stats
}

// Función para obtener estilos del estado
function getStatusStyles(status: string): string {
  switch (status) {
    case 'completada':
      return 'border-green-500 bg-green-900/20'
    case 'aplazada':
      return 'border-yellow-500 bg-yellow-900/20'
    case 'programada':
      return 'border-blue-500 bg-blue-900/20'
    default:
      return 'border-gray-500 bg-gray-900/20'
  }
}

// Componente ActivityCard CORREGIDO
function ActivityCard({ 
  activity, 
  onView, 
  onComplete,  // ✅ Esta función debe abrir el modal con hectáreas
  onDefer, 
  onDelete, 
  loading = false 
}: {
  activity: Activity
  onView: () => void
  onComplete: (activity: Activity) => void  // ✅ Cambiar el tipo para recibir la actividad completa
  onDefer: (activity: Activity) => void
  onDelete: (id: string) => void
  loading?: boolean
}) {
  const activityInfo = getActivityInfo(activity.type, activity.name)
  const date = new Date(activity.scheduled_date)
  
  return (
    <div 
      className={`border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${getStatusStyles(activity.status)}`}
      onClick={onView}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{activityInfo.icon}</span>
          <span className={`text-sm font-medium ${activityInfo.color}`}>
            {activityInfo.description}
          </span>
        </div>
        <StatusBadge status={activity.status} />
      </div>
      
      <h3 className="font-semibold text-white mb-2 line-clamp-2">
        {activity.name}
      </h3>
      
      {/* Información simplificada - solo fecha (sin hora) */}
      <div className="space-y-1 text-sm text-gray-300 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-400">📅</span>
          <span>{date.toLocaleDateString('es-ES', { 
            weekday: 'long',
            day: 'numeric', 
            month: 'long'
          })}</span>
        </div>
      </div>

      {/* Información de hectáreas */}
      {activity.planned_hectares && (
        <div className="bg-gray-700/50 p-2 rounded text-xs mb-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Hectáreas:</span>
            <span className={`font-semibold ${
              activity.status === 'completada' 
                ? activity.completed_hectares 
                  ? (activity.completed_hectares === activity.planned_hectares ? 'text-green-400' : 
                     activity.completed_hectares > activity.planned_hectares ? 'text-green-400' : 'text-yellow-400')
                  : 'text-gray-400'
                : 'text-blue-400'
            }`}>
              {activity.status === 'completada' && activity.completed_hectares
                ? `${activity.completed_hectares}ha`
                : `${activity.planned_hectares}ha`
              }
              {activity.status === 'completada' && activity.completed_hectares && 
               activity.completed_hectares !== activity.planned_hectares && (
                <span className="text-xs ml-1">
                  de {activity.planned_hectares}ha {activity.completed_hectares > activity.planned_hectares ? '+' : ''}{Math.abs(activity.completed_hectares - activity.planned_hectares).toFixed(1) !== '0.0' ? (activity.completed_hectares > activity.planned_hectares ? '+' : '') + (activity.completed_hectares - activity.planned_hectares).toFixed(1) : ''}
                </span>
              )}
            </span>
          </div>
          {activity.status === 'completada' && activity.completed_hectares && 
           activity.completed_hectares !== activity.planned_hectares && (
            <div className="text-xs text-gray-500 mt-1">
              {activity.completed_hectares > activity.planned_hectares ? '📈' : '📉'} 
              {activity.completed_hectares > activity.planned_hectares ? 'Exceso' : 'Déficit'}: 
              {Math.abs(activity.completed_hectares - activity.planned_hectares).toFixed(1)}ha
            </div>
          )}
        </div>
      )}
      
      {/* Botones de acción CORREGIDOS */}
      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
        {activity.status === 'programada' && (
          <>
            <button
              onClick={() => onComplete(activity)} // ✅ CORREGIDO - pasa la actividad completa
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
            >
              ✅ Completar
            </button>
            <button
              onClick={() => onDefer(activity)}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-medium"
            >
              🕐 Aplazar
            </button>
          </>
        )}
        
        {activity.status === 'aplazada' && (
          <button
            onClick={() => onComplete(activity)} // ✅ CORREGIDO - pasa la actividad completa
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
          >
            ✅ Completar
          </button>
        )}
        
        {activity.status !== 'completada' && (
          <button
            onClick={() => onDelete(activity.id)}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-3 py-1 rounded text-xs font-medium"
          >
            {loading ? '...' : '🗑️'}
          </button>
        )}
      </div>
    </div>
  )
}

// Modal para reprogramar actividad
function ReprogramModal({
  activity,
  onClose,
  onReprogram,
  loading = false,
}: {
  activity: Activity
  onClose: () => void
  onReprogram: (date: string) => void
  loading?: boolean
}) {
  const [selectedDate, setSelectedDate] = useState('')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border rounded p-8 max-w-md w-full text-gray-100 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Reprogramar: {activity.name}</h2>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Nueva fecha y hora:</label>
          <input
            type="datetime-local"
            className="border rounded px-2 py-1 w-full bg-gray-900 text-gray-100"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
        <ActionButton
          className="bg-green-600 text-white px-4 py-2 rounded"
          loading={loading}
          disabled={!selectedDate || loading}
          onClick={() => onReprogram(selectedDate)}
        >
          Reprogramar
        </ActionButton>
      </div>
    </div>
  )
}

// Componente del modal del Asistente IA
function IAAssistantModal({
  activities,
  coordinates,
  onClose,
  onApply,
}: {
  activities: Activity[]
  coordinates: { latitude: number; longitude: number }
  onClose: () => void
  onApply: (suggestions: IAResponse) => void
}) {
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<IAResponse>({ suggestions: [] })

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true)
      const res = await fetch('/api/calendar/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          activities,
          coordinates,
          context: 'Optimiza el calendario para cultivo de Palma Africana'
        }),
      })
      const data: IAResponse = await res.json()
      setSuggestions(data)
      setLoading(false)
    }
    fetchSuggestions()
  }, [activities, coordinates])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border rounded p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto text-gray-100 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          🤖 Asistente IA - Especialista en Palma Africana
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size={32} />
          </div>
        ) : (
          <>
            {/* Información de ubicación y contexto climático */}
            {suggestions.location_info && (
              <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  📍 Ubicación y Contexto Climático:
                </h4>
                <div className="text-xs text-gray-400 grid grid-cols-2 gap-2">
                  <div>🌍 Lat: {suggestions.location_info.latitude.toFixed(4)}</div>
                  <div>🌍 Lon: {suggestions.location_info.longitude.toFixed(4)}</div>
                  <div>📅 Pronóstico: {suggestions.location_info.weather_data.forecast_days} días</div>
                  <div>🌧️ Días lluvia: {suggestions.location_info.weather_data.rainy_days}</div>
                </div>
              </div>
            )}

            {/* Alertas del Clima específicas para Palma */}
            {suggestions.weather_alerts && suggestions.weather_alerts.length > 0 && (
              <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500 rounded">
                <h3 className="font-bold text-blue-400 mb-2">🌦️ ALERTAS METEOROLÓGICAS PARA PALMA:</h3>
                <ul className="list-disc list-inside">
                  {suggestions.weather_alerts.map((alert: string, idx: number) => (
                    <li key={idx} className="text-blue-300">{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Errores Críticos */}
            {suggestions.critical_errors && suggestions.critical_errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded">
                <h3 className="font-bold text-red-400 mb-2">⚠️ ERRORES CRÍTICOS PARA PALMA DETECTADOS:</h3>
                <ul className="list-disc list-inside">
                  {suggestions.critical_errors.map((error, idx) => (
                    <li key={idx} className="text-red-300">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Análisis de Riesgos */}
            {suggestions.risk_analysis && (
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded">
                <h3 className="font-bold text-yellow-400 mb-2">📊 Análisis de Riesgos para Palma Africana:</h3>
                <p className="text-gray-300">{suggestions.risk_analysis}</p>
              </div>
            )}

            {/* Sugerencias */}
            <h3 className="font-bold mb-3">📋 Sugerencias y Correcciones:</h3>
            <div className="space-y-4 mb-6">
              {suggestions.suggestions?.map((s: IASuggestion, idx: number) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded border ${
                    s.priority === 'high' ? 'border-red-500 bg-red-900/20' :
                    s.priority === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                    'border-blue-500 bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">
                      {s.type === 'warning' ? '⚠️' : 
                       s.type === 'optimization' ? '⚡' : '💡'}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">{s.text}</p>
                      {s.action && (
                        <div className="bg-black/30 rounded p-3 mt-2">
                          <p className="text-sm text-green-400 font-semibold">
                            ✅ Acción Recomendada:
                          </p>
                          <p className="text-sm text-gray-300 mt-1">
                            {s.action.reason}
                          </p>
                          {s.action.recommended_date && (
                            <p className="text-sm text-blue-400 mt-1">
                              📅 Nueva fecha sugerida: {new Date(s.action.recommended_date).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <ActionButton
                className="bg-green-600 text-white px-4 py-2"
                onClick={() => onApply(suggestions)}
              >
                ✅ Aplicar todas las correcciones
              </ActionButton>
              <ActionButton
                className="bg-gray-600 text-white px-4 py-2"
                onClick={onClose}
              >
                Cerrar
              </ActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Componente Dashboard de Progreso
function ProgressDashboard({ 
  activities, 
  onBlockFilter, 
  selectedBlock 
}: { 
  activities: Activity[]
  onBlockFilter: (blockNumber: number | null) => void
  selectedBlock: number | null
}) {
  const blockStats = calculateBlockStatistics(activities)
  const generalStats = calculateGeneralStatistics(activities)

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📊 Dashboard de Progreso
      </h2>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-900/30 p-4 rounded border border-blue-600">
          <div className="text-2xl font-bold text-blue-300">{generalStats.totalActivities}</div>
          <div className="text-sm text-blue-400">Total Actividades</div>
        </div>
        <div className="bg-green-900/30 p-4 rounded border border-green-600">
          <div className="text-2xl font-bold text-green-300">{generalStats.completedActivities}</div>
          <div className="text-sm text-green-400">Completadas</div>
        </div>
        <div className="bg-yellow-900/30 p-4 rounded border border-yellow-600">
          <div className="text-2xl font-bold text-yellow-300">{generalStats.programmedActivities}</div>
          <div className="text-sm text-yellow-400">Programadas</div>
        </div>
        <div className="bg-red-900/30 p-4 rounded border border-red-600">
          <div className="text-2xl font-bold text-red-300">{generalStats.deferredActivities}</div>
          <div className="text-sm text-red-400">Aplazadas</div>
        </div>
      </div>

      {/* Progreso General de Hectáreas */}
      <div className="bg-gray-700 p-4 rounded mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold">Progreso General de Hectáreas</span>
          <span className="text-white font-bold">{generalStats.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${generalStats.overallProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mt-1">
          <span>{generalStats.totalCompletedHectares.toLocaleString()} ha completadas</span>
          <span>{generalStats.totalPlannedHectares.toLocaleString()} ha planificadas</span>
        </div>
      </div>

      {/* Progreso por Bloques */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">📈 Progreso por Bloques</h3>
          <button
            onClick={() => onBlockFilter(null)}
            className={`px-3 py-1 rounded text-sm ${
              selectedBlock === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Todos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(blockStats)
            .sort((a, b) => a.blockNumber - b.blockNumber)
            .map(block => (
              <div 
                key={block.blockNumber}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  selectedBlock === block.blockNumber
                    ? 'bg-blue-900/40 border-blue-500'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
                onClick={() => onBlockFilter(
                  selectedBlock === block.blockNumber ? null : block.blockNumber
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">Bloque {block.blockNumber}</span>
                  <span className="text-sm text-gray-300">
                    {block.completedActivities}/{block.totalActivities}
                  </span>
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      block.progressPercentage === 100 
                        ? 'bg-green-500' 
                        : block.progressPercentage > 50
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${block.progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{block.completedHectares}ha / {block.plannedHectares}ha</span>
                  <span>{block.progressPercentage}%</span>
                </div>

                {/* Información por ciclos */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {Object.entries(block.cycles).map(([cycleName, cycleData]) => (
                    <div key={cycleName} className="text-xs">
                      <div className="text-gray-300">{cycleName}</div>
                      <div className="text-gray-400">
                        {cycleData.completed}/{cycleData.activities}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

// Modal para completar actividad con captura de hectáreas
function CompleteActivityModal({
  activity,
  onClose,
  onConfirm,
  loading = false,
}: {
  activity: Activity
  onClose: () => void
  onConfirm: (completedHectares: number, notes?: string) => void
  loading?: boolean
}) {
  const [completedHectares, setCompletedHectares] = useState<string>(
    activity.planned_hectares?.toString() || '60'
  )
  const [notes, setNotes] = useState('')
  
  const handleSubmit = () => {
    const hectares = parseFloat(completedHectares)
    if (isNaN(hectares) || hectares <= 0) {
      alert('Por favor ingrese un número válido de hectáreas')
      return
    }
    onConfirm(hectares, notes.trim() || undefined)
  }

  const difference = parseFloat(completedHectares) - (activity.planned_hectares || 60)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border rounded p-8 max-w-lg w-full text-gray-100 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold mb-4">✅ Completar Actividad</h2>
        
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-sm text-gray-300">
            <strong>Actividad:</strong> {activity.name}
          </p>
          <p className="text-sm text-gray-400">
            <strong>Fecha:</strong> {new Date(activity.scheduled_date).toLocaleString('es-ES')}
          </p>
          <p className="text-sm text-gray-400">
            <strong>Hectáreas planificadas:</strong> {activity.planned_hectares || 60} ha
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="text-red-400">*</span> Hectáreas realizadas:
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={completedHectares}
              onChange={(e) => setCompletedHectares(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="60"
              required
            />
            
            {/* Mostrar diferencia en tiempo real */}
            {!isNaN(difference) && difference !== 0 && (
              <div className={`mt-2 p-2 rounded text-sm ${
                difference > 0 
                  ? 'bg-green-900/30 border border-green-600 text-green-300'
                  : 'bg-yellow-900/30 border border-yellow-600 text-yellow-300'
              }`}>
                <span className="font-semibold">
                  {difference > 0 ? '📈' : '📉'} Diferencia: 
                  {difference > 0 ? '+' : ''}{difference.toFixed(1)} ha
                </span>
                <div className="text-xs mt-1">
                  {difference > 0 
                    ? '✅ Se realizaron más hectáreas de las planificadas. El calendario se ajustará automáticamente.'
                    : '⚠️ Se realizaron menos hectáreas. Las pendientes se redistribuirán en días posteriores del bloque.'
                  }
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notas adicionales (opcional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="Ej: Condiciones favorables, equipo funcionó correctamente..."
              rows={3}
            />
          </div>
          
          <div className="p-3 bg-blue-900/20 border border-blue-600 rounded">
            <p className="text-xs text-blue-300">
              <strong>💡 Redistribución automática:</strong> Si las hectáreas realizadas difieren de las planificadas, 
              el sistema reorganizará automáticamente las actividades posteriores del mismo bloque para optimizar 
              la secuencia de trabajo.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <ActionButton
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            loading={loading}
            disabled={!completedHectares.trim() || loading}
            onClick={handleSubmit}
          >
            ✅ Confirmar Completada
          </ActionButton>
          <ActionButton
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
            onClick={onClose}
          >
            Cancelar
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

// Modal para aplazar actividad
function DeferActivityModal({
  activity,
  onClose,
  onDefer,
  loading = false,
}: {
  activity: Activity
  onClose: () => void
  onDefer: (date: string, reason: string) => void
  loading?: boolean
}) {
  const [selectedDate, setSelectedDate] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (!selectedDate.trim() || !reason.trim()) {
      alert('Por favor complete todos los campos')
      return
    }
    onDefer(selectedDate, reason)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border rounded p-8 max-w-lg w-full text-gray-100 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold mb-4">🕐 Aplazar Actividad</h2>
        
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-sm text-gray-300">
            <strong>Actividad:</strong> {activity.name}
          </p>
          <p className="text-sm text-gray-400">
            <strong>Fecha actual:</strong> {new Date(activity.scheduled_date).toLocaleString('es-ES')}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="text-red-400">*</span> Nueva fecha y hora:
            </label>
            <input
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="text-red-400">*</span> Motivo del aplazamiento:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
              placeholder="Ej: Condiciones climáticas adversas, problema con equipo..."
              rows={3}
              required
            />
          </div>
          
          <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded">
            <p className="text-xs text-yellow-300">
              <strong>⚡ Reorganización automática:</strong> Al aplazar esta actividad, 
              el sistema reorganizará automáticamente todo el ciclo para mantener la secuencia óptima.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <ActionButton
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2"
            loading={loading}
            disabled={!selectedDate.trim() || !reason.trim() || loading}
            onClick={handleSubmit}
          >
            🕐 Confirmar Aplazamiento
          </ActionButton>
          <ActionButton
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
            onClick={onClose}
          >
            Cancelar
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

// Componente para tarjeta de mes colapsable
function CollapsibleMonthCard({
  monthKey,
  monthName,
  year,
  monthActivities,
  isExpanded,
  onToggle,
  onActivityView,
  onActivityComplete,
  onActivityDefer,
  onActivityDelete,
  deleteLoadingId
}: {
  monthKey: string
  monthName: string
  year: string
  monthActivities: Activity[]
  isExpanded: boolean
  onToggle: () => void
  onActivityView: (activity: Activity) => void
  onActivityComplete: (activity: Activity) => void  // ✅ CORREGIDO - recibe actividad completa
  onActivityDefer: (activity: Activity) => void
  onActivityDelete: (id: string) => void
  deleteLoadingId: string | null
}) {
  const completedCount = monthActivities.filter(a => a.status === 'completada').length
  const pendingCount = monthActivities.filter(a => a.status !== 'completada').length
  const totalHectares = monthActivities.reduce((sum, a) => sum + (a.planned_hectares || 60), 0)
  const completedHectares = monthActivities.reduce((sum, a) => sum + (a.completed_hectares || 0), 0)
  const progressPercentage = totalHectares > 0 ? Math.round((completedHectares / totalHectares) * 100) : 0

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header del mes - siempre visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-750 transition-colors border-b border-gray-700"
        onClick={onToggle}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Icono de expandir/colapsar */}
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
              <span className="text-blue-400 text-lg">▶️</span>
            </div>
            
            {/* Título del mes */}
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {monthName} {year}
            </h2>
          </div>

          {/* Indicador de estado del mes */}
          <div className="flex items-center gap-4">
            {/* Barra de progreso mini */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-16 bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressPercentage === 100 ? 'bg-green-500' : 
                    progressPercentage > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">{progressPercentage}%</span>
            </div>

            {/* Contadores rápidos */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Total:</span>
                <span className="font-semibold text-white">{monthActivities.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">✅</span>
                <span className="text-green-400 font-semibold">{completedCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⏳</span>
                <span className="text-yellow-400 font-semibold">{pendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional en el header (solo cuando está colapsado) */}
        {!isExpanded && (
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
            <div>
              📏 {completedHectares.toLocaleString()} / {totalHectares.toLocaleString()} ha
            </div>
            <div>
              📊 {progressPercentage}% completado
            </div>
            <div>
              🗓️ {monthActivities.length} actividad{monthActivities.length !== 1 ? 'es' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Contenido expandible */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {isExpanded && (
          <div className="p-6">
            {/* Estadísticas detalladas del mes */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 p-3 rounded text-center">
                <div className="text-lg font-bold text-white">{monthActivities.length}</div>
                <div className="text-sm text-gray-400">Total Actividades</div>
              </div>
              <div className="bg-green-900/30 p-3 rounded text-center border border-green-600">
                <div className="text-lg font-bold text-green-400">{completedCount}</div>
                <div className="text-sm text-gray-400">Completadas</div>
              </div>
              <div className="bg-yellow-900/30 p-3 rounded text-center border border-yellow-600">
                <div className="text-lg font-bold text-yellow-400">{pendingCount}</div>
                <div className="text-sm text-gray-400">Pendientes</div>
              </div>
            </div>

            {/* Barra de progreso de hectáreas */}
            <div className="bg-gray-700 p-4 rounded mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Progreso de Hectáreas - {monthName}</span>
                <span className="text-white font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    progressPercentage === 100 ? 'bg-green-500' : 
                    progressPercentage > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-300 mt-1">
                <span>{completedHectares.toLocaleString()} ha completadas</span>
                <span>{totalHectares.toLocaleString()} ha planificadas</span>
              </div>
            </div>

            {/* Grid de actividades */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {monthActivities
                .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
                .map((activity) => (
                  <ActivityCard 
                    key={activity.id} 
                    activity={activity}
                    onView={() => onActivityView(activity)}
                    onComplete={(activity) => onActivityComplete(activity)} // ✅ CORREGIDO - pasa la actividad completa
                    onDefer={onActivityDefer}
                    onDelete={onActivityDelete}
                    loading={deleteLoadingId === activity.id}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [reprogramActivity, setReprogramActivity] = useState<Activity | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null)
  const [reprogramLoading, setReprogramLoading] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [deferActivity, setDeferActivity] = useState<Activity | null>(null)
  const [deferLoading, setDeferLoading] = useState(false)
  const [completeActivity, setCompleteActivity] = useState<Activity | null>(null)
  const [completeLoading, setCompleteLoading] = useState(false)
  const [coordinates, setCoordinates] = useState({
    latitude: 19.4326,
    longitude: -99.1332
  })
  const [showCoordinatesForm, setShowCoordinatesForm] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)

  // Estado para controlar qué meses están expandidos
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  // Estado para controlar si todos los meses están expandidos o colapsados
  const [allExpanded, setAllExpanded] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [])

  // Función para expandir/colapsar todos los meses
  const toggleAllMonths = () => {
    if (allExpanded) {
      // Colapsar todos
      setExpandedMonths(new Set())
      setAllExpanded(false)
    } else {
      // Expandir todos
      const allMonthKeys = Object.keys(groupedActivities)
      setExpandedMonths(new Set(allMonthKeys))
      setAllExpanded(true)
    }
  }

  // Función para alternar un mes específico
  const toggleMonth = (monthKey: string) => {
    const newExpandedMonths = new Set(expandedMonths)
    if (newExpandedMonths.has(monthKey)) {
      newExpandedMonths.delete(monthKey)
    } else {
      newExpandedMonths.add(monthKey)
    }
    setExpandedMonths(newExpandedMonths)
    
    // Actualizar el estado de "todos expandidos"
    const totalMonths = Object.keys(groupedActivities).length
    setAllExpanded(newExpandedMonths.size === totalMonths)
  }

  async function fetchActivities() {
    try {
      setLoading(true)
      const res = await fetch('/api/activities')
      
      if (res.ok) {
        const data = await res.json()
        
        if (Array.isArray(data)) {
          setActivities(data)
        } else {
          console.error('La respuesta de la API no es un array:', data)
          setActivities([])
        }
      } else {
        console.error('Error fetching activities:', res.status)
        setActivities([])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Error al crear la actividad')
      } else {
        setForm(initialForm)
        fetchActivities()
      }
    } catch (error) {
      setError('Error de conexión')
    }
    setSubmitting(false)
  }

  async function deleteActivity(id: string) {
    setDeleteLoadingId(id)
    if (!confirm('¿Seguro que deseas eliminar esta actividad?')) {
      setDeleteLoadingId(null)
      return
    }
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchActivities()
        setSelectedActivity(null)
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
    setDeleteLoadingId(null)
  }

  async function handleStatus(id: string, status: string) {
    setStatusLoadingId(id)
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        fetchActivities()
        setSelectedActivity(null)
      } else {
        const error = await res.json()
        console.error('Error updating status:', error)
        alert('Error al actualizar el estado: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error de conexión al actualizar el estado')
    } finally {
      setStatusLoadingId(null)
    }
  }

  async function handleComplete(activityId: string) {
    setStatusLoadingId(activityId)
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completada' }),
      })
      if (res.ok) {
        fetchActivities()
        setSelectedActivity(null)
      } else {
        const error = await res.json()
        console.error('Error completando actividad:', error)
        alert('Error al marcar como completada: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error de conexión al actualizar el estado')
    } finally {
      setStatusLoadingId(null)
    }
  }

  async function handleDefer(newDate: string, reason: string) {
    if (!deferActivity) return
    
    setDeferLoading(true)
    try {
      const res = await fetch('/api/activities/defer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: deferActivity.id,
          old_date: deferActivity.scheduled_date,
          new_date: newDate,
          reason: reason
        }),
      })
      
      if (res.ok) {
        const result = await res.json()
        console.log('Aplazamiento exitoso:', result)
        setDeferActivity(null)
        setSelectedActivity(null)
        fetchActivities()
      } else {
        const error = await res.json()
        console.error('Error aplazando actividad:', error)
        alert('Error al aplazar actividad: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error deferring activity:', error)
      alert('Error de conexión al aplazar la actividad')
    } finally {
      setDeferLoading(false)
    }
  }

  async function confirmReprogram(date: string) {
    setReprogramLoading(true)
    if (!reprogramActivity) return
    try {
      await fetch(`/api/activities/${reprogramActivity.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'aplazada', new_date: date }),
      })
      setReprogramActivity(null)
      fetchActivities()
    } catch (error) {
      console.error('Error reprogramming activity:', error)
    }
    setReprogramLoading(false)
  }

  async function applyIASuggestions(suggestions: IAResponse) {
    console.log('Aplicando sugerencias:', suggestions)
    if (suggestions.suggestions) {
      for (const suggestion of suggestions.suggestions) {
        if (suggestion.action?.activity_id && suggestion.action?.recommended_date) {
          try {
            await fetch(`/api/activities/${suggestion.action.activity_id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                status: 'reprogramada', 
                new_date: suggestion.action.recommended_date,
                reason: suggestion.action.reason
              }),
            })
          } catch (error) {
            console.error('Error applying suggestion:', error)
          }
        }
      }
    }
    setShowAssistant(false)
    fetchActivities()
  }

  async function handleCompleteWithHectares(completedHectares: number, notes?: string) {
    if (!completeActivity) return
    
    setCompleteLoading(true)
    try {
      const res = await fetch('/api/activities/complete-with-hectares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: completeActivity.id,
          completed_hectares: completedHectares,
          notes: notes
        }),
      })
      
      if (res.ok) {
        const result = await res.json()
        console.log('Actividad completada con redistribución:', result)
        
        // Mostrar mensaje informativo detallado
        let message = '✅ Actividad completada exitosamente.\n'
        
        if (result.hectares_difference !== 0) {
          message += `📊 Diferencia: ${result.hectares_difference > 0 ? '+' : ''}${result.hectares_difference} hectáreas\n`
        }
        
        if (result.redistributed_activities > 0) {
          message += `🔄 Se reorganizaron ${result.redistributed_activities} actividades del Bloque ${result.block_info.blockNumber}\n`
          
          if (result.redistribution_details) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nuevasActividades = result.redistribution_details.filter((d: any) => d.type === 'nueva_actividad')
            if (nuevasActividades.length > 0) {
              message += `➕ Se creó ${nuevasActividades.length} nueva actividad para el excedente\n`
            }
          }
        }
        
        alert(message)
        
        setCompleteActivity(null)
        setSelectedActivity(null)
        fetchActivities() // Recargar todas las actividades
      } else {
        // Manejo mejorado de errores HTTP
        let errorMessage = 'Error desconocido al completar actividad'
        
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
          
          if (errorData.details) {
            errorMessage += `\nDetalles: ${errorData.details}`
          }
        } catch (parseError) {
          // Si no se puede parsear JSON, usar el status
          errorMessage = `Error HTTP ${res.status}: ${res.statusText}`
        }
        
        console.error('Error completando actividad:', errorMessage)
        alert(`❌ Error al completar actividad:\n${errorMessage}`)
      }
    } catch (error) {
      console.error('Error completing activity:', error)
      alert(`❌ Error de conexión al completar la actividad:\n${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setCompleteLoading(false)
    }
  }

  // Función para filtrar por bloque
  const filteredActivities = useMemo(() => {
    if (!Array.isArray(activities)) {
      return []
    }
    
    if (selectedBlock === null) {
      return activities
    }
    
    return activities.filter(activity => {
      const blockNumber = extractBlockNumber(activity.name)
      return blockNumber === selectedBlock
    })
  }, [activities, selectedBlock])

  // Agrupación para vista lista
  const groupedActivities = useMemo(() => {
    if (!Array.isArray(filteredActivities)) {
      console.warn('filteredActivities no es un array en el render:', filteredActivities)
      return {}
    }
    return groupByMonth(filteredActivities)
  }, [filteredActivities])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            🌴 Sirius Calendar - Palma Africana
          </h1>
          <p className="text-gray-400 mt-2">Sistema Inteligente de Gestión Agrícola</p>
        </div>

        {/* Dashboard de Progreso - manteniendo código existente */}
        {!loading && (
          <ProgressDashboard 
            activities={activities}
            onBlockFilter={setSelectedBlock}
            selectedBlock={selectedBlock}
          />
        )}

        {/* Indicador de filtro activo */}
        {selectedBlock !== null && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-300">
                📍 Mostrando solo actividades del <strong>Bloque {selectedBlock}</strong>
              </span>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-blue-400 hover:text-white"
              >
                ✕ Quitar filtro
              </button>
            </div>
          </div>
        )}

        {/* Controles principales */}
        <div className="flex flex-wrap gap-4 justify-center">
          <ActionButton
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
            onClick={() => setShowAssistant(true)}
          >
            🤖 Asistente IA
          </ActionButton>
          <ActionButton
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
            onClick={() => setShowCoordinatesForm(!showCoordinatesForm)}
          >
            📍 {showCoordinatesForm ? 'Ocultar' : 'Configurar'} Ubicación
          </ActionButton>
          
          {/* NUEVO: Botón para expandir/colapsar todos los meses */}
          {Object.keys(groupedActivities).length > 0 && (
            <ActionButton
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg"
              onClick={toggleAllMonths}
            >
              {allExpanded ? '📁 Colapsar Todos' : '📂 Expandir Todos'}
            </ActionButton>
          )}
        </div>

        {/* Formulario de coordenadas - manteniendo código existente */}
        {showCoordinatesForm && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">📍 Configuración de Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Latitud:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={coordinates.latitude}
                  onChange={(e) => setCoordinates(prev => ({
                    ...prev,
                    latitude: parseFloat(e.target.value) || prev.latitude
                  }))}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Longitud:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={coordinates.longitude}
                  onChange={(e) => setCoordinates(prev => ({
                    ...prev,
                    longitude: parseFloat(e.target.value) || prev.longitude
                  }))}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Coordenadas actuales: {coordinates.latitude}, {coordinates.longitude}
            </p>
          </div>
        )}

        {/* Lista de actividades con funcionalidad colapsable */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-4 text-xl">Cargando actividades...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedActivities).map(([monthKey, monthActivities]) => {
              const [year, month] = monthKey.split('-')
              const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
              ]
              const monthName = monthNames[parseInt(month) - 1]

              return (
                <CollapsibleMonthCard
                  key={monthKey}
                  monthKey={monthKey}
                  monthName={monthName}
                  year={year}
                  monthActivities={monthActivities}
                  isExpanded={expandedMonths.has(monthKey)}
                  onToggle={() => toggleMonth(monthKey)}
                  onActivityView={setSelectedActivity}
                  onActivityComplete={setCompleteActivity} // ✅ YA ESTÁ CORRECTO - pasa la función que maneja actividad completa
                  onActivityDefer={setDeferActivity}
                  onActivityDelete={deleteActivity}
                  deleteLoadingId={deleteLoadingId}
                />
              )
            })}
          </div>
        )}

        {/* Modal de detalles de actividad */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border rounded p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-gray-100 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setSelectedActivity(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedActivity.name}</h2>
              
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="font-semibold mb-2 text-blue-400">📅 Programación:</h3>
                  <p className="text-sm">
                    <strong>Fecha:</strong> {formatDateTime(selectedActivity.scheduled_date)}
                  </p>
                  <p className="text-sm">
                    <strong>Duración:</strong> {selectedActivity.duration} minutos
                  </p>
                  <p className="text-sm">
                    <strong>Prioridad:</strong> {selectedActivity.priority}
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="font-semibold mb-2 text-green-400">🔧 Detalles:</h3>
                  <p className="text-sm">
                    <strong>Tipo:</strong> {getActivityInfo(selectedActivity.type, selectedActivity.name).description}
                  </p>
                  <p className="text-sm">
                    <strong>Estado:</strong> <StatusBadge status={selectedActivity.status} />
                  </p>
                  {selectedActivity.reason && (
                    <p className="text-sm mt-2">
                      <strong>Motivo:</strong> {selectedActivity.reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Información de hectáreas */}
              {selectedActivity.planned_hectares && (
                <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600 mb-6">
                  <div className="text-blue-400 font-semibold mb-2">📏 Información de Hectáreas:</div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-400">Planificadas:</span> 
                      <span className="ml-2 text-blue-300">{selectedActivity.planned_hectares} ha</span>
                    </div>
                    {selectedActivity.completed_hectares !== null && selectedActivity.completed_hectares !== undefined && (
                      <>
                        <div>
                          <span className="text-gray-400">Realizadas:</span> 
                          <span className="ml-2 text-green-300">{selectedActivity.completed_hectares} ha</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Diferencia:</span> 
                          <span className={`ml-2 font-semibold ${
                            (selectedActivity.completed_hectares - selectedActivity.planned_hectares) > 0 
                              ? 'text-green-300' 
                              : (selectedActivity.completed_hectares - selectedActivity.planned_hectares) < 0
                                ? 'text-yellow-300'
                                : 'text-gray-300'
                          }`}>
                            {selectedActivity.completed_hectares - selectedActivity.planned_hectares > 0 ? '+' : ''}
                            {selectedActivity.completed_hectares - selectedActivity.planned_hectares} ha
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2 mt-6">
                {/* Botón Completar con hectáreas - disponible para actividades aplazadas y programadas */}
                {(selectedActivity.status === 'aplazada' || selectedActivity.status === 'programada') && (
                  <button
                    onClick={() => {
                      setCompleteActivity(selectedActivity)
                      setSelectedActivity(null)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                  >
                    ✅ Completar
                  </button>
                )}

                {/* Botón Aplazar - solo para actividades programadas */}
                {selectedActivity.status === 'programada' && (
                  <button
                    onClick={() => {
                      setDeferActivity(selectedActivity)
                      setSelectedActivity(null)
                    }}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                  >
                    🕐 Aplazar
                  </button>
                )}

                {selectedActivity.status !== 'completada' && (
                  <button
                    onClick={() => deleteActivity(selectedActivity.id)}
                    disabled={deleteLoadingId === selectedActivity.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {deleteLoadingId === selectedActivity.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        🗑️ Eliminar
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para completar actividad con hectáreas */}
        {completeActivity && (
          <CompleteActivityModal
            activity={completeActivity}
            onClose={() => setCompleteActivity(null)}
            onConfirm={handleCompleteWithHectares}
            loading={completeLoading}
          />
        )}

        {/* Modal para aplazar actividad */}
        {deferActivity && (
          <DeferActivityModal
            activity={deferActivity}
            onClose={() => setDeferActivity(null)}
            onDefer={handleDefer}
            loading={deferLoading}
          />
        )}

        {/* Modal del Asistente IA */}
        {showAssistant && (
          <IAAssistantModal
            activities={activities}
            coordinates={coordinates}
            onClose={() => setShowAssistant(false)}
            onApply={applyIASuggestions}
          />
        )}

        {/* Modal de reprogramación */}
        {reprogramActivity && (
          <ReprogramModal
            activity={reprogramActivity}
            onClose={() => setReprogramActivity(null)}
            onReprogram={confirmReprogram}
            loading={reprogramLoading}
          />
        )}
      </div>
    </main>
  )
}