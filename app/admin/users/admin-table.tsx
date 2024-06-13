"use client"

import {useEffect, useState} from "react"
import DropDownEnableCheckbox from "./drop-down-enable-checkbox"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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

import {AdminDropDownMenu, AdminDropDownMenuProps} from "./admin-dropdown-menu"

const defaultPagination: number = 0
const maxPagination: number = 50

interface UsersSectionProps {
  users: {
    isActivated: boolean,
    email: string,
    id: number,
  }[]
}

type AdminUsersType = {
  id: number
  isActivated: boolean
  email: string
}

export function generateColumns(onDelete: (id: number) => void,
                                changeActivateToFalse: (id: number) => void,
                                changeActivateToTrue: (id: number) => void): ColumnDef<AdminUsersType>[] {
  return [
    {
      accessorKey: "isActivated",
      header: "enabled",
      cell: ({ row }) => {
        const user = row.original
        const props = {
          id: user.id,
          activate: user.isActivated,
          changeActivateToFalse: () => {
            changeActivateToFalse(user.id)
          },
          changeActivateToTrue: () => {
            changeActivateToTrue(user.id)
          },
        }

        return (
          <DropDownEnableCheckbox {...props} />
        )},
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        const props: AdminDropDownMenuProps = {
          enable: true,
          id:user.id,
          onDelete: () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onDelete(user.id)
          }
        }

        return (
          <AdminDropDownMenu {...props} />
        )
      },
    },
  ]
}

export function AdminTable({users}:UsersSectionProps) {
  const [data, setData] = useState<AdminUsersType[]>([])
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
  const columns = generateColumns(id => {
    setData(prevState =>
    {
      return prevState
        .filter(value => {
          return value.id !== id
        })
    }
    )
  },
    id => {
    setData(prevState => {
      return prevState.map(value => {
        if (value.id === id) {
          value.isActivated = false
        }

        return value
      })
    }
    )
  },
    id => {
      setData(prevState => {
          return prevState.map(value => {
            if (value.id === id) {
              value.isActivated = true
            }

            return value
          })
        }
      )
    } )

  useEffect(() => {
    setData(users)
  }, [users])
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
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("email")?.setFilterValue(event.target.value)
          }

          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="grid grid-cols-3">
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
                  className="grid grid-cols-3"
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
            onClick={() => {table.previousPage()}}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {table.nextPage()}}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
