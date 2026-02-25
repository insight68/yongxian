import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase } from "./assistant-base";

/**
 * Brand Management category configuration
 */
const BRAND_CATEGORY_RULES = [
  { id: "social", label: "社交媒体", keywords: ["social"] },
  { id: "competitive", label: "竞品分析", keywords: ["competitive", "competitor", "alternative"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const BRAND_CATEGORY_ORDER = BRAND_CATEGORY_RULES.map((rule) => rule.id);

const BRAND_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  BRAND_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured brand management skills
 */
const FEATURED_BRAND_SKILL_KEYS = new Set<string>(["social-content", "competitor-alternatives"]);

/**
 * Brand Management View Component
 *
 * 品牌管理页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Brand 类别的技能
 */
@customElement("openclaw-view-brand-management")
export class BrandManagementView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "品牌管理";
  }

  get pageSubtitle(): string {
    return "品牌策略和形象管理";
  }

  get skillCategory(): SkillJobCategory {
    return "brand";
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_BRAND_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return BRAND_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...BRAND_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无品牌管理相关技能，请先安装或启用相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of BRAND_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-brand-management": BrandManagementView;
  }
}
