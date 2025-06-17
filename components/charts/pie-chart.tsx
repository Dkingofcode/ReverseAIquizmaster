"use client"

interface PieChartProps {
  data: Array<{ name: string; value: number }>
  size?: number
}

export default function PieChart({ data, size = 200 }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6e6388]">
        <p>No data available</p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = ["#7847ea", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#06b6d4", "#84cc16"]

  let currentAngle = 0
  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ")

    currentAngle += angle

    return {
      pathData,
      color: colors[index % colors.length],
      percentage: Math.round(percentage),
      name: item.name,
      value: item.value,
    }
  })

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <svg width={size} height={size} className="flex-shrink-0">
        {slices.map((slice, index) => (
          <path key={index} d={slice.pathData} fill={slice.color} className="hover:opacity-80 transition-opacity">
            <title>
              {slice.name}: {slice.value} ({slice.percentage}%)
            </title>
          </path>
        ))}
      </svg>

      <div className="flex flex-col gap-2">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-sm text-[#131118]">
              {slice.name} ({slice.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
