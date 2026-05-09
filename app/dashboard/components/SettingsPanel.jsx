import { settingsTabs } from "@/dashboard/components/dashboardData";
import { contentClass, headerClass } from "@/dashboard/components/dashboardTheme";
import { cn } from "@/dashboard/components/dashboardUtils";
import ToggleBig from "@/dashboard/components/ToggleBig";

const fallbackSettingsTabs = settingsTabs.map((tab, index) => {
  const [icon = "", ...labelParts] = String(tab).split(" ");
  const fallbackIds = ["profile", "notifications", "integrations", "ai-model", "team"];

  return {
    id: fallbackIds[index] ?? `tab-${index + 1}`,
    icon,
    label: labelParts.join(" ") || String(tab),
  };
});

export default function SettingsPanel({
  activeSettingsTabId,
  businessProfile,
  isSaving = false,
  onBusinessProfileChange,
  onSaveChanges,
  onSettingsTabChange,
  onToggleSetting,
  settingsTabItems = fallbackSettingsTabs,
  settingsToggles,
}) {
  const activeTab =
    settingsTabItems.find((tab) => tab.id === activeSettingsTabId) ?? settingsTabItems[0];

  return (
    <>
      <div className={headerClass}>
        <div>
          <div className="font-['Syne',sans-serif] text-[20px] font-extrabold tracking-[-0.5px] text-[var(--white)]">
            Settings
          </div>
          <div className="mt-[2px] text-[12px] text-[var(--muted)] max-[720px]:text-[11px]">
            Manage your account and preferences
          </div>
        </div>
      </div>

      <div className={contentClass}>
        <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-[14px] max-[1080px]:grid-cols-1">
          <div className="h-fit rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-0 py-2">
            {settingsTabItems.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "flex cursor-pointer items-center gap-[10px] px-4 py-[10px] text-[13px] transition-all duration-200",
                  activeSettingsTabId === tab.id
                    ? "bg-[rgba(245,166,35,0.07)] text-[var(--amber)]"
                    : "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]",
                )}
                onClick={() => onSettingsTabChange(tab.id)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-6 max-[720px]:p-4">
            <div className="mb-5 font-['Syne',sans-serif] text-[17px] font-bold text-[var(--white)]">
              {activeTab?.label ?? "Settings"} Settings
            </div>

            <div className="mb-6">
              <div className="mb-3 font-['JetBrains_Mono',monospace] text-[12px] font-semibold uppercase tracking-[1px] text-[var(--muted)]">
                Business Info
              </div>
              <div className="mb-3 grid grid-cols-2 gap-3 max-[1080px]:grid-cols-1">
                <Field
                  label="Business Name"
                  value={businessProfile.businessName}
                  onChange={(value) => onBusinessProfileChange("businessName", value)}
                />
                <Field
                  label="Business Type"
                  value={businessProfile.businessType}
                  onChange={(value) => onBusinessProfileChange("businessType", value)}
                />
              </div>
              <Field
                label="Website"
                value={businessProfile.website}
                onChange={(value) => onBusinessProfileChange("website", value)}
              />
            </div>

            <div className="mb-6">
              <div className="mb-3 font-['JetBrains_Mono',monospace] text-[12px] font-semibold uppercase tracking-[1px] text-[var(--muted)]">
                AI Preferences
              </div>
              <PreferenceRow
                description="claude-sonnet-4 (recommended for Pro plan)"
                enabled={settingsToggles.claude}
                label="Use Claude for AI Chat"
                onClick={() => onToggleSetting("claude")}
              />
              <PreferenceRow
                description="Show AI typing in real-time"
                enabled={settingsToggles.streaming}
                label="Stream responses"
                onClick={() => onToggleSetting("streaming")}
              />
              <PreferenceRow
                border={false}
                description="Store all AI chat sessions in your account"
                enabled={settingsToggles.history}
                label="Save conversation history"
                onClick={() => onToggleSetting("history")}
              />
            </div>

            <button
              type="button"
              disabled={isSaving}
              className="rounded-[7px] bg-[var(--amber)] px-6 py-[10px] font-['Syne',sans-serif] text-[14px] font-bold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--amber2)] max-[720px]:w-full"
              onClick={onSaveChanges}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, onChange, value }) {
  return (
    <div className="mb-4">
      <label className="mb-[5px] block font-['JetBrains_Mono',monospace] text-[11px] font-medium uppercase tracking-[1px] text-[var(--muted)]">
        {label}
      </label>
      <input
        className="w-full rounded-[7px] border border-[var(--border)] bg-[var(--bg)] px-[14px] py-[11px] text-[13px] text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--amber)]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function PreferenceRow({
  border = true,
  description,
  disabled = false,
  enabled,
  label,
  onClick,
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-[14px] py-3 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-2",
        border && "border-b border-[var(--border)]",
      )}
    >
      <div>
        <div className="text-[13px] text-[var(--text)]">{label}</div>
        <div className="mt-[2px] text-[11px] text-[var(--muted)]">{description}</div>
      </div>
      <div className="ml-4 shrink-0 max-[720px]:ml-0">
        <ToggleBig disabled={disabled} enabled={enabled} onClick={onClick} />
      </div>
    </div>
  );
}
