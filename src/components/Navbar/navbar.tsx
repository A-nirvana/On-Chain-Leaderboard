import { UserPill } from "@privy-io/react-auth/ui";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-semibold">On Chain</h1>
      <UserPill/>
    </nav>
  );
}
