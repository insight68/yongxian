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
 * Legal category configuration with detailed rules
 */
const LEGAL_CATEGORY_RULES = [
    { id: "compliance", label: "合规审核", keywords: ["compliance", "gdpr", "ccpa", "privacy"] },
    { id: "contract", label: "合同管理", keywords: ["contract", "nda", "agreement"] },
    { id: "risk", label: "风险评估", keywords: ["risk", "assessment", "triage"] },
    { id: "template", label: "模板回复", keywords: ["canned", "template", "response"] },
    { id: "meeting", label: "会议支持", keywords: ["meeting", "briefing"] },
    { id: "other", label: "其他", keywords: [] },
];
const LEGAL_CATEGORY_ORDER = LEGAL_CATEGORY_RULES.map((rule) => rule.id);
const LEGAL_CATEGORY_LABELS = Object.fromEntries(LEGAL_CATEGORY_RULES.map((rule) => [rule.id, rule.label]));
/**
 * Featured legal skills to highlight
 */
const FEATURED_LEGAL_SKILL_KEYS = new Set(["contract-review", "compliance", "nda-triage"]);
/**
 * Legal-specific SVG icons
 */
const LEGAL_SVG_ICONS = {
    ...COMMON_SVG_ICONS,
    scale: svg `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M5 6l7-3 7 3"/><path d="M5 6v6a2 2 0 0 0 2 2h4"/><path d="M19 6v6a2 2 0 0 1-2 2h-4"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`,
    contract: svg `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    shield: svg `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
};
/**
 * Legal Assistant View Component
 *
 * 法务助手页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示 Legal 类别的技能，包括虚拟占位符
 */
let LegalView = class LegalView extends AssistantViewBase {
    // ========== Abstract Implementation ==========
    get pageTitle() {
        return "法务助手";
    }
    get pageSubtitle() {
        return "合同审核、合规审查和法律风险评估";
    }
    get skillCategory() {
        return "legal";
    }
    get featuredSkillKeys() {
        return FEATURED_LEGAL_SKILL_KEYS;
    }
    get categoryLabels() {
        return LEGAL_CATEGORY_LABELS;
    }
    get categoryOrder() {
        return [...LEGAL_CATEGORY_ORDER];
    }
    get emptyStateMessage() {
        return "暂无法务相关技能，请先安装或启用相关技能。";
    }
    resolveCategoryId(skillKey) {
        const normalized = skillKey.toLowerCase();
        for (const rule of LEGAL_CATEGORY_RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.id;
            }
        }
        return "other";
    }
    /**
     * Override to use legal-specific icons
     */
    renderIcon(iconName) {
        return LEGAL_SVG_ICONS[iconName] ?? html `<span>${iconName}</span>`;
    }
};
LegalView = __decorate([
    customElement("openclaw-view-legal")
], LegalView);
export { LegalView };
