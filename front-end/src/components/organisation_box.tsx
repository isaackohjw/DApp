"use client";
export default function OrganisationBox({
  name = "Organization Name",
  profilePic,
  roles = [],
  tokens = ["5 ETH"],
}: {
  name: string;
  profilePic: string | null;
  roles: string[];
  tokens: string[];
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-80 mt-6">
      {/* Profile Picture and Organization Name */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {profilePic ? (
            <img
              src={profilePic}
              alt={`${name} Profile`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="bg-gray-400 w-full h-full flex items-center justify-center text-gray-800">
              ?
            </div>
          )}
        </div>
        <span className="ml-4 text-lg font-semibold truncate">{name}</span>
      </div>

      {/* Separator */}
      <hr className="border-gray-300 mb-4" />

      {/* Roles */}
      <div className="flex justify-center gap-2 mb-4">
        {roles.length > 0 ? (
          roles.map((role, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
            >
              {role}
            </div>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No roles assigned</span>
        )}
      </div>

      {/* Separator */}
      <hr className="border-gray-300 mb-4" />

      {/* Tokens */}
      <div className="text-gray-600 flex justify-center items-center">
        <span className="text-sm">{tokens.join(", ")}</span>
      </div>
    </div>
  );
}
