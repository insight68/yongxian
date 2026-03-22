var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
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
];
const SERVICE_CATEGORY_ORDER = SERVICE_CATEGORY_RULES.map((rule) => rule.id);
const SERVICE_CATEGORY_LABELS = Object.fromEntries(SERVICE_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured customer service skills
 */
const FEATURED_SERVICE_SKILL_KEYS = new Set(["imsg", "wacli"]);
/**
 * Customer Service View Component
 *
 * 客户服务页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Service 类别的技能
 */
let CustomerServiceView = class CustomerServiceView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "客户服务";
    }
    get pageSubtitle() {
        return "客户支持和问题解决方案";
    }
    get skillCategory() {
        return "service";
    }
    get featuredSkillKeys() {
        return FEATURED_SERVICE_SKILL_KEYS;
    }
    get categoryLabels() {
        return SERVICE_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...SERVICE_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无客户服务相关技能，请先安装或启用相关技能。";
    }
    resolveCategoryId(skillKey) {
        const normalized = skillKey.toLowerCase();
        for (const rule of SERVICE_CATEGORY_RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.id;
            }
        }
        return "other";
    }
};
CustomerServiceView = __decorate([
    customElement("openclaw-view-customer-service")
], CustomerServiceView);
export { CustomerServiceView };
