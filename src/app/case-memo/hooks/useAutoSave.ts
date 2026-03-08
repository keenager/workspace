import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Props {
  content: string;
  saveFn: (content: string) => Promise<void>;
  delay?: number;
}

export const useAutoSave = ({ content, saveFn, delay = 3000 }: Props) => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<NodeJS.Timeout>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        setStatus("saving");
        await saveFn(content);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (error) {
        setStatus("error");
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content]);

  return status;
};
