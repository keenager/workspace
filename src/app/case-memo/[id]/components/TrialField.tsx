"use client";

import { useRef, useState } from "react";
import { generateHTML } from "@tiptap/react";
import Editor from "../../components/Editor";
import { useSectionIdStateCtx } from "../../store/SectionsProvider";
import { editorExtensions } from "../../components/editorExtensions";

interface Props {
  label: string;
  value: string;
  onSave: (content: string) => void;
}

export default function TrialField({ label, value, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const sectionId = useSectionIdStateCtx()[0];
  const contentsState = useState({ [label]: value });

  const containerRef = useRef<HTMLDivElement>(null);
  const blurHandler = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setIsEditing(false);
  };

  const preview = value
    ? generateHTML(JSON.parse(value), editorExtensions)
    : '<p class="text-muted-foreground">클릭하여 입력...</p>';

  return (
    <div className="p-3" ref={containerRef} onBlur={blurHandler}>
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      {isEditing ? (
        <Editor
          sectionId={sectionId}
          contentsState={contentsState}
          saveFn={async (content) => onSave(content)}
          editable={isEditing}
        />
      ) : (
        <div
          className="prose max-w-none p-1 min-h-8 cursor-pointer hover:bg-muted/50 rounded transition-colors"
          onClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      )}
    </div>
  );
}
