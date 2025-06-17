"use client"

interface LineChartProps {
  data: Array<{ name: string; value: number }>
  color?: string
  height?: number
}

export default function LineChart({ data, color = "#7847ea", height = 200 }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6e6388]">
        <p>No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - minValue) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox="0 0 100 100" className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f0f4" strokeWidth="0.5" />
        ))}

        {/* Area under curve */}
        <polygon points={`0,100 ${points} 100,100`} fill={`url(#gradient-${color.replace("#", "")})`} stroke="none" />

        {/* Line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - ((item.value - minValue) / range) * 100
          return (
            <circle key={index} cx={x} cy={y} r="2" fill={color}>
              <title>
                {item.name}: {item.value}
              </title>
            </circle>
          )
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-[#6e6388]">
        {data.map((item, index) => (
          <span key={index} className={index % Math.ceil(data.length / 5) === 0 ? "" : "opacity-0"}>
            {item.name}
          </span>
        ))}
      </div>
    </div>
  )
}
