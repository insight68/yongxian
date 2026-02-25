import { LitElement, html, css, svg } from "lit";
import type { TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type {
  SkillWithViewMapping,
  ViewSkillMapping,
  SkillJobCategory,
  SkillCategoryMapping,
} from "../../config/skill-category-mappings";
import {
  filterRealSkillsByCategory,
  filterSkillsByMultipleCategories,
  filterSkillsByCategory,
} from "../../config/skill-category-mappings";
import type { SkillStatusEntry, SkillStatusReport } from "../types";
import type { ChatProps } from "./chat";

/**
 * Create empty requirement buckets for placeholder skills
 */
const createEmptyRequirementBuckets = () => ({
  bins: [] as string[],
  env: [] as string[],
  config: [] as string[],
  os: [] as string[],
});

/**
 * Create a placeholder skill entry for skills defined in mappings but not installed
 */
const createPlaceholderSkillEntry = (
  definition: SkillCategoryMapping,
  assistantName: string,
): SkillStatusEntry => {
  const displayName = definition.displayName ?? definition.skillName;
  return {
    name: displayName,
    description: definition.description ?? `${assistantName}已为你预置「${displayName}」提示词`,
    source: "definition",
    filePath: "",
    baseDir: "",
    skillKey: definition.skillName,
    always: false,
    disabled: true,
    blockedByAllowlist: false,
    eligible: false,
    requirements: createEmptyRequirementBuckets(),
    missing: createEmptyRequirementBuckets(),
    configChecks: [],
    install: [],
  };
};

/**
 * Build skill entries with virtual placeholders for uninstalled skills
 */
const buildSkillEntriesWithPlaceholders = (
  skills: SkillStatusEntry[],
  definitions: SkillCategoryMapping[],
  featuredKeys: Set<string>,
  assistantName: string,
): SkillWithViewMapping[] => {
  const skillMap = new Map(skills.map((skill) => [skill.skillKey, skill]));
  const entries: SkillWithViewMapping[] = [];

  definitions.forEach((definition, index) => {
    const matchedSkill = skillMap.get(definition.skillName);
    const isVirtual = !matchedSkill;
    const isFeatured = featuredKeys.has(definition.skillName);
    const skill = matchedSkill ?? createPlaceholderSkillEntry(definition, assistantName);

    entries.push({
      skill,
      mapping: {
        skillKeyPattern: definition.skillName,
        displayName: definition.displayName ?? skill.name,
        description: matchedSkill?.description ?? skill.description ?? "暂无描述",
        category: definition.category,
        visual: {
          variant: isFeatured ? "primary" : isVirtual ? "subtle" : "secondary",
          icon: definition.icon || "📦",
          size: isFeatured ? "large" : "medium",
          featured: isFeatured,
        },
        interaction: {
          type: "prompt",
          prompt: `/${definition.skillName}`,
        },
        priority: definitions.length - index,
      },
    });
  });

  return entries;
};

/**
 * Common SVG icons for assistant views
 */
export const COMMON_SVG_ICONS: Record<string, ReturnType<typeof svg>> = {
  // Charts and Analytics
  chart: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>`,
  barChart: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>`,
  trendingUp: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,

  // Communication
  message: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  chat: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  phone: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>`,

  // Brand and Marketing
  megaphone: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l6-6 6 6"/><path d="M13 5l6 6-6 6"/><path d="M5 19l4-4"/></svg>`,
  sparkles: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M5.6 5.6l12.8 12.8"/><path d="M18.4 5.6 5.6 18.4"/></svg>`,
  target: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  refresh: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,

  // Search and Research
  search: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  trend: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  shield: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  eye: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,

  // Documents and Data
  log: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  dollar: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  map: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,

  // Content and Design
  penTool: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13 16.5 5.5 2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
  share: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  users: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  flask: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L6 14v6h12v-6l-4-4.69V2h-4z"/><path d="M8.5 2h7"/></svg>`,
};

/**
 * Shared CSS styles for assistant views
 */
export const ASSISTANT_VIEW_STYLES = css`
  :host {
    display: block;
    height: 100%;
  }

  .assistant-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  /* Function panel area */
  .function-panel {
    flex: 0 0 auto;
    padding: var(--space-xl) var(--space-2xl);
    background: var(--card);
    border-bottom: 1px solid var(--border);
    overflow-y: auto;
    max-height: 40vh;
    transition: max-height 300ms var(--ease-out);
  }

  .function-panel--collapsed {
    max-height: 0;
    padding: 0;
    border-width: 0;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-lg);
  }

  .panel-header-text {
    flex: 1;
  }

  .panel-title {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-strong);
    margin: 0 0 var(--space-sm) 0;
  }

  .panel-subtitle {
    font-family: var(--font-body);
    font-size: 0.9375rem;
    color: var(--muted);
    margin: 0;
  }

  .panel-controls {
    display: flex;
    gap: var(--space-sm);
  }

  .panel-control-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 150ms var(--ease-out);
    color: var(--muted);
  }

  .panel-control-button:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--border-hover);
  }

  /* Section titles */
  .section-title {
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: var(--space-lg) 0 var(--space-md) 0;
  }

  .section-title:first-of-type {
    margin-top: 0;
  }

  /* Quick actions */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  /* Skills grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-md);
  }

  /* Chat area */
  .chat-area {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .chat-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--muted);
    font-family: var(--font-body);
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-3xl);
    text-align: center;
    color: var(--muted);
  }

  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
    opacity: 0.5;
  }

  .empty-state-text {
    font-family: var(--font-body);
    font-size: 1rem;
  }

  /* Mock data hint */
  .mock-data-hint {
    padding: var(--space-sm) var(--space-md);
    background: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.3);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-md);
    font-size: 0.875rem;
    color: rgb(249, 115, 22);
  }

  @media (max-width: 768px) {
    .function-panel {
      max-height: 50vh;
      padding: var(--space-md);
    }

    .quick-actions {
      grid-template-columns: 1fr;
    }

    .panel-title {
      font-size: 1.5rem;
    }
  }
`;

/**
 * Category configuration for skill grouping
 */
export interface CategoryConfig {
  id: string;
  label: string;
  keywords: string[];
}

/**
 * Abstract base class for AI assistant views
 *
 * Provides shared functionality for:
 * - Skill filtering and display
 * - Panel collapse/expand
 * - Chat dock integration
 * - Skill card rendering
 */
export abstract class AssistantViewBase extends LitElement {
  static styles = ASSISTANT_VIEW_STYLES;

  // ========== Properties ==========

  @property({ attribute: false })
  skillsReport?: SkillStatusReport | null;

  @property({ attribute: false })
  chatProps?: ChatProps | null;

  @property({ attribute: false })
  renderChat?: (props: ChatProps) => TemplateResult;

  // ========== State ==========

  @state()
  selectedSkillKey: string | null = null;

  @state()
  panelCollapsed = false;

  // ========== Abstract Methods - Must be implemented by subclasses ==========

  /**
   * Page title displayed in the header
   */
  abstract get pageTitle(): string;

  /**
   * Page subtitle displayed below the title
   */
  abstract get pageSubtitle(): string;

  /**
   * Skill category for filtering (e.g., "marketing", "data", "service")
   * Override skillCategories instead for multi-category intersection filtering
   */
  abstract get skillCategory(): SkillJobCategory;

  /**
   * Multiple skill categories for intersection filtering
   * If provided, takes precedence over skillCategory
   * Override this to filter skills that belong to ALL specified categories
   */
  get skillCategories(): SkillJobCategory[] | null {
    return null;
  }

  /**
   * Featured skill keys to highlight in the quick actions area
   * Override in subclasses to define featured skills
   */
  get featuredSkillKeys(): Set<string> {
    return new Set();
  }

  /**
   * Category labels for grouping skills
   */
  abstract get categoryLabels(): Record<string, string>;

  /**
   * Category order for displaying skill groups
   */
  abstract get categoryOrder(): string[];

  /**
   * Empty state message when no skills are available
   */
  abstract get emptyStateMessage(): string;

  /**
   * Resolve the category ID for a skill based on its key
   */
  abstract resolveCategoryId(skillKey: string): string;

  // ========== Lifecycle ==========

  protected createRenderRoot() {
    return this; // Disable Shadow DOM, use global styles
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  // ========== Shared Methods ==========

  /**
   * Get filtered skills for this view
   * Uses virtual placeholders for skills defined in mappings but not installed
   */
  protected getSkillEntries(): SkillWithViewMapping[] {
    const skills = this.skillsReport?.skills ?? [];
    const categories = this.skillCategories;

    // Get skill definitions for this category
    let definitions: SkillCategoryMapping[];
    if (categories && categories.length > 0) {
      // For multi-category, get union of all category definitions
      const allDefs = new Map<string, SkillCategoryMapping>();
      for (const cat of categories) {
        for (const def of filterSkillsByCategory(cat)) {
          allDefs.set(def.skillName, def);
        }
      }
      definitions = Array.from(allDefs.values());
    } else {
      definitions = filterSkillsByCategory(this.skillCategory);
    }

    // Build entries with virtual placeholders
    return buildSkillEntriesWithPlaceholders(
      skills,
      definitions,
      this.featuredSkillKeys,
      this.pageTitle,
    );
  }

  /**
   * Handle skill card click
   */
  protected handleSkillClick(skill: SkillStatusEntry, mapping: ViewSkillMapping): void {
    const { type, prompt, link } = mapping.interaction;

    this.selectedSkillKey = skill.skillKey;

    switch (type) {
      case "prompt":
        this.dispatchEvent(
          new CustomEvent("inject-prompt", {
            detail: {
              prompt: prompt ?? "",
              skillKey: skill.skillKey,
              displayName: mapping.displayName ?? skill.name ?? "Unnamed Skill",
            },
            bubbles: true,
            composed: true,
          }),
        );
        break;

      case "link":
        if (link) {
          window.open(link, "_blank");
        }
        break;

      case "tool":
        console.log("Tool invocation:", mapping.interaction.toolParams);
        break;

      case "modal":
        console.log("Modal:", mapping.interaction.modal);
        break;
    }
  }

  /**
   * Toggle panel collapse state
   */
  protected togglePanelCollapse(): void {
    this.panelCollapsed = !this.panelCollapsed;
  }

  /**
   * Render an icon by name
   * Override in subclasses to add custom icons
   */
  protected renderIcon(iconName: string): ReturnType<typeof html> {
    return COMMON_SVG_ICONS[iconName] ?? html`<span>${iconName}</span>`;
  }

  /**
   * Render a skill card
   */
  protected renderSkillCard(
    skill: SkillStatusEntry,
    mapping: ViewSkillMapping,
  ): ReturnType<typeof html> {
    const { visual } = mapping;
    const { variant, size, icon } = visual;
    const displayName = mapping.displayName ?? skill.name ?? "Unnamed Skill";
    const description = mapping.description ?? skill.description ?? "No description";
    const isSelected = this.selectedSkillKey === skill.skillKey;

    const cardClasses = [
      "skill-card",
      `skill-card--${variant}`,
      `skill-card--${size}`,
      isSelected ? "skill-card--selected" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div
        class="${cardClasses}"
        @click=${() => this.handleSkillClick(skill, mapping)}
        role="button"
        tabindex="0"
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleSkillClick(skill, mapping);
          }
        }}
      >
        ${
          size === "large"
            ? html`
              <div class="skill-icon">${this.renderIcon(icon)}</div>
              <div class="skill-title">${displayName}</div>
              <div class="skill-description">${description}</div>
            `
            : html`
              <div class="skill-icon">${this.renderIcon(icon)}</div>
              <div class="skill-content">
                <div class="skill-title">${displayName}</div>
                <div class="skill-description">${description}</div>
              </div>
            `
        }
      </div>
    `;
  }

  /**
   * Render the chat dock
   */
  protected renderChatDock(selectedSkillDesc: string): ReturnType<typeof html> {
    if (!this.chatProps || !this.renderChat) {
      return html``;
    }

    const skillCommand = this.selectedSkillKey ? `/${this.selectedSkillKey}` : null;

    return html`
      <div class="marketing-chat-dock">
        ${
          skillCommand
            ? html`
              <div class="marketing-chat-dock__header">
                <span class="marketing-chat-dock__skill-tag">${skillCommand}</span>
                <span class="marketing-chat-dock__hint">${selectedSkillDesc}</span>
              </div>
            `
            : ""
        }
        <div class="marketing-chat-dock__content">${this.renderChat(this.chatProps)}</div>
      </div>
    `;
  }

  /**
   * Render the collapse/expand button
   */
  protected renderCollapseButton(): ReturnType<typeof html> {
    return html`
      <button
        class="panel-control-button"
        @click=${() => this.togglePanelCollapse()}
        title="${this.panelCollapsed ? "Expand panel" : "Collapse panel"}"
      >
        ${
          this.panelCollapsed
            ? html`
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              `
            : html`
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              `
        }
      </button>
    `;
  }

  /**
   * Render empty state
   */
  protected renderEmptyState(): ReturnType<typeof html> {
    return html`
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">${this.emptyStateMessage}</div>
      </div>
    `;
  }

  // ========== Main Render ==========

  render(): ReturnType<typeof html> {
    const allSkills = this.getSkillEntries();
    const featuredSkills = allSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = allSkills.filter((item) => !item.mapping.visual.featured);

    // Group skills by category
    const groupedSkills = new Map<string, SkillWithViewMapping[]>();
    for (const categoryId of this.categoryOrder) {
      groupedSkills.set(categoryId, []);
    }

    for (const item of regularSkills) {
      const categoryId = this.resolveCategoryId(item.skill.skillKey);
      const categorySkills = groupedSkills.get(categoryId);
      if (categorySkills) {
        categorySkills.push(item);
      } else {
        // Add to "other" category if exists, otherwise create new
        const otherSkills = groupedSkills.get("other");
        if (otherSkills) {
          otherSkills.push(item);
        } else {
          groupedSkills.set(categoryId, [item]);
        }
      }
    }

    const hasSkills = allSkills.length > 0;

    // Get selected skill description
    const selectedSkillEntry = this.selectedSkillKey
      ? allSkills.find((item) => item.skill.skillKey === this.selectedSkillKey)
      : null;
    const selectedSkillDesc =
      selectedSkillEntry?.mapping.description ?? "Click any skill above to inject prompt into chat";

    return html`
      <div class="assistant-container">
        <!-- Function panel -->
        <div class="function-panel ${this.panelCollapsed ? "function-panel--collapsed" : ""}">
          <div class="panel-header">
            <div class="panel-header-text">
              <h1 class="panel-title">${this.pageTitle}</h1>
              <p class="panel-subtitle">${this.pageSubtitle}</p>
            </div>
            <div class="panel-controls">${this.renderCollapseButton()}</div>
          </div>

          ${
            hasSkills
              ? html`
                ${
                  featuredSkills.length > 0
                    ? html`
                      <div class="quick-actions">
                        ${featuredSkills.map(({ skill, mapping }) => this.renderSkillCard(skill, mapping))}
                      </div>
                    `
                    : ""
                }
                ${this.categoryOrder.map((categoryId) => {
                  const skills = groupedSkills.get(categoryId) ?? [];
                  return skills.length === 0
                    ? ""
                    : html`
                        <div class="section-title">${this.categoryLabels[categoryId] ?? categoryId}</div>
                        <div class="skills-grid">
                          ${skills.map(({ skill, mapping }) => this.renderSkillCard(skill, mapping))}
                        </div>
                      `;
                })}
              `
              : this.renderEmptyState()
          }
        </div>

        ${this.renderChatDock(selectedSkillDesc)}
      </div>
    `;
  }
}
