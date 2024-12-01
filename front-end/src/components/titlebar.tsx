export function Titlebar({ name = "User", initial = "U" }) {
  return (
    <div className="text-white h-16 flex items-center px-4 mt-2 mb-2">
      {/* Title */}
      <div className="absolute left-0 right-0 flex justify-center">
        <span className="text-4xl rainbow-text font-title leading-normal">
          Voting Application
        </span>
      </div>

      {/* Profile Section - Aligning to the right */}
      <div className="flex items-center space-x-2 ml-auto text-body">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-medium">
          {initial}
        </div>
        <span className="text-sm">{name}</span>
      </div>
    </div>
  );
}
