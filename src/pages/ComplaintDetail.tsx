import React from "react";
import { useParams } from "react-router-dom";

const ComplaintDetail = () => {
  const { id } = useParams();

  const complaint = {
    id,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem. Praesent tincidunt fermentum lectus quis condimentum. Quisque porttitor, neque ut volutpat semper, massa massa gravida massa, nec volutpat sapien arcu sed neque.
    
Phasellus lobortis urna et sem rutrum mollis. Nam bibendum fringilla quam nec tristique. Sed sagittis eget turpis sit amet molestie. Praesent sodales fringilla tincidunt. Donec ac lacinia lacus. Nulla sit amet nisi massa. Vestibulum lacus nisl, tincidunt eu lorem vel, aliquam condimentum libero. Vestibulum mattis lacus vitae ultrices interdum. Mauris vitae semper lorem. Cras vulputate et nisi quis vestibulum. Ut auctor mauris a est bibendum, nec convallis elit fringilla. Ut vitae faucibus arcu, vel malesuada mauris. Morbi dolor.`,
    date: "12-Dec-2023",
    media: ["/assets/complaints/img1.jpg", "/assets/complaints/img2.jpg"],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-semibold text-gray-900">
          Complaint Detail
        </h1>
        <p className="text-sm text-gray-500">{complaint.date}</p>
      </div>

      {/* Detail Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
        <h3 className="text-gray-900 font-medium leading-snug">
          {complaint.title}
        </h3>

        <p className="text-sm text-gray-600 whitespace-pre-line">
          {complaint.description}
        </p>

        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-3">Media</h4>
          <div className="flex gap-4 flex-wrap">
            {complaint.media.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Complaint media ${idx + 1}`}
                className="w-40 h-40 object-cover rounded-xl border border-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
