import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "일정 관리",
};

export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <h1 className="text-center text-2xl">일정 관리</h1>
      {children}
    </div>
  );
}
