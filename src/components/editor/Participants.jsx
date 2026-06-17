import { Users } from "lucide-react";
export default function Participants({
  users,
}) {
  return (
    <div className="bg-slate-700 p-4 rounded-lg">

      <div className="flex items-center gap-2 mb-3">
  <Users size={20} />
  <h3 className="text-lg font-semibold">
    Participants ({users.length})
  </h3>
</div>
      <div className="space-y-2">

        {users.map((user) => (
          <div
            key={user.socketId}
            className="bg-slate-600 px-3 py-2 rounded-md"
          >
            🟢 {user.username}
          </div>
        ))}

      </div>

    </div>
  );
}