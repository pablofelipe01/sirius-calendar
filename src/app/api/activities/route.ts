import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    console.log('🔍 Iniciando GET /api/activities')
    
    // ✅ CORRECCIÓN: Pasar cookies directamente sin await
    const supabase = createRouteHandlerClient({ cookies })
    console.log('✅ Cliente de Supabase creado')
    
    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        id,
        name,
        type,
        scheduled_date,
        duration,
        priority,
        status,
        planned_hectares,
        completed_hectares,
        created_at
      `)
      .order('scheduled_date', { ascending: true })

    console.log('📊 Consulta ejecutada. Error:', error)
    console.log('📊 Datos recibidos:', activities ? activities.length : 'null')

    if (error) {
      console.error('❌ Error de Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Validación: asegurar que siempre devolvamos un array
    const validActivities = Array.isArray(activities) ? activities : []
    console.log(`✅ Devolviendo ${validActivities.length} actividades`)
    
    return NextResponse.json(validActivities)
    
  } catch (error) {
    console.error('💥 Error del servidor:', error)
    console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando POST /api/activities')
    
    // ✅ CORRECCIÓN: Pasar cookies directamente sin await
    const supabase = createRouteHandlerClient({ cookies })
    
    const body = await request.json()
    console.log('📝 Body recibido:', body)
    
    const { data, error } = await supabase
      .from('activities')
      .insert([body])
      .select()
      .single()

    console.log('📊 Insert ejecutado. Error:', error)
    console.log('📊 Data insertada:', data)

    if (error) {
      console.error('❌ Error de insert:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('💥 Error del servidor en POST:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}