"use client"

interface KQLogoProps {
  width?: number
  height?: number
  className?: string
}

export default function KQLogo({ width = 120, height = 40, className = "" }: KQLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Red circle with K */}
      <circle cx="28" cy="30" r="26" fill="#c8102e" />
      <text
        x="28"
        y="40"
        textAnchor="middle"
        fontSize="32"
        fill="white"
        fontFamily="Georgia, serif"
        fontWeight="bold"
      >
        K
      </text>

      {/* Kenya Airways text */}
      <text
        x="65"
        y="28"
        fontSize="22"
        fill="#c8102e"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontStyle="italic"
      >
        Kenya
      </text>
      <text
        x="65"
        y="50"
        fontSize="22"
        fill="#c8102e"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontStyle="italic"
      >
        Airways
      </text>

      {/* The Pride of Africa tagline */}
      <text
        x="65"
        y="62"
        fontSize="9"
        fill="#c8102e"
        fontFamily="Georgia, serif"
        fontStyle="italic"
      >
        The Pride of Africa
      </text>
    </svg>
  )
}
