function Message({ message, currentUser }) {
  const isOwnMessage =
    message.username === currentUser;

  return (
    <div
      className={`flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          isOwnMessage
            ? "bg-blue-600"
            : "bg-slate-700"
        }`}
      >
        <p className="text-xs text-slate-300">
          {message.username}
        </p>

        <p className="text-sm break-words">
          {message.text}
        </p>

        <p className="text-[10px] text-slate-400 text-right">
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

export default Message;