"use client";

import { useMemo, useState } from "react";

import {
  conversations,
  conversationThreads,
} from "@/dashboard/components/dashboardData";
import { contentClass, headerClass } from "@/dashboard/components/dashboardTheme";
import { cn } from "@/dashboard/components/dashboardUtils";

export default function ChatPanel({ avatarLabel }) {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);

  const activeThread = useMemo(
    () => conversationThreads[activeConversationId] ?? conversationThreads[conversations[0]?.id],
    [activeConversationId],
  );

  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            AI Chat
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            Powered by Claude · Ask anything about your business
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <span className="inline-flex items-center gap-[6px] rounded-[4px] border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.1)] px-[10px] py-[3px] font-['JetBrains_Mono',monospace] text-[10px] text-[var(--amber)]">
            claude-sonnet
          </span>
        </div>
      </div>

      <div className={cn(contentClass, "pt-4")}>
        <div className="grid min-h-[560px] grid-cols-[minmax(220px,260px)_minmax(0,1fr)] gap-[14px] min-[1440px]:min-h-[620px] max-[1080px]:grid-cols-1 max-[1080px]:min-h-0">
          <div className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] max-[1080px]:w-full">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-[14px]">
              <span className="text-[13px] font-semibold text-[var(--white)]">Conversations</span>
              <button
                type="button"
                className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[var(--amber)] text-[16px] text-[var(--bg)]"
              >
                +
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "mb-[2px] cursor-pointer rounded-[7px] px-[10px] py-[10px] text-[12px] transition-all duration-200",
                    activeConversationId === item.id
                      ? "bg-[rgba(245,166,35,0.08)] text-[var(--amber)]"
                      : "text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]",
                  )}
                  onClick={() => setActiveConversationId(item.id)}
                >
                  <div className="mb-[2px] overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                    {item.title}
                  </div>
                  <div className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--subtle)]">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
            <div className="flex items-center gap-[10px] border-b border-[var(--border)] px-[18px] py-[14px] max-[720px]:flex-wrap max-[720px]:px-[14px] max-[720px]:py-3">
              <span className="text-[13px] font-medium text-[var(--white)]">{activeThread.title}</span>
              <span className="ml-auto rounded-[4px] border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.1)] px-[10px] py-[3px] font-['JetBrains_Mono',monospace] text-[10px] text-[var(--amber)]">
                {activeThread.model}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 max-[720px]:p-[14px]">
              {activeThread.messages.map((message, index) => {
                if (message.role === "user") {
                  return (
                    <ChatBubbleMine key={`${activeConversationId}-${index}`} avatarLabel={avatarLabel} time={message.time}>
                      {message.content}
                    </ChatBubbleMine>
                  );
                }

                if (message.role === "assistant") {
                  return (
                    <ChatBubbleBot key={`${activeConversationId}-${index}`} time={message.time}>
                      <FormattedMessage content={message.content} />
                    </ChatBubbleBot>
                  );
                }

                return <TypingBubble key={`${activeConversationId}-${index}`} />;
              })}
            </div>

            <div className="border-t border-[var(--border)] p-[14px]">
              <div className="flex items-end gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3 py-[10px] focus-within:border-[var(--amber)]">
                <textarea
                  className="max-h-[100px] flex-1 resize-none bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--subtle)]"
                  placeholder="Ask anything about your business..."
                  rows={1}
                />
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--amber)] text-[14px] text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)]"
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ChatBubbleMine({ avatarLabel, children, time }) {
  return (
    <div className="flex flex-row-reverse items-start gap-[10px] max-[720px]:flex-col max-[720px]:items-end">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--amber),var(--amber3))] font-['Syne',sans-serif] text-[11px] font-extrabold text-[var(--bg)]">
        {avatarLabel}
      </div>
      <div>
        <div className="max-w-[min(75%,680px)] rounded-[10px] bg-[var(--amber)] px-[14px] py-[11px] text-[13px] font-medium leading-[1.6] text-[var(--bg)] max-[720px]:max-w-full">
          {children}
        </div>
        <div className="mt-[3px] text-right font-['JetBrains_Mono',monospace] text-[9px] text-[var(--subtle)]">
          {time}
        </div>
      </div>
    </div>
  );
}

function ChatBubbleBot({ children, time }) {
  return (
    <div className="flex items-start gap-[10px] max-[720px]:flex-col">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.15)] text-[12px]">
        🤖
      </div>
      <div>
        <div className="max-w-[min(75%,680px)] rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-[11px] text-[13px] leading-[1.6] text-[var(--text)] max-[720px]:max-w-full">
          {children}
        </div>
        <div className="mt-[3px] font-['JetBrains_Mono',monospace] text-[9px] text-[var(--subtle)]">
          {time}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-[10px] max-[720px]:flex-col">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.15)] text-[12px]">
        🤖
      </div>
      <div>
        <div className="inline-flex items-center gap-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-3">
          <div className="h-[6px] w-[6px] animate-bounce rounded-full bg-[var(--muted)]" />
          <div className="[animation-delay:150ms] h-[6px] w-[6px] animate-bounce rounded-full bg-[var(--muted)]" />
          <div className="[animation-delay:300ms] h-[6px] w-[6px] animate-bounce rounded-full bg-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}

function FormattedMessage({ content }) {
  return content.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < content.split("\n").length - 1 ? (
        <>
          <br />
          <br />
        </>
      ) : null}
    </span>
  ));
}
