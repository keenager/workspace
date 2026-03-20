import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const users = [
    { name: "전부장", email: "jeon@scourt.go.kr", password: "1234" },
    { name: "김배석", email: "kim@scourt.go.kr", password: "1234" },
    { name: "이배석", email: "lee@scourt.go.kr", password: "1234" },
  ];

  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
      },
    });
    createdUsers.push(created);
  }

  const testCase = await prisma.case.upsert({
    where: { id: "test-case-1" },
    update: {},
    create: {
      id: "test-case-1",
      caseType: "CRIMINAL",
      caseNumber: "2026고합123",
      caseName: "특가법위반(절도)",
      court: "제주지방법원",
      filedAt: new Date("2026-01-01"),
      criminalCase: {
        create: {
          prosecutors: "박검사",
          criminalDefendants: {
            create: [
              {
                name: "나범인",
                birthDate: new Date("2000-01-01"),
                address: "서울시 강남구 테헤란로 123",
                order: 1,
                crimeTitle: "사기",
                isDetained: true,
                detentionDate: new Date("2025. 12. 30."),
                detentionPlace: "제주구치소",
                arrestDate: new Date("2025-12-28"),
                isMandatoryPublicDefense: true,
                mandatoryReason: "DETAINED",
                privateDefender: "변호사 너무죄",
              },
              {
                name: "김영수",
                birthDate: new Date("1975-11-20"),
                address: "서울시 서초구 서초대로 456",
                order: 2,
                crimeTitle: "횡령",
                isDetained: false,
                isMandatoryPublicDefense: false,
                privateDefender: "변호사 너감형",
              },
              {
                name: "이철민",
                birthDate: new Date("1990-03-08"),
                address: "서울시 송파구 올림픽로 789",
                order: 3,
                crimeTitle: "배임",
                isDetained: false,
                isMandatoryPublicDefense: true,
                mandatoryReason: "POVERTY",
                publicDefender: "변호사 너성실(국선)",
              },
            ],
          },
          compensationApplicants: {
            create: [
              {
                name: "박피해",
                birthDate: new Date("1985-07-22"),
                address: "서울시 마포구 홍익로 111",
                claimAmount: 50000000,
                claimReason: "사기로 인한 손해배상",
                order: 1,
              },
              {
                name: "최피해",
                birthDate: new Date("1978-09-10"),
                address: "서울시 용산구 이태원로 222",
                claimAmount: 30000000,
                claimReason: "횡령으로 인한 손해배상",
                order: 2,
              },
            ],
          },
        },
      },
      sections: {
        create: [
          { title: "공소사실", content: "", order: 0, sectionType: "EDITOR" },
          { title: "쟁점 정리", content: "", order: 1, sectionType: "EDITOR" },
          { title: "기일 진행", content: "", order: 2, sectionType: "TRIAL" },
          {
            title: "피고인 주장",
            content: "",
            order: 3,
            sectionType: "EDITOR",
          },
          {
            title: "관련 법리 및 판례",
            content: "",
            order: 4,
            sectionType: "EDITOR",
          },
          {
            title: "증거 및 제출서류",
            content: "",
            order: 5,
            sectionType: "EDITOR",
          },
          { title: "기타 메모", content: "", order: 6, sectionType: "EDITOR" },
        ],
      },
    },
  });

  console.log("시드 완성: ", testCase.caseNumber);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
