"use client";

import { CaseDetail } from "../../types";
import CaseInfoPanel from "./CaseInfoPanel";
import CaseSectionsPanel from "./CaseSectionsPanel";
import SectionsProvider from "../../store/SectionsProvider";
import SectionDetail from "./SectionDetail";

interface Props {
  caseDetail: CaseDetail;
}

export default function CaseMemoClient({ caseDetail }: Props) {
  return (
    <SectionsProvider sections={caseDetail.sections}>
      <div className="flex h-screen overflow-hidden">
        {/* 좌측 패널 */}
        <div className="w-64 border-r flex flex-col shrink-0 overflow-hidden">
          {/* 핵심 정보 + 상세보기 */}
          <CaseInfoPanel caseDetail={caseDetail} />
          {/* 섹션 목록 */}
          <CaseSectionsPanel />
        </div>
        {/* 우측 에디터 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <SectionDetail caseDetail={caseDetail} />
          </div>
        </div>
      </div>
    </SectionsProvider>
  );
}
