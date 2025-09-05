import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

interface CompleteWithHectaresRequest {
  activity_id: string
  completed_hectares: number
  notes?: string
}

interface BlockInfo {
  blockNumber: number
  totalPlannedHectares: number
  completedHectares: number
  pendingHectares: number
}

interface RedistributionDetail {
  type: 'actualizada' | 'nueva_actividad' | 'eliminada' | 'warning' | 'desplazada'
  activity_id?: string
  activity_name?: string
  old_hectares?: number
  new_hectares?: number
  old_date?: string
  new_date?: string
  message: string
}

interface ActivityUpdateData {
  status?: string
  completed_hectares?: number
  updated_at?: string
  planned_hectares?: number
  duration?: number
  scheduled_date?: string
}

// Función para extraer el número de bloque del nombre de la actividad
function extractBlockNumber(activityName: string): number | null {
  console.log('🔍 Extracting block number from:', activityName)
  
  const patterns = [
    /Bloque\s+(\d+)/i,
    /Block\s+(\d+)/i,
    /B(\d+)/i,
    /bloque\s*(\d+)/i,
    /sector\s+(\d+)/i,
    /-\s*Bloque\s+(\d+)/i
  ]
  
  for (const pattern of patterns) {
    const match = activityName.match(pattern)
    if (match) {
      const blockNumber = parseInt(match[1])
      console.log('✅ Block number extracted:', blockNumber, 'using pattern:', pattern.source)
      return blockNumber
    }
  }
  
  console.log('❌ No block number found in activity name:', activityName)
  return null
}

// Función para obtener el ciclo basado en la fecha
function getCycleFromDate(date: string): { name: string; number: number } | null {
  console.log('🔍 Extracting cycle from date:', date)
  
  try {
    const activityDate = new Date(date)
    
    if (isNaN(activityDate.getTime())) {
      console.log('❌ Invalid date format:', date)
      return null
    }
    
    const month = activityDate.getMonth() + 1
    const year = activityDate.getFullYear()
    
    console.log('🔍 Date analysis:', { 
      originalDate: date, 
      parsedDate: activityDate.toISOString(), 
      month, 
      year 
    })
    
    let cycle: { name: string; number: number } | null = null
    
    if ([2, 3].includes(month)) {
      cycle = { name: 'Feb-Mar', number: 1 }
    } else if ([5, 6].includes(month)) {
      cycle = { name: 'May-Jun', number: 2 }
    } else if ([8, 9].includes(month)) {
      cycle = { name: 'Aug-Sep', number: 3 }
    } else if ([11, 12].includes(month)) {
      cycle = { name: 'Nov-Dec', number: 4 }
    } else {
      console.log('⚠️ Month not in main cycles, attempting to assign closest cycle')
      
      if (month === 1) {
        cycle = { name: 'Feb-Mar', number: 1 }
      } else if (month === 4) {
        cycle = { name: 'May-Jun', number: 2 }
      } else if (month === 7) {
        cycle = { name: 'Aug-Sep', number: 3 }
      } else if ([9, 10].includes(month)) {
        cycle = { name: 'Nov-Dec', number: 4 }
      }
    }
    
    if (cycle) {
      console.log('✅ Cycle extracted:', cycle)
    } else {
      console.log('❌ Could not determine cycle for month:', month)
    }
    
    return cycle
    
  } catch (error) {
    console.error('❌ Error parsing date:', date, error)
    return null
  }
}

// Función para identificar si es el último día del bloque (día remanente/comodín)
function isBufferDay(activityName: string): boolean {
  const bufferPatterns = [
    /remanente/i,
    /último/i,
    /ultimo/i,
    /final/i,
    /restante/i,
    /comodín/i,
    /comodin/i,
    /buffer/i
  ]
  
  return bufferPatterns.some(pattern => pattern.test(activityName))
}

// Función para formatear fecha para PostgreSQL
function formatDateForPostgres(date: Date): string {
  return date.toISOString()
}

// Función para encontrar la próxima fecha laboral disponible (evita domingos)
function getNextWorkday(date: Date): Date {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)
  
  // Evitar domingos (día 0)
  while (nextDate.getDay() === 0) {
    nextDate.setDate(nextDate.getDate() + 1)
  }
  
  return nextDate
}

// Función para extraer el número de día de una actividad
function extractDayNumber(activityName: string): number {
  const match = activityName.match(/Día (\d+)/)
  return match ? parseInt(match[1]) : 999 // 999 para actividades sin número de día
}

// FUNCIÓN PRINCIPAL: Desplazar el calendario hacia adelante
async function shiftCalendarForward(insertionDate: Date, redistributionDetails: RedistributionDetail[]): Promise<number> {
  try {
    console.log('🔄 Starting calendar shift for insertion date:', insertionDate.toISOString())
    
    // Obtener todas las actividades programadas/aplazadas después de la fecha de inserción
    const activitiesToShift = await dbHelpers.getActivitiesWhere({
      scheduled_date_gte: formatDateForPostgres(insertionDate),
      status_in: ['programada', 'aplazada']
    })
    
    console.log('📅 Found activities to shift:', activitiesToShift.length)
    
    if (activitiesToShift.length === 0) {
      return 0
    }
    
    // ✅ ORDENAMIENTO MEJORADO: Por fecha, luego por bloque, luego por día
    const sortedActivities = activitiesToShift.sort((a, b) => {
      // 1. Primero ordenar por fecha
      const dateComparison = new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      if (dateComparison !== 0) {
        return dateComparison
      }
      
      // 2. Si tienen la misma fecha, ordenar por bloque
      const blockA = extractBlockNumber(a.name) || 999
      const blockB = extractBlockNumber(b.name) || 999
      if (blockA !== blockB) {
        return blockA - blockB
      }
      
      // 3. Si están en el mismo bloque, ordenar por número de día
      const dayA = extractDayNumber(a.name)
      const dayB = extractDayNumber(b.name)
      return dayA - dayB
    })
    
    let shiftedCount = 0
    let currentShiftDate = new Date(insertionDate)
    
    // ✅ DESPLAZAMIENTO SECUENCIAL: Una fecha única por actividad
    for (const activity of sortedActivities) {
      const currentActivityDate = new Date(activity.scheduled_date)
      
      // Si la actividad actual está en o después de la fecha de inserción, necesita ser desplazada
      if (currentActivityDate >= insertionDate) {
        // Calcular la nueva fecha: debe ser al menos 1 día después de la última fecha asignada
        const newDate = getNextWorkday(currentShiftDate)
        
        // Actualizar la actividad con la nueva fecha
        await dbHelpers.updateActivity(activity.id, {
          scheduled_date: formatDateForPostgres(newDate)
        })
        
        redistributionDetails.push({
          type: 'desplazada',
          activity_id: activity.id,
          activity_name: activity.name,
          old_date: currentActivityDate.toISOString(),
          new_date: newDate.toISOString(),
          message: `Actividad desplazada de ${currentActivityDate.toLocaleDateString()} a ${newDate.toLocaleDateString()}`
        })
        
        shiftedCount++
        console.log(`📅 Shifted activity ${activity.name}: ${currentActivityDate.toDateString()} → ${newDate.toDateString()}`)
        
        // ✅ CRÍTICO: Actualizar la fecha de referencia para la siguiente actividad
        currentShiftDate = newDate
      }
    }
    
    console.log(`✅ Successfully shifted ${shiftedCount} activities forward`)
    return shiftedCount
    
  } catch (error) {
    console.error('❌ ERROR shifting calendar:', error)
    redistributionDetails.push({
      type: 'warning',
      message: `Error desplazando calendario: ${error instanceof Error ? error.message : 'Error desconocido'}`
    })
    return 0
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting POST request to complete-with-hectares')
    
    const body: CompleteWithHectaresRequest = await request.json()
    const { activity_id, completed_hectares, notes } = body

    console.log('🔍 DEBUG - Request received:', { activity_id, completed_hectares, notes })

    // Validaciones básicas
    if (!activity_id) {
      console.log('❌ Validation failed: Missing activity_id')
      return NextResponse.json(
        { error: 'Falta activity_id en la solicitud' },
        { status: 400 }
      )
    }

    if (typeof completed_hectares !== 'number' || completed_hectares <= 0) {
      console.log('❌ Validation failed: Invalid completed_hectares:', completed_hectares)
      return NextResponse.json(
        { error: 'completed_hectares debe ser un número mayor a 0' },
        { status: 400 }
      )
    }

    // Obtener la actividad
    const activity = await dbHelpers.getActivity(activity_id)
    if (!activity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada', debug_info: { searched_id: activity_id } },
        { status: 404 }
      )
    }

    console.log('✅ Activity found:', {
      id: activity.id,
      name: activity.name,
      status: activity.status,
      planned_hectares: activity.planned_hectares,
      scheduled_date: activity.scheduled_date
    })

    // Extraer información del bloque y ciclo
    const blockNumber = extractBlockNumber(activity.name)
    const cycle = getCycleFromDate(activity.scheduled_date)

    console.log('🔍 DEBUG - Extraction results:', { 
      blockNumber, 
      cycle, 
      activityName: activity.name,
      scheduledDate: activity.scheduled_date 
    })

    if (!blockNumber || !cycle) {
      console.log('❌ Could not extract block or cycle info')
      return NextResponse.json(
        { 
          error: 'No se pudo determinar el bloque o ciclo de la actividad',
          debug_info: {
            activity_name: activity.name,
            scheduled_date: activity.scheduled_date,
            extracted_block: blockNumber,
            extracted_cycle: cycle
          }
        },
        { status: 400 }
      )
    }

    console.log('✅ Block and cycle info extracted successfully:', { blockNumber, cycle })

    // Calcular diferencia de hectáreas
    const plannedHectares = activity.planned_hectares || 60
    const hectaresDifference = completed_hectares - plannedHectares

    console.log('🔍 DEBUG - Hectares calculation:', {
      planned: plannedHectares,
      completed: completed_hectares,
      difference: hectaresDifference
    })

    // Completar la actividad principal
    const updateData: ActivityUpdateData = {
      status: 'completada',
      completed_hectares: completed_hectares
    }

    if ('updated_at' in activity) {
      updateData.updated_at = new Date().toISOString()
    }

    const updatedActivity = await dbHelpers.updateActivity(activity.id, updateData)
    console.log('✅ Activity updated successfully:', updatedActivity.id)

    let redistributedActivities = 0
    const redistributionDetails: RedistributionDetail[] = []

    // Solo redistribuir si hay diferencia significativa (> 0.1ha)
    if (Math.abs(hectaresDifference) > 0.1) {
      console.log('🔍 DEBUG - Starting SMART redistribution for difference:', hectaresDifference)

      // Determinar fechas del ciclo
      const year = new Date(activity.scheduled_date).getFullYear()
      const cycleStartDate = cycle.number === 1 ? `${year}-02-01` :
                           cycle.number === 2 ? `${year}-05-01` :
                           cycle.number === 3 ? `${year}-08-01` :
                           `${year}-11-01`

      const cycleEndDate = cycle.number === 1 ? `${year}-03-31 23:59:59` :
                         cycle.number === 2 ? `${year}-06-30 23:59:59` :
                         cycle.number === 3 ? `${year}-09-30 23:59:59` :
                         `${year}-12-31 23:59:59`

      console.log('🔍 DEBUG - Cycle date range:', { cycleStartDate, cycleEndDate })

      try {
        // Obtener todas las actividades pendientes del mismo bloque y ciclo
        const pendingActivities = await dbHelpers.getActivitiesWhere({
          name_like: `Bloque ${blockNumber}`,
          scheduled_date_gte: cycleStartDate,
          scheduled_date_lte: cycleEndDate,
          status_in: ['programada', 'aplazada'],
          id_not: activity.id
        })

        console.log('🔍 DEBUG - Found pending activities for redistribution:', pendingActivities.length)

        // Agregar estos logs justo ANTES de la línea "const bufferActivity = pendingActivities"

        console.log('🔍 DEBUG - Searching for buffer activity...')
        console.log('🔍 DEBUG - Pending activities found:', pendingActivities.length)
        console.log('🔍 DEBUG - Pending activities details:', pendingActivities.map(act => ({
          id: act.id,
          name: act.name,
          scheduled_date: act.scheduled_date,
          planned_hectares: act.planned_hectares,
          isBuffer: isBufferDay(act.name)
        })))

        // BUSCAR el día comodín/remanente (último día del bloque)
        const bufferActivity = pendingActivities
          .filter(act => isBufferDay(act.name))
          .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())[0]

        console.log('🔍 DEBUG - Buffer activity search result:', bufferActivity ? {
          id: bufferActivity.id,
          name: bufferActivity.name,
          scheduled_date: bufferActivity.scheduled_date,
          planned_hectares: bufferActivity.planned_hectares
        } : 'NO BUFFER ACTIVITY FOUND')

        // ✅ CASO ESPECIAL: Si la actividad que estamos completando ES EL DÍA REMANENTE
        if (!bufferActivity && isBufferDay(activity.name)) {
          console.log('🎯 SPECIAL CASE: The completed activity IS the buffer day itself!')
          
          if (hectaresDifference < 0) {
            // Hay déficit en el día remanente - crear nueva actividad
            const deficit = Math.abs(hectaresDifference)
            
            console.log(`🔄 Creating new activity for ${deficit}ha deficit from buffer day`)
            
            // Encontrar la fecha correcta después del día remanente actual
            const currentDate = new Date(activity.scheduled_date)
            const insertionDate = getNextWorkday(currentDate)
            
            console.log('📅 Insertion date for deficit from buffer:', insertionDate.toDateString())

            // Desplazar el calendario hacia adelante
            const shiftedCount = await shiftCalendarForward(insertionDate, redistributionDetails)
            console.log(`📅 Shifted ${shiftedCount} activities forward`)

            // Crear nueva actividad para el déficit
            const blockNumber = extractBlockNumber(activity.name)
            const deficitActivityName = `Aplicación Preventiva Biológicos - Bloque ${blockNumber} Día ${extractDayNumber(activity.name) + 1} (Déficit Restante)`
            
            const newActivity = await dbHelpers.createActivity({
              name: deficitActivityName,
              type: activity.type,
              scheduled_date: formatDateForPostgres(insertionDate),
              duration: Math.round((deficit / 60) * 480),
              priority: activity.priority,
              status: 'programada',
              planned_hectares: deficit
            })

            redistributionDetails.push({
              type: 'nueva_actividad',
              activity_id: newActivity.id,
              activity_name: deficitActivityName,
              new_hectares: deficit,
              message: `Nueva actividad creada para ${deficit}ha de déficit del día remanente en ${insertionDate.toLocaleDateString()}`
            })

            redistributedActivities += 1 + shiftedCount
            console.log(`✅ Created new activity for ${deficit}ha deficit from buffer day`)
          }
        } else if (bufferActivity) {
          // ...existing code para cuando sí encuentra buffer activity...
          console.log('🎯 Found buffer activity:', bufferActivity.name, 'Current hectares:', bufferActivity.planned_hectares)

          const currentBufferHectares = bufferActivity.planned_hectares || 15
          const newBufferHectares = currentBufferHectares - hectaresDifference

          console.log('🔍 Buffer calculation:', {
            current: currentBufferHectares,
            difference: hectaresDifference,
            new: newBufferHectares
          })

          // Verificar si el buffer day puede absorber toda la diferencia
          if (newBufferHectares > 0 && newBufferHectares <= 70) {
            // ✅ CASO IDEAL: El día comodín puede absorber toda la diferencia
            
            await dbHelpers.updateActivity(bufferActivity.id, {
              planned_hectares: newBufferHectares,
              duration: Math.round((newBufferHectares / 60) * 480)
            })

            redistributionDetails.push({
              type: 'actualizada',
              activity_id: bufferActivity.id,
              activity_name: bufferActivity.name,
              old_hectares: currentBufferHectares,
              new_hectares: newBufferHectares,
              message: hectaresDifference > 0 
                ? `Exceso de ${hectaresDifference}ha absorbido por el día comodín (${currentBufferHectares}ha → ${newBufferHectares}ha)`
                : `Déficit de ${Math.abs(hectaresDifference)}ha compensado por el día comodín (${currentBufferHectares}ha → ${newBufferHectares}ha)`
            })

            redistributedActivities++
            console.log('✅ Buffer day successfully adjusted')

          } else if (newBufferHectares > 70) {
            // ⚠️ WARNING: El día comodín superaría 70ha
            
            // Ajustar el buffer al máximo (70ha) y el resto crear nueva actividad
            const excessAfterBuffer = newBufferHectares - 70
            
            await dbHelpers.updateActivity(bufferActivity.id, {
              planned_hectares: 70,
              duration: Math.round((70 / 60) * 480)
            })

            redistributionDetails.push({
              type: 'warning',
              activity_id: bufferActivity.id,
              activity_name: bufferActivity.name,
              old_hectares: currentBufferHectares,
              new_hectares: 70,
              message: `⚠️ WARNING: Día comodín ajustado al máximo de 70ha (era ${currentBufferHectares}ha)`
            })

            // Encontrar la fecha correcta después del último día del bloque actual
            const bufferDate = new Date(bufferActivity.scheduled_date)
            const insertionDate = getNextWorkday(bufferDate)
            
            console.log('📅 Insertion date calculated:', insertionDate.toDateString())

            // Desplazar el calendario hacia adelante
            const shiftedCount = await shiftCalendarForward(insertionDate, redistributionDetails)
            console.log(`📅 Shifted ${shiftedCount} activities forward`)

            // Crear nueva actividad para el exceso restante en la fecha libre
            const newActivityName = `${activity.name} - Exceso Adicional (+${excessAfterBuffer}ha)`
            
            const newActivity = await dbHelpers.createActivity({
              name: newActivityName,
              type: activity.type,
              scheduled_date: formatDateForPostgres(insertionDate),
              duration: Math.round((excessAfterBuffer / 60) * 480),
              priority: activity.priority,
              status: 'programada',
              planned_hectares: excessAfterBuffer
            })

            redistributionDetails.push({
              type: 'nueva_actividad',
              activity_id: newActivity.id,
              activity_name: newActivityName,
              new_hectares: excessAfterBuffer,
              message: `Nueva actividad creada para ${excessAfterBuffer}ha en fecha ${insertionDate.toLocaleDateString()} (calendario desplazado)`
            })

            redistributedActivities += 1 + shiftedCount

          } else if (newBufferHectares <= 0) {
            // 🗑️ El día comodín quedaría en 0 o negativo
            
            if (newBufferHectares === 0) {
              // Eliminar el día comodín (queda exactamente en 0)
              const { supabase } = await import('@/lib/database')
              await supabase.from('activities').delete().eq('id', bufferActivity.id)

              redistributionDetails.push({
                type: 'eliminada',
                activity_id: bufferActivity.id,
                activity_name: bufferActivity.name,
                old_hectares: currentBufferHectares,
                new_hectares: 0,
                message: `Día comodín eliminado (${currentBufferHectares}ha exactamente absorbidos por exceso)`
              })

              redistributedActivities++

            } else {
              // newBufferHectares < 0: Eliminar el día comodín y crear nueva actividad con el déficit restante
              const remainingDeficit = Math.abs(newBufferHectares)

              const { supabase } = await import('@/lib/database')
              await supabase.from('activities').delete().eq('id', bufferActivity.id)

              redistributionDetails.push({
                type: 'eliminada',
                activity_id: bufferActivity.id,
                activity_name: bufferActivity.name,
                old_hectares: currentBufferHectares,
                new_hectares: 0,
                message: `Día comodín eliminado (${currentBufferHectares}ha absorbidos, quedan ${remainingDeficit}ha por redistribuir)`
              })

              // Encontrar la fecha correcta después del último día del bloque actual
              const bufferDate = new Date(bufferActivity.scheduled_date)
              const insertionDate = getNextWorkday(bufferDate)
              
              console.log('📅 Insertion date calculated for deficit:', insertionDate.toDateString())

              // Desplazar el calendario hacia adelante
              const shiftedCount = await shiftCalendarForward(insertionDate, redistributionDetails)
              console.log(`📅 Shifted ${shiftedCount} activities forward for deficit`)

              // Crear nueva actividad para el déficit restante en la fecha libre
              const deficitActivityName = `${activity.name} - Déficit Restante (+${remainingDeficit}ha)`
              
              const newActivity = await dbHelpers.createActivity({
                name: deficitActivityName,
                type: activity.type,
                scheduled_date: formatDateForPostgres(insertionDate),
                duration: Math.round((remainingDeficit / 60) * 480),
                priority: activity.priority,
                status: 'programada',
                planned_hectares: remainingDeficit
              })

              redistributionDetails.push({
                type: 'nueva_actividad',
                activity_id: newActivity.id,
                activity_name: deficitActivityName,
                new_hectares: remainingDeficit,
                message: `Nueva actividad creada para ${remainingDeficit}ha de déficit en fecha ${insertionDate.toLocaleDateString()} (calendario desplazado)`
              })

              redistributedActivities += 1 + shiftedCount
            }
          }

        } else {
          // No hay día comodín, usar lógica tradicional de redistribución con desplazamiento dinámico
          console.log('⚠️ No buffer day found, using traditional redistribution with dynamic shifting')
          
          if (hectaresDifference > 0) {
            // EXCESO: Crear nueva actividad con desplazamiento dinámico
            const activityDate = new Date(activity.scheduled_date)
            const insertionDate = getNextWorkday(activityDate)
            
            console.log('📅 Insertion date for excess (no buffer):', insertionDate.toDateString())

            // Desplazar el calendario hacia adelante
            const shiftedCount = await shiftCalendarForward(insertionDate, redistributionDetails)
            console.log(`📅 Shifted ${shiftedCount} activities forward (no buffer case)`)

            const newActivityName = `${activity.name} - Excedente (+${hectaresDifference}ha)`
            
            const newActivity = await dbHelpers.createActivity({
              name: newActivityName,
              type: activity.type,
              scheduled_date: formatDateForPostgres(insertionDate),
              duration: Math.round((hectaresDifference / 60) * 480),
              priority: activity.priority,
              status: 'programada',
              planned_hectares: hectaresDifference
            })

            redistributionDetails.push({
              type: 'nueva_actividad',
              activity_id: newActivity.id,
              activity_name: newActivityName,
              new_hectares: hectaresDifference,
              message: `Se creó nueva actividad para ${hectaresDifference}ha en fecha ${insertionDate.toLocaleDateString()} (calendario desplazado, no hay día comodín)`
            })

            redistributedActivities += 1 + shiftedCount

          } else {
            // DÉFICIT: Distribuir en actividades existentes
            const deficit = Math.abs(hectaresDifference)
            let remainingDeficit = deficit

            for (const pendingActivity of pendingActivities) {
              if (remainingDeficit <= 0) break

              const currentPlanned = pendingActivity.planned_hectares || 60
              const addToThisActivity = Math.min(remainingDeficit, 60)
              const newPlanned = currentPlanned + addToThisActivity

              await dbHelpers.updateActivity(pendingActivity.id, {
                planned_hectares: newPlanned,
                duration: Math.round((newPlanned / 60) * 480)
              })

              redistributionDetails.push({
                type: 'actualizada',
                activity_id: pendingActivity.id,
                activity_name: pendingActivity.name,
                old_hectares: currentPlanned,
                new_hectares: newPlanned,
                message: `Se añadieron ${addToThisActivity}ha a esta actividad`
              })

              redistributedActivities++
              remainingDeficit -= addToThisActivity
            }

            // Si queda déficit, crear nueva actividad con desplazamiento dinámico
            if (remainingDeficit > 0) {
              const activityDate = new Date(activity.scheduled_date)
              const insertionDate = getNextWorkday(activityDate)
              
              console.log('📅 Insertion date for remaining deficit:', insertionDate.toDateString())

              // Desplazar el calendario hacia adelante
              const shiftedCount = await shiftCalendarForward(insertionDate, redistributionDetails)
              console.log(`📅 Shifted ${shiftedCount} activities forward (remaining deficit)`)

              const deficitActivityName = `${activity.name} - Déficit Redistribuido (+${remainingDeficit}ha)`
              
              const newActivity = await dbHelpers.createActivity({
                name: deficitActivityName,
                type: activity.type,
                scheduled_date: formatDateForPostgres(insertionDate),
                duration: Math.round((remainingDeficit / 60) * 480),
                priority: activity.priority,
                status: 'programada',
                planned_hectares: remainingDeficit
              })

              redistributionDetails.push({
                type: 'nueva_actividad',
                activity_id: newActivity.id,
                activity_name: deficitActivityName,
                new_hectares: remainingDeficit,
                message: `Se creó nueva actividad para ${remainingDeficit}ha de déficit en fecha ${insertionDate.toLocaleDateString()} (calendario desplazado)`
              })

              redistributedActivities += 1 + shiftedCount
            }
          }
        }

      } catch (redistributionError) {
        console.error('❌ ERROR during smart redistribution:', redistributionError)
        redistributionDetails.push({
          type: 'warning',
          message: `Error en redistribución inteligente: ${redistributionError instanceof Error ? redistributionError.message : 'Error desconocido'}`
        })
      }
    } else {
      console.log('✅ No redistribution needed - difference within tolerance')
    }

    // Obtener estadísticas del bloque
    let blockInfo: BlockInfo
    try {
      const blockStats = await dbHelpers.getBlockStats(blockNumber)
      blockInfo = {
        blockNumber,
        totalPlannedHectares: blockStats.total_planned_hectares || 0,
        completedHectares: blockStats.total_completed_hectares || 0,
        pendingHectares: (blockStats.total_planned_hectares || 0) - (blockStats.total_completed_hectares || 0)
      }
    } catch (error) {
      console.error('❌ ERROR getting block stats:', error)
      blockInfo = {
        blockNumber,
        totalPlannedHectares: plannedHectares,
        completedHectares: completed_hectares,
        pendingHectares: 0
      }
    }

    // Respuesta exitosa
    const response = {
      success: true,
      message: 'Actividad completada exitosamente con redistribución inteligente y desplazamiento dinámico',
      activity_id: activity.id,
      completed_hectares,
      planned_hectares: plannedHectares,
      hectares_difference: hectaresDifference,
      redistributed_activities: redistributedActivities,
      redistribution_details: redistributionDetails,
      block_info: blockInfo,
      cycle_info: cycle,
      notes: notes,
      redistribution_strategy: 'smart_buffer_day_with_dynamic_shift'
    }

    console.log('✅ Sending successful response:', { 
      success: response.success, 
      activity_id: response.activity_id, 
      redistributed: response.redistributed_activities,
      strategy: response.redistribution_strategy
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ FATAL ERROR in smart complete-with-hectares endpoint:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available')
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al completar la actividad',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}