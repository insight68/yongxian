var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) {r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { AssistantViewBase } from "./assistant-base";
/**
 * Brand Management category configuration
 */
const BRAND_CATEGORY_RULES = [
    { id: "social", label: "社交媒体", keywords: ["social"] },
    { id: "competitive", label: "竞品分析", keywords: ["competitive", "competitor", "alternative"] },
    { id: "other", label: "其他", keywords: [] },
];
const BRAND_CATEGORY_ORDER = BRAND_CATEGORY_RULES.map((rule) => rule.id);
const BRAND_CATEGORY_LABELS = Object.fromEntries(BRAND_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured brand management skills
 */
const FEATURED_BRAND_SKILL_KEYS = new Set(["social-content", "competitor-alternatives"]);
/**
 * Brand Management View Component
 *
 * 品牌管理页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Brand 类别的技能
 */
let BrandManagementView = class BrandManagementView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "品牌管理";
    }
    get pageSubtitle() {
        return "品牌策略和形象管理";
    }
    get skillCategory() {
        return "brand";
    }
    get featuredSkillKeys() {
        return FEATURED_BRAND_SKILL_KEYS;
    }
    get categoryLabels() {
        return BRAND_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...BRAND_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无品牌管理相关技能，请先安装或启用相关技能。";
    }
    resolveCategoryId(skillKey) {
        const normalized = skillKey.toLowerCase();
        for (const rule of BRAND_CATEGORY_RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.id;
            }
        }
        return "other";
    }
};
BrandManagementView = __decorate([
    customElement("openclaw-view-brand-management")
], BrandManagementView);
export { BrandManagementView };
