export function Taskbar() {
  return (
    <div className="bg-gray-800 text-white h-12 flex items-center px-4">
      {/* Taskbar Items */}
      <div className="flex-grow">
        <span className="text-lg rainbow-text font-title">
          Voting Application
        </span>
      </div>
      <div className="space-x-4">
        <button className="hover:text-gray-300">Home</button>
        <button className="hover:text-gray-300">About</button>
        <button className="hover:text-gray-300">Settings</button>
      </div>
    </div>
  );
}
