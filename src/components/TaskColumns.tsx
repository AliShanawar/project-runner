import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Package2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type Task = {
  id: number;
  assignedTo: {
    name: string;
    avatar?: string;
  };
  assignedBy: string;
  material: {
    type: string;
    quantity: string;
    icon?: string;
  };
  status: "Pending" | "Completed" | "Cancelled";
};

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as Task["assignedTo"];
      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={assignedTo.avatar} />
            <AvatarFallback className="text-xs">
              {assignedTo.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900">{assignedTo.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignedBy",
    header: "Assigned By",
    cell: ({ row }) => {
      return (
        <span className="text-gray-700">{row.getValue("assignedBy")}</span>
      );
    },
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => {
      const material = row.getValue("material") as Task["material"];
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-orange-600 text-sm">
            <Package2 className="w-4 h-4" />
            {material.type}
          </div>
          <div className="flex items-center gap-1.5 text-orange-800 text-sm">
            <Package2 className="w-4 h-4 fill-orange-800" />
            {material.quantity}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Task["status"];
      return (
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "Completed"
                ? "bg-green-600"
                : status === "Pending"
                ? "bg-blue-600"
                : "bg-red-600"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              status === "Completed"
                ? "text-green-600"
                : status === "Pending"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ViewTaskButton taskId={row.original.id} />,
  },
];

const ViewTaskButton = ({ taskId }: { taskId: number }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="link"
      className="text-blue-600 p-0 h-auto"
      onClick={() => navigate(`/dashboard/tasks/${taskId}`)}
    >
      View
    </Button>
  );
};
