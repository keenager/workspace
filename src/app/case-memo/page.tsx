import { getCases } from "./actions/case";
import CaseList from "./components/CaseList";

export default async function CaseMemoPage() {
  const cases = await getCases();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">사건 메모</h1>
      </div>
      <CaseList cases={cases} />
    </div>
    /* <Editor sectionId="1" /> */
  );
}
