import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase } from "./assistant-base";

/**
 * Sentiment Monitor category configuration
 */
const SENTIMENT_CATEGORY_RULES = [
  { id: "monitoring", label: "社交媒体监控", keywords: ["social", "monitor"] },
  { id: "analysis", label: "情感分析", keywords: ["sentiment", "analysis"] },
  { id: "other", label: "其他", keywords: [] },
] as const;

const SENTIMENT_CATEGORY_ORDER = SENTIMENT_CATEGORY_RULES.map((rule) => rule.id);

const SENTIMENT_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SENTIMENT_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured sentiment monitoring skills
 */
const FEATURED_SENTIMENT_SKILL_KEYS = new Set<string>(["social-content", "slack", "discord"]);

/**
 * Sentiment Monitor View Component
 *
 * 舆情监控页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示同时属于 Communication 和 Brand 类别的技能（交集）
 */
@customElement("openclaw-view-sentiment-monitor")
export class SentimentMonitorView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "舆情监控";
  }

  get pageSubtitle(): string {
    return "舆情监测和声誉管理（通讯+品牌）";
  }

  // Required but not used since skillCategories is provided
  get skillCategory(): SkillJobCategory {
    return "communication";
  }

  // Use multi-category intersection filtering
  override get skillCategories(): SkillJobCategory[] {
    return ["communication", "brand"];
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_SENTIMENT_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return SENTIMENT_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...SENTIMENT_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无舆情监控相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of SENTIMENT_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-sentiment-monitor": SentimentMonitorView;
  }
}
