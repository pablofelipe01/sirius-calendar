import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

// GET - Obtener una actividad por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // ← Aquí el cambio: await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de actividad requerido' },
        { status: 400 }
      )
    }

    const activity = await dbHelpers.getActivity(id)

    if (!activity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error obteniendo actividad:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// PUT - Actualizar una actividad
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // ← Aquí el cambio: await params
    const updateData = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID de actividad requerido' },
        { status: 400 }
      )
    }

    // Verificar que la actividad existe
    const existingActivity = await dbHelpers.getActivity(id)
    if (!existingActivity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar la actividad
    const updatedActivity = await dbHelpers.updateActivity(id, updateData)

    return NextResponse.json({
      success: true,
      message: 'Actividad actualizada exitosamente',
      data: updatedActivity
    })
  } catch (error) {
    console.error('Error actualizando actividad:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una actividad
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // ← Aquí el cambio: await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de actividad requerido' },
        { status: 400 }
      )
    }

    // Verificar que la actividad existe
    const existingActivity = await dbHelpers.getActivity(id)
    if (!existingActivity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la actividad usando Supabase
    const { supabase } = await import('@/lib/database')
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Actividad eliminada exitosamente',
      deleted_id: id
    })
  } catch (error) {
    console.error('Error eliminando actividad:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}