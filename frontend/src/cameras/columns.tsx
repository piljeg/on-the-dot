"use client";

import { StructuredTrafficData } from "@/App";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<StructuredTrafficData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "lastDay",
    header: "No. vehicles (24hrs)",
  },
  {
    accessorKey: "lastHour",
    header: "No. vehicles (1hr)",
  },
  {
    accessorKey: "intensity",
    header: "Traffic intensity",
  },
];
