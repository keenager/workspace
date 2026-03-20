"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from "lucide-react";
import { Trial } from "../../types";
import TrialField from "./TrialField";
import { useSectionsCtx } from "../../store/SectionsProvider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface Props {
  currentTrial: Trial;
  trials: Trial[];
  defaultOpen?: boolean;
  onDelete: (trialId: string) => void;
  onUpdate: (
    trialId: string,
    data: {
      date?: Date;
      checkItems?: string;
      proceedings?: string;
      submissions?: string;
    },
  ) => void;
  onUpdateAttendance: (
    attendanceId: string,
    trialId: string,
    data: {
      isPresent: boolean;
      isSummonsServed: boolean | null;
    },
  ) => void;
}

export default function TrialCard({
  currentTrial,
  trials,
  defaultOpen = false,
  onDelete,
  onUpdate,
  onUpdateAttendance,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleDelete = () => {
    if (!confirm(`${currentTrial.order}기일을 삭제하시겠습니까?`)) return;
    onDelete(currentTrial.id);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg overflow-hidden">
        {/* 헤더 */}
        <CollapsibleTrigger asChild>
          <div className="w-full flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronUpIcon className="w-4 h-4" />
              )}
              <span className="font-semibold text-sm">
                {currentTrial.order}기일
              </span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(currentTrial.date), "yyyy. MM. dd. (eee)", {
                  locale: ko,
                })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // 헤더 클릭 이벤트와 분리
                handleDelete();
              }}
            >
              <Trash2Icon className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </CollapsibleTrigger>

        {/* 본문 */}
        <CollapsibleContent>
          <div className="grid grid-cols-[120px_1fr] divide-x">
            {/* 좌측: 피고인 출석 현황 */}
            <div className="p-3 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                피고인 출석
              </p>
              {currentTrial.attendances.map((attendance) => {
                // 지난 기일 출석한 경우 처리
                const isPresentLastTrial =
                  currentTrial.order > 1 &&
                  trials
                    .find((t) => t.order === currentTrial.order - 1)!
                    .attendances.find(
                      (a) => a.defendantId === attendance.defendantId,
                    )?.isPresent;

                return (
                  <div key={attendance.id} className="space-y-1">
                    <p className="text-sm font-medium">
                      {attendance.defendant.name}
                    </p>
                    {/* 소환장 송달 여부 표시 */}
                    <div className="flex items-center gap-1">
                      {isPresentLastTrial ? (
                        <p className="text-xs text-muted-foreground">
                          지난 기일 출석
                        </p>
                      ) : (
                        <button
                          onClick={() =>
                            onUpdateAttendance(attendance.id, currentTrial.id, {
                              isPresent: attendance.isPresent,
                              isSummonsServed: !attendance.isSummonsServed,
                            })
                          }
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          소환장
                          <Badge
                            variant={
                              attendance.isSummonsServed ? "default" : "outline"
                            }
                            className="ml-1 text-xs"
                          >
                            {attendance.isSummonsServed ? "송달" : "미송달"}
                          </Badge>
                        </button>
                      )}
                    </div>
                    {/* 출석 여부 토글 */}
                    <button
                      onClick={() =>
                        onUpdateAttendance(attendance.id, currentTrial.id, {
                          isPresent: !attendance.isPresent,
                          isSummonsServed: attendance.isPresent
                            ? null
                            : attendance.isSummonsServed,
                        })
                      }
                    >
                      <Badge
                        variant={
                          attendance.isPresent ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {attendance.isPresent ? "출석" : "불출석"}
                      </Badge>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 우측: 체크사항 / 진행사항 / 신청내역 */}
            <div className="divide-y">
              <TrialField
                label="체크사항"
                value={currentTrial.checkItems ?? ""}
                onSave={(content: string) =>
                  onUpdate(currentTrial.id, { checkItems: content })
                }
              />
              <TrialField
                label="진행사항"
                value={currentTrial.proceedings ?? ""}
                onSave={(content: string) =>
                  onUpdate(currentTrial.id, { proceedings: content })
                }
              />
              <TrialField
                label="신청내역"
                value={currentTrial.submissions ?? ""}
                onSave={(content: string) =>
                  onUpdate(currentTrial.id, { submissions: content })
                }
              />
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
