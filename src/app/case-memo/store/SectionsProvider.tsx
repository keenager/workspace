import { createContext, ReactNode, useContext, useState } from "react";
import { Sections } from "../types";
import { MakeState } from "@/app/calendar/types";

const SectionsContext = createContext<Sections>([]);
const SectionIdStateContext = createContext<MakeState<string>>(["", () => {}]);

export default function SectionsProvider({
  sections,
  children,
}: {
  sections: Sections;
  children: ReactNode;
}) {
  const sectionIdState = useState<string>(sections[0].id ?? "");
  return (
    <SectionsContext.Provider value={sections}>
      <SectionIdStateContext.Provider value={sectionIdState}>
        {children}
      </SectionIdStateContext.Provider>
    </SectionsContext.Provider>
  );
}

export const useSectionsCtx = () => {
  return useContext(SectionsContext);
};

export const useSectionIdStateCtx = () => {
  return useContext(SectionIdStateContext);
};
