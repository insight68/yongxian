var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) {r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
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
];
const DATA_CATEGORY_ORDER = DATA_CATEGORY_RULES.map((rule) => rule.id);
const DATA_CATEGORY_LABELS = Object.fromEntries(DATA_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured data processing skills
 */
const FEATURED_DATA_SKILL_KEYS = new Set([
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
let DataProcessingView = class DataProcessingView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "数据处理";
    }
    get pageSubtitle() {
        return "数据分析、清洗和可视化工具";
    }
    get skillCategory() {
        return "data";
    }
    get featuredSkillKeys() {
        return FEATURED_DATA_SKILL_KEYS;
    }
    get categoryLabels() {
        return DATA_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...DATA_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无数据处理相关技能，请先安装或启用相关技能。";
    }
    resolveCategoryId(skillKey) {
        const normalized = skillKey.toLowerCase();
        for (const rule of DATA_CATEGORY_RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.id;
            }
        }
        return "other";
    }
};
DataProcessingView = __decorate([
    customElement("openclaw-view-data-processing")
], DataProcessingView);
export { DataProcessingView };
