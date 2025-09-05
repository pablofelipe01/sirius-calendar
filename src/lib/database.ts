import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Función para mantener compatibilidad con el código anterior
export async function openDb() {
  return supabase
}

// Definir tipos para los filtros
interface ActivityFilters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  name_like?: string
  scheduled_date_gte?: string
  scheduled_date_lte?: string
  status_in?: string[]
  id_not?: string
  status?: string
  type?: string
}

// Definir tipo para las actualizaciones de actividad
interface ActivityUpdate {
  name?: string
  type?: string
  scheduled_date?: string
  duration?: number
  priority?: string
  status?: string
  planned_hectares?: number
  completed_hectares?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

// Definir tipo para crear actividad
interface ActivityCreate {
  name: string
  type: string
  scheduled_date: string
  duration?: number
  priority?: string
  status?: string
  planned_hectares?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

// Helper functions para queries específicas de activities
export const dbHelpers = {
  // Obtener una actividad por ID
  async getActivity(id: string) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Actualizar estado de actividad
  async updateActivity(id: string, updates: ActivityUpdate) {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Crear nueva actividad
  async createActivity(activity: ActivityCreate) {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar actividades con filtros
  async getActivitiesWhere(filters: ActivityFilters) {
    let query = supabase.from('activities').select('*')
    
    // Aplicar filtros dinámicamente
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        if (key === 'name_like') {
          query = query.ilike('name', `%${filters[key]}%`)
        } else if (key === 'scheduled_date_gte') {
          query = query.gte('scheduled_date', filters[key])
        } else if (key === 'scheduled_date_lte') {
          query = query.lte('scheduled_date', filters[key])
        } else if (key === 'status_in') {
          query = query.in('status', filters[key])
        } else if (key === 'id_not') {
          query = query.neq('id', filters[key])
        } else {
          query = query.eq(key, filters[key])
        }
      }
    })
    
    const { data, error } = await query.order('scheduled_date', { ascending: true })
    if (error) throw error
    return data
  },

  // Estadísticas de bloque
  async getBlockStats(blockNumber: number) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .ilike('name', `%Bloque ${blockNumber}%`)
    
    if (error) throw error
    
    const totalActivities = data.length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completedActivities = data.filter((a: any) => a.status === 'completada').length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalPlannedHectares = data.reduce((sum: number, a: any) => sum + (a.planned_hectares || 0), 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCompletedHectares = data.reduce((sum: number, a: any) => sum + (a.completed_hectares || 0), 0)
    
    return {
      total_activities: totalActivities,
      completed_activities: completedActivities,
      total_planned_hectares: totalPlannedHectares,
      total_completed_hectares: totalCompletedHectares
    }
  },

  // Contar total de actividades
  async countActivities() {
    const { count, error } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return { count }
  }
}