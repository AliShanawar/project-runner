import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RequestDetail() {
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
                src="https://i.pravatar.cc/60"
                alt="User"
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-medium">Alex Johnson</p>
                <p className="text-sm text-gray-500">Driver</p>
              </div>
            </div>
          </div>

          {/* Driving License and Vehicle Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-medium text-sm">User Name Driving License</p>
                <p className="text-xs text-gray-500">867 Kb</p>
              </div>
              <span className="text-[#8A5BD5] font-semibold">PDF</span>
            </div>

            <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-medium text-sm">Vehicle Registration Card</p>
                <p className="text-xs text-gray-500">867 Kb</p>
              </div>
              <span className="text-[#8A5BD5] font-semibold">PDF</span>
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-md font-medium mb-2">Vehicle Details</h3>
            <p className="text-sm text-gray-600">
              Vehicle Number: <span className="font-medium">12345671234</span>
            </p>
            <p className="text-sm text-gray-600">
              Registration Number:{" "}
              <span className="font-medium">12345671234</span>
            </p>

            <div className="flex gap-3 mt-3">
              <img
                src="https://picsum.photos/120/80?1"
                alt="Vehicle"
                className="rounded-lg object-cover h-20 w-28"
              />
              <img
                src="https://picsum.photos/120/80?2"
                alt="Vehicle"
                className="rounded-lg object-cover h-20 w-28"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              className="border-[#8A5BD5] text-[#8A5BD5]"
            >
              Reject
            </Button>
            <Button className="bg-[#8A5BD5] hover:bg-[#7A49D1] text-white">
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
