import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const requests = Array.from({ length: 10 }).map((_, index) => ({
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
  ][index],
  email: `example${index + 1}@mail.com`,
  type: index % 2 === 0 ? "Driver" : "Subcontractor",
  induction: "516286222",
}));

export default function Requests() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Requests</h1>
          <p className="text-muted-foreground text-sm">
            Manage and review all site-related requests.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Request" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Request</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="subcontractor">Subcontractor</SelectItem>
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
                <TableHead className="text-gray-500 font-medium py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((req) => (
                <TableRow
                  key={req.id}
                  className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="py-4 text-gray-800 font-medium">
                    {req.id}
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">
                    {req.name}
                  </TableCell>
                  <TableCell className="text-gray-700">{req.email}</TableCell>
                  <TableCell className="text-gray-700">{req.type}</TableCell>
                  <TableCell className="text-gray-700">
                    {req.induction}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-4 text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/requests/${req.id}`)
                        }
                        className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                      >
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-700 transition-colors">
                        Accept
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-colors">
                        Reject
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
