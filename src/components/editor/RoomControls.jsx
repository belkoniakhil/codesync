import { Copy, LogOut } from "lucide-react";
export default function RoomControls({
  copyRoomId,
  leaveRoom,
}) {
  return (
    <div className="flex flex-col gap-3">

    <button
  onClick={copyRoomId}
  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
>
  <Copy size={18} />
  Copy Room ID
</button>

<button
  onClick={leaveRoom}
  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition"
>
  <LogOut size={18} />
  Leave Room
</button>

    </div>
  );
}