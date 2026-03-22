import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ChatProps } from "./chat";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  category: "approval" | "config" | "review" | "deploy";
}

export interface SkillUsage {
  id: string;
  name: string;
  icon: string;
  time: string;
  category: string;
}

export interface LastRunSummary {
  title: string;
  time: string;
  summary: string;
}

export interface FrequentTask {
  name: string;
  icon: string;
  desc: string;
  link: string;
}

@customElement("openclaw-view-home")
export class HomeView extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

  @state()
  lastRun: LastRunSummary | null = null;

  @state()
  todos: TodoItem[] = [];

  @state()
  topTask: FrequentTask | null = null;

  @state()
  recentSkills: SkillUsage[] = [];

  @state()
  loading = true;

  @property({ attribute: false })
  chatProps?: ChatProps | null;

  @property({ attribute: false })
  renderChat?: (props: ChatProps) => TemplateResult;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.fetchHomeData();
  }

  private async fetchHomeData() {
    this.loading = true;
    try {
      // TODO: 从 Gateway API 获取真实数据；当前使用模拟数据
      this.lastRun = {
        title: "营销投放日报生成",
        time: "今天 14:05 自动任务",
        summary: "已汇总昨日全渠道投放数据，生成日报草稿并推送到 Slack #marketing。",
      };

      this.todos = [
        {
          id: "1",
          text: "审核客服渠道 API Key 是否过期",
          done: false,
          category: "review",
        },
        {
          id: "2",
          text: "更新 WhatsApp 渠道配置并保存",
          done: false,
          category: "config",
        },
        {
          id: "3",
          text: "确认昨日营销日报内容无误后发送",
          done: false,
          category: "approval",
        },
        {
          id: "4",
          text: "部署最新 Gateway 版本",
          done: true,
          category: "deploy",
        },
      ];

      this.topTask = {
        name: "生成营销日报",
        icon: "📝",
        desc: "汇总投放数据，生成日报并推送到营销频道",
        link: "/marketing",
      };

      this.recentSkills = [
        {
          id: "1",
          name: "Data Analysis",
          icon: "📊",
          time: "2 min ago",
          category: "analysis",
        },
        {
          id: "2",
          name: "Email Campaign",
          icon: "📧",
          time: "15 min ago",
          category: "marketing",
        },
        {
          id: "3",
          name: "Image Generate",
          icon: "🎨",
          time: "1 hour ago",
          category: "creative",
        },
        {
          id: "4",
          name: "Document Write",
          icon: "📝",
          time: "3 hours ago",
          category: "writing",
        },
      ];
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    } finally {
      this.loading = false;
    }
  }

  private toggleTodo(todoId: string) {
    this.todos = this.todos.map((todo) =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo,
    );
  }

  private getCategoryIcon(category: TodoItem["category"]): string {
    switch (category) {
      case "approval":
        return "✅";
      case "config":
        return "⚙️";
      case "review":
        return "🔍";
      case "deploy":
        return "🚀";
      default:
        return "📌";
    }
  }

  private navigateToSkill(skill: SkillUsage) {
    const categoryToTab: Record<string, string> = {
      marketing: "/marketing",
      analysis: "/market-analysis",
      creative: "/brand-management",
      writing: "/marketing",
    };
    const tab = categoryToTab[skill.category];
    if (tab) {
      window.location.href = tab;
    }
  }

  private openTopTask() {
    if (this.topTask?.link) {
      window.location.href = this.topTask.link;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="home-loading">Loading...</div>
      `;
    }

    return html`
      <div class="home-container">
        <!-- 欢迎 -->
        <section class="welcome-section">
          <div class="welcome-meta">
            <div class="welcome-pill">欢迎回来</div>
            <div class="welcome-time">${new Date().toLocaleString()}</div>
          </div>
          <h1 class="welcome-title">工作台概览</h1>
          <p class="welcome-subtitle">快速查看最新进展、待办与常用任务，底部可直接开启对话。</p>
        </section>

        <section class="summary-grid">
          <div class="card last-run">
            <div class="card-badge">最近执行</div>
            <div class="card-title">${this.lastRun?.title ?? "暂无任务"}</div>
            <div class="card-time">${this.lastRun?.time ?? "--"}</div>
            <p class="card-desc">${this.lastRun?.summary ?? "还没有执行记录"}</p>
          </div>

          <div class="card top-task">
            <div class="card-badge accent">常用任务</div>
            <div class="top-task-row">
              <div class="top-task-icon">${this.topTask?.icon ?? "✨"}</div>
              <div>
                <div class="card-title">${this.topTask?.name ?? "未配置"}</div>
                <p class="card-desc">${this.topTask?.desc ?? "设置一个常用任务以便快速进入。"}</p>
              </div>
            </div>
            <button class="card-button" @click=${() => this.openTopTask()} ?disabled=${!this.topTask?.link}>
              前往执行
            </button>
          </div>
        </section>

        <!-- 待办事项 -->
        <section class="todos-section">
          <div class="section-header">
            <h2>待办</h2>
            <span class="section-badge">${this.todos.filter((t) => !t.done).length} 未完成</span>
          </div>
          <ul class="todo-list">
            ${this.todos.map(
              (todo) => html`
                <li class="todo-item ${todo.done ? "done" : ""}">
                  <input
                    type="checkbox"
                    .checked=${todo.done}
                    @change=${() => this.toggleTodo(todo.id)}
                    aria-label="Mark ${todo.text} as ${todo.done ? "incomplete" : "complete"}"
                  />
                  <span class="todo-category">${this.getCategoryIcon(todo.category)}</span>
                  <span class="todo-text">${todo.text}</span>
                  ${
                    todo.done
                      ? html`
                          <span class="todo-status">✓</span>
                        `
                      : html`
                          <span class="todo-status"></span>
                        `
                  }
                </li>
              `,
            )}
          </ul>
        </section>

        <!-- 最近使用的技能 / 任务 -->
        <section class="skills-section">
          <div class="section-header">
            <h2>最近使用</h2>
            <a href="/skills" class="section-link">查看全部 →</a>
          </div>
          <div class="skills-grid">
            ${this.recentSkills.map(
              (skill) => html`
                <div
                  class="skill-card"
                  @click=${() => this.navigateToSkill(skill)}
                  role="button"
                  tabindex="0"
                  aria-label="Open ${skill.name}"
                >
                  <div class="skill-icon">${skill.icon}</div>
                  <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-time">${skill.time}</div>
                  </div>
                  <div class="skill-arrow">→</div>
                </div>
              `,
            )}
          </div>
        </section>

        <!-- Chat Dock -->
        ${
          this.chatProps && this.renderChat
            ? html`
                <section class="chat-dock">
                  <div class="chat-dock__card">
                    ${this.renderChat(this.chatProps)}
                  </div>
                </section>
              `
            : nothing
        }

      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-home": HomeView;
  }
}
