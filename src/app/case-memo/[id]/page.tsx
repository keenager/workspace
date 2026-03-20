import { notFound } from "next/navigation";
import { getCaseDetail } from "../actions/case";
import CaseMemoClient from "./components/CaseMemoClient";

interface Props {
  params: { id: string };
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getCaseDetail(id);
  if (!result.isSuccess) notFound();

  return <CaseMemoClient caseDetail={result.data} />;
}
