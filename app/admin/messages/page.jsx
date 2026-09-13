"use client";

import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaTrash,
  FaCheck,
  FaReply,
  FaArchive,
  FaExclamationTriangle,
} from "react-icons/fa";

const statusOptions = [
  "new",
  "read",
  "replied",
  "archived",
];

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/contact");

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateMessage = async (id, updates) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((previous) =>
          previous.map((message) =>
            message._id === id
              ? data.message
              : message
          )
        );

        if (selectedMessage?._id === id) {
          setSelectedMessage(data.message);
        }
      }
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((previous) =>
          previous.filter(
            (message) => message._id !== id
          )
        );

        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "read":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "replied":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "archived":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter(
          (message) => message.status === filter
        );

  const newMessages = messages.filter(
    (message) => message.status === "new"
  ).length;

  return (
    <div className="min-h-screen bg-[#0d1224] p-4 text-white sm:p-6 lg:p-8">

      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Messages
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Manage messages received from your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#1f2937] bg-[#111827] px-4 py-3">
            <FaEnvelope className="text-[#16f2b3]" />

            <span className="text-sm text-gray-300">
              {newMessages} new
            </span>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">

          {[
            "all",
            "new",
            "read",
            "replied",
            "archived",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                filter === status
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-[#1f2937] bg-[#111827] text-gray-400 hover:border-[#374151] hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}

        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-10 text-center">
            <p className="text-gray-400">
              Loading messages...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredMessages.length === 0 && (
          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-12 text-center">

            <FaEnvelope
              className="mx-auto mb-4 text-gray-600"
              size={40}
            />

            <h2 className="text-lg font-semibold">
              No messages found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Messages submitted through your contact form
              will appear here.
            </p>

          </div>
        )}

        {/* Messages */}
        {!loading && filteredMessages.length > 0 && (
          <div className="space-y-4">

            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`rounded-xl border bg-[#111827] p-5 transition-all duration-200 hover:border-[#374151] ${
                  message.status === "new"
                    ? "border-violet-500/30"
                    : "border-[#1f2937]"
                }`}
              >

                {/* Top */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-lg font-semibold">
                        {message.name}
                      </h2>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
                          message.status
                        )}`}
                      >
                        {message.status}
                      </span>

                      {message.isSpam && (
                        <span className="flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-400">
                          <FaExclamationTriangle />
                          Spam
                        </span>
                      )}

                    </div>

                    <a
                      href={`mailto:${message.email}`}
                      className="mt-1 block text-sm text-[#16f2b3] hover:underline"
                    >
                      {message.email}
                    </a>

                    {message.subject && (
                      <p className="mt-3 font-medium text-gray-200">
                        {message.subject}
                      </p>
                    )}

                  </div>

                  <p className="shrink-0 text-xs text-gray-500">
                    {message.createdAt
                      ? new Date(
                          message.createdAt
                        ).toLocaleString()
                      : ""}
                  </p>

                </div>

                {/* Message */}
                <div className="mt-4 rounded-lg border border-[#1f2937] bg-[#0f172a] p-4">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {message.message}
                  </p>

                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">

                  {message.status === "new" && (
                    <button
                      onClick={() =>
                        updateMessage(message._id, {
                          status: "read",
                        })
                      }
                      className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400 transition hover:bg-yellow-500/20"
                    >
                      <FaEye />
                      Mark Read
                    </button>
                  )}

                  {message.status !== "replied" && (
                    <button
                      onClick={() =>
                        updateMessage(message._id, {
                          status: "replied",
                        })
                      }
                      className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-400 transition hover:bg-green-500/20"
                    >
                      <FaReply />
                      Mark Replied
                    </button>
                  )}

                  {message.status !== "archived" && (
                    <button
                      onClick={() =>
                        updateMessage(message._id, {
                          status: "archived",
                        })
                      }
                      className="flex items-center gap-2 rounded-lg border border-gray-500/20 bg-gray-500/10 px-3 py-2 text-xs text-gray-400 transition hover:bg-gray-500/20"
                    >
                      <FaArchive />
                      Archive
                    </button>
                  )}

                  <button
                    onClick={() =>
                      updateMessage(message._id, {
                        isSpam: !message.isSpam,
                      })
                    }
                    className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs text-orange-400 transition hover:bg-orange-500/20"
                  >
                    <FaExclamationTriangle />

                    {message.isSpam
                      ? "Remove Spam"
                      : "Mark Spam"}
                  </button>

                  <button
                    onClick={() =>
                      setSelectedMessage(message)
                    }
                    className="flex items-center gap-2 rounded-lg border border-[#374151] bg-[#0f172a] px-3 py-2 text-xs text-gray-300 transition hover:border-violet-500 hover:text-white"
                  >
                    <FaEye />
                    View
                  </button>

                  <button
                    onClick={() =>
                      deleteMessage(message._id)
                    }
                    className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/20"
                  >
                    <FaTrash />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#374151] bg-[#111827] p-6 shadow-2xl">

            <div className="mb-6 flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold">
                  Message Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedMessage.createdAt
                    ? new Date(
                        selectedMessage.createdAt
                      ).toLocaleString()
                    : ""}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="rounded-lg border border-[#374151] px-3 py-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5">

              <div>
                <p className="mb-1 text-xs uppercase text-gray-500">
                  Name
                </p>

                <p className="text-gray-200">
                  {selectedMessage.name}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase text-gray-500">
                  Email
                </p>

                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-[#16f2b3] hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase text-gray-500">
                  Subject
                </p>

                <p className="text-gray-200">
                  {selectedMessage.subject ||
                    "No subject"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase text-gray-500">
                  Message
                </p>

                <div className="rounded-lg border border-[#1f2937] bg-[#0f172a] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() => {
                    updateMessage(
                      selectedMessage._id,
                      {
                        status: "read",
                      }
                    );
                  }}
                  className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400"
                >
                  <FaCheck />
                  Mark Read
                </button>

                <button
                  onClick={() => {
                    updateMessage(
                      selectedMessage._id,
                      {
                        status: "replied",
                      }
                    );
                  }}
                  className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400"
                >
                  <FaReply />
                  Mark Replied
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminMessages;