"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { CaseDetail } from "../../types";

type Props = {
  caseDetail: CaseDetail;
};

export default function CaseInfoPanel({ caseDetail }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { criminalCase } = caseDetail;

  const defendants = criminalCase?.criminalDefendants ?? [];
  const defendantSummary =
    defendants.length === 0
      ? "피고인 미등록"
      : defendants.length === 1
        ? defendants[0].name
        : defendants.length < 5
          ? defendants.map((d) => d.name).join(", ")
          : `${defendants[0].name} 외 ${defendants.length - 1}명`;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {/* 항상 보이는 핵심 정보 */}
      <div className="p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              caseDetail.caseType === "CRIMINAL" ? "destructive" : "default"
            }
          >
            {caseDetail.caseType === "CRIMINAL" ? "형사" : "민사"}
          </Badge>
          <span className="font-semibold text-sm">{caseDetail.caseNumber}</span>
        </div>
        {caseDetail.caseType === "CRIMINAL" && (
          <>
            <p className="text-sm">{defendantSummary}</p>
            <p className="text-sm text-muted-foreground">
              {caseDetail.caseName}
            </p>
          </>
        )}
        {caseDetail.caseType === "CIVIL" && (
          <p className="text-sm text-muted-foreground">{caseDetail.caseName}</p>
        )}
      </div>

      {/* 상세보기 토글 */}
      <CollapsibleTrigger className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors border-t">
        {isOpen ? (
          <>
            접기 <ChevronUpIcon className="w-3 h-3" />
          </>
        ) : (
          <>
            상세보기 <ChevronDownIcon className="w-3 h-3" />
          </>
        )}
      </CollapsibleTrigger>

      {/* 펼쳐지는 상세 정보 */}
      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-3 text-sm border-t pt-3">
          {/* 기본 정보 */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              기본 정보
            </p>
            <p>{caseDetail.court}</p>
            <p className="text-muted-foreground">
              {format(new Date(caseDetail.filedAt), "yyyy. MM. dd.", {
                locale: ko,
              })}{" "}
              접수
            </p>
          </div>

          <Separator />

          {/* 형사 당사자 */}
          {caseDetail.caseType === "CRIMINAL" && (
            <div className="space-y-3">
              {/* 검사 */}
              {(criminalCase?.prosecutors.length ?? 0) > 0 && ( //TODO: 형사에 한정된 경우이므로 민사와 형사 분기를 나눈 뒤에 수정 필요
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    검사 {criminalCase?.prosecutors}
                  </p>
                </div>
              )}
              <Separator />

              {/* 피고인 */}
              {defendants.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    피고인
                  </p>
                  {defendants.map((d, i) => (
                    <div key={d.id} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p>{i + 1}.</p>
                        <p className="font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(d.birthDate), "yyyy. MM. dd.", {
                            locale: ko,
                          })}{" "}
                          생
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {d.address}
                      </p>
                      {d.isDetained && (
                        <Badge variant="destructive" className="text-xs">
                          구속 · {d.detentionPlace}
                        </Badge>
                      )}
                      {d.isMandatoryPublicDefense && (
                        <Badge
                          variant="outline"
                          className="text-xs text-orange-600"
                        >
                          필요적 국선
                        </Badge>
                      )}
                      <p>
                        {d.privateDefender} {d.publicDefender}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <Separator />

              {/* 배상신청인 */}
              {(criminalCase?.compensationApplicants.length ?? 0) > 0 && ( //TODO: 형사에 한정된 경우이므로 민사와 형사 분기를 나눈 뒤에 수정 필요
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    배상신청인
                  </p>
                  {criminalCase?.compensationApplicants.map((a) => (
                    <div key={a.id}>
                      <p>{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.claimAmount.toLocaleString()}원
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.claimReason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
