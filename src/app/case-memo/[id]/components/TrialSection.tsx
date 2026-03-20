"use client";

import { useState, useTransition } from "react";
import { CaseDetail, Trial } from "../../types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddTrialModal from "./AddTrialModal";
import {
  createTrial,
  deleteTrial,
  updateAttendance,
  updateTrial,
} from "../../actions/case";
import { toast } from "sonner";
import TrialCard from "./TrialCard";

interface Props {
  caseDetail: CaseDetail;
  initialTrials: Trial[];
}

export default function TrialSection({ caseDetail, initialTrials }: Props) {
  const [trials, setTrials] = useState<Trial[]>(initialTrials);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defendants = caseDetail.criminalCase?.criminalDefendants ?? [];

  const handleCreate = (date: Date) => {
    startTransition(async () => {
      const result = await createTrial(
        caseDetail.criminalCase!.id,
        date,
        defendants.map((d) => d.id),
      );
      if (!result.isSuccess) {
        toast(result.message);
        return;
      }
      setTrials((prev) => [...prev, result.data]);
      setModalOpen(false);
    });
  };

  const handleDelete = (trialId: string) => {
    startTransition(async () => {
      const result = await deleteTrial(trialId);
      if (!result.isSuccess) {
        toast(result.message);
        return;
      }
      setTrials((prev) => prev.filter((t) => t.id !== trialId));
    });
  };

  const handleUpdate = (
    trialId: string,
    data: {
      date?: Date;
      checkItems?: string;
      proceedings?: string;
      submissions?: string;
    },
  ) => {
    startTransition(async () => {
      const result = await updateTrial(trialId, data);
      if (!result.isSuccess) {
        toast(result.message);
        return;
      }
      setTrials((prev) =>
        prev.map((t) => (t.id === trialId ? result.data : t)),
      );
    });
  };

  const handleUpdateAttendance = (
    attendanceId: string,
    trialId: string,
    data: { isPresent: boolean; isSummonsServed: boolean | null },
  ) => {
    startTransition(async () => {
      const result = await updateAttendance(attendanceId, trialId, data);
      if (!result.isSuccess) {
        toast(result.message);
        return;
      }
      setTrials((prev) =>
        prev.map((t) =>
          t.id === trialId
            ? {
                ...t,
                attendances: t.attendances.map((a) =>
                  a.id === attendanceId ? { ...a, ...result.data } : a,
                ),
              }
            : t,
        ),
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">기일 진행</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          기일 추가
        </Button>
      </div>

      {trials.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          등록된 기일이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {trials.map((trial, index) => (
            <TrialCard
              key={trial.id}
              currentTrial={trial}
              trials={trials}
              defaultOpen={index === trials.length - 1}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onUpdateAttendance={handleUpdateAttendance}
            />
          ))}
        </div>
      )}

      <AddTrialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreate}
        isPending={isPending}
      />
    </div>
  );
}
