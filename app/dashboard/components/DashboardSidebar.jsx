import {
  accountNav,
  businessNav,
  dashboardNav,
} from "@/dashboard/components/dashboardData";
import { navItemBase } from "@/dashboard/components/dashboardTheme";
import { cn } from "@/dashboard/components/dashboardUtils";

export default function DashboardSidebar({
  activePanel,
  avatarLabel,
  currentPlanPrice,
  currentPlanName,
  displayName,
  onPanelChange,
}) {
  return (
    <div className="flex w-[240px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg2)] min-[1440px]:w-[260px] max-[1080px]:w-full max-[1080px]:border-b max-[1080px]:border-r-0">
      <div className="flex-1 overflow-y-auto py-3 max-[1080px]:grid max-[1080px]:grid-cols-2 max-[1080px]:gap-1 max-[1080px]:p-3 max-[720px]:grid-cols-1">
        <NavSection
          activePanel={activePanel}
          items={dashboardNav}
          label="Main"
          onPanelChange={onPanelChange}
        />

        <StaticSection
          activePanel={activePanel}
          items={businessNav}
          label="Business"
          onPanelChange={onPanelChange}
        />
        <AccountSection activePanel={activePanel} items={accountNav} onPanelChange={onPanelChange} />
      </div>

      <div className="border-t border-[var(--border)] p-[14px] max-[1080px]:p-3">
        <div className="flex cursor-pointer items-center gap-[10px] rounded-[8px] px-3 py-[10px] transition-colors duration-200 hover:bg-[var(--bg3)]">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--amber),var(--amber3))] font-['Syne',sans-serif] text-[12px] font-extrabold text-[var(--bg)]">
            {avatarLabel}
          </div>
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium text-[var(--white)]">
              {displayName}
            </div>
            <div className="text-[10px] text-[var(--muted)] max-[720px]:text-[11px]">
              {currentPlanName} Plan · ${currentPlanPrice}/mo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavSection({ activePanel, items, label, onPanelChange }) {
  return (
    <>
      <div className="px-4 pb-1 pt-2 font-['JetBrains_Mono',monospace] text-[8px] uppercase tracking-[2px] text-[var(--subtle)] max-[1080px]:col-span-full max-[1080px]:px-1 max-[1080px]:pb-1 max-[1080px]:pt-2">
        {label}
      </div>

      {items.map((item) => {
        const isActive = activePanel === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              navItemBase,
              isActive
                ? "bg-[rgba(245,166,35,0.07)] text-[var(--amber)]"
                : "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]",
            )}
            onClick={() => onPanelChange(item.id)}
          >
            {isActive ? (
              <span className="absolute bottom-[6px] left-0 top-[6px] hidden w-[2px] rounded-r-[2px] bg-[var(--amber)] max-[1080px]:hidden lg:block" />
            ) : null}
            <span className="shrink-0 text-[15px]">{item.icon}</span>
            {item.label}
            {item.badge ? (
              <span
                className={cn(
                  "ml-auto rounded-[10px] px-[6px] py-[1px] font-['JetBrains_Mono',monospace] text-[9px] font-semibold text-[var(--bg)]",
                  item.badgeGreen ? "bg-[var(--green)]" : "bg-[var(--amber)]",
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

function StaticSection({ activePanel, items, label, onPanelChange }) {
  return (
    <>
      <div className="mt-2 px-4 pb-1 pt-2 font-['JetBrains_Mono',monospace] text-[8px] uppercase tracking-[2px] text-[var(--subtle)] max-[1080px]:col-span-full max-[1080px]:px-1 max-[1080px]:pb-1 max-[1080px]:pt-2">
        {label}
      </div>

      {items.map((item) => {
        const isInteractive = item.id === "leads" || item.id === "appointments";
        const isActive = isInteractive && activePanel === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              navItemBase,
              isActive
                ? "bg-[rgba(245,166,35,0.07)] text-[var(--amber)]"
                : "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]",
            )}
            onClick={isInteractive ? () => onPanelChange(item.id) : undefined}
          >
            {isActive ? (
              <span className="absolute bottom-[6px] left-0 top-[6px] hidden w-[2px] rounded-r-[2px] bg-[var(--amber)] max-[1080px]:hidden lg:block" />
            ) : null}
            <span className="shrink-0 text-[15px]">{item.icon}</span>
            {item.label}
          </div>
        );
      })}
    </>
  );
}

function AccountSection({ activePanel, items, onPanelChange }) {
  return (
    <>
      <div className="mt-2 px-4 pb-1 pt-2 font-['JetBrains_Mono',monospace] text-[8px] uppercase tracking-[2px] text-[var(--subtle)] max-[1080px]:col-span-full max-[1080px]:px-1 max-[1080px]:pb-1 max-[1080px]:pt-2">
        Account
      </div>

      {items.map((item) => {
        const isActive = item.id === "settings" && activePanel === "settings";

        return (
          <div
            key={item.id}
            className={cn(
              navItemBase,
              isActive
                ? "bg-[rgba(245,166,35,0.07)] text-[var(--amber)]"
                : "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]",
            )}
            onClick={item.id === "settings" ? () => onPanelChange("settings") : undefined}
          >
            {isActive ? (
              <span className="absolute bottom-[6px] left-0 top-[6px] hidden w-[2px] rounded-r-[2px] bg-[var(--amber)] max-[1080px]:hidden lg:block" />
            ) : null}
            <span className="shrink-0 text-[15px]">{item.icon}</span>
            {item.label}
          </div>
        );
      })}
    </>
  );
}
