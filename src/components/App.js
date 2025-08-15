import timelineItems from "../timelineItems.js";
import { Timeline } from "./Timeline.js";

export function App() {


  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto w-[min(1600px,100vw-2rem)] space-y-3">
        <h1 className="text-xl font-semibold">Airtable Timeline</h1>
        <p className="text-sm text-slate-600">{timelineItems.length} items • compact lanes</p>
        <Timeline items={timelineItems} />
      </div>
    </div>
  );
} 