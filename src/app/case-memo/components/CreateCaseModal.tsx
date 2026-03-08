"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCase } from "../actions/case";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateCaseModal({ open, onClose }: Props) {
  const router = useRouter();
  const [caseType, setCaseType] = useState<"CIVIL" | "CRIMINAL">("CRIMINAL");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    formData.set("caseType", caseType);
    setIsLoading(true);
    const result = await createCase(formData);
    setIsLoading(false);

    if (!result.isSuccess) {
      alert(result.message);
      return;
    }

    onClose();
    router.push(`/case-memo/${result.caseId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 사건 등록</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {/* 사건 유형 */}
          <div>
            <label className="text-sm font-medium">사건 유형</label>
            <Select
              value={caseType}
              onValueChange={(v) => setCaseType(v as "CIVIL" | "CRIMINAL")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRIMINAL">형사</SelectItem>
                <SelectItem value="CIVIL">민사</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 사건번호 */}
          <div>
            <label className="text-sm font-medium">사건번호</label>
            <Input name="caseNumber" placeholder="예: 2024고합123" required />
          </div>

          {/* 사건명 */}
          {caseType === "CIVIL" && (
            <div>
              <label className="text-sm font-medium">사건명</label>
              <Input name="caseName" placeholder="예: 손해배상" required />
            </div>
          )}
          {/* 법원명 */}
          <div>
            <label className="text-sm font-medium">법원명</label>
            <Input name="court" placeholder="예: 서울중앙지방법원" required />
          </div>

          {/* 접수일 */}
          <div>
            <label className="text-sm font-medium">접수일</label>
            <Input name="filedAt" type="date" required />
          </div>

          {/* 죄명 (형사만) */}
          {caseType === "CRIMINAL" && (
            <div>
              <label className="text-sm font-medium">죄명</label>
              <Input name="crimeTitle" placeholder="예: 사기, 횡령" required />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "등록 중..." : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
