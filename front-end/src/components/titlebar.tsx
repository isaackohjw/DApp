export function Titlebar({ name = "User", initial = "U" }) {
  return (
    <div className="text-white h-16 flex items-center px-4 bg-gray-900 fixed top-0 left-0 right-0 z-50">
      {/* Title */}
      <div className="flex justify-left ml-8 mt-2">
        <span className="text-2xl rainbow-text font-title leading-normal">
          Voting Application
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-2 ml-auto text-body mt-2 mr-8">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-base font-body">
          {initial}
        </div>
        <span className="text-base font-body">{name}</span>
      </div>
    </div>
  );
}
