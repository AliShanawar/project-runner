import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inventory = [
  {
    id: 1,
    name: "Sand",
    quantity: 10,
    unit: "Cubic m",
    icon: "/assets/inventory/sand.png",
  },
  {
    id: 2,
    name: "Cement Bags",
    quantity: 500,
    unit: "Bags",
    icon: "/assets/inventory/cement.png",
  },
  {
    id: 3,
    name: "Steel Rods",
    quantity: 10,
    unit: "Tons",
    icon: "/assets/inventory/steel.png",
  },
  {
    id: 4,
    name: "Bricks",
    quantity: 10000,
    unit: "Units",
    icon: "/assets/inventory/bricks.png",
  },
  {
    id: 5,
    name: "Gravel",
    quantity: 150,
    unit: "Cubic m",
    icon: "/assets/inventory/gravel.png",
  },
  {
    id: 6,
    name: "Paint Buckets (20L)",
    quantity: 293,
    unit: "Buckets",
    icon: "/assets/inventory/paint.png",
  },
];

const SiteInventory = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm">
            Manage and track all inventory items available for this site.
          </p>
        </div>

        <Button className="border border-[#8A5BD5] text-[#8A5BD5] hover:bg-[#8A5BD5] hover:text-white rounded-lg">
          Add Inventory
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="text-gray-500 font-medium">
                  Name
                </TableHead>
                <TableHead className="text-gray-500 font-medium">
                  Quantity
                </TableHead>
                <TableHead className="text-gray-500 font-medium">
                  Unit
                </TableHead>
                <TableHead className="text-gray-500 font-medium text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {inventory.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="flex items-center gap-3 py-3 font-medium text-gray-800">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                    {item.id}- {item.name}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-gray-700">{item.unit}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    <button className="text-[#8A5BD5] hover:text-[#7A4EC3] mr-3 transition-colors">
                      History
                    </button>
                    <button className="text-[#8A5BD5] hover:text-[#7A4EC3] mr-3 transition-colors">
                      Edit
                    </button>
                    <button className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors">
                      Delete
                    </button>
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

export default SiteInventory;
