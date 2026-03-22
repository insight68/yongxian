import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

// 团队成员类型
export interface TeamMember {
  id: string;
  name: string;
  title: string;
  abilities: string;
  tasks: string;
  status: string;
  reporter: string;
  avatar?: string;
}

// 树节点类型
interface TreeNode {
  member: TeamMember;
  children: TreeNode[];
  expanded: boolean;
}

@customElement("openclaw-view-team-structure")
export class TeamStructureView extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      box-sizing: border-box;

      /* 浅色系主题变量 */
      --team-bg-primary: #faf8f5;
      --team-bg-secondary: #f5f2ed;
      --team-bg-card: #ffffff;
      --team-bg-card-hover: #fffbf7;

      --team-accent-primary: #d4a574;
      --team-accent-secondary: #b8956a;
      --team-accent-tertiary: #e8c4a0;
      --team-accent-cyan: #a8c5d1;

      --team-text-primary: #2c2416;
      --team-text-secondary: #6b5d4f;
      --team-text-muted: #9a8b7a;

      --team-border-color: rgba(212, 165, 116, 0.15);
      --team-shadow: rgba(44, 36, 22, 0.08);
      --team-shadow-hover: rgba(44, 36, 22, 0.15);

      font-family:
        "Crimson Pro",
        "Inter",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "PingFang SC",
        "Hiragino Sans GB",
        "Microsoft YaHei",
        serif;
      background: var(--team-bg-primary);
      /* 纸质纹理背景 */
      background-image:
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(212, 165, 116, 0.02) 2px,
          rgba(212, 165, 116, 0.02) 4px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(212, 165, 116, 0.02) 2px,
          rgba(212, 165, 116, 0.02) 4px
        );
      padding: 48px 32px;
      position: relative;
      overflow-x: hidden;
    }

    .page-header {
      text-align: center;
      margin-bottom: 48px;
      position: relative;
      z-index: 1;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--team-text-primary);
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
      background: linear-gradient(
        135deg,
        var(--team-accent-primary) 0%,
        var(--team-accent-secondary) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--team-text-muted);
      margin: 0;
    }

    /* Tree container */
    .tree-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    /* Tree level wrapper */
    .tree-level {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 24px;
      margin-bottom: 48px;
    }

    /* Member card */
    .member-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 28px;
      border-radius: 16px;
      background: var(--team-bg-card);
      border: 1px solid var(--team-border-color);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 140px;
      position: relative;
    }

    .member-card:hover {
      transform: translateY(-4px);
      border-color: var(--team-accent-primary);
      box-shadow:
        0 8px 24px var(--team-shadow-hover),
        0 4px 12px rgba(212, 165, 116, 0.2);
    }

    .member-card.has-children {
      border-color: var(--team-accent-tertiary);
    }

    /* CEO special style */
    .ceo-card {
      position: relative;
      border-color: var(--team-accent-primary);
      background: linear-gradient(135deg, var(--team-bg-card) 0%, rgba(212, 165, 116, 0.08) 100%);
      box-shadow: 0 4px 16px var(--team-shadow);
    }

    .ceo-card::after {
      content: "";
      position: absolute;
      inset: -2px;
      background: linear-gradient(
        135deg,
        var(--team-accent-primary),
        var(--team-accent-secondary),
        var(--team-accent-tertiary)
      );
      border-radius: 18px;
      z-index: -1;
      opacity: 0.3;
      animation: glow-pulse 3s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%,
      100% {
        opacity: 0.2;
      }
      50% {
        opacity: 0.4;
      }
    }

    /* Avatar */
    .member-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--team-accent-primary), var(--team-accent-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin-bottom: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px var(--team-shadow);
    }

    .member-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .member-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--team-text-primary);
      text-align: center;
      margin-bottom: 4px;
    }

    .member-title {
      font-size: 12px;
      color: var(--team-text-secondary);
      text-align: center;
      line-height: 1.4;
    }

    /* Expand indicator */
    .expand-indicator {
      margin-top: 12px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--team-accent-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--team-accent-secondary);
      transition: all 0.3s ease;
    }

    .expand-indicator.expanded {
      transform: rotate(180deg);
      background: var(--team-accent-primary);
      color: white;
    }

    .expand-indicator svg {
      width: 14px;
      height: 14px;
    }

    /* Children container */
    .children-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 40px;
      padding-top: 40px;
      position: relative;
    }

    .children-container::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 20px;
      background: linear-gradient(to bottom, var(--team-accent-primary), transparent);
    }

    /* Child card */
    .child-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 24px;
      border-radius: 14px;
      background: var(--team-bg-card);
      border: 1px solid var(--team-border-color);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 120px;
    }

    .child-card:hover {
      transform: translateY(-3px);
      border-color: var(--team-accent-secondary);
      box-shadow:
        0 6px 20px var(--team-shadow-hover),
        0 3px 10px rgba(184, 149, 106, 0.2);
    }

    .child-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        var(--team-accent-secondary),
        var(--team-accent-tertiary)
      );
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin-bottom: 10px;
      overflow: hidden;
      box-shadow: 0 2px 6px var(--team-shadow);
    }

    .child-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .child-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--team-text-primary);
      text-align: center;
    }

    .child-title {
      font-size: 11px;
      color: var(--team-text-secondary);
      text-align: center;
      margin-top: 2px;
    }

    /* Level 3 - Rosie team */
    .level3-card {
      background: linear-gradient(135deg, var(--team-bg-card) 0%, rgba(212, 165, 116, 0.05) 100%);
    }

    .level3-card:hover {
      border-color: var(--team-accent-tertiary);
      box-shadow:
        0 6px 20px var(--team-shadow-hover),
        0 3px 10px rgba(232, 196, 160, 0.2);
    }

    .level3-avatar {
      background: linear-gradient(135deg, var(--team-accent-tertiary), var(--team-accent-cyan));
      box-shadow: 0 2px 6px var(--team-shadow);
    }

    /* Nested children container */
    .nested-children {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 32px;
      padding-top: 32px;
      position: relative;
    }

    .nested-children::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 16px;
      background: linear-gradient(to bottom, var(--team-accent-secondary), transparent);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(44, 36, 22, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fade-in 0.2s ease;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: var(--team-bg-card);
      border-radius: 24px;
      padding: 32px;
      max-width: 420px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      border: 1px solid var(--team-border-color);
      box-shadow:
        0 12px 40px var(--team-shadow-hover),
        0 0 0 1px rgba(212, 165, 116, 0.1) inset;
      animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--team-text-primary);
      margin: 0;
    }

    .modal-close {
      background: var(--team-bg-secondary);
      border: 1px solid var(--team-border-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      color: var(--team-text-secondary);
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      background: var(--team-bg-card-hover);
      border-color: var(--team-accent-primary);
      color: var(--team-text-primary);
    }

    .modal-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--team-accent-primary), var(--team-accent-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin: 0 auto 24px;
      overflow: hidden;
      box-shadow: 0 4px 16px var(--team-shadow);
    }

    .modal-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-info {
      margin-bottom: 24px;
    }

    .modal-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--team-border-color);
    }

    .modal-row:last-child {
      border-bottom: none;
    }

    .modal-label {
      font-size: 13px;
      color: var(--team-text-muted);
    }

    .modal-value {
      font-size: 14px;
      color: var(--team-text-primary);
      font-weight: 500;
    }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      margin-right: 6px;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
    }

    .modal-section {
      margin-top: 20px;
    }

    .modal-section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--team-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .modal-abilities {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ability-tag {
      font-size: 13px;
      padding: 6px 14px;
      background: var(--team-accent-tertiary);
      color: var(--team-accent-secondary);
      border-radius: 20px;
      border: 1px solid var(--team-accent-primary);
    }

    .modal-tasks {
      font-size: 14px;
      color: var(--team-text-secondary);
      line-height: 1.6;
    }

    .modal-actions {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--team-border-color);
    }

    .modal-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .modal-action-btn.primary {
      background: var(--team-accent-primary);
      color: #fff;
      border: none;
    }

    .modal-action-btn.primary:hover {
      background: var(--team-accent-secondary);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
    }

    /* Modal children (team members) */
    .modal-children {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
    }

    .modal-child-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--team-bg-secondary);
      border: 1px solid var(--team-border-color);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 160px;
    }

    .modal-child-card:hover {
      background: var(--team-bg-card-hover);
      border-color: var(--team-accent-primary);
      transform: translateY(-2px);
    }

    .modal-child-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        var(--team-accent-tertiary),
        var(--team-accent-secondary)
      );
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .modal-child-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-child-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .modal-child-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--team-text-primary);
    }

    .modal-child-title {
      font-size: 11px;
      color: var(--team-text-muted);
    }

    /* Footer */
    .footer-hint {
      margin-top: 48px;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .hint-text {
      font-size: 13px;
      color: var(--team-text-muted);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--team-bg-secondary);
      border-radius: 24px;
      border: 1px solid var(--team-border-color);
    }

    /* Loading */
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      color: var(--team-text-muted);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--team-border-color);
      border-top-color: var(--team-accent-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* SVG 连线系统 */
    .org-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .org-lines path {
      fill: none;
      stroke: var(--team-accent-primary);
      stroke-width: 2;
      opacity: 0.3;
      stroke-linecap: round;
    }

    .org-lines .main-line {
      stroke-width: 2.5;
      opacity: 0.4;
    }

    .org-lines .branch-line {
      stroke: var(--team-accent-secondary);
      stroke-width: 2;
      opacity: 0.3;
    }

    .org-lines .curve-line {
      stroke: var(--team-accent-tertiary);
      stroke-width: 1.5;
      opacity: 0.25;
    }

    /* Responsive Design - Tablet */
    @media (max-width: 1100px) {
      :host {
        padding: 32px 20px;
      }

      .page-title {
        font-size: 28px;
      }

      .tree-level {
        gap: 20px;
      }

      .member-card {
        min-width: 130px;
        padding: 20px 24px;
      }

      .child-card {
        min-width: 110px;
        padding: 18px 20px;
      }
    }

    /* Responsive Design - Mobile */
    @media (max-width: 768px) {
      :host {
        padding: 24px 16px;
        min-height: auto;
      }

      .page-header {
        margin-bottom: 32px;
      }

      .page-title {
        font-size: 24px;
      }

      .page-subtitle {
        font-size: 13px;
      }

      /* 移动端隐藏连线 */
      .org-lines {
        display: none;
      }

      .tree-level {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        margin-bottom: 32px;
      }

      .member-card,
      .child-card {
        min-width: 100%;
        max-width: 100%;
      }

      .member-card {
        padding: 20px;
      }

      .child-card {
        padding: 16px;
      }

      .children-container {
        flex-direction: column;
        gap: 16px;
        margin-top: 24px;
        padding-top: 24px;
      }

      .nested-children {
        flex-direction: column;
        gap: 12px;
        margin-top: 24px;
        padding-top: 24px;
      }

      .modal-content {
        width: 95%;
        padding: 24px;
        max-height: 90vh;
      }

      .modal-title {
        font-size: 20px;
      }

      .modal-avatar {
        width: 80px;
        height: 80px;
        font-size: 32px;
        margin-bottom: 20px;
      }

      .footer-hint {
        margin-top: 32px;
      }

      .hint-text {
        font-size: 12px;
        padding: 10px 16px;
      }
    }

    /* Responsive Design - Small Mobile */
    @media (max-width: 480px) {
      :host {
        padding: 20px 12px;
      }

      .page-title {
        font-size: 22px;
      }

      .member-avatar {
        width: 56px;
        height: 56px;
        font-size: 20px;
      }

      .child-avatar {
        width: 48px;
        height: 48px;
        font-size: 16px;
      }

      .member-name {
        font-size: 15px;
      }

      .member-title,
      .child-title {
        font-size: 11px;
      }

      .modal-content {
        padding: 20px;
        border-radius: 20px;
      }

      .modal-avatar {
        width: 72px;
        height: 72px;
        font-size: 28px;
      }
    }
  `;

  @state()
  private tree: TreeNode[] = [];

  @state()
  private loading = true;

  @state()
  private selectedMember: TeamMember | null = null;

  @state()
  private selectedMemberChildren: TreeNode[] = [];

  @state()
  private lastRefreshTime = "";

  // 移除 createRenderRoot() 方法以使用默认的 Shadow DOM
  // protected createRenderRoot() {
  //   return this;
  // }

  connectedCallback(): void {
    super.connectedCallback();
    void this.loadTeamData();
  }

  private async loadTeamData() {
    this.loading = true;
    try {
      const response = await fetch("/api/team-structure");
      if (!response.ok) {
        throw new Error("Failed to fetch team data");
      }
      const members = (await response.json()) as TeamMember[];
      this.tree = this.buildTree(members);
      this.lastRefreshTime = new Date().toLocaleTimeString();
    } catch (error) {
      console.error("Failed to load team data:", error);
      this.tree = this.getDefaultTree();
      this.lastRefreshTime = new Date().toLocaleTimeString();
    } finally {
      this.loading = false;
    }
  }

  private buildTree(members: TeamMember[]): TreeNode[] {
    const ceo = members.find((m) => !m.reporter || m.reporter === "");
    if (!ceo) {
      return this.getDefaultTree();
    }

    const buildNode = (member: TeamMember): TreeNode => {
      const children = members.filter((m) => m.reporter === member.id).map((m) => buildNode(m));

      return {
        member,
        children,
        expanded: true,
      };
    };

    return [buildNode(ceo)];
  }

  private getDefaultTree(): TreeNode[] {
    const leo: TreeNode = {
      member: {
        id: "leo",
        name: "Leo",
        title: "CEO / 总指挥",
        abilities: "接收并分解任务,协调各专业Agent工作,最终决策和质量把控",
        tasks: "任务分配,进度追踪,结果审核",
        status: "💭 思考",
        reporter: "",
      },
      expanded: true,
      children: [],
    };

    // L2: 直接汇报给 leo
    const layer2: TreeNode[] = [
      {
        member: {
          id: "siyuan",
          name: "思远",
          title: "首席战略官(CSO)",
          abilities: "洞察用户,活动设计,营销策略,为最终结果负责",
          tasks: "项目规划与执行",
          status: "💭 思考",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "jianfeng",
          name: "剑锋",
          title: "COO",
          abilities: "洞察用户,需求挖掘,架构设计",
          tasks: "产品规划,任务分解,持续迭代",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "chengze",
          name: "武承泽",
          title: "CFO",
          abilities: "公司首席财务官,交易分析,金融",
          tasks: "市场分析,交易决策,风险评估",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "hengyue",
          name: "恒岳",
          title: "CTO",
          abilities: "开发,自动化,技术方案",
          tasks: "网站开发,脚本编写,技术问题解决",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "jingxing",
          name: "景行",
          title: "产品VP",
          abilities: "洞察用户,需求挖掘,架构设计",
          tasks: "产品规划,任务分解,持续迭代",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "minglv",
          name: "明律",
          title: "法务",
          abilities: "法律咨询,合同审核,风险控制",
          tasks: "法律合规,合同管理,风险防范",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "xingye",
          name: "星野",
          title: "内容总监",
          abilities: "选题规划,内容策略",
          tasks: "选题分析,内容规划,热点追踪",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
      {
        member: {
          id: "rosie",
          name: "罗西",
          title: "小红书运营总监",
          abilities: "百万顶流网红的教练",
          tasks: "孵化,训练,反馈,指导博主成长",
          status: "💼 工作",
          reporter: "leo",
        },
        expanded: true,
        children: [],
      },
    ];

    // L3: 汇报给 jianfeng (COO)
    const layer3_jianfeng: TreeNode[] = [
      {
        member: {
          id: "moyun",
          name: "墨韵",
          title: "创意写作官",
          abilities: "内容创作,文案优化",
          tasks: "文案撰写,内容创作,创意策划",
          status: "💼 工作",
          reporter: "jianfeng",
        },
        expanded: false,
        children: [],
      },
      {
        member: {
          id: "shengtuo",
          name: "声拓",
          title: "媒体运营官",
          abilities: "多平台发布,媒体管理",
          tasks: "平台运营,内容分发,数据追踪",
          status: "💼 工作",
          reporter: "jianfeng",
        },
        expanded: false,
        children: [],
      },
    ];

    // L3: 汇报给 jingxing (产品VP)
    const layer3_jingxing: TreeNode[] = [
      {
        member: {
          id: "qifan",
          name: "启帆",
          title: "产品运营",
          abilities: "产品分类",
          tasks: "产品分类,运营分析,用户反馈",
          status: "💼 工作",
          reporter: "jingxing",
        },
        expanded: false,
        children: [],
      },
    ];

    // L3: 汇报给 chengze (CFO)
    const layer3_chengze: TreeNode[] = [
      {
        member: {
          id: "thea",
          name: "西娅",
          title: "股票投资总监",
          abilities: "洞察市场,果断",
          tasks: "投资分析,股票交易,市场研究",
          status: "💼 工作",
          reporter: "chengze",
        },
        expanded: false,
        children: [],
      },
    ];

    // L3: 汇报给 rosie (小红书运营总监)
    const layer3_rosie: TreeNode[] = [
      {
        member: {
          id: "lili",
          name: "张小丽",
          title: "小红书博主",
          abilities: "日常生活,教育",
          tasks: "分享日常生活,教育孩子的点滴故事",
          status: "😴 休息",
          reporter: "rosie",
        },
        expanded: false,
        children: [],
      },
      {
        member: {
          id: "xuanran",
          name: "许安然",
          title: "小红书博主",
          abilities: "极简生活,职场干货",
          tasks: "分享极简生活、职场干货、产品经理成长",
          status: "💼 工作",
          reporter: "rosie",
        },
        expanded: false,
        children: [],
      },
      {
        member: {
          id: "suxiaonuan",
          name: "苏小暖",
          title: "小红书博主",
          abilities: "宠物,情感",
          tasks: "分享宠物日常（豆豆、小橘）、情感语录",
          status: "😴 休息",
          reporter: "rosie",
        },
        expanded: false,
        children: [],
      },
      {
        member: {
          id: "chenyuwei",
          name: "陈雨薇",
          title: "小红书博主",
          abilities: "美食,探店",
          tasks: "探店推荐、美食教程、川菜、网红店测评",
          status: "💼 工作",
          reporter: "rosie",
        },
        expanded: false,
        children: [],
      },
      {
        member: {
          id: "linshiyao",
          name: "林诗瑶",
          title: "小红书博主",
          abilities: "瑜伽,情感",
          tasks: "分享生活心得和生活中的趣事",
          status: "😴 休息",
          reporter: "rosie",
        },
        expanded: false,
        children: [],
      },
      {
        member: {
          id: "linjingshu",
          name: "林静书",
          title: "HR负责人",
          abilities: "管理公司人力资源",
          tasks: "招聘,培训,员工关系,绩效考核",
          status: "💼 工作",
          reporter: "rosie",
        },
        expanded: false,
        children: [],
      },
    ];

    // 建立 L2 成员的 children 关联
    const jianfengNode = layer2.find((n) => n.member.id === "jianfeng");
    if (jianfengNode) {
      jianfengNode.children = layer3_jianfeng;
    }

    const jingxingNode = layer2.find((n) => n.member.id === "jingxing");
    if (jingxingNode) {
      jingxingNode.children = layer3_jingxing;
    }

    const chengzeNode = layer2.find((n) => n.member.id === "chengze");
    if (chengzeNode) {
      chengzeNode.children = layer3_chengze;
    }

    const rosieNode = layer2.find((n) => n.member.id === "rosie");
    if (rosieNode) {
      rosieNode.children = layer3_rosie;
    }

    leo.children = layer2;
    return [leo];
  }

  private toggleExpand(node: TreeNode, e: Event) {
    e.stopPropagation();
    node.expanded = !node.expanded;
    this.requestUpdate();
  }

  private openModal(member: TeamMember) {
    this.selectedMember = member;
    // 查找成员的下属
    this.selectedMemberChildren = this.findMemberChildren(member.id);
  }

  private findMemberChildren(memberId: string): TreeNode[] {
    const findInTree = (nodes: TreeNode[]): TreeNode[] => {
      for (const node of nodes) {
        if (node.member.id === memberId) {
          return node.children;
        }
        const found = findInTree(node.children);
        if (found.length > 0) {
          return found;
        }
      }
      return [];
    };
    return findInTree(this.tree);
  }

  private closeModal() {
    this.selectedMember = null;
    this.selectedMemberChildren = [];
  }

  private getAvatarUrl(memberId: string): string {
    // 头像映射表：成员 ID -> 头像文件名
    const avatarMap: Record<string, string> = {
      leo: "lion.webp", // CEO - 狮子
      siyuan: "arthur.webp", // 首席战略官
      jianfeng: "brian.webp", // 首席技术官
      chengze: "jason.webp", // 首席产品官
      hengyue: "harvey.webp", // 首席运营官
      jingxing: "kevin.webp", // 首席财务官
      xingye: "josh.webp", // 首席营销官
      rosie: "emma.webp", // 人力资源总监
      lili: "Audrey.webp", // 母亲博主
      xuanran: "hunter.webp", // 职场博主
      suxiaonuan: "suxiaonuan.jpg", // 宠物博主
      chenyuwei: "chenyuwei.jpg", // 美食博主 - 专属头像
      linshiyao: "linshiyao.jpg", // 瑜伽/情感博主
    };

    const avatarName = avatarMap[memberId] || "lion.webp";
    return `/teams/${avatarName}`;
  }

  private getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  private isCEO(node: TreeNode): boolean {
    return node.member.id === "leo";
  }

  private isRosieTeam(node: TreeNode): boolean {
    return node.member.reporter === "rosie";
  }

  private renderMemberCard(node: TreeNode, isChild = false, forceLevel3 = false) {
    const { member, expanded, children } = node;
    const hasChildren = children.length > 0;
    const isCEO = this.isCEO(node);
    const isRosie = this.isRosieTeam(node);
    const isLevel3 = forceLevel3 || isRosie;

    if (isChild) {
      return html`
        <div
          class="child-card ${isLevel3 ? "level3-card" : ""}"
          @click=${() => this.openModal(member)}
        >
          <div class="child-avatar ${isLevel3 ? "level3-avatar" : ""}">
            <img
              src=${this.getAvatarUrl(member.id)}
              alt=${member.name}
              @error=${(e: Event) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.textContent = this.getInitials(member.name);
              }}
            />
          </div>
          <div class="child-name">${member.name}</div>
          <div class="child-title">${member.title}</div>
        </div>
      `;
    }

    return html`
      <div
        class="member-card ${hasChildren ? "has-children" : ""} ${isCEO ? "ceo-card" : ""}"
        @click=${() => this.openModal(member)}
      >
        <div class="member-avatar">
          <img
            src=${this.getAvatarUrl(member.id)}
            alt=${member.name}
            @error=${(e: Event) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.textContent = this.getInitials(member.name);
            }}
          />
        </div>
        <div class="member-name">${member.name}</div>
        <div class="member-title">${member.title}</div>
        ${
          hasChildren
            ? html`
              <div
                class="expand-indicator ${expanded ? "expanded" : ""}"
                @click=${(e: Event) => this.toggleExpand(node, e)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            `
            : nothing
        }
      </div>
      ${
        hasChildren && expanded
          ? html`
            <div class="children-container">
              ${children.map((child) => this.renderMemberCard(child, true))}
            </div>
          `
          : nothing
      }
    `;
  }

  private renderTree() {
    return html`
      <div class="tree-container">
        <!-- SVG 连线层 -->
        <svg class="org-lines" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
          <!-- CEO 到第二层的主干线 -->
          <path d="M 500 120 L 500 200" class="main-line" />

          <!-- 第二层的水平分支线 -->
          <path d="M 200 200 L 800 200" class="branch-line" />

          <!-- 垂直连接到各个成员 (示例) -->
          <path d="M 300 200 L 300 280" class="branch-line" />
          <path d="M 500 200 L 500 280" class="branch-line" />
          <path d="M 700 200 L 700 280" class="branch-line" />

          <!-- 曲线连接到第三层 (贝塞尔曲线示例) -->
          <path d="M 500 400 Q 500 430, 450 450" class="curve-line" />
          <path d="M 500 400 Q 500 430, 550 450" class="curve-line" />
        </svg>

        ${this.tree.map((node) => this.renderMemberCard(node))}
      </div>
    `;
  }

  private navigateToChat(member: TeamMember, e?: Event) {
    if (e) {
      e.stopPropagation();
    }
    // 构建 sessionKey: agent:{id}:main
    const sessionKey = `agent:${member.id}:main`;

    // 获取当前路径，切换到 /chat
    const url = new URL(window.location.href);
    url.pathname = '/chat';
    url.searchParams.set('session', sessionKey);

    // 使用 pushState 改变 URL
    window.history.pushState({}, '', url.toString());

    // 手动触发 popstate 事件，让 app-settings 的 onPopState 处理状态更新
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  private renderModal() {
    if (!this.selectedMember) {return nothing;}

    const member = this.selectedMember;
    const abilities = member.abilities.split(",").map((a) => a.trim());

    return html`
      <div class="modal-overlay" @click=${() => this.closeModal()}>
        <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
          <div class="modal-header">
            <h2 class="modal-title">${member.name}</h2>
            <button class="modal-close" @click=${() => this.closeModal()}>×</button>
          </div>

          <div class="modal-avatar">
            <img
              src=${this.getAvatarUrl(member.id)}
              alt=${member.name}
              @error=${(e: Event) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.textContent = this.getInitials(member.name);
              }}
            />
          </div>

          <div class="modal-info">
            <div class="modal-row">
              <span class="modal-label">职位</span>
              <span class="modal-value">${member.title}</span>
            </div>
            <div class="modal-row">
              <span class="modal-label">状态</span>
              <span class="modal-value">
                <span class="status-dot"></span>
                ${member.status.replace("✅ ", "")}
              </span>
            </div>
            <div class="modal-row">
              <span class="modal-label">汇报对象</span>
              <span class="modal-value">${member.reporter || "无"}</span>
            </div>
          </div>

          <div class="modal-section">
            <div class="modal-section-title">核心能力</div>
            <div class="modal-abilities">
              ${abilities.map((ability) => html`<span class="ability-tag">${ability}</span>`)}
            </div>
          </div>

          <div class="modal-section">
            <div class="modal-section-title">典型任务</div>
            <div class="modal-tasks">${member.tasks}</div>
          </div>

          <div class="modal-actions">
            <button
              class="modal-action-btn primary"
              @click=${(e: Event) => this.navigateToChat(member, e)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              发起对话
            </button>
          </div>

          ${
            this.selectedMemberChildren.length > 0
              ? html`
                <div class="modal-section">
                  <div class="modal-section-title">团队成员 (${this.selectedMemberChildren.length})</div>
                  <div class="modal-children">
                    ${this.selectedMemberChildren.map(
                      (child) => html`
                        <div
                          class="modal-child-card"
                          @click=${(e: Event) => {
                            e.stopPropagation();
                            this.closeModal();
                            setTimeout(() => this.openModal(child.member), 100);
                          }}
                        >
                          <div class="modal-child-avatar">
                            <img
                              src=${this.getAvatarUrl(child.member.id)}
                              alt=${child.member.name}
                              @error=${(e: Event) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.parentElement!.textContent = this.getInitials(
                                  child.member.name,
                                );
                              }}
                            />
                          </div>
                          <div class="modal-child-info">
                            <div class="modal-child-name">${child.member.name}</div>
                            <div class="modal-child-title">${child.member.title}</div>
                          </div>
                        </div>
                      `,
                    )}
                  </div>
                </div>
              `
              : nothing
          }
        </div>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    return html`
      <div class="page-header">
        <h1 class="page-title">团队架构</h1>
        <p class="page-subtitle">点击成员卡片查看详情</p>
      </div>

      ${this.renderTree()}

      ${this.renderModal()}

      <div class="footer-hint">
        <span class="hint-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          自动刷新于 ${this.lastRefreshTime}
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-team-structure": TeamStructureView;
  }
}
