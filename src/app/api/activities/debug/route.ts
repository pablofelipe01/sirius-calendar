import { NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

// Removido 'request' parameter que no se usa
export async function GET() {
  try {
    // Obtener información general de la tabla
    const totalCount = await dbHelpers.countActivities()
    
    // Obtener primeras 10 actividades con todos los campos
    const sampleActivities = await dbHelpers.getActivitiesWhere({})
    const limitedSample = sampleActivities.slice(0, 10)
    
    // Estadísticas por status
    const statusStats: Record<string, number> = {}
    sampleActivities.forEach(activity => {
      statusStats[activity.status] = (statusStats[activity.status] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      debug_info: {
        total_activities: totalCount.count,
        sample_activities: limitedSample,
        activities_by_status: Object.entries(statusStats).map(([status, count]) => ({
          status,
          count
        })),
        database_type: 'Supabase PostgreSQL'
      }
    })

  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json(
      { 
        error: 'Error en endpoint de debugging',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}