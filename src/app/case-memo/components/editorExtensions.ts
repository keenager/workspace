import { mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import { Footnotes, Footnote, FootnoteReference } from "tiptap-footnotes";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const CustomFootnote = Footnote.extend({
  renderHTML({ HTMLAttributes }) {
    const refNumber = (HTMLAttributes.id as string).replace("fn:", "");
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["span", 0],
      ["a", { href: `#fnref:${refNumber}`, class: "footnote-backref" }, "↩"],
    ];
  },
});

export const editorExtensions = [
  StarterKit.configure({
    document: false,
    heading: { levels: [1, 2, 3, 4] },
  }),
  Document.extend({ content: "block+ footnotes?" }),
  Underline,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Highlight,
  Image,
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-500 underline cursor-pointer",
    },
  }),
  Footnotes,
  CustomFootnote,
  FootnoteReference,
];
