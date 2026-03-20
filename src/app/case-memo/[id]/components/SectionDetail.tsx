import { useState } from "react";
import Editor from "../../components/Editor";
import {
  useSectionIdStateCtx,
  useSectionsCtx,
} from "../../store/SectionsProvider";
import TrialSection from "./TrialSection";
import { saveSectionContent } from "../../actions/case";
import { CaseDetail } from "../../types";

interface Props {
  caseDetail: CaseDetail;
}

export default function SectionDetail({ caseDetail }: Props) {
  const sections = useSectionsCtx();
  const [selectedSectionId] = useSectionIdStateCtx();
  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const contentsState = useState<Record<string, string>>(
    Object.fromEntries(sections.map((s) => [s.id, s.content])),
  ); // selectedSection이 바뀔때마다 에디터가 재렌더링되기 때문에 contents 상태관리를 에디터와 분리

  if (!selectedSection) return null;

  return selectedSection.sectionType === "TRIAL" ? (
    <TrialSection
      key={selectedSection.id}
      caseDetail={caseDetail}
      initialTrials={caseDetail.criminalCase?.trials ?? []}
    ></TrialSection>
  ) : (
    <Editor
      key={selectedSection.id} // id값이 바뀔때마다 에디터 재렌더링
      sectionId={selectedSection.id}
      contentsState={contentsState}
      saveFn={async (c: string) => {
        const result = await saveSectionContent(selectedSection.id, c);
        if (!result.isSuccess) throw new Error(result.message);
      }}
    />
  );
}
