import MonacoEditor from "@monaco-editor/react";

export default function CodeEditor({
  code,
  setCode,
  socket,
  isRemoteUpdate,
}) {
  return (
    <MonacoEditor
      height="100vh"
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={(value) => {
        const newCode = value || "";

        setCode(newCode);

        if (isRemoteUpdate.current) {
          isRemoteUpdate.current = false;
          return;
        }

        socket.emit("CODE_CHANGE", {
          code: newCode,
        });
      }}
    />
  );
}