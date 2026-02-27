import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ComponentProps, ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: ComponentProps<typeof AlertDialogAction>["variant"];
  onConfirm: () => void;
  isPending?: boolean;
  children: ReactNode;
}

export default function ConfirmDialog({
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  confirmVariant,
  onConfirm,
  isPending,
  children,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
