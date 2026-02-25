import { html, svg } from "lit";
import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase, COMMON_SVG_ICONS } from "./assistant-base";

/**
 * Marketing category configuration with detailed rules
 */
const MARKETING_CATEGORY_RULES = [
  {
    id: "strategy",
    label: "营销策略",
    keywords: ["strategy", "launch", "pricing", "referral", "free-tool", "idea", "psychology"],
  },
  {
    id: "content",
    label: "内容创作",
    keywords: ["product-marketing-context", "content", "copy", "writing", "editing"],
  },
  {
    id: "social",
    label: "社交邮件",
    keywords: ["social", "instagram", "linkedin", "tiktok", "email"],
  },
  {
    id: "seo",
    label: "SEO优化",
    keywords: ["seo", "schema", "keyword", "competitor-alternatives"],
  },
  { id: "paid", label: "付费广告", keywords: ["paid", "ads"] },
  {
    id: "cro",
    label: "转化优化",
    keywords: ["cro", "form", "page", "popup", "onboarding", "signup", "paywall"],
  },
  { id: "analytics", label: "数据分析", keywords: ["analytics", "tracking", "metric"] },
  { id: "research", label: "用户研究", keywords: ["research", "ab-test", "survey"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const MARKETING_CATEGORY_ORDER = MARKETING_CATEGORY_RULES.map((rule) => rule.id);

const MARKETING_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  MARKETING_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured marketing skills to highlight
 */
const FEATURED_MARKETING_SKILL_KEYS = new Set<string>([
  "launch-strategy",
  "copywriting",
  "analytics-tracking",
  "paid-ads",
]);

/**
 * Marketing-specific SVG icons
 */
const MARKETING_SVG_ICONS: Record<string, ReturnType<typeof svg>> = {
  ...COMMON_SVG_ICONS,
  megaphone: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l6-6 6 6"/><path d="M13 5l6 6-6 6"/><path d="M5 19l4-4"/></svg>`,
};

/**
 * Marketing Assistant View Component
 *
 * 营销助手页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Marketing 类别的技能，包括虚拟占位符
 */
@customElement("openclaw-view-marketing")
export class MarketingView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "营销助手";
  }

  get pageSubtitle(): string {
    return "营销活动策划、内容生成和效果分析";
  }

  get skillCategory(): SkillJobCategory {
    return "marketing";
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_MARKETING_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return MARKETING_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...MARKETING_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无营销相关技能，请先安装或启用相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of MARKETING_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }

  /**
   * Override to use marketing-specific icons
   */
  protected override renderIcon(iconName: string): ReturnType<typeof html> {
    return MARKETING_SVG_ICONS[iconName] ?? html`<span>${iconName}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-marketing": MarketingView;
  }
}
