import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase } from "./assistant-base";

/**
 * Market Analysis category configuration
 */
const MARKET_ANALYSIS_CATEGORY_RULES = [
  { id: "analytics", label: "数据分析与追踪", keywords: ["analytics"] },
  { id: "seo", label: "SEO审计与优化", keywords: ["seo"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const MARKET_ANALYSIS_CATEGORY_ORDER = MARKET_ANALYSIS_CATEGORY_RULES.map((rule) => rule.id);

const MARKET_ANALYSIS_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  MARKET_ANALYSIS_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured market analysis skills
 */
const FEATURED_MARKET_ANALYSIS_SKILL_KEYS = new Set<string>([
  "analytics-tracking",
  "seo-audit",
  "competitor-alternatives",
]);

/**
 * Market Analysis View Component
 *
 * 市场分析页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示同时属于 Data 和 Marketing 类别的技能（交集）
 */
@customElement("openclaw-view-market-analysis")
export class MarketAnalysisView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "市场分析";
  }

  get pageSubtitle(): string {
    return "市场趋势分析和竞争情报（数据+营销）";
  }

  // Required but not used since skillCategories is provided
  get skillCategory(): SkillJobCategory {
    return "data";
  }

  // Use multi-category intersection filtering
  override get skillCategories(): SkillJobCategory[] {
    return ["data", "marketing"];
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_MARKET_ANALYSIS_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return MARKET_ANALYSIS_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...MARKET_ANALYSIS_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无市场分析相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of MARKET_ANALYSIS_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-market-analysis": MarketAnalysisView;
  }
}
