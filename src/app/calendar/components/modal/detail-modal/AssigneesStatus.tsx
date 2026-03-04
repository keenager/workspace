import { Assignee } from "@/app/calendar/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusLabel = {
  PENDING: "대기 중",
  CONFIRMED: "수락",
  REJECTED: "거절",
  DONE: "완료",
};

const statusColor = {
  PENDING: "text-gray-500",
  CONFIRMED: "text-green-600",
  REJECTED: "text-red-500",
  DONE: "text-blue-500",
};

interface Props {
  assignees: Assignee[];
}

export default function AssigneesStatus({ assignees }: Props) {
  return (
    <Table>
      {/* <p className="text-sm font-medium mb-2">담당자 현황</p> */}
      <TableHeader>
        <TableRow>
          <TableHead>담당자</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignees.map((asn) => (
          <TableRow key={asn.id}>
            <TableHead>{asn.user.name}</TableHead>
            <TableHead>
              <div className="flex flex-col ">
                <span className={statusColor[asn.status]}>
                  {statusLabel[asn.status]}
                </span>
                {/* 거절 사유 표시 */}
                {asn.status === "REJECTED" && asn.comment && (
                  <span className="text-xs text-gray-400">{asn.comment}</span>
                )}
              </div>
            </TableHead>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
