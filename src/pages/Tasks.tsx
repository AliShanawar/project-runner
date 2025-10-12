import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

type TaskStatus = "Pending" | "Completed" | "Cancelled";

type TaskRow = {
  id: number;
  assignedTo: string;
  assignedBy: string;
  material: string;
  reward: string;
  status: TaskStatus;
  avatar?: string;
};

const taskRows: TaskRow[] = [
  {
    id: 1,
    assignedTo: "Lily Thompson",
    assignedBy: "Lily Thompson",
    material: "1 Ton",
    reward: "200 unit",
    status: "Pending",
  },
  {
    id: 2,
    assignedTo: "Ethan Carter",
    assignedBy: "Lily Thompson",
    material: "1 Ton",
    reward: "200 unit",
    status: "Completed",
  },
  {
    id: 3,
    assignedTo: "Isabella Kim",
    assignedBy: "Lily Thompson",
    material: "1 Ton",
    reward: "200 unit",
    status: "Cancelled",
  },
  {
    id: 4,
    assignedTo: "Liam Johnson",
    assignedBy: "Lily Thompson",
    material: "1 Ton",
    reward: "200 unit",
    status: "Completed",
  },
];

const statusStyles: Record<TaskStatus, string> = {
  Pending: "text-[#8A5BD5]",
  Completed: "text-emerald-500",
  Cancelled: "text-red-500",
};

const TaskList = () => {
  const [memberFilter, setMemberFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredTasks = useMemo(() => {
    return taskRows.filter((task) => {
      const matchesMember =
        memberFilter === "all" ||
        task.assignedTo.toLowerCase().includes(memberFilter);
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        `${task.assignedTo} ${task.assignedBy}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesMember && matchesSearch;
    });
  }, [memberFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Task</h1>
        <p className="text-muted-foreground text-sm">
          Track assignments and progress across all site members.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select
            value={memberFilter}
            onValueChange={(value) => setMemberFilter(value)}
          >
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Member</SelectItem>
              <SelectItem value="lily">Lily Thompson</SelectItem>
              <SelectItem value="ethan">Ethan Carter</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <TableHead>#</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Assigned By</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="font-medium">{task.id}.</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://i.pravatar.cc/40?img=${task.id}`}
                        />
                        <AvatarFallback>
                          {getInitials(task.assignedTo)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-800">
                        {task.assignedTo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {task.assignedBy}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {task.material}
                  </TableCell>
                  <TableCell className="text-gray-700">{task.reward}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${statusStyles[task.status]}`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8A5BD5] hover:text-[#7A4EC3]"
                      onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
                    >
                      View
                    </Button>
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

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default TaskList;
