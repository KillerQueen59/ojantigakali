/** 20-cell farm meter. Filled count = round(value / 50 * total). */
export default function Meter({
  value,
  color,
  total = 20,
}: {
  value: number
  color: string
  total?: number
}) {
  const filled = Math.round((value / 50) * total)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 14,
            background: i < filled ? color : '#E5D3A8',
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.15)',
          }}
        />
      ))}
    </div>
  )
}
