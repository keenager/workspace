"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, FileTextIcon } from "lucide-react";
import { deleteCase } from "../actions/case";
import CreateCaseModal from "./CreateCaseModal";

type Case = {
  id: string;
  caseNumber: string;
  caseType: "CIVIL" | "CRIMINAL";
  caseName: string;
  court: string;
  filedAt: Date;
  createdAt: Date;
};

type Props = {
  cases: Case[];
};

const caseTypeLabel = {
  CIVIL: "민사",
  CRIMINAL: "형사",
};

export default function CaseList({ cases }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (caseId: string) => {
    if (!confirm("사건을 삭제하시겠습니까? 모든 메모가 삭제됩니다.")) return;
    const result = await deleteCase(caseId);
    if (!result.isSuccess) alert(result.message);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />새 사건
        </Button>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          등록된 사건이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {cases.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push(`/case-memo/${c.id}`)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.caseType === "CRIMINAL"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {caseTypeLabel[c.caseType]}
                  </span>
                  <span className="font-medium">{c.caseNumber}</span>
                  <span className="text-muted-foreground">{c.caseName}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {c.court} ·{" "}
                  {format(new Date(c.filedAt), "yyyy. MM. dd.", { locale: ko })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="has-[>svg]:px-1"
                  onClick={() => router.push(`/case-memo/${c.id}`)}
                >
                  <FileTextIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="has-[>svg]:px-1"
                  onClick={() => handleDelete(c.id)}
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCaseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
