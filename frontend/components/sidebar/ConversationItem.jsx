import { formatDistanceToNow } from "date-fns";

export default function ConversationItem({ contact, active, onClick }) {
  const { user, lastMessage, lastTime } = contact;

  return (
    <button
      onClick={onClick}
      className={`
        group w-full flex items-center gap-3 px-4 py-3 text-left
        transition-all duration-200 relative
        ${
          active
            ? "bg-white/[0.06] border-l-2 border-primary"
            : "border-l-2 border-transparent hover:bg-white/[0.03]"
        }
      `}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`
          w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm text-white
          ${active ? "bg-gradient-to-br from-primary to-primary-dark shadow-glow" : "bg-white/[0.08]"}
          transition-all duration-200
        `}
        >
          {user.displayName?.[0]?.toUpperCase()}
        </div>
        {user.isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-panel flex items-center justify-center">
            <span className="w-full h-full rounded-full bg-emerald-400 animate-pulse-soft" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span
            className={`font-medium text-[13px] truncate ${active ? "text-white" : "text-white/90"}`}
          >
            {user.displayName}
          </span>
          {lastTime && (
            <span className="text-[11px] text-muted flex-shrink-0 ml-2 tabular-nums">
              {formatDistanceToNow(new Date(lastTime), { addSuffix: false })}
            </span>
          )}
        </div>
        <p className="text-xs text-muted truncate mt-0.5 leading-relaxed">
          {lastMessage ?? ""}
        </p>
      </div>
    </button>
  );
}
