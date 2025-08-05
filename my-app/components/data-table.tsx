"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import { PlayerPerformance } from "@/lib/api/queries"

// Helper function to convert string to number safely
const parseNumber = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

const columns: ColumnDef<PlayerPerformance>[] = [
  {
    accessorKey: "gamertag",
    header: "Player",
    cell: ({ row }) => <div className="font-medium">{row.getValue("gamertag")}</div>,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => <div className="capitalize">{row.getValue("position") || "N/A"}</div>,
  },
  {
    accessorKey: "games_played",
    header: "Games",
    cell: ({ row }) => <div className="text-center">{row.getValue("games_played")}</div>,
  },
  {
    accessorKey: "avg_points",
    header: "Points",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("avg_points"))
      return <div className="text-center font-medium">{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "avg_assists",
    header: "Assists",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("avg_assists"))
      return <div className="text-center">{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "avg_rebounds",
    header: "Rebounds",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("avg_rebounds"))
      return <div className="text-center">{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "avg_steals",
    header: "Steals",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("avg_steals"))
      return <div className="text-center">{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "avg_blocks",
    header: "Blocks",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("avg_blocks"))
      return <div className="text-center">{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "avg_performance_score",
    header: "Performance",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("avg_performance_score"))
      return <div className="text-center font-semibold">{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "player_rank_score",
    header: "Rank Score",
    cell: ({ row }) => {
      const value = parseNumber(row.getValue("player_rank_score"))
      return <div className="text-center">{value.toFixed(0)}</div>
    },
  },
]

interface DataTableProps {
  data: PlayerPerformance[]
}

export function DataTable({ data }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "avg_performance_score",
      desc: true,
    },
  ])

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
