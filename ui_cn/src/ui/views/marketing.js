var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) {r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, svg } from "lit";
import { customElement } from "lit/decorators.js";
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
];
const MARKETING_CATEGORY_ORDER = MARKETING_CATEGORY_RULES.map((rule) => rule.id);
const MARKETING_CATEGORY_LABELS = Object.fromEntries(MARKETING_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured marketing skills to highlight
 */
const FEATURED_MARKETING_SKILL_KEYS = new Set([
    "launch-strategy",
    "copywriting",
    "analytics-tracking",
    "paid-ads",
]);
/**
 * Marketing-specific SVG icons
 */
const MARKETING_SVG_ICONS = {
    ...COMMON_SVG_ICONS,
    megaphone: svg `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l6-6 6 6"/><path d="M13 5l6 6-6 6"/><path d="M5 19l4-4"/></svg>`,
};
/**
 * Marketing Assistant View Component
 *
 * 营销助手页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Marketing 类别的技能，包括虚拟占位符
 */
let MarketingView = class MarketingView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "营销助手";
    }
    get pageSubtitle() {
        return "营销活动策划、内容生成和效果分析";
    }
    get skillCategory() {
        return "marketing";
    }
    get featuredSkillKeys() {
        return FEATURED_MARKETING_SKILL_KEYS;
    }
    get categoryLabels() {
        return MARKETING_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...MARKETING_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无营销相关技能，请先安装或启用相关技能。";
    }
    resolveCategoryId(skillKey) {
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
    renderIcon(iconName) {
        return MARKETING_SVG_ICONS[iconName] ?? html `<span>${iconName}</span>`;
    }
};
MarketingView = __decorate([
    customElement("openclaw-view-marketing")
], MarketingView);
export { MarketingView };
