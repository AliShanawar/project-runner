import { type ReactNode, useState } from "react";
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
import { Check, Search, UploadCloud } from "lucide-react";

const sites = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  name: `Dummy name`,
  activeMembers: 12,
  subcontractors: 2,
  forklifters: 10,
}));

type ModalType =
  | null
  | "create"
  | "createSuccess"
  | "edit"
  | "updateSuccess"
  | "deleteConfirm"
  | "deleteSuccess";

const Sites = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedSite, setSelectedSite] = useState<
    (typeof sites)[number] | null
  >(null);
  const navigate = useNavigate();

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
                  Active Member
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Subcontractor
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Forklifter
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sites.map((site) => (
                <TableRow
                  key={site.id}
                  className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="py-4 text-gray-800 font-medium">
                    {site.id}- {site.name}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {site.activeMembers}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {site.subcontractors}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {site.forklifters}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-4 text-sm font-medium">
                      <button
                        className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                        onClick={() => navigate(`/dashboard/sites/${site.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                        onClick={() => {
                          setSelectedSite(site);
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
              ))}
            </TableBody>
          </Table>
        </div>
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
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg sm:w-32"
                onClick={() => setActiveModal("createSuccess")}
              >
                Create Site
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
                defaultValue={
                  selectedSite ? `${selectedSite.id}- ${selectedSite.name}` : ""
                }
                placeholder="Enter site name"
                className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
              />
            </div>
            <div className="px-8 py-6 border-t border-gray-100 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-lg sm:w-32"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg sm:w-32"
                onClick={() => setActiveModal("updateSuccess")}
              >
                Site Updated
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
                onClick={() => setActiveModal("deleteSuccess")}
              >
                Delete Site
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
