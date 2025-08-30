
"use client";
import { useEffect, useMemo, useState } from "react";

export default function SenderPage() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [title, setTitle] = useState("Hello from 3000");
  const [body, setBody] = useState("This is a test message");

  const [selectedUserId, setSelectedUserId] = useState("");

  async function loadUsers() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-users`);
      const data = await res.json();
      if (data.success) setUsers(data.users || []);
    } catch (e) {
      console.error("loadUsers error:", e);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function toggle(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.has(u._id)),
    [users, selectedIds]
  );

  // Send notification
  async function send(usersToSend = [], mode = null) {
    try {
      // Loop through users and send personalized notification
      for (const user of usersToSend) {
        const personalizedBody = `Hello ${user.name}, ${body}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            body: personalizedBody,
            tokens: [user.token],
          }),
        });

        const data = await res.json();
        console.log("Sent to", user.name, data);
      }

    if (mode === "broadcast") {
  for (const user of users) {
    const personalizedBody = `Hello ${user.name}, ${body}`;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: personalizedBody, tokens: [user.token] }),
    });
  }
}

      alert("Notifications sent!");
      loadUsers();
    } catch (err) {
      console.error("send error:", err);
      alert("Send failed: " + err.message);
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1 className="font-bold">Sender Page</h1>

      <section style={{ display: "flex", gap: 8 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
      </section>

      <div className="flex justify-around">

        {/* Broadcast */}
        <div>
          <h1 className="font-bold">Send All Users</h1>
          <button
            onClick={() => send([], "broadcast")}
            className="px-3 py-2 rounded-2xl bg-blue-400 hover:bg-blue-300 cursor-pointer"
          >
            Broadcast to All
          </button>
        </div>

        {/* Single User Dropdown */}
        <section>
          <h2 className="font-bold">Send to Particular User</h2>
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
          <button
            className="px-3 py-1 rounded-2xl ml-4 bg-blue-400 hover:bg-blue-300 cursor-pointer"
            disabled={!selectedUserId}
            onClick={() => {
              const user = users.find((u) => u._id === selectedUserId);
              if (user) send([user]);
            }}
          >
            Send
          </button>
        </section>

        {/* Multiple Users */}
        <section>
          <h2 className="font-bold">Select Users</h2>
          {users.map((u) => (
            <label key={u._id} style={{ display: "block" }}>
              <input type="checkbox" checked={selectedIds.has(u._id)} onChange={() => toggle(u._id)} />
              {u.name}
            </label>
          ))}
          <button
            onClick={() => send(selectedUsers)}
            className="px-3 py-1 bg-blue-400 hover:bg-blue-300 cursor-pointer rounded-2xl"
          >
            Send
          </button>
        </section>
      </div>
    </main>
  );
}
