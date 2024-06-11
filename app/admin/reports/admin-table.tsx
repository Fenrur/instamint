"use client"

import {useEffect, useState} from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable, ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const defaultPagination: number = 0
const maxPagination: number = 50

interface ReportsSectionProps {
  reports: {
    type: string,
    element: string,
    reason: string,
    user: string,
  }[]
}

type AdminReportsType = {
  type: string,
  element: string,
  reason: string,
  user: string,
}

export function generateColumns(): ColumnDef<AdminReportsType>[] {
  return [
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "element",
      cell: ({ row }) => <div className="lowercase">{row.getValue("element")}</div>,
    },
    {
      accessorKey: "reason",
      cell: ({ row }) => <div className="lowercase">{row.getValue("reason")}</div>,
    },
    {
      accessorKey: "user",
      cell: ({ row }) => <div className="lowercase">{row.getValue("user")}</div>,
    },
  ]
}

export function AdminTable({reports}:ReportsSectionProps) {
  const [data, setData] = useState<AdminReportsType[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: defaultPagination,
    pageSize: maxPagination,
  })
  const columns = generateColumns()

  useEffect(() => {
    setData(reports)
  }, [reports])
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })


  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter types..."
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("type")?.setFilterValue(event.target.value)
          }
          }
          className="max-w-sm"/>
        <Input
          placeholder="Filter elements..."
          value={(table.getColumn("element")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("element")?.setFilterValue(event.target.value)
          }
          }
          className="max-w-sm"/>
        <Input
        placeholder="Filter users..."
        value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
        table.getColumn("user")?.setFilterValue(event.target.value)
        }
        }
        className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="grid grid-cols-4">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="flex justify-center items-center">
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
                  className="grid grid-cols-4"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="mx-auto">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
