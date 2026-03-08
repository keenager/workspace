import { Prisma } from "../../../generated/prisma/client";

export type CaseDetail = Prisma.CaseGetPayload<{
  include: {
    sections: true;
    prosecutors: true;
    criminalDefendants: true;
    compensationApplicants: true;
    lawFirms: {
      include: { handlingAttorneys: true };
    };
    privateDefenders: true;
    publicDefenders: true;
  };
}>;
