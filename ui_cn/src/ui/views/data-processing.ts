import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase } from "./assistant-base";

/**
 * Data Processing category configuration
 */
const DATA_CATEGORY_RULES = [
  { id: "analytics", label: "数据分析", keywords: ["analytics"] },
  { id: "seo", label: "SEO审计", keywords: ["seo"] },
  { id: "logs", label: "日志分析", keywords: ["session", "log"] },
  { id: "cost", label: "成本追踪", keywords: ["usage", "cost"] },
  { id: "visualization", label: "数据可视化", keywords: ["mapper", "viz"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const DATA_CATEGORY_ORDER = DATA_CATEGORY_RULES.map((rule) => rule.id);

const DATA_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  DATA_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured data processing skills
 */
const FEATURED_DATA_SKILL_KEYS = new Set<string>([
  "analytics-tracking",
  "seo-audit",
  "model-usage",
]);

/**
 * Data Processing View Component
 *
 * 数据处理页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Data 类别的技能
 */
@customElement("openclaw-view-data-processing")
export class DataProcessingView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "数据处理";
  }

  get pageSubtitle(): string {
    return "数据分析、清洗和可视化工具";
  }

  get skillCategory(): SkillJobCategory {
    return "data";
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_DATA_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return DATA_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...DATA_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无数据处理相关技能，请先安装或启用相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of DATA_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-data-processing": DataProcessingView;
  }
}
