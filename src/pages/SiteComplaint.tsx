import React from "react";
import { useNavigate } from "react-router-dom";

const complaints = [
  {
    id: 1,
    author: "Lily Thompson",
    avatar: "/assets/users/lily.png",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem...",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem. Praesent tincidunt fermentum lectus quis condimentum. Quisque porttitor, neque ut volutpat semper, massa massa gravida massa, nec volutpat sapien arcu sed.",
    date: "12-Dec-2023",
    isNew: true,
  },
  {
    id: 2,
    author: "Lily Thompson",
    avatar: "/assets/users/lily.png",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem...",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem. Praesent tincidunt fermentum lectus quis condimentum. Quisque porttitor, neque ut volutpat semper, massa massa gravida massa, nec volutpat sapien arcu sed.",
    date: "12-Dec-2023",
    isNew: false,
  },
  {
    id: 3,
    author: "Lily Thompson",
    avatar: "/assets/users/lily.png",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem...",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget aliquam sem. Praesent tincidunt fermentum lectus quis condimentum. Quisque porttitor, neque ut volutpat semper, massa massa gravida massa, nec volutpat sapien arcu sed.",
    date: "12-Dec-2023",
    isNew: false,
  },
];

const SiteComplaint = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Complaint</h1>
        <p className="text-gray-500 text-sm">
          View and track complaints raised by site members.
        </p>
      </div>

      {/* Complaints List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
        {complaints.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/dashboard/complain/${item.id}`)}
            className="p-5 border border-gray-100 rounded-2xl hover:shadow-sm transition-all bg-white cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-gray-900 font-medium leading-snug text-[15px] flex-1">
                {item.title}
              </h3>

              <div className="flex items-center gap-2">
                {item.isNew && (
                  <span className="bg-[#8A5BD5]/10 text-[#8A5BD5] text-xs font-medium px-3 py-1 rounded-full">
                    New
                  </span>
                )}
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">{item.description}</p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-4">
              <img
                src={item.avatar}
                alt={item.author}
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="text-sm font-medium text-gray-800">{item.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteComplaint;
