import { ClaimRole as ClaimRoleComponent } from "./components/ClaimRole";

export default function ClaimRole() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Claim Discord Role</h1>
      <div className="max-w-md mx-auto">
        <ClaimRoleComponent />
      </div>
    </div>
  );
}
