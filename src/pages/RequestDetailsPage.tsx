import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user.store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedUser: user, isLoading, getUser, approveRejectUser } = useUserStore();

  useEffect(() => {
    if (id) {
      getUser(id).catch(() => {
        toast.error("Failed to fetch user details");
        navigate("/dashboard/requests");
      });
    }
  }, [id, getUser, navigate]);

  const handleAction = async (action: "approved" | "rejected") => {
    if (!id) return;
    try {
      await approveRejectUser(id, {
        action,
        reason: action === "approved" ? "Account approved" : "Account rejected",
      });
      toast.success(`User ${action}d successfully`);
      navigate("/dashboard/requests");
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#8A5BD5]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-500">
        User not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Request Detail
        </h1>
        <p className="text-muted-foreground text-sm">
          Review the user details and attached documents before approval.
        </p>
      </div>

      <Card className="p-6 border-none">
        <CardContent className="space-y-6">
          {/* Personal Details */}
          <div>
            <h2 className="text-lg font-medium mb-2">Personal Details</h2>
            <div className="flex items-center gap-4">
              <img
                src={user.profilePicture || "https://i.pravatar.cc/60"}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Driving License and Vehicle Card - Placeholder for now as these fields are not in User type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-medium text-sm">Driving License</p>
                <p className="text-xs text-gray-500">--</p>
              </div>
              <span className="text-[#8A5BD5] font-semibold">PDF</span>
            </div>

            <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-medium text-sm">Vehicle Registration Card</p>
                <p className="text-xs text-gray-500">--</p>
              </div>
              <span className="text-[#8A5BD5] font-semibold">PDF</span>
            </div>
          </div>

          {/* Vehicle Details - Placeholder */}
          <div>
            <h3 className="text-md font-medium mb-2">Vehicle Details</h3>
            <p className="text-sm text-gray-600">
              Vehicle Number: <span className="font-medium">--</span>
            </p>
            <p className="text-sm text-gray-600">
              Registration Number:{" "}
              <span className="font-medium">--</span>
            </p>

            <div className="flex gap-3 mt-3">
              {/* Placeholder images */}
              <div className="h-20 w-28 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              className="border-[#8A5BD5] text-[#8A5BD5] hover:bg-[#8A5BD5]/10"
              onClick={() => handleAction("rejected")}
            >
              Reject
            </Button>
            <Button 
              className="bg-[#8A5BD5] hover:bg-[#7A49D1] text-white"
              onClick={() => handleAction("approved")}
            >
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
