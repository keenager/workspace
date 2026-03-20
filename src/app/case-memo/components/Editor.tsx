"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import EditorToolbar from "./EditorToolbar";
import { useAutoSave } from "../hooks/useAutoSave";
import { MakeState } from "@/app/calendar/types";
import { useSectionsCtx } from "../store/SectionsProvider";
import { useEffect } from "react";
import { editorExtensions } from "./editorExtensions";

interface Props {
  sectionId: string;
  contentsState: MakeState<Record<string, string>>;
  saveFn?: (content: string) => Promise<void>;
  editable?: boolean;
}

export default function Editor({
  sectionId,
  contentsState,
  saveFn,
  editable = true,
}: Props) {
  const [contents, setContents] = contentsState; // 보통의 경우에는 {sectionId: content, ...}, 기일 진행 상황의 경우 {"체크 사항": content}
  let currentContent;

  const isTrial =
    useSectionsCtx().find((s) => s.id === sectionId)!.sectionType === "TRIAL";

  if (isTrial) {
    currentContent = Object.values(contents)[0];
  } else {
    currentContent = contents[sectionId!];
  }

  const saveStatus = useAutoSave({
    content: currentContent,
    saveFn: saveFn,
  });

  const editor = useEditor({
    extensions: editorExtensions,
    content: currentContent ? JSON.parse(currentContent) : "",
    editable,
    onUpdate: ({ editor }) => {
      if (isTrial) {
        const label = Object.keys(contents)[0];
        const newContents = {
          [label]: JSON.stringify(editor.getJSON()),
        };
        setContents(newContents);
      } else {
        setContents((prev) => ({
          ...prev,
          [sectionId!]: JSON.stringify(editor.getJSON()),
        }));
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
    if (editable) editor.commands.focus();
  }, [editable, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md">
      {editable && (
        <div className="flex items-center justify-between border-b">
          <EditorToolbar editor={editor} />
          {saveFn && (
            <span className="text-xs text-muted-foreground px-2">
              {saveStatus === "saving" && "저장 중..."}
              {saveStatus === "saved" && "저장됨 ✓"}
              {saveStatus === "error" && "저장 실패 ✗"}
            </span>
          )}
        </div>
      )}
      <EditorContent
        editor={editor}
        className={`prose max-w-none p-4 focus:outline-none ${editable ? "min-h-64" : "min-h-0"}`}
      />
    </div>
  );
}
