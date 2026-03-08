"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import EditorToolbar from "./EditorToolbar";
import { useAutoSave } from "../hooks/useAutoSave";
import { saveSectionContent } from "../actions/case";
import { MakeState } from "@/app/calendar/types";
import { CaseDetail } from "../types";

interface Props {
  section: CaseDetail["sections"][number];
  contentsState: MakeState<Record<string, string>>;
  editable?: boolean;
}

export default function Editor({
  section,
  contentsState,
  editable = true,
}: Props) {
  const [contents, setContents] = contentsState;
  const currentContent = contents[section.id];

  const saveStatus = useAutoSave({
    content: currentContent,
    saveFn: async (c: string) => {
      const result = await saveSectionContent(section.id, c);
      if (!result.isSuccess) throw new Error(result.message);
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: currentContent ? JSON.parse(currentContent) : "",
    editable,
    onUpdate: ({ editor }) => {
      // setContent(JSON.stringify(editor.getJSON()));
      setContents((prev) => ({
        ...prev,
        [section.id]: JSON.stringify(editor.getJSON()),
      }));
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md">
      {editable && (
        <div className="flex items-center justify-between border-b">
          <EditorToolbar editor={editor} />
          <span className="text-xs text-muted-foreground px-2">
            {saveStatus === "saving" && "저장 중..."}
            {saveStatus === "saved" && "저장됨 ✓"}
            {saveStatus === "error" && "저장 실패 ✗"}
          </span>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-64 focus:outline-none"
      />
    </div>
  );
}
