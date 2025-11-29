import { type ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Search, UploadCloud, Loader2 } from "lucide-react";
import { useSiteStore } from "@/store/site.store";
import { toast } from "sonner";
import type { Site } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type ModalType =
  | null
  | "create"
  | "createSuccess"
  | "edit"
  | "updateSuccess"
  | "deleteConfirm"
  | "deleteSuccess";

const Sites = () => {
  const navigate = useNavigate();

  // Zustand store
  const {
    sites,
    isLoading,
    error,
    total,
    page: currentPage,
    limit: currentLimit,
    getAllSites,
    createSite,
    updateSite,
    deleteSite
  } = useSiteStore();

  // Local state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });

  // Fetch sites when page or pageSize changes
  useEffect(() => {
    getAllSites({ page: currentPage, limit: pageSize }).catch((err) => {
      toast.error("Failed to fetch sites");
      console.error(err);
    });

  }, [currentPage, pageSize, getAllSites]);

  // Handle site creation
  const handleCreateSite = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a site name");
      return;
    }

    try {
      await createSite({
        name: formData.name,
        location: {
          address: formData.address || "No address provided",
          coordinates: {
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        },
      });
      setActiveModal("createSuccess");
      setFormData({ name: "", address: "", latitude: 0, longitude: 0 });
    } catch (err) {
      toast.error("Failed to create site");
      console.error(err);
    }
  };

  // Handle site update
  const handleUpdateSite = async () => {
    if (!selectedSite || !formData.name.trim()) {
      toast.error("Please enter a site name");
      return;
    }

    try {
      await updateSite(selectedSite._id, {
        name: formData.name,
      });
      toast.success("Site updated successfully");
      setFormData({ name: "", address: "", latitude: 0, longitude: 0 });
      setActiveModal(null);
      setSelectedSite(null);
    } catch (err) {
      toast.error("Failed to update site");
      console.error(err);
    }
  };

  // Handle site deletion
  const handleDeleteSite = async () => {
    if (!selectedSite) return;

    try {
      await deleteSite(selectedSite._id);
      setActiveModal("deleteSuccess");
      setSelectedSite(null);
    } catch (err) {
      toast.error("Failed to delete site");
      console.error(err);
    }
  };

  // Fetch sites when search query changes (with debounce effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAllSites({ page: 1, limit: pageSize, search: searchQuery }).catch((err) => {
        toast.error("Failed to fetch sites");
        console.error(err);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Pagination helpers
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    getAllSites({ page, limit: pageSize, search: searchQuery }).catch((err) => {
      toast.error("Failed to fetch sites");
      console.error(err);
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    getAllSites({ page: 1, limit: newSize, search: searchQuery }).catch((err) => {
      toast.error("Failed to fetch sites");
      console.error(err);
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Sites</h1>
          <p className="text-muted-foreground text-sm">
            Manage all of your active sites in one place.
          </p>
        </div>
        <Button
          className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg px-5"
          onClick={() => {
            setSelectedSite(null);
            setActiveModal("create");
          }}
        >
          Add New Site
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select defaultValue="all">
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Site</SelectItem>
              <SelectItem value="active">Active Sites</SelectItem>
              <SelectItem value="inactive">Inactive Sites</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="text-gray-500 font-medium py-3">
                  Name
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Location
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Subcontractors
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Forklift Operators
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Status
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
                      <span className="text-gray-500">Loading sites...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-red-500">
                      Error: {error}
                    </div>
                  </TableCell>
                </TableRow>
              ) : sites?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-gray-500">
                      {searchQuery ? "No sites found matching your search" : "No sites yet. Create your first site!"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sites?.map((site) => (
                  <TableRow
                    key={site._id}
                    className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                  >
                    <TableCell className="py-4 text-gray-800 font-medium">
                      {site.name}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {site.location.address}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {site.employeeCounts?.subscontructor ?? site.employeeCounts?.subConstructor ?? 0}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {site.employeeCounts?.forklift ?? 0}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        site.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {site.status ? site.status.charAt(0).toUpperCase() + site.status.slice(1) : 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-4 text-sm font-medium">
                        <button
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                          onClick={() => navigate(`/dashboard/sites/${site._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                          onClick={() => {
                            setSelectedSite(site);
                            setFormData({
                              name: site.name,
                              address: site.location.address,
                              latitude: site.location.coordinates.latitude,
                              longitude: site.location.coordinates.longitude,
                            });
                            setActiveModal("edit");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                          onClick={() => {
                            setSelectedSite(site);
                            setActiveModal("deleteConfirm");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && sites?.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[70px] h-8 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, total)} of {total}
              </span>
            </div>

            {/* Pagination */}
            <Pagination className="!w-auto sm:ml-auto sm:mr-0 sm:justify-end">
              <PaginationContent className="gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={cn(
                      "rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                      currentPage === 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis className="text-gray-400" />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                        isActive={currentPage === page}
                        className={cn(
                          "cursor-pointer rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                          currentPage === page && "border-transparent bg-[#8A5BD5] text-white hover:bg-[#7A4EC3]"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={cn(
                      "rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {renderModal()}
    </div>
  );

  function renderOverlay(
    content: ReactNode,
    options?: { labelledBy?: string }
  ) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={options?.labelledBy}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setActiveModal(null);
          }
        }}
      >
        {content}
      </div>
    );
  }

  function renderSuccessModal({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) {
    const titleId = `${title.toLowerCase().replace(/\s+/g, "-")}-title`;
    return renderOverlay(
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xs px-8 py-10 text-center space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#8A5BD5]/10 relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#8A5BD5]/10" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#8A5BD5] text-white">
            <Check className="size-8" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 id={titleId} className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Button
          className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg w-full"
          onClick={() => setActiveModal(null)}
        >
          Close
        </Button>
      </div>,
      { labelledBy: titleId }
    );
  }

  function renderModal() {
    switch (activeModal) {
      case "create":
        const createTitleId = "add-site-title";
        return renderOverlay(
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
            <div className="px-8 py-6 space-y-6">
              <div>
                <h2
                  id={createTitleId}
                  className="text-xl font-semibold text-gray-900"
                >
                  Add New Site
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipis elit maecenas
                  bibendum.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Enter site name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
                />

                <Input
                  placeholder="Enter site address (optional)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
                />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-800">Site Map</p>
                  <label
                    htmlFor="site-map-upload"
                    className="border border-dashed border-[#8A5BD5]/50 rounded-2xl py-8 px-4 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-[#8A5BD5]"
                  >
                    <UploadCloud className="text-[#8A5BD5] size-8" />
                    <span className="text-sm font-medium text-[#8A5BD5]">
                      Browse files
                    </span>
                    <span className="text-xs text-gray-500">
                      Upload your sitemap file
                    </span>
                    <input
                      id="site-map-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.svg"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-100 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-lg sm:w-32"
                onClick={() => {
                  setActiveModal(null);
                  setFormData({ name: "", address: "", latitude: 0, longitude: 0 });
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg sm:w-32"
                onClick={handleCreateSite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Site"
                )}
              </Button>
            </div>
          </div>,
          { labelledBy: createTitleId }
        );
      case "createSuccess":
        return renderSuccessModal({
          title: "Site Created",
          description:
            "Sed dignissim nisi a vehicula fringilla. Nulla faucibus dui tellus, ut dignissim.",
        });
      case "edit":
        const editTitleId = "edit-site-title";
        return renderOverlay(
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
            <div className="px-8 py-6 space-y-6">
              <div>
                <h2
                  id={editTitleId}
                  className="text-xl font-semibold text-gray-900"
                >
                  Edit Site
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipis elit maecenas
                  bibendum.
                </p>
              </div>

              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter site name"
                className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
              />
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter site address (optional)"
                className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
              />
            </div>
            <div className="px-8 py-6 border-t border-gray-100 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-lg sm:w-32"
                onClick={() => {
                  setActiveModal(null);
                  setFormData({ name: "", address: "", latitude: 0, longitude: 0 });
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg sm:w-32"
                onClick={handleUpdateSite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Site"
                )}
              </Button>
            </div>
          </div>,
          { labelledBy: editTitleId }
        );
      case "deleteConfirm":
        const deleteTitleId = "delete-site-title";
        return renderOverlay(
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
            <div className="px-8 py-6 space-y-4 text-center">
              <h2
                id={deleteTitleId}
                className="text-xl font-semibold text-gray-900"
              >
                Delete Site
              </h2>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                hendrerit dictum augue a malesuada molestie justo quis pretium.
              </p>
            </div>
            <div className="px-8 py-6 border-t border-gray-100 flex flex-col-reverse gap-3 sm:flex-row sm:justify-evenly">
              <Button
                variant="outline"
                className="rounded-lg sm:w-32"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg sm:w-32"
                onClick={handleDeleteSite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Site"
                )}
              </Button>
            </div>
          </div>,
          { labelledBy: deleteTitleId }
        );
      case "deleteSuccess":
        return renderSuccessModal({
          title: "Site Deleted",
          description:
            "Sed dignissim nisi a vehicula fringilla. Nulla faucibus dui tellus, ut dignissim.",
        });
      case "updateSuccess":
        return renderSuccessModal({
          title: "Site Updated",
          description:
            "Sed dignissim nisi a vehicula fringilla. Nulla faucibus dui tellus, ut dignissim.",
        });
      default:
        return null;
    }
  }
};

export default Sites;
