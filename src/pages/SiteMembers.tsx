import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

const members = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ["Lily Thompson", "Ethan Carter", "Isabella Kim", "Liam Johnson"][
    i % 4
  ],
  email: `example${i + 1}@mail.com`,
  type: i % 3 === 0 ? "Subcontractor" : "Driver",
  assignedTasks: i % 3 === 0 ? "-" : 5,
  avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
}));

const SiteMembers = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Active Members</h1>
        <p className="text-gray-500 text-sm">
          Manage and track all team members assigned to this site.
        </p>
      </div>

      {/* Filter + Search */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select defaultValue="all">
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="drivers">Drivers</SelectItem>
              <SelectItem value="subcontractors">Subcontractors</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search members"
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="text-gray-500 font-medium">
                  Name
                </TableHead>
                <TableHead className="text-gray-500 font-medium">
                  Email
                </TableHead>
                <TableHead className="text-gray-500 font-medium">
                  Type
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-right">
                  Assigned Tasks
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow
                  key={m.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="flex items-center gap-3 py-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {m.name}
                  </TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell className="text-right">
                    {m.assignedTasks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SiteMembers;
