import { customElement } from "lit/decorators.js";
import type { SkillJobCategory } from "../../config/skill-category-mappings";
import { AssistantViewBase } from "./assistant-base";

/**
 * Customer Service category configuration
 */
const SERVICE_CATEGORY_RULES = [
  {
    id: "messaging",
    label: "消息平台",
    keywords: ["imsg", "wacli", "bluebubbles", "whatsapp", "telegram", "discord"],
  },
  { id: "other", label: "其他", keywords: [] },
] as const;

const SERVICE_CATEGORY_ORDER = SERVICE_CATEGORY_RULES.map((rule) => rule.id);

const SERVICE_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORY_RULES.map((rule) => [rule.id, rule.label]),
);

/**
 * Featured customer service skills
 */
const FEATURED_SERVICE_SKILL_KEYS = new Set<string>(["imsg", "wacli"]);

/**
 * Customer Service View Component
 *
 * 客户服务页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Service 类别的技能
 */
@customElement("openclaw-view-customer-service")
export class CustomerServiceView extends AssistantViewBase {
  // ========== Abstract Implementation ==========

  get pageTitle(): string {
    return "客户服务";
  }

  get pageSubtitle(): string {
    return "客户支持和问题解决方案";
  }

  get skillCategory(): SkillJobCategory {
    return "service";
  }

  override get featuredSkillKeys(): Set<string> {
    return FEATURED_SERVICE_SKILL_KEYS;
  }

  get categoryLabels(): Record<string, string> {
    return SERVICE_CATEGORY_LABELS;
  }

  get categoryOrder(): string[] {
    return [...SERVICE_CATEGORY_ORDER];
  }

  get emptyStateMessage(): string {
    return "暂无客户服务相关技能，请先安装或启用相关技能。";
  }

  resolveCategoryId(skillKey: string): string {
    const normalized = skillKey.toLowerCase();
    for (const rule of SERVICE_CATEGORY_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.id;
      }
    }
    return "other";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-customer-service": CustomerServiceView;
  }
}
