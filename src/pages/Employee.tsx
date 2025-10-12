import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

const employees = Array.from({ length: 11 }).map((_, index) => ({
  id: index + 1,
  name: [
    "Lily Thompson",
    "Ethan Carter",
    "Isabella Kim",
    "Liam Johnson",
    "Emma Rodriguez",
    "Noah Smith",
    "Olivia Martinez",
    "Oliver Brown",
    "Ava Patel",
    "Lucas Davis",
    "Mia Johnson",
  ][index],
  email: `example${index + 1}@mail.com`,
  type: index % 2 === 0 ? "Driver" : "Subcontractor",
  induction: "516266222",
  site: "Site 1",
  avatar: `https://i.pravatar.cc/40?img=${index + 1}`,
}));

export default function Employees() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
        <p className="text-muted-foreground text-sm">
          Manage and organize your employees across all sites.
        </p>
      </div>

      {/* Filter + Search */}
      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="min-w-[160px] rounded-lg">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="driver">Drivers</SelectItem>
              <SelectItem value="subcontractor">Subcontractors</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="text-gray-500 font-medium py-3 w-10">
                  #
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Name
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Email
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Type
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Induction Number
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Site
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="py-4 text-gray-800 font-medium">
                    {emp.id}-
                  </TableCell>
                  <TableCell className="flex items-center gap-3 text-gray-800 font-medium">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    {emp.name}
                  </TableCell>
                  <TableCell className="text-gray-700">{emp.email}</TableCell>
                  <TableCell className="text-gray-700">{emp.type}</TableCell>
                  <TableCell className="text-gray-700">
                    {emp.induction}
                  </TableCell>
                  <TableCell className="text-gray-700">{emp.site}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-4 text-sm font-medium">
                      <button className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors">
                        Change Site
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
