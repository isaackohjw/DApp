// Role type
export type Role = "Voter" | "Admin" | "Owner";

// Role color mapping
export const roleColors: { [key in Role]: string } = {
  Owner: "bg-green-600",
  Admin: "bg-blue-600",
  Voter: "bg-orange-600",
};
