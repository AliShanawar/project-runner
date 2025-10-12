import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const members = [
  {
    id: 1,
    name: "Lily Thompson",
    email: "example1@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 2,
    name: "Ethan Carter",
    email: "example2@mail.com",
    type: "Subcontractor",
    assignedTask: "-",
  },
  {
    id: 3,
    name: "Isabella Kim",
    email: "example11@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 4,
    name: "Liam Johnson",
    email: "example3@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 5,
    name: "Emma Rodriguez",
    email: "example8@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 6,
    name: "Noah Smith",
    email: "example4@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 7,
    name: "Olivia Martinez",
    email: "example9@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 8,
    name: "Oliver Brown",
    email: "example5@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 9,
    name: "Ava Patel",
    email: "example10@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 10,
    name: "Lucas Davis",
    email: "example6@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
  {
    id: 11,
    name: "Mia Johnson",
    email: "example7@mail.com",
    type: "Driver",
    assignedTask: 5,
  },
];

const ActiveMembers = () => {
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesType =
        filterType === "all" || m.type.toLowerCase() === filterType;
      const matchesSearch =
        search.trim().length === 0 ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filterType, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Active Members
        </h1>
        <p className="text-muted-foreground text-sm">
          View all members currently assigned to this site.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="subcontractor">Subcontractor</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned Task</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredMembers.map((member, index) => (
                <TableRow
                  key={member.id}
                  className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="flex items-center gap-3 py-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://i.pravatar.cc/40?img=${member.id}`}
                      />
                      <AvatarFallback>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-800 font-medium">
                      {index + 1}- {member.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-gray-700">{member.type}</TableCell>
                  <TableCell className="text-gray-700 text-center">
                    {member.assignedTask}
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default ActiveMembers;
