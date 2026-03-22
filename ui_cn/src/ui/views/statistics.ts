import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

export interface MessageStats {
  total: number;
  processed: number;
  successRate: number;
  avgProcessTime: number;
}

export interface ToolCallStats {
  toolName: string;
  callCount: number;
  category: string;
}

/**
 * Statistics View Component
 *
 * 统计页面组件 - 展示消息统计和工具调用分析
 */
@customElement("openclaw-view-statistics")
export class StatisticsView extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @state()
  messageStats: MessageStats = {
    total: 0,
    processed: 0,
    successRate: 0,
    avgProcessTime: 0,
  };

  @state()
  toolCalls: ToolCallStats[] = [];

  @state()
  loading = true;

  @state()
  timeRange: "24h" | "7d" | "30d" = "7d";

  protected createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.fetchStatisticsData();
  }

  private async fetchStatisticsData() {
    this.loading = true;

    try {
      // TODO: 从 Gateway API 获取真实统计数据
      // 目前使用模拟数据
      this.messageStats = {
        total: 15234,
        processed: 14856,
        successRate: 97.5,
        avgProcessTime: 245,
      };

      this.toolCalls = [
        { toolName: "Data Analysis", callCount: 342, category: "analysis" },
        { toolName: "Email Campaign", callCount: 156, category: "marketing" },
        { toolName: "Image Generate", callCount: 89, category: "creative" },
        { toolName: "Document Write", callCount: 234, category: "writing" },
        { toolName: "Web Search", callCount: 567, category: "research" },
        { toolName: "Code Execute", callCount: 123, category: "development" },
        { toolName: "File Process", callCount: 98, category: "utility" },
        { toolName: "API Call", callCount: 445, category: "integration" },
      ];
    } catch (error) {
      console.error("Failed to fetch statistics data:", error);
    } finally {
      this.loading = false;
    }
  }

  private setTimeRange(range: "24h" | "7d" | "30d") {
    this.timeRange = range;
    void this.fetchStatisticsData();
  }

  private formatNumber(num: number): string {
    return num.toLocaleString();
  }

  private formatTime(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  }

  private getMaxCallCount(): number {
    return Math.max(...this.toolCalls.map((t) => t.callCount));
  }

  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      analysis: "var(--info)",
      marketing: "var(--accent)",
      creative: "var(--accent-2)",
      writing: "var(--ok)",
      research: "var(--warn)",
      development: "var(--danger)",
      utility: "var(--muted)",
      integration: "var(--accent-2)",
    };
    return colors[category] || "var(--muted)";
  }

  render() {
    if (this.loading) {
      return html`
        <div class="statistics-loading">Loading statistics...</div>
      `;
    }

    return html`
      <div class="statistics-container">
        <!-- 页面标题 -->
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Statistics</h1>
            <p class="page-subtitle">消息统计和工具调用分析</p>
          </div>

          <!-- 时间范围选择器 -->
          <div class="time-range-selector">
            ${(["24h", "7d", "30d"] as const).map(
              (range) => html`
                <button
                  class="range-button ${this.timeRange === range ? "active" : ""}"
                  @click=${() => this.setTimeRange(range)}
                >
                  ${range === "24h" ? "24小时" : range === "7d" ? "7天" : "30天"}
                </button>
              `,
            )}
          </div>
        </div>

        <!-- 消息统计卡片 -->
        <section class="stats-grid">
          <div class="stat-card stat-card--primary">
            <div class="stat-header">
              <span class="stat-icon">📨</span>
              <span class="stat-label">Total Messages</span>
            </div>
            <div class="stat-value">${this.formatNumber(this.messageStats.total)}</div>
            <div class="stat-change positive">+12.5% vs last period</div>
          </div>

          <div class="stat-card stat-card--success">
            <div class="stat-header">
              <span class="stat-icon">✅</span>
              <span class="stat-label">Processed</span>
            </div>
            <div class="stat-value">${this.formatNumber(this.messageStats.processed)}</div>
            <div class="stat-change neutral">${this.messageStats.processed / this.messageStats.total}% processed</div>
          </div>

          <div class="stat-card stat-card--info">
            <div class="stat-header">
              <span class="stat-icon">📈</span>
              <span class="stat-label">Success Rate</span>
            </div>
            <div class="stat-value">${this.messageStats.successRate}%</div>
            <div class="stat-change positive">+2.3% vs last period</div>
          </div>

          <div class="stat-card stat-card--warning">
            <div class="stat-header">
              <span class="stat-icon">⏱️</span>
              <span class="stat-label">Avg Process Time</span>
            </div>
            <div class="stat-value">${this.formatTime(this.messageStats.avgProcessTime)}</div>
            <div class="stat-change negative">+8% vs last period</div>
          </div>
        </section>

        <!-- 工具调用统计 -->
        <section class="tools-section">
          <div class="section-header">
            <h2>Tool Usage</h2>
            <span class="section-subtitle">Most frequently used tools</span>
          </div>

          <div class="tools-list">
            ${this.toolCalls.map((tool, index) => {
              const maxCount = this.getMaxCallCount();
              const percentage = (tool.callCount / maxCount) * 100;
              return html`
                <div class="tool-item">
                  <div class="tool-rank">${index + 1}</div>
                  <div class="tool-info">
                    <div class="tool-name">${tool.toolName}</div>
                    <div class="tool-category" style="color: ${this.getCategoryColor(tool.category)}">
                      ${tool.category}
                    </div>
                  </div>
                  <div class="tool-stats">
                    <div class="tool-count">${this.formatNumber(tool.callCount)} calls</div>
                    <div class="tool-bar">
                      <div
                        class="tool-bar-fill"
                        style="width: ${percentage}%; background: ${this.getCategoryColor(tool.category)}"
                      ></div>
                    </div>
                  </div>
                </div>
              `;
            })}
          </div>
        </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-statistics": StatisticsView;
  }
}
