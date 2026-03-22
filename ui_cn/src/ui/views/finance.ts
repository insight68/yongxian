import { html, svg } from "lit";
import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase, COMMON_SVG_ICONS } from "./assistant-base";

/**
 * Finance category configuration with detailed rules
 */
const FINANCE_CATEGORY_RULES = [
  { id: "statements", label: "财务报表", keywords: ["financial", "statements", "report"] },
  { id: "close", label: "月末结账", keywords: ["close", "journal", "entry"] },
  { id: "reconciliation", label: "账务核对", keywords: ["reconcil", "rec"] },
  { id: "analysis", label: "分析审计", keywords: ["variance", "analysis", "audit"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const FINANCE_CATEGORY_ORDER = FINANCE_CATEGORY_RULES.map((rule) => rule.id);

const FINANCE_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  FINANCE_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured finance skills to highlight
 */
const FEATURED_FINANCE_SKILL_KEYS = new Set<string>([
  "financial-statements",
  "reconciliation",
  "variance-analysis",
]);

/**
 * Finance-specific SVG icons
 */
const FINANCE_SVG_ICONS: Record<string, ReturnType<typeof svg>> = {
  ...COMMON_SVG_ICONS,
  calculator: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
  coins: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
  receipt: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>`,
};

/**
 * Finance Assistant View Component
 *
 * 财务助手页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Finance 类别的技能，包括虚拟占位符
 */
@customElement("openclaw-view-finance")
export class FinanceView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "财务助手";
  }

  get pageSubtitle(): string {
    return "财务报表、对账核销和预算分析";
  }

  get skillCategory(): SkillJobCategory {
    return "finance";
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_FINANCE_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return FINANCE_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...FINANCE_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无财务相关技能，请先安装或启用相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of FINANCE_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }

  /**
   * Override to use finance-specific icons
   */
  protected override renderIcon(iconName: string): ReturnType<typeof html> {
    return FINANCE_SVG_ICONS[iconName] ?? html`<span>${iconName}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-finance": FinanceView;
  }
}
