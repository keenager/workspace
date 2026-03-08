import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Memo",
  description: "사건 메모",
};

export default async function CaseMemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <h1 className="text-center text-2xl">사건 메모</h1>
      {children}
    </div>
  );
}
