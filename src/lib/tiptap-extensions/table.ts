import { Extension } from "@tiptap/core";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export const TableCombine = Extension.create({
  name: "table-combine",
  addExtensions() {
    return [
      Table.configure({
        resizable: true,
        lastColumnResizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ];
  },
});
