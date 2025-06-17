"use client"

interface BarChartProps {
  data: Array<{ name: string; value: number }>
  color?: string
  height?: number
}

export default function BarChart({ data, color = "#7847ea", height = 200 }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6e6388]">
        <p>No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-1" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 40) : 0
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="relative">
                <div
                  className="w-full rounded-t transition-all duration-300 group-hover:opacity-80"
                  style={{
                    height: barHeight,
                    backgroundColor: color,
                    minWidth: "20px",
                  }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-[#131118] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#6e6388] mt-2 text-center max-w-full truncate" title={item.name}>
                {item.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
