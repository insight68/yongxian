import { html, svg } from "lit";
import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase, COMMON_SVG_ICONS } from "./assistant-base";

/**
 * Product management category configuration with detailed rules
 */
const PRODUCT_CATEGORY_RULES = [
  { id: "spec", label: "需求文档", keywords: ["spec", "prd", "feature"] },
  { id: "roadmap", label: "路线规划", keywords: ["roadmap", "planning"] },
  { id: "research", label: "用户研究", keywords: ["research", "user", "synthesis"] },
  { id: "analysis", label: "分析洞察", keywords: ["competitive", "analysis", "metrics"] },
  { id: "comms", label: "沟通协作", keywords: ["stakeholder", "comms", "communication"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const PRODUCT_CATEGORY_ORDER = PRODUCT_CATEGORY_RULES.map((rule) => rule.id);

const PRODUCT_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PRODUCT_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured product management skills to highlight
 */
const FEATURED_PRODUCT_SKILL_KEYS = new Set<string>([
  "feature-spec",
  "roadmap-management",
  "user-research-synthesis",
]);

/**
 * Product management-specific SVG icons
 */
const PRODUCT_SVG_ICONS: Record<string, ReturnType<typeof svg>> = {
  ...COMMON_SVG_ICONS,
  target: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  clipboard: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>`,
  users: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

/**
 * Product Management Assistant View Component
 *
 * 产品管理助手页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Product 类别的技能，包括虚拟占位符
 */
@customElement("openclaw-view-product-management")
export class ProductManagementView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "产品管理助手";
  }

  get pageSubtitle(): string {
    return "产品规划、需求管理和用户研究";
  }

  get skillCategory(): SkillJobCategory {
    return "product";
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_PRODUCT_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return PRODUCT_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...PRODUCT_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无产品管理相关技能，请先安装或启用相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of PRODUCT_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }

  /**
   * Override to use product management-specific icons
   */
  protected override renderIcon(iconName: string): ReturnType<typeof html> {
    return PRODUCT_SVG_ICONS[iconName] ?? html`<span>${iconName}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-product-management": ProductManagementView;
  }
}
