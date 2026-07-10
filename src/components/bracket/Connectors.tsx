export const HEADER_SPACER = "h-9";

export function PairConnector({ pairs }: { pairs: number }) {
  return (
    <div className="flex w-9 shrink-0 flex-col">
      <div className={HEADER_SPACER} aria-hidden="true" />
      <div className="flex flex-1 flex-col" aria-hidden="true">
        {Array.from({ length: pairs }).map((_, index) => (
          <div key={index} className="relative flex-1">
            <div className="absolute inset-y-1/4 left-0 right-1/2 rounded-r-[9px] border border-l-0 border-line-2" />
            <div className="absolute left-1/2 right-0 top-1/2 border-t border-line-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StraightConnector() {
  return (
    <div className="flex w-9 shrink-0 flex-col">
      <div className={HEADER_SPACER} aria-hidden="true" />
      <div className="relative flex-1" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 border-t border-line-2" />
      </div>
    </div>
  );
}
