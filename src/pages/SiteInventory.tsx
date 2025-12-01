import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { inventoryService } from "@/api/services/inventory.service";
import { authService } from "@/api/services/auth.service";
import { PaginationControls } from "@/components/PaginationControls";
import type { InventoryItem } from "@/types";
import { toast } from "sonner";

type DialogMode = "add" | "edit" | "delete" | null;

const SiteInventory = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    itemUnit: "",
    image: "",
  });

  useEffect(() => {
    setPage(1);
  }, [limit]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await inventoryService.getAllItems({
          page,
          limit,
        });
        setItems(response.inventory || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load inventory";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [page, limit]);

  const openAddDialog = () => {
    setFormData({ name: "", quantity: "", itemUnit: "", image: "" });
    setSelectedItem(null);
    setDialogMode("add");
  };

  const openEditDialog = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      itemUnit: item.itemUnit || "",
      image: item.image || "",
    });
    setSelectedItem(item);
    setDialogMode("edit");
  };

  const openDeleteDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogMode("delete");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedItem(null);
    setFormData({ name: "", quantity: "", itemUnit: "", image: "" });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploadingFile(true);
    try {
      const response = await authService.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        image: response.url,
      }));
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setIsUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (dialogMode === "add") {
        const newItem = await inventoryService.createItem({
          name: formData.name,
          quantity: Number(formData.quantity),
          itemUnit: formData.itemUnit || undefined,
          image: formData.image || undefined,
        });
        // Add new item to the beginning of the list
        setItems([newItem, ...items]);
        toast.success("Item added successfully");
      } else if (dialogMode === "edit" && selectedItem) {
        await inventoryService.updateItem(selectedItem._id, {
          name: formData.name,
          quantity: Number(formData.quantity),
          itemUnit: formData.itemUnit || undefined,
          image: formData.image || undefined,
        });
        // Update item in the list
        setItems(
          items.map((item) =>
            item._id === selectedItem._id
              ? {
                  ...item,
                  name: formData.name,
                  quantity: Number(formData.quantity),
                  itemUnit: formData.itemUnit,
                  image: formData.image,
                }
              : item
          )
        );
        toast.success("Item updated successfully");
      }
      closeDialog();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Operation failed";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      await inventoryService.deleteItem(selectedItem._id);
      setItems(items.filter((item) => item._id !== selectedItem._id));
      toast.success("Item deleted successfully");
      closeDialog();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete item";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <Button
          onClick={openAddDialog}
          className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg px-5"
        >
          Add Inventory
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="px-6 py-4">
          {isLoading && items.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600 py-8">
              <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
              Loading inventory...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-destructive py-8">
              <AlertCircle className="size-5" />
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="text-gray-500 py-8">No inventory items found.</div>
          ) : (
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
                {items.map((item) => (
                  <TableRow
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                  >
                    <TableCell className="flex items-center gap-3 py-3 font-medium text-gray-800">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <span>{item.name}</span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {item.itemUnit}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      <button className="text-[#8A5BD5] hover:text-[#7A4EC3] mr-3 transition-colors cursor-pointer">
                        History
                      </button>
                      <button
                        onClick={() => openEditDialog(item)}
                        className="text-[#8A5BD5] hover:text-[#7A4EC3] mr-3 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteDialog(item)}
                        className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination and Limit Selector */}
        {items.length > 0 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={limit}
            onPageSizeChange={setLimit}
            pageSizeOptions={[5, 10, 20, 50]}
            className="border-t border-gray-100 px-6 py-4"
          />
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogMode === "add" || dialogMode === "edit"}
        onOpenChange={closeDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add New Inventory" : "Edit Inventory"}
            </DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              hendrerit dictum augue a malesuada molestie justo quis pretium.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Item Name *
              </label>
              <Input
                name="name"
                placeholder="Enter item name"
                value={formData.name}
                onChange={handleFormChange}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <Input
                name="quantity"
                type="number"
                placeholder="Item quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <Input
                name="itemUnit"
                placeholder="Item unit"
                value={formData.itemUnit}
                onChange={handleFormChange}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Item Picture
              </label>
              {formData.image ? (
                <div className="mt-1 border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Image uploaded
                        </p>
                        <p className="text-xs text-gray-500">
                          Click remove to change
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#8A5BD5] hover:bg-[#8A5BD5]/5 transition-colors"
                >
                  <Upload className="size-6 text-[#8A5BD5] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    <button
                      type="button"
                      className="text-[#8A5BD5] hover:text-[#7A4EC3] font-medium"
                    >
                      Browse files
                    </button>
                    {" or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploadingFile}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              className="border-[#8A5BD5] text-[#8A5BD5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {dialogMode === "add" ? "Adding..." : "Updating..."}
                </>
              ) : dialogMode === "add" ? (
                "Add New Inventory"
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogMode === "delete"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Inventory</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              hendrerit dictum augue a malesuada molestie justo quis pretium.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              className="border-[#8A5BD5] text-[#8A5BD5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Inventory"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteInventory;
