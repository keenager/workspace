"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Superscript,
  Table,
  Underline,
  Undo,
} from "lucide-react";
import { useState } from "react";

interface Props {
  editor: Editor;
}

export default function EditorToolbar({ editor }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const isLink = editor.isActive("link");
  const hasSelection = !editor.state.selection.empty;

  const handleLinkOpen = () => {
    const existingUrl = editor.getAttributes("link").href;

    if (editor.isActive("link")) {
      editor.chain().extendMarkRange("link").run();
    }

    const { from, to } = editor.state.selection;
    const existingText = editor.state.doc.textBetween(from, to);

    setUrl(existingUrl ?? "");
    setLinkText(existingText ?? "");
    setLinkOpen(true);
  };

  const handleLinkConfirm = () => {
    if (!url) return;

    if (isLink) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .deleteSelection()
        .insertContent(`<a href="${url}">${linkText || url}</a>`)
        .run();
    } else if (hasSelection) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${linkText || url}</a>`)
        .run();
    }
    setUrl("");
    setLinkText("");
    setLinkOpen(false);
  };

  const handleLinkRemove = () => {
    editor.chain().focus().unsetLink().run();
    setLinkOpen(false);
  };

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

      {/* 각주 */}
      <Button
        type="button"
        variant={editor.isActive("footnoteReference") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().addFootnote().run()}
      >
        <Superscript className="w-4 h-4" />
      </Button>

      {/* 링크 */}
      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={isLink ? "default" : "ghost"}
            size="sm"
            onClick={handleLinkOpen}
          >
            <Link className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">표시 텍스트</label>
            <Input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="링크 텍스트"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkConfirm();
                }
              }}
            />
          </div>
          <div className="flex gap-2 justify-end">
            {isLink && (
              <Button variant="outline" size="sm" onClick={handleLinkRemove}>
                링크 제거
              </Button>
            )}
            <Button size="sm" onClick={handleLinkConfirm} disabled={!url}>
              확인
            </Button>
          </div>
        </PopoverContent>
      </Popover>

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
