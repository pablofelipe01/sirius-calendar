import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface DeferRequest {
  activity_id: string
  old_date: string
  new_date: string
  reason: string
}

// Función para calcular días laborales (Lunes a Sábado)
function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getDay()
  return dayOfWeek >= 1 && dayOfWeek <= 6 // Lunes (1) a Sábado (6)
}

// Función para obtener el siguiente día laboral
function getNextWorkingDay(date: Date): Date {
  const nextDay = new Date(date)
  do {
    nextDay.setDate(nextDay.getDate() + 1)
  } while (!isWorkingDay(nextDay))
  return nextDay
}

// Función para obtener el día laboral anterior
function getPreviousWorkingDay(date: Date): Date {
  const prevDay = new Date(date)
  do {
    prevDay.setDate(prevDay.getDate() - 1)
  } while (!isWorkingDay(prevDay))
  return prevDay
}

// Función para calcular diferencia en días laborales
function getWorkingDaysDifference(startDate: Date, endDate: Date): number {
  let current = new Date(startDate)
  let days = 0
  
  if (startDate > endDate) {
    // Si la nueva fecha es anterior, contar hacia atrás
    while (current > endDate) {
      current = getPreviousWorkingDay(current)
      days--
    }
  } else {
    // Si la nueva fecha es posterior, contar hacia adelante
    while (current < endDate) {
      current = getNextWorkingDay(current)
      days++
    }
  }
  
  return days
}

// Función para obtener hectáreas de una actividad por su nombre
function getHectaresFromName(name: string): number {
  const hectaresMatch = name.match(/\((\d+) ha\)/)
  return hectaresMatch ? parseInt(hectaresMatch[1]) : 60 // Default 60ha
}

// Función para validar formato de fecha ISO
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime()) && dateString.includes('T')
}

export async function POST(request: NextRequest) {
  try {
    // Forma correcta de usar createRouteHandlerClient en Next.js 15
    const supabase = createRouteHandlerClient({ cookies })
    
    const body: DeferRequest = await request.json()
    const { activity_id, old_date, new_date, reason } = body

    // Validación de entrada
    if (!activity_id || !old_date || !new_date || !reason) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: activity_id, old_date, new_date, reason' },
        { status: 400 }
      )
    }

    // Validar formato de fechas
    if (!isValidISODate(new_date)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use formato ISO (YYYY-MM-DDTHH:mm:ss)' },
        { status: 400 }
      )
    }

    // Validar que la nueva fecha sea un día laboral
    const newDateTime = new Date(new_date)
    if (!isWorkingDay(newDateTime)) {
      return NextResponse.json(
        { error: 'La nueva fecha debe ser un día laboral (Lunes a Sábado)' },
        { status: 400 }
      )
    }

    // 1. Obtener la actividad a aplazar
    const { data: activityToDefer, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activity_id)
      .single()

    if (activityError || !activityToDefer) {
      console.error('Error obteniendo actividad:', activityError)
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      )
    }

    // 2. Calcular el desplazamiento en días laborales
    const oldDate = new Date(old_date)
    const daysDifference = getWorkingDaysDifference(oldDate, newDateTime)
    
    console.log(`Desplazamiento calculado: ${daysDifference} días laborales`)

    // 3. Obtener todas las actividades del mismo ciclo que necesitan reorganizarse
    const activityYear = new Date(old_date).getFullYear()
    const activityMonth = new Date(old_date).getMonth() + 1
    
    // Determinar el ciclo basado en el mes
    let cycleMonths: number[] = []
    if ([2, 3].includes(activityMonth)) {
      cycleMonths = [2, 3] // Ciclo 1: Feb-Mar
    } else if ([5, 6].includes(activityMonth)) {
      cycleMonths = [5, 6] // Ciclo 2: May-Jun
    } else if ([8, 9].includes(activityMonth)) {
      cycleMonths = [8, 9] // Ciclo 3: Aug-Sep
    } else if ([11, 12].includes(activityMonth)) {
      cycleMonths = [11, 12] // Ciclo 4: Nov-Dec
    } else {
      return NextResponse.json(
        { error: 'La actividad no pertenece a un ciclo reconocido' },
        { status: 400 }
      )
    }

    // 4. Construir fechas de inicio y fin del ciclo correctamente
    const startMonth = cycleMonths[0]
    const endMonth = cycleMonths[1]
    
    // Fecha de inicio del ciclo
    const cycleStartDate = `${activityYear}-${startMonth.toString().padStart(2, '0')}-01`
    
    // Fecha de fin del ciclo (primer día del mes siguiente)
    let cycleEndYear = activityYear
    let cycleEndMonth = endMonth + 1
    
    // Si el ciclo termina en diciembre, el siguiente mes es enero del año siguiente
    if (endMonth === 12) {
      cycleEndYear = activityYear + 1
      cycleEndMonth = 1
    }
    
    const cycleEndDate = `${cycleEndYear}-${cycleEndMonth.toString().padStart(2, '0')}-01`
    
    console.log(`Buscando actividades del ciclo entre ${cycleStartDate} y ${cycleEndDate}`)

    // 5. Obtener todas las actividades del ciclo para reorganizar
    const { data: allCycleActivities, error: fetchError } = await supabase
      .from('activities')
      .select('*')
      .eq('status', 'programada')
      .gte('scheduled_date', cycleStartDate)
      .lt('scheduled_date', cycleEndDate)
      .order('scheduled_date', { ascending: true })

    if (fetchError) {
      console.error('Error obteniendo actividades del ciclo:', fetchError)
      return NextResponse.json(
        { error: 'Error obteniendo actividades del ciclo: ' + fetchError.message },
        { status: 500 }
      )
    }

    if (!allCycleActivities || allCycleActivities.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron actividades en el ciclo' },
        { status: 404 }
      )
    }

    console.log(`Encontradas ${allCycleActivities.length} actividades en el ciclo`)

    // 6. Encontrar la posición de la actividad a mover
    const activityIndex = allCycleActivities.findIndex(act => act.id === activity_id)
    if (activityIndex === -1) {
      return NextResponse.json(
        { error: 'Actividad no encontrada en el ciclo' },
        { status: 404 }
      )
    }

    // 7. Crear el nuevo calendario reorganizado
    const updates = []
    let currentScheduleDate = new Date(allCycleActivities[0].scheduled_date)
    
    // Ajustar la fecha de inicio basado en el desplazamiento
    if (daysDifference < 0) {
      // Mover hacia atrás: empezar desde una fecha anterior
      for (let i = 0; i < Math.abs(daysDifference); i++) {
        currentScheduleDate = getPreviousWorkingDay(currentScheduleDate)
      }
    } else if (daysDifference > 0) {
      // Mover hacia adelante: avanzar la fecha de inicio
      for (let i = 0; i < daysDifference; i++) {
        currentScheduleDate = getNextWorkingDay(currentScheduleDate)
      }
    }

    console.log(`Nueva fecha de inicio del ciclo: ${currentScheduleDate.toISOString()}`)

    // 8. Reorganizar todas las actividades del ciclo
    for (let i = 0; i < allCycleActivities.length; i++) {
      const activity = allCycleActivities[i]
      
      // Asegurar que sea día laboral
      while (!isWorkingDay(currentScheduleDate)) {
        currentScheduleDate = getNextWorkingDay(currentScheduleDate)
      }
      
      // Mantener la hora original
      const originalTime = new Date(activity.scheduled_date)
      const newScheduledDate = new Date(currentScheduleDate)
      newScheduledDate.setHours(
        originalTime.getHours(),
        originalTime.getMinutes(),
        originalTime.getSeconds(),
        originalTime.getMilliseconds()
      )
      
      // Solo agregar a updates si la fecha realmente cambió
      if (newScheduledDate.getTime() !== new Date(activity.scheduled_date).getTime()) {
        updates.push({
          id: activity.id,
          name: activity.name,
          old_date: activity.scheduled_date,
          new_date: newScheduledDate.toISOString(),
          is_deferred: activity.id === activity_id
        })
      }
      
      // Avanzar al siguiente día laboral para la siguiente actividad
      currentScheduleDate = getNextWorkingDay(currentScheduleDate)
    }

    console.log(`Preparadas ${updates.length} actualizaciones`)

    // 9. Registrar el evento de reprogramación principal
    const { error: rescheduleError } = await supabase
      .from('reschedule_events')
      .insert({
        activity_id,
        old_date,
        new_date,
        reason
      })

    if (rescheduleError) {
      console.error('Error registrando reprogramación:', rescheduleError)
      return NextResponse.json(
        { error: 'Error registrando la reprogramación: ' + rescheduleError.message },
        { status: 500 }
      )
    }

    // 10. Ejecutar todas las actualizaciones
    let successCount = 0
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('activities')
        .update({
          scheduled_date: update.new_date,
          status: update.is_deferred ? 'aplazada' : 'programada'
        })
        .eq('id', update.id)

      if (updateError) {
        console.error('Error actualizando actividad:', update.id, updateError)
      } else {
        // Registrar reorganización automática para actividades no deferridas
        if (!update.is_deferred) {
          await supabase
            .from('reschedule_events')
            .insert({
              activity_id: update.id,
              old_date: update.old_date,
              new_date: update.new_date,
              reason: `Reorganización automática por aplazamiento de ${activityToDefer.name}`
            })
        }
        successCount++
      }
    }

    console.log(`Reorganizadas ${successCount} actividades del ciclo completo`)

    return NextResponse.json({
      success: true,
      message: 'Calendario reorganizado dinámicamente',
      activity_id,
      old_date,
      new_date,
      reason,
      days_shifted: daysDifference,
      reorganized_activities: successCount,
      cycle_months: cycleMonths,
      total_activities_in_cycle: allCycleActivities.length,
      cycle_date_range: {
        start: cycleStartDate,
        end: cycleEndDate
      }
    })

  } catch (error) {
    console.error('Error en reorganización dinámica:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}