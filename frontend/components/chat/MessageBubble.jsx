import { format } from "date-fns";
import { motion } from "framer-motion";

function TickIcon({ status }) {
  if (status === "sent") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        className="text-muted-light"
      >
        <path
          d="M3.5 8.5L6.5 11.5L12.5 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "delivered") {
    return (
      <svg
        width="18"
        height="14"
        viewBox="0 0 20 16"
        fill="none"
        className="text-muted-light"
      >
        <path
          d="M2 8.5L5 11.5L11 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 8.5L10 11.5L16 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "read") {
    return (
      <svg
        width="18"
        height="14"
        viewBox="0 0 20 16"
        fill="none"
        className="text-blue-400"
      >
        <path
          d="M2 8.5L5 11.5L11 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 8.5L10 11.5L16 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return null;
}

export default function MessageBubble({ message, isMine }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[75%] md:max-w-[65%] px-3.5 py-2.5 text-sm leading-relaxed
          ${
            isMine
              ? "bg-[#2a2d3a] text-white/90 rounded-2xl rounded-br-md border border-white/[0.06]"
              : "bg-panel-light text-white/90 rounded-2xl rounded-bl-md border border-white/[0.04]"
          }
        `}
      >
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
        <div
          className={`flex items-center gap-1 mt-1.5 ${isMine ? "justify-end" : "justify-end"}`}
        >
          <span
            className={`text-[10px] tabular-nums ${isMine ? "text-white/60" : "text-muted"}`}
          >
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          {isMine && <TickIcon status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
}
