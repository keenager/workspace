export function CalendarLegend() {
  return (
    <div className="flex gap-4 text-xs mb-3 flex-wrap">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
        긴급
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
        보통
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" />
        낮음
      </div>
      <div className="flex items-center gap-1 ml-4">
        <span className="w-3 h-3 rounded-sm border-2 border-dashed border-gray-400 inline-block" />
        대기 중
      </div>
      <div className="flex items-center gap-1">
        <s>거절</s>
      </div>
    </div>
  );
}
