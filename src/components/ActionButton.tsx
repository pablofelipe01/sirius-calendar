import React from 'react'

export function ActionButton({
  children,
  loading = false,
  disabled = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`px-3 py-1 rounded text-xs font-semibold transition
        ${props.className || ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {loading ? <span className="mr-2"><LoadingSpinner size={16} /></span> : null}
      {children}
    </button>
  )
}

// Simple spinner
export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-gray-200"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}