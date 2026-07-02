"use client";

interface FormPartIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export default function FormPartIndicator({ current, total, label }: FormPartIndicatorProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[11px] font-semibold text-gray-500">
        {label ?? `Part ${current} of ${total}`}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index + 1 === current ? "w-5 bg-cavalo-yellow" : index + 1 < current ? "w-3 bg-emerald-400" : "w-3 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
