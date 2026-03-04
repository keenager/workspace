"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { respondToEvent, deleteEvent } from "@/app/calendar/actions/event";
import type { SessionUser } from "@/lib/auth";
import { ExtendedProps, MakeState } from "@/app/calendar/types";
import { EventImpl } from "@fullcalendar/core/internal";
import BasicInfo from "./BasicInfo";
import AssigneesStatus from "./AssigneesStatus";

interface Props {
  open: boolean;
  session: SessionUser;
  event?: EventImpl;
  setModalOpen: MakeState<boolean>[1][];
}

export default function EventDetailModal({
  open,
  session,
  event,
  setModalOpen,
}: Props) {
  if (!event) return null;

  const [rejectMode, setRejectMode] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { requestedBy, assignees } = event.extendedProps as ExtendedProps;
  const isRequester = requestedBy?.id === session.id;
  const myAssignee = assignees?.find((a) => a.user.id === session.id);
  const isPending = myAssignee?.status === "PENDING";

  const [setAddEditModalOpen, setDetailModalOpen] = setModalOpen;

  const handleConfirm = async () => {
    if (!myAssignee) return;
    setIsLoading(true);
    await respondToEvent(myAssignee.id, "CONFIRMED");
    setIsLoading(false);
    setComment("");
    setDetailModalOpen(false);
  };

  const handleReject = async () => {
    if (!myAssignee || !comment.trim()) return;
    setIsLoading(true);
    await respondToEvent(myAssignee.id, "REJECTED", comment);
    setIsLoading(false);
    setComment("");
    setDetailModalOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setIsLoading(true);
    await deleteEvent(event.id);
    setIsLoading(false);
    setDetailModalOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setDetailModalOpen(false);
        setRejectMode(false);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 기본 정보 */}
          <BasicInfo event={event} />
          {/* 담당자별 상태 */}
          <AssigneesStatus assignees={assignees ?? []} />
          {/* 거절 사유 입력 */}
          {rejectMode && (
            <div>
              <p className="text-sm font-medium mb-1">거절 사유</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="거절 사유를 입력해주세요"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {/* 내가 담당자이고 아직 PENDING인 경우 */}
          {isPending && !rejectMode && (
            <>
              <Button
                variant="outline"
                onClick={() => setRejectMode(true)}
                disabled={isLoading}
              >
                거절
              </Button>
              <Button onClick={handleConfirm} disabled={isLoading}>
                수락
              </Button>
            </>
          )}

          {/* 거절 사유 입력 중 */}
          {rejectMode && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setComment("");
                  setRejectMode(false);
                }}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!comment.trim() || isLoading}
              >
                거절 확정
              </Button>
            </>
          )}

          {/* 내가 요청자인 경우 */}
          {isRequester && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setAddEditModalOpen(true);
                  setDetailModalOpen(false);
                }}
                disabled={isLoading}
              >
                수정
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                삭제
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
