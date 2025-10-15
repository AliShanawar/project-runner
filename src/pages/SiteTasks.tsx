import { useState } from "react";
import { Search } from "lucide-react";
import { TaskDataTable } from "@/components/TaskDataTable";
import { taskColumns, type Task } from "@/components/TaskColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    assignedTo: { name: "Lily Thompson" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Pending",
  },
  {
    id: 2,
    assignedTo: { name: "Ethan Carter" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Completed",
  },
  {
    id: 3,
    assignedTo: { name: "Isabella Kim" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Cancelled",
  },
  {
    id: 4,
    assignedTo: { name: "Liam Johnson" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Completed",
  },
  {
    id: 5,
    assignedTo: { name: "Emma Rodriguez" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Pending",
  },
  {
    id: 6,
    assignedTo: { name: "Noah Smith" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Completed",
  },
  {
    id: 7,
    assignedTo: { name: "Olivia Martinez" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Pending",
  },
  {
    id: 8,
    assignedTo: { name: "Oliver Brown" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Completed",
  },
  {
    id: 9,
    assignedTo: { name: "Ava Patel" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Pending",
  },
  {
    id: 10,
    assignedTo: { name: "Lucas Davis" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Completed",
  },
  {
    id: 11,
    assignedTo: { name: "Mia Johnson" },
    assignedBy: "Lily Thompson",
    material: { type: "1 Ton", quantity: "200 unit" },
    status: "Pending",
  },
];

const SiteTasks = () => {
  const [memberFilter, setMemberFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className=" rounded-lg p-8 bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Task</h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={memberFilter} onValueChange={setMemberFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="lily">Lily Thompson</SelectItem>
              <SelectItem value="ethan">Ethan Carter</SelectItem>
              <SelectItem value="isabella">Isabella Kim</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Data Table */}
        <TaskDataTable columns={taskColumns} data={mockTasks} />
      </div>
    </div>
  );
};

export default SiteTasks;
