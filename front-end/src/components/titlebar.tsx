export function Titlebar({ name = "User", initial = "U" }) {
  return (
    <div className="bg-gray-800 text-white h-16 flex items-center px-4">
      {/* Title */}
      <div className="absolute left-0 right-0 flex justify-center">
        <span className="text-3xl rainbow-text font-title">
          Voting Application
        </span>
      </div>

      {/* Profile Section - Aligning to the right */}
      <div className="flex items-center space-x-2 ml-auto">
        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-xl font-medium">
          {initial}
        </div>
        <span className="text-lg">{name}</span>
      </div>
    </div>
  );
}

// include name and circle of user
