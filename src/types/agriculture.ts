// Definiciones TypeScript para el Sistema de Calendario Agrícola Dinámico

export type ActivityType = 
  | 'riego'
  | 'fumigacion'
  | 'cosecha'
  | 'siembra'
  | 'fertilizacion'
  | 'mantenimiento'
  | 'preparacion_suelo'
  | 'poda';

export type ResourceType = 
  | 'tractor'
  | 'sistema_riego'
  | 'fumigadora'
  | 'cosechadora'
  | 'trabajador'
  | 'fertilizante'
  | 'semilla'
  | 'pesticida';

export type Priority = 'critica' | 'alta' | 'media' | 'baja';

export type ActivityStatus = 'programada' | 'en_progreso' | 'completada' | 'cancelada' | 'reprogramada';

export type WeatherCondition = 'soleado' | 'nublado' | 'lluvia' | 'viento_fuerte' | 'helada';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface WeatherConstraint {
  requiredConditions: WeatherCondition[];
  blockedConditions: WeatherCondition[];
  maxWindSpeed?: number; // km/h
  minTemperature?: number; // °C
  maxHumidity?: number; // %
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  availability: TimeSlot[];
  status: 'disponible' | 'ocupado' | 'mantenimiento' | 'averiado';
  capacity?: number; // Para recursos como trabajadores o máquinas
  location?: string; // Ubicación en la finca
}

export interface CropInfo {
  id: string;
  name: string;
  variety: string;
  plantingDate: Date;
  harvestWindow: {
    start: Date;
    end: Date;
  };
  growthStage: 'siembra' | 'germinacion' | 'crecimiento' | 'floracion' | 'maduracion' | 'cosecha';
  area: number; // hectáreas
  location: string; // lote/parcela
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  description?: string;
  
  // Programación
  scheduledDate: Date;
  duration: number; // minutos
  estimatedEndTime: Date;
  
  // Prioridad y flexibilidad
  priority: Priority;
  flexibility: number; // 0-100: qué tan movible es la actividad
  criticalWindow?: {
    start: Date;
    end: Date;
  };
  
  // Recursos necesarios
  requiredResources: {
    resourceId: string;
    quantity: number;
    critical: boolean; // Si es crítico para la actividad
  }[];
  
  // Dependencias
  dependencies: string[]; // IDs de actividades que deben completarse antes
  dependents: string[]; // IDs de actividades que dependen de esta
  
  // Restricciones
  weatherConstraints: WeatherConstraint;
  timeConstraints?: {
    earliestStart?: Date;
    latestEnd?: Date;
    preferredTimeSlots?: TimeSlot[];
  };
  
  // Información del cultivo
  cropInfo?: CropInfo;
  affectedArea?: number; // hectáreas
  
  // Estado y seguimiento
  status: ActivityStatus;
  completionPercentage: number;
  actualStartTime?: Date;
  actualEndTime?: Date;
  
  // Historial de cambios
  originalScheduledDate: Date;
  reschedulingHistory: RescheduleEvent[];
  
  // Notas y observaciones
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RescheduleEvent {
  id: string;
  activityId: string;
  previousDate: Date;
  newDate: Date;
  reason: string;
  triggeredBy: 'usuario' | 'ia' | 'sistema';
  timestamp: Date;
  affectedActivities: string[]; // IDs de otras actividades que se movieron en cascada
}

export interface ConflictDetection {
  id: string;
  type: 'recurso_ocupado' | 'clima_adverso' | 'dependencia_no_cumplida' | 'ventana_critica';
  activityId: string;
  description: string;
  severity: 'baja' | 'media' | 'alta' | 'critica';
  suggestedActions: string[];
  autoResolvable: boolean;
}

export interface AIReschedulingOptions {
  preservePriorities: boolean;
  considerWeather: boolean;
  optimizeResourceUsage: boolean;
  minimizeDelays: boolean;
  maxRescheduleDays: number;
  allowParallelActivities: boolean;
}

export interface ReschedulingResult {
  success: boolean;
  originalActivity: Activity;
  rescheduledActivity: Activity;
  affectedActivities: Activity[];
  conflicts: ConflictDetection[];
  reasoning: string;
  confidence: number; // 0-100
  alternativeOptions?: Activity[];
}

export interface CalendarView {
  startDate: Date;
  endDate: Date;
  activities: Activity[];
  conflicts: ConflictDetection[];
  weatherForecast?: WeatherForecast[];
}

export interface WeatherForecast {
  date: Date;
  condition: WeatherCondition;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface FarmConfiguration {
  id: string;
  name: string;
  location: string;
  timezone: string;
  workingHours: {
    start: string; // "06:00"
    end: string;   // "18:00"
  };
  workingDays: number[]; // [1,2,3,4,5,6] (1=Lunes, 7=Domingo)
  crops: CropInfo[];
  resources: Resource[];
  aiSettings: AIReschedulingOptions;
}