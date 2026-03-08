"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { CaseType } from "@/../../generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../../../generated/prisma/client";

export type CaseActionResult = {
  isSuccess: boolean;
  message?: string;
  caseId?: string;
  data?: any;
};

export const saveSectionContent = async (
  sectionId: string,
  content: string,
): Promise<CaseActionResult> => {
  const session = await getSession();
  if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };

  try {
    await prisma.caseSection.update({
      where: { id: sectionId },
      data: { content },
    });
    return { isSuccess: true };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, message: "저장에 실패했습니다." };
  }
};

// 사건 목록 조회
export async function getCases() {
  const session = await getSession();
  if (!session) return [];

  return await prisma.case.findMany({
    // where: { createdById: session.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      caseNumber: true,
      caseType: true,
      caseName: true,
      court: true,
      filedAt: true,
      createdAt: true,
    },
  });
}

const decorate = (
  originalFn: (...args: any[]) => Promise<CaseActionResult>,
  revalidate = true,
) => {
  return async (...args: any[]) => {
    const session = await getSession();
    if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };
    try {
      const result = await originalFn(...args);
      if (revalidate) revalidatePath("/case-memo");
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        return { isSuccess: false, message: error.message };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { isSuccess: false, message: error.message };
      }
      return {
        isSuccess: false,
        message: `알 수 없는 오류 발생: ${(error as Prisma.PrismaClientUnknownRequestError).message}`,
      };
    }
  };
};

// 사건 생성
export const createCase = decorate(
  async (formData: FormData): Promise<CaseActionResult> => {
    const caseType = formData.get("caseType") as CaseType;

    const newCase = await prisma.case.create({
      data: {
        caseNumber: formData.get("caseNumber") as string,
        caseType,
        caseName:
          caseType === "CRIMINAL"
            ? (formData.get("crimeTitle") as string)
            : (formData.get("caseName") as string),
        court: formData.get("court") as string,
        filedAt: new Date(formData.get("filedAt") as string),
        crimeTitle:
          caseType === "CRIMINAL"
            ? (formData.get("crimeTitle") as string)
            : null,
        // createdById: session.id,
        // 기본 섹션 자동 생성
        sections: {
          create:
            caseType === "CRIMINAL"
              ? CRIMINAL_DEFAULT_SECTIONS
              : CIVIL_DEFAULT_SECTIONS,
        },
      },
    });

    return { isSuccess: true, caseId: newCase.id };
  },
);

export const getCaseDetail = decorate(async (caseId: string) => {
  const data = await prisma.case.findFirst({
    where: { id: caseId },
    include: {
      sections: { orderBy: { order: "asc" } },
      prosecutors: { orderBy: { order: "asc" } },
      criminalDefendants: { orderBy: { order: "asc" } },
      compensationApplicants: { orderBy: { order: "asc" } },
      lawFirms: {
        orderBy: { order: "asc" },
        include: { handlingAttorneys: { orderBy: { order: "asc" } } },
      },
      privateDefenders: { orderBy: { order: "asc" } },
      publicDefenders: { orderBy: { order: "asc" } },
    },
  });
  return { isSuccess: true, data };
}, false);

// 사건 삭제
export const deleteCase = decorate(
  async (caseId: string): Promise<CaseActionResult> => {
    await prisma.case.delete({
      where: {
        id: caseId,
        // createdById: session.id
      },
    });

    return { isSuccess: true };
  },
);

// 기본 섹션 템플릿
const CRIMINAL_DEFAULT_SECTIONS = [
  { title: "공소사실", content: "", order: 0 },
  { title: "쟁점 정리", content: "", order: 1 },
  { title: "기일 진행", content: "", order: 2 },
  { title: "피고인 주장", content: "", order: 3 },
  { title: "관련 법리 및 판례", content: "", order: 4 },
  { title: "증거 및 제출서류", content: "", order: 5 },
  { title: "기타 메모", content: "", order: 6 },
];

const CIVIL_DEFAULT_SECTIONS = [
  { title: "쟁점 정리", content: "", order: 0 },
  { title: "기일 진행", content: "", order: 1 },
  { title: "원고 주장", content: "", order: 2 },
  { title: "피고 주장", content: "", order: 3 },
  { title: "관련 법리 및 판례", content: "", order: 4 },
  { title: "증거 및 제출서류", content: "", order: 5 },
  { title: "기타 메모", content: "", order: 6 },
];
