"use client";

import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Table,
  Underline,
  Undo,
} from "lucide-react";

interface Props {
  editor: Editor;
}

export default function EditorToolbar({ editor }: Props) {
  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("이미지의 URL을 입력하세요.");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };
  return (
    <div className="flex flex-wrap gap-1 p-2">
      {/* 실행취소/다시실행 */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>

      <div className="w-px bg-border mx-1" />

      {/* 개요 */}
      {[1, 2, 3].map((level) => (
        <Button
          key={level}
          type="button"
          variant={editor.isActive("heading", { level }) ? "default" : "ghost"}
          size="sm"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 })
              .run()
          }
        >
          H{level}
        </Button>
      ))}

      <div className="w-px bg-border mx-1" />

      {/* 텍스트 서식 */}
      <Button
        type="button"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("underline") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("strike") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("highlight") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      <div className="w-px bg-border mx-1" />

      {/* 정렬 */}
      {(["left", "center", "right"] as const).map((align) => {
        const Icon =
          align === "left"
            ? AlignLeft
            : align === "center"
              ? AlignCenter
              : AlignRight;
        return (
          <Button
            key={align}
            type="button"
            variant={
              editor.isActive({ textAlign: align }) ? "default" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}

      <div className="w-px bg-border mx-1" />

      {/* 목록 */}
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <div className="w-px bg-border mx-1" />

      {/* 표 */}
      <Button type="button" variant="ghost" size="sm" onClick={addTable}>
        <Table className="w-4 h-4" />
      </Button>

      {/* 이미지 */}
      <Button type="button" variant="ghost" size="sm" onClick={addImage}>
        <Image className="w-4 h-4" />
      </Button>
    </div>
  );
}
