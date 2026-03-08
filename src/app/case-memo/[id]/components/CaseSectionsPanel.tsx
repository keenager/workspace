import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CaseSection } from "../../../../../generated/prisma/browser";
import { MakeState } from "@/app/calendar/types";

interface Props {
  sections: CaseSection[];
  idState: MakeState<string>;
}

export default function CaseSectionsPanel({ sections, idState }: Props) {
  const [selectedSectionId, setSelectedSectionId] = idState;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <p className="text-xs font-medium text-muted-foreground px-4 py-2 border-t">
        메모 섹션
      </p>
      <div className="flex-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSectionId(s.id)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              selectedSectionId === s.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* 섹션 추가 버튼 */}
      <div className="p-3 border-t">
        <Button variant="outline" size="sm" className="w-full">
          <PlusIcon className="w-4 h-4 mr-2" />
          섹션 추가
        </Button>
      </div>
    </div>
  );
}
