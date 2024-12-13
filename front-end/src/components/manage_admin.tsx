import React, { useState } from "react";
import { AdminList } from "@/components/admin_list";
import { AddAdminInput } from "@/components/admin_input";
import { ConfirmationModalAd } from "@/components/admin_confirmation_modal";

interface AddRemoveAdminModalProps {
  onClose: () => void;
}

export const AddRemoveAdminModal = ({
  onClose,
  organizations,
  onSelectOrganization,
  selectedOrganization,
  onAddAdmin,
  newAdmin,
  setNewAdmin,
  isLoading,
  error,
}) => {
  const [adminList, setAdminList] = useState<string[]>([
    "admin1@example.com",
    "admin2@example.com",
    "admin3@example.com",
  ]);
  const [newAdmins, setNewAdmins] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"add" | "remove" | null>(
    null
  );
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);

  // Add admins to the list
  const handleAddAdmins = (admins: string[]) => {
    setNewAdmins(admins);
    setConfirmAction("add");
    setIsConfirmModalOpen(true);
  };

  const confirmAddAdmins = () => {
    setAdminList((prev) => [...prev, ...newAdmins]);
    setNewAdmins([]);
    setIsConfirmModalOpen(false);
  };

  // Remove admin from the list
  const handleRemoveAdmin = (admin: string) => {
    setAdminToRemove(admin);
    setConfirmAction("remove");
    setIsConfirmModalOpen(true);
  };

  const confirmRemoveAdmin = () => {
    setAdminList((prev) => prev.filter((admin) => admin !== adminToRemove));
    setAdminToRemove(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-[24rem] space-y-4 relative">
        {/* Title */}
        <h2 className="text-2xl text-center font-semibold">Admin List</h2>

        {/* Admin List */}
        <AdminList admins={adminList} onRemove={handleRemoveAdmin} />

        {/* Add Admins */}
        <AddAdminInput onAdd={handleAddAdmins} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          ✖
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModalAd
        isOpen={isConfirmModalOpen}
        message={
          confirmAction === "add"
            ? `Are you sure you want to add ${newAdmins.length} admins?`
            : `Are you sure you want to remove ${adminToRemove}?`
        }
        onConfirm={
          confirmAction === "add" ? confirmAddAdmins : confirmRemoveAdmin
        }
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};