var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) {r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { AssistantViewBase } from "./assistant-base";
/**
 * Sentiment Monitor category configuration
 */
const SENTIMENT_CATEGORY_RULES = [
    { id: "monitoring", label: "社交媒体监控", keywords: ["social", "monitor"] },
    { id: "analysis", label: "情感分析", keywords: ["sentiment", "analysis"] },
    { id: "other", label: "其他", keywords: [] },
];
const SENTIMENT_CATEGORY_ORDER = SENTIMENT_CATEGORY_RULES.map((rule) => rule.id);
const SENTIMENT_CATEGORY_LABELS = Object.fromEntries(SENTIMENT_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured sentiment monitoring skills
 */
const FEATURED_SENTIMENT_SKILL_KEYS = new Set(["social-content", "slack", "discord"]);
/**
 * Sentiment Monitor View Component
 *
 * 舆情监控页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示同时属于 Communication 和 Brand 类别的技能（交集）
 */
let SentimentMonitorView = class SentimentMonitorView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "舆情监控";
    }
    get pageSubtitle() {
        return "舆情监测和声誉管理（通讯+品牌）";
    }
    // Required but not used since skillCategories is provided
    get skillCategory() {
        return "communication";
    }
    // Use multi-category intersection filtering
    get skillCategories() {
        return ["communication", "brand"];
    }
    get featuredSkillKeys() {
        return FEATURED_SENTIMENT_SKILL_KEYS;
    }
    get categoryLabels() {
        return SENTIMENT_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...SENTIMENT_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无舆情监控相关技能。";
    }
    resolveCategoryId(skillKey) {
        const normalized = skillKey.toLowerCase();
        for (const rule of SENTIMENT_CATEGORY_RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.id;
            }
        }
        return "other";
    }
};
SentimentMonitorView = __decorate([
    customElement("openclaw-view-sentiment-monitor")
], SentimentMonitorView);
export { SentimentMonitorView };
