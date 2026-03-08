"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CaseInfoPanel from "./CaseInfoPanel";
import Editor from "../../components/Editor";
import { CaseDetail } from "../../types";
import CaseSectionsPanel from "./CaseSectionsPanel";

interface Props {
  caseDetail: CaseDetail;
}

export default function CaseDetailClient({ caseDetail }: Props) {
  const sections = caseDetail.sections;

  const sectionIdState = useState<string>(sections[0].id ?? "");
  const selectedSection = sections.find((s) => s.id === sectionIdState[0]);

  const contentsState = useState<Record<string, string>>(
    Object.fromEntries(sections.map((s) => [s.id, s.content])),
  ); // selectedSection이 바뀔때마다 에디터가 재렌더링되기 때문에 contents 상태관리를 에디터와 분리

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 좌측 패널 */}
      <div className="w-64 border-r flex flex-col shrink-0 overflow-hidden">
        {/* 핵심 정보 + 상세보기 */}
        <CaseInfoPanel caseDetail={caseDetail} />
        {/* 섹션 목록 */}
        <CaseSectionsPanel sections={sections} idState={sectionIdState} />
      </div>
      {/* 우측 에디터 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {selectedSection && (
            <Editor
              key={selectedSection.id} // id값이 바뀔때마다 에디터 재렌더링
              section={selectedSection}
              contentsState={contentsState}
            />
          )}
        </div>
      </div>
    </div>
  );
}
