import { Prisma } from "../../../generated/prisma/client";

export type CaseDetail = Prisma.CaseGetPayload<{
  include: {
    sections: true;
    criminalCase: {
      include: {
        criminalDefendants: true;
        compensationApplicants: true;
        trials: {
          include: {
            attendances: {
              include: { defendant: true };
            };
          };
        };
      };
    };
  };
}>;

export type Sections = CaseDetail["sections"];

export type Trial = NonNullable<CaseDetail["criminalCase"]>["trials"][number];

export type TrialAttendance = Trial["attendances"][number];
