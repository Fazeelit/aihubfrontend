import { documents } from "@/dashboard/components/dashboardData";
import { contentClass, headerClass } from "@/dashboard/components/dashboardTheme";
import { cn, getDocBadgeClass } from "@/dashboard/components/dashboardUtils";

export default function DocumentsPanel({
  activeDocument,
  activeDocumentData,
  onActiveDocumentChange,
}) {
  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Document Intelligence
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            Ask questions about your business documents
          </div>
        </div>
        <div className="flex items-center gap-2 max-[1080px]:w-full max-[1080px]:flex-wrap">
          <button
            type="button"
            className="cursor-pointer rounded-[6px] bg-[var(--amber)] px-[14px] py-[6px] text-[12px] font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
          >
            + Upload Document
          </button>
        </div>
      </div>

      <div className={cn(contentClass, "pt-4")}>
        <div className="grid min-h-[560px] grid-cols-[minmax(240px,280px)_minmax(0,1fr)] gap-[14px] min-[1440px]:min-h-[620px] max-[1080px]:grid-cols-1 max-[1080px]:min-h-0">
          <div className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] max-[1080px]:w-full">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-[14px] max-[720px]:px-[14px] max-[720px]:py-3">
              <span className="text-[13px] font-semibold text-[var(--white)]">Documents</span>
              <button
                type="button"
                className="rounded-[6px] bg-[var(--amber)] px-3 py-[5px] text-[11px] font-semibold text-[var(--bg)]"
              >
                + Upload
              </button>
            </div>
            {documents.map((document) => (
              <div
                key={document.id}
                className={cn(
                  "cursor-pointer border-b border-[var(--border)] px-[14px] py-3 transition-colors duration-200 hover:bg-[var(--bg3)]",
                  activeDocument === document.id && "bg-[rgba(245,166,35,0.07)]",
                )}
                onClick={() => onActiveDocumentChange(document.id)}
              >
                <div className="mb-1 text-[18px]">{document.icon}</div>
                <div className="mb-[2px] text-[12px] font-medium text-[var(--white)]">
                  {document.name}
                </div>
                <div className="text-[10px] text-[var(--muted)]">{document.meta}</div>
                <div
                  className={cn(
                    "mt-1 w-fit rounded-[3px] px-[7px] py-[2px] font-['JetBrains_Mono',monospace] text-[9px]",
                    getDocBadgeClass(document.badgeClass),
                  )}
                >
                  {document.badge}
                </div>
              </div>
            ))}
          </div>

          <div className="flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
            <div className="border-b border-[var(--border)] px-[18px] py-[14px] max-[720px]:px-[14px] max-[720px]:py-3">
              <div className="mb-[2px] text-[13px] font-semibold text-[var(--white)]">
                {activeDocumentData.icon} {activeDocumentData.name}
              </div>
              <div className="text-[11px] text-[var(--muted)]">
                Ask any question about this document
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[14px] overflow-y-auto p-5 max-[720px]:p-[14px]">
              <div className="ml-auto max-w-[min(80%,720px)] self-end rounded-[9px] bg-[var(--amber)] px-[14px] py-3 text-[13px] font-medium leading-[1.6] text-[var(--bg)] max-[720px]:max-w-full">
                What&apos;s our cancellation policy for lessons?
              </div>
              <div className="max-w-[min(80%,720px)] rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-3 text-[13px] leading-[1.6] text-[var(--text)] max-[720px]:max-w-full">
                According to the Student Policy Handbook (Section 4.2), the cancellation policy is:
                <br />
                <br />
                • <strong>24+ hours notice:</strong> Full credit applied to next lesson
                <br />
                • <strong>12-24 hours:</strong> 50% credit applied
                <br />
                • <strong>Less than 12 hours:</strong> No refund or credit
                <br />
                • <strong>No-show:</strong> Lesson forfeited, no refund
                <br />
                <br />
                Students may request a one-time emergency exception per enrollment.
                <div className="mt-[6px] border-t border-[var(--border)] pt-[6px] font-['JetBrains_Mono',monospace] text-[10px] text-[var(--muted)]">
                  📍 Source: Policy Handbook, Section 4.2, Page 11
                </div>
              </div>
              <div className="ml-auto max-w-[min(80%,720px)] self-end rounded-[9px] bg-[var(--amber)] px-[14px] py-3 text-[13px] font-medium leading-[1.6] text-[var(--bg)] max-[720px]:max-w-full">
                What age do students need to be to enroll?
              </div>
              <div className="max-w-[min(80%,720px)] rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-3 text-[13px] leading-[1.6] text-[var(--text)] max-[720px]:max-w-full">
                Students must be at least <strong>15 years and 9 months old</strong> to begin
                driving lessons in Virginia (to obtain a learner&apos;s permit at 15 years 10
                months). In Maryland, the minimum age is <strong>15 years and 9 months</strong> as
                well, with a learner&apos;s permit available at 15 years 10 months.
                <div className="mt-[6px] border-t border-[var(--border)] pt-[6px] font-['JetBrains_Mono',monospace] text-[10px] text-[var(--muted)]">
                  📍 Source: Policy Handbook, Section 2.1, Page 4
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] p-3">
              <div className="flex items-end gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3 py-[10px] focus-within:border-[var(--amber)]">
                <textarea
                  className="max-h-[100px] flex-1 resize-none bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--subtle)]"
                  placeholder="Ask a question about this document..."
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
