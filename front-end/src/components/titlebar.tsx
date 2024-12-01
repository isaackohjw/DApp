export function Titlebar({ name = "User", initial = "U" }) {
  return (
    <div className="text-white h-12 flex items-center px-4 pt-4 pb-4">
      {/* Title */}
      <div className="absolute left-0 right-0 flex justify-left ml-8 mt-2">
        <span className="text-2xl rainbow-text font-title leading-normal">
          Voting Application
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-2 ml-auto text-body mt-2">
        <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-base font-body ">
          {initial}
        </div>
        <span className="text-base font-body">{name}</span>
      </div>
    </div>
  );
}
