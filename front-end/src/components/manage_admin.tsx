interface AddRemoveAdminModalProps {
  onClose: () => void;
}

export const AddRemoveAdminModal: React.FC<AddRemoveAdminModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-96">
        <h2 className="text-xl">Add or Remove Admins</h2>
        {/* For simplicity, here you could add inputs or a list of current admins */}
        <input
          type="text"
          placeholder="Admin Username"
          className="mt-4 w-full px-4 py-2 rounded-md"
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => console.log("Admin Added")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Add Admin
          </button>
          <button
            onClick={() => console.log("Admin Removed")}
            className="bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Remove Admin
          </button>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-6 py-2 mt-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
