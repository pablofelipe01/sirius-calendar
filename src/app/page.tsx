import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-4xl">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-white font-bold">🌟</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sirius Calendar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Sistema de gestión agrícola inteligente para planificación y seguimiento
            de aplicaciones preventivas biológicas
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Planificación Inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Programa actividades agrícolas con redistribución automática de
              hectáreas y gestión de días comodín
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Control Biológico
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Gestiona aplicaciones preventivas biológicas por bloques con
              seguimiento en tiempo real del progreso
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">☀️</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Clima Integrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Integración con pronósticos meteorológicos para optimizar la
              planificación de actividades
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col gap-4 items-center mt-8">
          <Link
            href="/calendar"
            className="rounded-full border border-solid border-transparent transition-all duration-300 flex items-center justify-center bg-green-600 text-white gap-3 hover:bg-green-700 hover:scale-105 font-semibold text-lg h-14 px-8 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">📋</span>
            Acceder al Calendario
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Gestiona tus actividades agrícolas, completa tareas con seguimiento de
            hectáreas y visualiza el progreso en tiempo real
          </p>
        </div>

        {/* Stats Preview */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 w-full max-w-2xl mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
            Funcionalidades Principales
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Redistribución Automática
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">📊</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Seguimiento de Progreso
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">⚡</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Actualizaciones en Tiempo Real
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">🎯</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gestión por Bloques
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Sirius Regenerative Solutions SAS
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          Sistema de Gestión Agrícola
        </div>
        <div className="flex items-center gap-2">
          <span>🚀</span>
          Powered by Next.js
        </div>
      </footer>
    </div>
  );
}
