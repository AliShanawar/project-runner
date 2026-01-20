import { type ReactNode, type ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Search, UploadCloud, Loader2, FileText } from "lucide-react";
import { useSiteStore } from "@/store/site.store";
import { toast } from "sonner";
import type { Site } from "@/types";
import { PaginationControls } from "@/components/PaginationControls";
import { showSuccessToast } from "@/lib/utils";
import { uploadImageToS3 } from "@/lib/uploadImageToS3";

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
    getAllSites,
    createSite,
    updateSite,
    deleteSite,
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
    siteMap: "",
  });
  const [isUploadingSiteMap, setIsUploadingSiteMap] = useState(false);

  // Fetch sites when page or pageSize changes
  useEffect(() => {
    getAllSites({ page: currentPage, limit: pageSize }).catch((err) => {
      toast.error("Failed to fetch sites");
      console.error(err);
    });
  }, [currentPage, pageSize, getAllSites]);

  // Handle site creation
  const siteMapFileName = formData.siteMap
    ? decodeURIComponent(
        formData.siteMap.split("/").pop()?.split("?")[0] ?? "Uploaded file",
      )
    : "";
  const siteMapExtension =
    siteMapFileName.split(".").pop()?.toLowerCase() ?? "";
  const isImageSiteMap = ["png", "jpg", "jpeg", "svg"].includes(
    siteMapExtension,
  );

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
        siteMap: formData.siteMap || undefined,
      });
      setActiveModal("createSuccess");
      setFormData({
        name: "",
        address: "",
        latitude: 0,
        longitude: 0,
        siteMap: "",
      });
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
        location: {
          address: formData.address || "No address provided",
          coordinates: {
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        },
        siteMap: formData.siteMap || undefined,
      });
      setFormData({
        name: "",
        address: "",
        latitude: 0,
        longitude: 0,
        siteMap: "",
      });
      setActiveModal("updateSuccess");
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
      getAllSites({ page: 1, limit: pageSize, search: searchQuery }).catch(
        (err) => {
          toast.error("Failed to fetch sites");
          console.error(err);
        },
      );
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
    getAllSites({ page: 1, limit: newSize, search: searchQuery }).catch(
      (err) => {
        toast.error("Failed to fetch sites");
        console.error(err);
      },
    );
  };

  const handleSiteMapUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSiteMap(true);
    try {
      const { fileUrl } = await uploadImageToS3(file);
      setFormData((prev) => ({ ...prev, siteMap: fileUrl }));
      showSuccessToast("Site map uploaded successfully");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload site map";
      toast.error(errorMessage);
    } finally {
      setIsUploadingSiteMap(false);
      e.target.value = "";
    }
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
                    <div className="text-red-500">Error: {error}</div>
                  </TableCell>
                </TableRow>
              ) : sites?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-gray-500">
                      {searchQuery
                        ? "No sites found matching your search"
                        : "No sites yet. Create your first site!"}
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
                      {site.employeeCounts?.subscontructor ??
                        site.employeeCounts?.subConstructor ??
                        0}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {site.employeeCounts?.forklift ?? 0}
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          site.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {site.status
                          ? site.status.charAt(0).toUpperCase() +
                            site.status.slice(1)
                          : "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-4 text-sm font-medium">
                        <button
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(`/dashboard/sites/${site._id}/tasks`)
                          }
                        >
                          View
                        </button>
                        <button
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedSite(site);
                            setFormData({
                              name: site.name,
                              address: site.location.address,
                              latitude: site.location.coordinates.latitude,
                              longitude: site.location.coordinates.longitude,
                              siteMap: (site as any).siteMap || "",
                            });
                            setActiveModal("edit");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors cursor-pointer"
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
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={total}
            className="px-6 py-4 border-t border-gray-100"
            label="Rows"
          />
        )}
      </div>
      {renderModal()}
    </div>
  );

  function renderOverlay(
    content: ReactNode,
    options?: { labelledBy?: string },
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
        <div className="mx-auto h-32 w-32">
          <img src="/success.svg" alt="Success" className="h-full w-full" />
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
      { labelledBy: titleId },
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
                />

                <Input
                  placeholder="Enter site address (optional)"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
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
                      {isUploadingSiteMap
                        ? "Uploading..."
                        : formData.siteMap
                          ? "Replace file"
                          : "Browse files"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Upload your sitemap file
                    </span>
                    {formData.siteMap && (
                      <div className="mt-3 w-full space-y-2 text-left">
                        {isImageSiteMap ? (
                          <img
                            src={formData.siteMap}
                            alt={siteMapFileName}
                            className="mx-auto h-24 w-full rounded-xl object-contain border border-gray-200 bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                            <FileText className="text-[#8A5BD5] size-6" />
                            <div className="flex flex-col text-xs">
                              <span className="font-medium text-gray-900">
                                {siteMapFileName}
                              </span>
                              <a
                                href={formData.siteMap}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#8A5BD5]"
                              >
                                Open file
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      id="site-map-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.svg"
                      onChange={handleSiteMapUpload}
                      disabled={isUploadingSiteMap}
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
                  setFormData({
                    name: "",
                    address: "",
                    latitude: 0,
                    longitude: 0,
                    siteMap: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg sm:w-32"
                onClick={handleCreateSite}
                disabled={isLoading || isUploadingSiteMap}
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
          { labelledBy: createTitleId },
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Site Name
                  </p>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter site name"
                    className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">Address</p>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter site address (optional)"
                    className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
                  />
                </div>

                {/* <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-800">
                      Site Map
                    </p>
                    <label
                      htmlFor="site-map-upload"
                      className="border border-dashed border-[#8A5BD5]/50 rounded-2xl py-8 px-4 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-[#8A5BD5]"
                    >
                      <UploadCloud className="text-[#8A5BD5] size-8" />
                      <span className="text-sm font-medium text-[#8A5BD5]">
                        {isUploadingSiteMap
                          ? "Uploading..."
                          : formData.siteMap
                          ? "Replace file"
                          : "Browse files"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Upload your sitemap file
                      </span>
                      {formData.siteMap && (
                        <div className="mt-3 w-full space-y-2 text-left">
                          {isImageSiteMap ? (
                            <img
                              src={formData.siteMap}
                              alt={siteMapFileName}
                              className="mx-auto h-24 w-full rounded-xl object-contain border border-gray-200 bg-white"
                            />
                          ) : (
                            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                              <FileText className="text-[#8A5BD5] size-6" />
                              <div className="flex flex-col text-xs">
                                <span className="font-medium text-gray-900">
                                  {siteMapFileName}
                                </span>
                                <a
                                  href={formData.siteMap}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#8A5BD5]"
                                >
                                  Open file
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  </div>
                  <input
                    id="site-map-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.svg"
                    onChange={handleSiteMapUpload}
                    disabled={isUploadingSiteMap}
                  /> */}
              </div>
            </div>
            <div className="px-8 py-6 border-t border-gray-100 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-lg sm:w-32"
                onClick={() => {
                  setActiveModal(null);
                  setFormData({
                    name: "",
                    address: "",
                    latitude: 0,
                    longitude: 0,
                    siteMap: "",
                  });
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
          { labelledBy: editTitleId },
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
          { labelledBy: deleteTitleId },
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
