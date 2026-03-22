var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { AssistantViewBase } from "./assistant-base";
/**
 * Market Analysis category configuration
 */
const MARKET_ANALYSIS_CATEGORY_RULES = [
    { id: "analytics", label: "数据分析与追踪", keywords: ["analytics"] },
    { id: "seo", label: "SEO审计与优化", keywords: ["seo"] },
    { id: "other", label: "其他", keywords: [] },
];
const MARKET_ANALYSIS_CATEGORY_ORDER = MARKET_ANALYSIS_CATEGORY_RULES.map((rule) => rule.id);
const MARKET_ANALYSIS_CATEGORY_LABELS = Object.fromEntries(MARKET_ANALYSIS_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured market analysis skills
 */
const FEATURED_MARKET_ANALYSIS_SKILL_KEYS = new Set([
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
let MarketAnalysisView = class MarketAnalysisView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "市场分析";
    }
    get pageSubtitle() {
        return "市场趋势分析和竞争情报（数据+营销）";
    }
    // Required but not used since skillCategories is provided
    get skillCategory() {
        return "data";
    }
    // Use multi-category intersection filtering
    get skillCategories() {
        return ["data", "marketing"];
    }
    get featuredSkillKeys() {
        return FEATURED_MARKET_ANALYSIS_SKILL_KEYS;
    }
    get categoryLabels() {
        return MARKET_ANALYSIS_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...MARKET_ANALYSIS_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无市场分析相关技能。";
    }
    resolveCategoryId(skillKey) {
        const normalized = skillKey.toLowerCase();
        for (const rule of MARKET_ANALYSIS_CATEGORY_RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.id;
            }
        }
        return "other";
    }
};
MarketAnalysisView = __decorate([
    customElement("openclaw-view-market-analysis")
], MarketAnalysisView);
export { MarketAnalysisView };
