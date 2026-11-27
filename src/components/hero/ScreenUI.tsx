/**
 * Схематичный интерфейс на экране станции в кадре 3 (демо, не реальный экран приложения).
 * Размеры в cqw — масштабируется вместе с контейнером при «наезде камеры».
 */
export default function ScreenUI() {
  const pins = [
    [28, 30], [62, 22], [48, 44], [74, 52], [22, 58], [55, 66],
  ];
  return (
    <div className="@container relative h-full w-full bg-[#0d1a14] text-floral">
      <svg viewBox="0 0 100 178" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g stroke="#1f3b2d" strokeWidth="1.6" fill="none">
          <path d="M-5 40 C 30 36, 60 52, 110 44" />
          <path d="M-5 92 C 40 84, 70 104, 110 96" />
          <path d="M30 -5 C 26 50, 40 110, 34 190" />
          <path d="M72 -5 C 78 60, 64 120, 76 190" />
          <path d="M-5 140 L 110 120" />
        </g>
        <g stroke="#173024" strokeWidth="0.6">
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M ${i * 9} -5 L ${i * 9 - 20} 190`} />
          ))}
        </g>
      </svg>
      {pins.map(([x, y], i) => (
        <span key={i} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
          <span className="absolute -inset-[3cqw] animate-ping rounded-full bg-malachite/30" style={{ animationDelay: `${i * 0.25}s` }} />
          <span className="relative grid h-[7cqw] w-[7cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-malachite text-[3.6cqw] font-bold text-ink">
            ⚡
          </span>
        </span>
      ))}
      <div className="absolute inset-x-[5cqw] bottom-[5cqw] rounded-[5cqw] bg-floral p-[5cqw] text-ink">
        <div className="flex items-center justify-between text-[4cqw] opacity-60">
          <span>EnerGo</span>
          <span className="rounded-full bg-sky/60 px-[2cqw] font-semibold">DEMO</span>
        </div>
        <div className="mt-[1.5cqw] text-[6cqw] leading-tight font-semibold">GB/T · 2 / 2</div>
        <div className="mt-[3cqw] grid h-[11cqw] place-items-center rounded-[3cqw] bg-malachite text-[4.6cqw] font-semibold">▶</div>
      </div>
    </div>
  );
}
