import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

/**
 * Agent 团队成员信息
 */
export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  roleTag: "LEAD" | "INT" | "SPC" | "";
  status: "working" | "idle" | "offline";
}

/**
 * 任务卡片信息
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  timestamp: string;
  tags: string[];
  status: "inbox" | "assigned" | "in-progress" | "review" | "done";
  progress?: number; // 进度百分比 0-100
  theme?: string; // 所属主题
}

/**
 * Kanban 列配置
 */
interface KanbanColumn {
  id: string;
  title: string;
  status: Task["status"];
  icon: string;
  color: string;
  count: number;
}

/**
 * Mission Control Dashboard 组件
 *
 * 任务控制中心 - 两栏式布局展示 Agents 和 Kanban 看板
 */
@customElement("openclaw-view-mission-control")
export class MissionControlView extends LitElement {
  static styles = css`
    :host {
      /* 浅色系主题变量 */
      --mission-bg-primary: #faf8f5; /* 温暖的米白色背景 */
      --mission-bg-secondary: #f5f2ed; /* 次级背景 */
      --mission-bg-card: #ffffff; /* 卡片背景 */
      --mission-bg-card-hover: #fffbf7; /* 卡片悬停 */

      --mission-accent-primary: #d4a574; /* 金色主色调 */
      --mission-accent-secondary: #b8956a; /* 深金色 */
      --mission-accent-tertiary: #e8c4a0; /* 浅金色 */

      --mission-text-primary: #2c2416; /* 深棕色文字 */
      --mission-text-secondary: #6b5d4f; /* 中等棕色 */
      --mission-text-muted: #9a8b7a; /* 浅棕色 */

      --mission-border-color: rgba(212, 165, 116, 0.15);
      --mission-shadow: rgba(44, 36, 22, 0.08);
      --mission-shadow-hover: rgba(44, 36, 22, 0.15);

      display: block;
      width: 100%;
      height: 100%;
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
      background: var(--mission-bg-primary);
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
      padding: 32px 24px;
      overflow-y: auto;
    }
  `;

  // ========== 状态数据 ==========

  @state()
  agents: Agent[] = [];

  @state()
  tasks: Task[] = [];

  @state()
  loading = true;

  @state()
  currentTime = new Date();

  @state()
  activeAgentsCount = 6;

  @state()
  tasksInQueue = 35;

  // Kanban 列配置
  private readonly kanbanColumns: KanbanColumn[] = [
    { id: "inbox", title: "计划中", status: "inbox", icon: "📋", color: "#3b82f6", count: 4 },
    { id: "assigned", title: "已分配", status: "assigned", icon: "📤", color: "#f59e0b", count: 3 },
    {
      id: "in-progress",
      title: "进行中",
      status: "in-progress",
      icon: "🔄",
      color: "#22c55e",
      count: 5,
    },
    { id: "review", title: "审核中", status: "review", icon: "👁️", color: "#8b5cf6", count: 2 },
    { id: "done", title: "已完成", status: "done", icon: "✅", color: "#22c55e", count: 6 },
  ];

  // 时间更新定时器
  private timeUpdateInterval: number | null = null;

  // 模拟任务动态更新
  private taskUpdateInterval: number | null = null;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.fetchMissionData();
    // 每秒更新时间
    this.timeUpdateInterval = window.setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    // 每3秒模拟任务状态更新
    this.taskUpdateInterval = window.setInterval(() => {
      this.simulateTaskProgress();
    }, 3000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.timeUpdateInterval !== null) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
    if (this.taskUpdateInterval !== null) {
      clearInterval(this.taskUpdateInterval);
      this.taskUpdateInterval = null;
    }
  }

  private async fetchMissionData() {
    this.loading = true;
    try {
      // TODO: 从 Gateway API 获取真实数据
      // 当前使用模拟数据

      // 团队成员数据 - 根据真实团队成员
      this.agents = [
        {
          id: "leo",
          name: "Leo",
          avatar: "/teams/lion.webp",
          role: "CEO",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "siyuan",
          name: "思远",
          avatar: "/teams/arthur.webp",
          role: "CSO 首席战略官",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "jianfeng",
          name: "剑锋",
          avatar: "/teams/brian.webp",
          role: "COO",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "chengze",
          name: "武承泽",
          avatar: "/teams/jason.webp",
          role: "CFO",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "hengyue",
          name: "恒岳",
          avatar: "/teams/harvey.webp",
          role: "CTO",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "jingxing",
          name: "顾景行",
          avatar: "/teams/kevin.webp",
          role: "产品VP",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "xingye",
          name: "星野",
          avatar: "/teams/josh.webp",
          role: "内容总监",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "rosie",
          name: "Rosie",
          avatar: "/teams/emma.webp",
          role: "小红书运营总监",
          roleTag: "LEAD",
          status: "working",
        },
        {
          id: "lili",
          name: "小丽",
          avatar: "/teams/Audrey.webp",
          role: "小红书博主",
          roleTag: "INT",
          status: "working",
        },
        {
          id: "xuanran",
          name: "安然",
          avatar: "/teams/hunter.webp",
          role: "小红书博主",
          roleTag: "INT",
          status: "working",
        },
        {
          id: "suxiaonuan",
          name: "小暖",
          avatar: "/teams/suxiaonuan.jpg",
          role: "小红书博主",
          roleTag: "INT",
          status: "working",
        },
        {
          id: "chenyuwei",
          name: "雨薇",
          avatar: "/teams/chenyuwei.jpg",
          role: "小红书博主",
          roleTag: "INT",
          status: "working",
        },
        {
          id: "moyun",
          name: "墨韵",
          avatar: "/teams/emma.webp",
          role: "创意写作官",
          roleTag: "INT",
          status: "working",
        },
        {
          id: "shengtuo",
          name: "声拓",
          avatar: "/teams/josh.webp",
          role: "媒体运营官",
          roleTag: "INT",
          status: "working",
        },
        {
          id: "thea",
          name: "Thea",
          avatar: "/teams/no1.webp",
          role: "股票投资总监",
          roleTag: "INT",
          status: "working",
        },
      ];

      // 更新活跃成员数
      this.activeAgentsCount = this.agents.filter((a) => a.status === "working").length;

      // 任务数据 - 基于真实团队成员和业务场景
      // 主题: 小红书运营、官网开发、内容创作、股票投资
      this.tasks = [
        // ========== 已完成任务 (15个) ==========
        {
          id: "done-1",
          title: "确定Q3小红书运营策略",
          description: "团队讨论确定账号定位、内容方向和目标用户画像",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "2天前",
          tags: ["小红书", "策划"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-2",
          title: "小丽账号内容定位确认",
          description: "确定育儿类账号内容方向，包括日常育儿、绘本分享等",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "2天前",
          tags: ["小红书", "育儿"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-3",
          title: "安然账号人设打造",
          description: "完成极简生活博主定位，确定内容风格和出镜形象",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "1天前",
          tags: ["小红书", "人设"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-4",
          title: "雨薇探店合作资源梳理",
          description: "整理北京/上海地区适合的餐饮探店商家清单",
          assignee: "雨薇",
          assigneeAvatar: "/teams/chenyuwei.jpg",
          timestamp: "1天前",
          tags: ["小红书", "探店"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-5",
          title: "官网技术架构设计",
          description: "确定使用 Next.js 14 + Tailwind CSS 重构方案",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "1天前",
          tags: ["官网", "技术"],
          status: "done",
          progress: 100,
          theme: "官网重构",
        },
        {
          id: "done-6",
          title: "Q3内容选题会",
          description: "星野主持，确定未来3个月的内容选题和更新频率",
          assignee: "星野",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "18小时前",
          tags: ["内容", "策划"],
          status: "done",
          progress: 100,
          theme: "内容创作",
        },
        {
          id: "done-7",
          title: "小暖救助流浪动物内容策划",
          description: "策划系列流浪动物救助内容，提升账号温度",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "12小时前",
          tags: ["小红书", "宠物"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-8",
          title: "股票投资组合策略制定",
          description: "Thea 制定300万资金的投资组合方案，分散风险",
          assignee: "Thea",
          assigneeAvatar: "/teams/no1.webp",
          timestamp: "1天前",
          tags: ["投资", "策略"],
          status: "done",
          progress: 100,
          theme: "股票投资",
        },
        {
          id: "done-9",
          title: "声拓多平台账号搭建",
          description: "完成小红书、微博、抖音账号的基础设置和绑定",
          assignee: "声拓",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "2天前",
          tags: ["运营", "平台"],
          status: "done",
          progress: 100,
          theme: "内容创作",
        },
        {
          id: "done-10",
          title: "墨韵写作风格确定",
          description: "确定公众号文风定位，聚焦职场成长和干货分享",
          assignee: "墨韵",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "1天前",
          tags: ["写作", "内容"],
          status: "done",
          progress: 100,
          theme: "内容创作",
        },
        {
          id: "done-11",
          title: "38复盘报告",
          description: "分析38期间的销售数据和用户反馈",
          assignee: "剑锋",
          assigneeAvatar: "/teams/brian.webp",
          timestamp: "3天前",
          tags: ["复盘", "数据"],
          status: "done",
          progress: 100,
          theme: "运营分析",
        },
        {
          id: "done-12",
          title: "小丽首条笔记发布",
          description: "发布第一条育儿日常笔记，测试账号活跃度",
          assignee: "小丽",
          assigneeAvatar: "/teams/Audrey.webp",
          timestamp: "1天前",
          tags: ["小红书", "发布"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-13",
          title: "安然极简生活合集规划",
          description: "规划极简生活主题内容系列，共10期",
          assignee: "安然",
          assigneeAvatar: "/teams/hunter.webp",
          timestamp: "2天前",
          tags: ["小红书", "合集"],
          status: "done",
          progress: 100,
          theme: "小红书运营",
        },
        {
          id: "done-14",
          title: "官网域名购买与备案",
          description: "完成新域名购买和ICP备案申请",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "3天前",
          tags: ["官网", "域名"],
          status: "done",
          progress: 100,
          theme: "官网重构",
        },
        {
          id: "done-15",
          title: "Q3预算审批",
          description: "50万运营预算获得CEO批准",
          assignee: "思远",
          assigneeAvatar: "/teams/arthur.webp",
          timestamp: "1天前",
          tags: ["预算", "审批"],
          status: "done",
          progress: 100,
          theme: "战略规划",
        },

        // ========== 审核中任务 (6个) ==========
        {
          id: "review-1",
          title: "小丽本周笔记数据复盘",
          description: "分析前3条笔记的阅读量、点赞、收藏数据",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "4小时前",
          tags: ["小红书", "数据"],
          status: "review",
          progress: 90,
          theme: "小红书运营",
        },
        {
          id: "review-2",
          title: "官网首页设计稿",
          description: "完成首页高保真设计，待思远确认",
          assignee: "顾景行",
          assigneeAvatar: "/teams/kevin.webp",
          timestamp: "2小时前",
          tags: ["官网", "设计"],
          status: "review",
          progress: 95,
          theme: "官网重构",
        },
        {
          id: "review-3",
          title: "安然极简生活第一期内容",
          description: "极简生活主题第一期笔记，待审核发布",
          assignee: "安然",
          assigneeAvatar: "/teams/hunter.webp",
          timestamp: "3小时前",
          tags: ["小红书", "内容"],
          status: "review",
          progress: 85,
          theme: "小红书运营",
        },
        {
          id: "review-4",
          title: "股票池筛选报告",
          description: "Thea 筛选出20只潜力股票，待武承泽审批",
          assignee: "Thea",
          assigneeAvatar: "/teams/no1.webp",
          timestamp: "5小时前",
          tags: ["投资", "股票"],
          status: "review",
          progress: 88,
          theme: "股票投资",
        },
        {
          id: "review-5",
          title: "声拓本周发布排期",
          description: "规划下周一到周日的多平台内容发布顺序",
          assignee: "声拓",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "6小时前",
          tags: ["运营", "排期"],
          status: "review",
          progress: 80,
          theme: "内容创作",
        },
        {
          id: "review-6",
          title: "墨韵公众号文章大纲",
          description: "职场成长主题文章结构，待星野确认方向",
          assignee: "墨韵",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "8小时前",
          tags: ["写作", "大纲"],
          status: "review",
          progress: 92,
          theme: "内容创作",
        },

        // ========== 进行中任务 (18个) ==========
        {
          id: "progress-1",
          title: "小丽育儿日常拍摄",
          description: "拍摄明天发布的育儿互动视频",
          assignee: "小丽",
          assigneeAvatar: "/teams/Audrey.webp",
          timestamp: "30分钟前",
          tags: ["小红书", "拍摄"],
          status: "in-progress",
          progress: 65,
          theme: "小红书运营",
        },
        {
          id: "progress-2",
          title: "官网首页开发",
          description: "开发首页 Hero 区域和产品展示模块",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "1小时前",
          tags: ["官网", "开发"],
          status: "in-progress",
          progress: 45,
          theme: "官网重构",
        },
        {
          id: "progress-3",
          title: "小暖流浪猫救助Vlog",
          description: "拍摄今天救助流浪猫的全过程",
          assignee: "小暖",
          assigneeAvatar: "/teams/suxiaonuan.jpg",
          timestamp: "2小时前",
          tags: ["小红书", "Vlog"],
          status: "in-progress",
          progress: 50,
          theme: "小红书运营",
        },
        {
          id: "progress-4",
          title: "雨薇探店视频剪辑",
          description: "剪辑昨天拍摄的日料店探店视频",
          assignee: "雨薇",
          assigneeAvatar: "/teams/chenyuwei.jpg",
          timestamp: "3小时前",
          tags: ["小红书", "剪辑"],
          status: "in-progress",
          progress: 70,
          theme: "小红书运营",
        },
        {
          id: "progress-5",
          title: "官网SEO优化",
          description: "设置TDK、优化图片Alt标签和内链结构",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "4小时前",
          tags: ["官网", "SEO"],
          status: "in-progress",
          progress: 35,
          theme: "官网重构",
        },
        {
          id: "progress-6",
          title: "Rosie 博主培训课程",
          description: "为小丽定制第三期培训内容，聚焦拍摄技巧",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "2小时前",
          tags: ["小红书", "培训"],
          status: "in-progress",
          progress: 55,
          theme: "小红书运营",
        },
        {
          id: "progress-7",
          title: "星野热点追踪分析",
          description: "分析本周微博/小红书热点话题，输出选题建议",
          assignee: "星野",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "5小时前",
          tags: ["内容", "热点"],
          status: "in-progress",
          progress: 60,
          theme: "内容创作",
        },
        {
          id: "progress-8",
          title: "官网用户调研问卷设计",
          description: "设计新官网的用户满意度调查问卷",
          assignee: "顾景行",
          assigneeAvatar: "/teams/kevin.webp",
          timestamp: "3小时前",
          tags: ["官网", "调研"],
          status: "in-progress",
          progress: 40,
          theme: "官网重构",
        },
        {
          id: "progress-9",
          title: "墨韵公众号文章撰写",
          description: "撰写职场成长主题干货文章，预计2000字",
          assignee: "墨韵",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "6小时前",
          tags: ["写作", "文章"],
          status: "in-progress",
          progress: 30,
          theme: "内容创作",
        },
        {
          id: "progress-10",
          title: "安然产品经理成长系列内容",
          description: "规划产品经理面试技巧系列内容第一期",
          assignee: "安然",
          assigneeAvatar: "/teams/hunter.webp",
          timestamp: "4小时前",
          tags: ["小红书", "职场"],
          status: "in-progress",
          progress: 45,
          theme: "小红书运营",
        },
        // 新增任务
        {
          id: "progress-11",
          title: "安然小红书数据复盘",
          description: "分析上周发布的极简生活内容数据表现",
          assignee: "安然",
          assigneeAvatar: "/teams/hunter.webp",
          timestamp: "1小时前",
          tags: ["小红书", "数据"],
          status: "in-progress",
          progress: 25,
          theme: "小红书运营",
        },
        {
          id: "progress-12",
          title: "声拓抖音视频发布",
          description: "剪辑今日内容并发布到抖音平台",
          assignee: "声拓",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "30分钟前",
          tags: ["运营", "视频"],
          status: "in-progress",
          progress: 15,
          theme: "内容创作",
        },
        {
          id: "progress-13",
          title: "小暖猫咪日常Vlog",
          description: "拍摄家里三只猫的互动日常",
          assignee: "小暖",
          assigneeAvatar: "/teams/suxiaonuan.jpg",
          timestamp: "20分钟前",
          tags: ["小红书", "Vlog"],
          status: "in-progress",
          progress: 10,
          theme: "小红书运营",
        },
        {
          id: "progress-14",
          title: "雨薇美食教程拍摄",
          description: "拍摄家常川菜教学视频",
          assignee: "雨薇",
          assigneeAvatar: "/teams/chenyuwei.jpg",
          timestamp: "15分钟前",
          tags: ["小红书", "美食"],
          status: "in-progress",
          progress: 5,
          theme: "小红书运营",
        },
        {
          id: "progress-15",
          title: "Thea 股票池更新",
          description: "更新本周关注的股票池，新增5只潜力股",
          assignee: "Thea",
          assigneeAvatar: "/teams/no1.webp",
          timestamp: "2小时前",
          tags: ["投资", "分析"],
          status: "in-progress",
          progress: 40,
          theme: "股票投资",
        },
        {
          id: "progress-16",
          title: "官网博客页面开发",
          description: "开发博客列表页和详情页模板",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "3小时前",
          tags: ["官网", "开发"],
          status: "in-progress",
          progress: 20,
          theme: "官网重构",
        },
        {
          id: "progress-17",
          title: "小丽绘本推荐笔记",
          description: "撰写0-3岁宝宝绘本推荐清单",
          assignee: "小丽",
          assigneeAvatar: "/teams/Audrey.webp",
          timestamp: "1小时前",
          tags: ["小红书", "育儿"],
          status: "in-progress",
          progress: 35,
          theme: "小红书运营",
        },
        {
          id: "progress-18",
          title: "星野内容策略文档",
          description: "编写Q3内容运营策略完整文档",
          assignee: "星野",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "4小时前",
          tags: ["内容", "策略"],
          status: "in-progress",
          progress: 55,
          theme: "内容创作",
        },

        // ========== 已分配任务 (12个) ==========
        {
          id: "assigned-1",
          title: "小丽下周内容脚本",
          description: "规划小丽账号下周3条笔记的内容脚本",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "5小时前",
          tags: ["小红书", "脚本"],
          status: "assigned",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "assigned-2",
          title: "官网产品详情页开发",
          description: "开发产品功能介绍页面和参数对比表",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "6小时前",
          tags: ["官网", "开发"],
          status: "assigned",
          progress: 0,
          theme: "官网重构",
        },
        {
          id: "assigned-3",
          title: "安然粉丝增长目标设定",
          description: "为安然账号设定Q3粉丝增长KPI",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "7小时前",
          tags: ["小红书", "KPI"],
          status: "assigned",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "assigned-4",
          title: "声拓数据分析报表",
          description: "整理各平台本周的阅读量、互动数据报表",
          assignee: "声拓",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "8小时前",
          tags: ["运营", "数据"],
          status: "assigned",
          progress: 0,
          theme: "内容创作",
        },
        {
          id: "assigned-5",
          title: "雨薇美食账号人设优化",
          description: "根据数据反馈，调整美食博主定位和内容方向",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "9小时前",
          tags: ["小红书", "优化"],
          status: "assigned",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "assigned-6",
          title: "官网联系表单开发",
          description: "开发在线咨询表单和留言功能",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "10小时前",
          tags: ["官网", "功能"],
          status: "assigned",
          progress: 0,
          theme: "官网重构",
        },
        {
          id: "assigned-7",
          title: "小暖情感语录文案撰写",
          description: "撰写10条情感语录，用于本周发布",
          assignee: "小暖",
          assigneeAvatar: "/teams/suxiaonuan.jpg",
          timestamp: "11小时前",
          tags: ["小红书", "文案"],
          status: "assigned",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "assigned-8",
          title: "墨韵第二篇文章选题",
          description: "确定公众号第二篇干货文章主题",
          assignee: "星野",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "12小时前",
          tags: ["写作", "选题"],
          status: "assigned",
          progress: 0,
          theme: "内容创作",
        },
        {
          id: "assigned-9",
          title: "股票交易执行",
          description: "根据Thea的分析报告，执行股票买入操作",
          assignee: "武承泽",
          assigneeAvatar: "/teams/jason.webp",
          timestamp: "13小时前",
          tags: ["投资", "交易"],
          status: "assigned",
          progress: 0,
          theme: "股票投资",
        },
        {
          id: "assigned-10",
          title: "官网博客模块开发",
          description: "开发官网博客列表和详情页模板",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "14小时前",
          tags: ["官网", "开发"],
          status: "assigned",
          progress: 0,
          theme: "官网重构",
        },
        {
          id: "assigned-11",
          title: "顾景行产品需求文档",
          description: "编写新功能模块的PRD文档",
          assignee: "顾景行",
          assigneeAvatar: "/teams/kevin.webp",
          timestamp: "15小时前",
          tags: ["产品", "文档"],
          status: "assigned",
          progress: 0,
          theme: "产品规划",
        },
        {
          id: "assigned-12",
          title: "声拓下月内容排期",
          description: "规划下个月各平台的内容发布日历",
          assignee: "声拓",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "16小时前",
          tags: ["运营", "排期"],
          status: "assigned",
          progress: 0,
          theme: "内容创作",
        },

        // ========== 计划中任务 (15个) ==========
        {
          id: "inbox-1",
          title: "小丽月度数据总结",
          description: "汇总小丽账号首月运营数据，输出优化建议",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "刚刚",
          tags: ["小红书", "复盘"],
          status: "inbox",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "inbox-2",
          title: "官网移动端适配",
          description: "确保官网在手机和平板上的正常显示",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "10分钟前",
          tags: ["官网", "适配"],
          status: "inbox",
          progress: 0,
          theme: "官网重构",
        },
        {
          id: "inbox-3",
          title: "安然职场系列第二期",
          description: "产品经理面试技巧系列内容第二期",
          assignee: "安然",
          assigneeAvatar: "/teams/hunter.webp",
          timestamp: "30分钟前",
          tags: ["小红书", "职场"],
          status: "inbox",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "inbox-4",
          title: "小暖救助故事持续更新",
          description: "记录并发布救助流浪动物的暖心故事",
          assignee: "小暖",
          assigneeAvatar: "/teams/suxiaonuan.jpg",
          timestamp: "1小时前",
          tags: ["小红书", "宠物"],
          status: "inbox",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "inbox-5",
          title: "雨薇探店新商家开拓",
          description: "联系3家新的人气餐厅谈合作",
          assignee: "雨薇",
          assigneeAvatar: "/teams/chenyuwei.jpg",
          timestamp: "2小时前",
          tags: ["小红书", "商务"],
          status: "inbox",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "inbox-6",
          title: "官网性能优化",
          description: "优化首屏加载速度，确保LCP<2.5s",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "3小时前",
          tags: ["官网", "性能"],
          status: "inbox",
          progress: 0,
          theme: "官网重构",
        },
        {
          id: "inbox-7",
          title: "墨韵公众号第三篇文章",
          description: "撰写第三篇职场成长主题文章",
          assignee: "墨韵",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "4小时前",
          tags: ["写作", "文章"],
          status: "inbox",
          progress: 0,
          theme: "内容创作",
        },
        {
          id: "inbox-8",
          title: "声拓短视频平台分发",
          description: "将长视频剪辑成短视频，分发到抖音/快手",
          assignee: "声拓",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "5小时前",
          tags: ["运营", "视频"],
          status: "inbox",
          progress: 0,
          theme: "内容创作",
        },
        {
          id: "inbox-9",
          title: "星野Q4内容规划",
          description: "制定第四季度内容产出计划和目标",
          assignee: "星野",
          assigneeAvatar: "/teams/josh.webp",
          timestamp: "6小时前",
          tags: ["内容", "规划"],
          status: "inbox",
          progress: 0,
          theme: "内容创作",
        },
        {
          id: "inbox-10",
          title: "Thea 股票收益评估",
          description: "评估本月股票投资收益，调整持仓",
          assignee: "Thea",
          assigneeAvatar: "/teams/no1.webp",
          timestamp: "7小时前",
          tags: ["投资", "评估"],
          status: "inbox",
          progress: 0,
          theme: "股票投资",
        },
        {
          id: "inbox-11",
          title: "剑锋团队周会",
          description: "主持每周团队例会，同步各项目进度",
          assignee: "剑锋",
          assigneeAvatar: "/teams/brian.webp",
          timestamp: "8小时前",
          tags: ["管理", "会议"],
          status: "inbox",
          progress: 0,
          theme: "运营管理",
        },
        {
          id: "inbox-12",
          title: "官网Analytics配置",
          description: "配置Google Analytics和事件追踪",
          assignee: "恒岳",
          assigneeAvatar: "/teams/harvey.webp",
          timestamp: "9小时前",
          tags: ["官网", "数据"],
          status: "inbox",
          progress: 0,
          theme: "官网重构",
        },
        {
          id: "inbox-13",
          title: "思远季度战略复盘",
          description: "Q2战略执行复盘，制定Q3调整方案",
          assignee: "思远",
          assigneeAvatar: "/teams/arthur.webp",
          timestamp: "10小时前",
          tags: ["战略", "复盘"],
          status: "inbox",
          progress: 0,
          theme: "战略规划",
        },
        {
          id: "inbox-14",
          title: "Rosie 博主进阶培训",
          description: "为4位博主设计第四期进阶课程",
          assignee: "Rosie",
          assigneeAvatar: "/teams/emma.webp",
          timestamp: "11小时前",
          tags: ["小红书", "培训"],
          status: "inbox",
          progress: 0,
          theme: "小红书运营",
        },
        {
          id: "inbox-15",
          title: "武承泽投资风险评估",
          description: "评估当前持仓风险，准备风险对冲方案",
          assignee: "武承泽",
          assigneeAvatar: "/teams/jason.webp",
          timestamp: "12小时前",
          tags: ["投资", "风险"],
          status: "inbox",
          progress: 0,
          theme: "股票投资",
        },
      ];

      // 更新待处理任务数
      this.tasksInQueue = this.tasks.filter(
        (t) => t.status === "inbox" || t.status === "assigned",
      ).length;
    } catch (error) {
      console.error("Failed to fetch mission data:", error);
    } finally {
      this.loading = false;
    }
  }

  // 模拟任务进度动态更新
  private simulateTaskProgress() {
    this.tasks = this.tasks.map((task) => {
      // 只对进行中的任务更新进度
      if (task.status === "in-progress" && task.progress !== undefined && task.progress < 100) {
        // 每次增加 5-10% 的进度
        const increment = Math.floor(Math.random() * 6) + 5;
        const newProgress = Math.min(task.progress + increment, 95);

        // 如果进度达到90%以上，移动到审核中
        if (newProgress >= 90) {
          return { ...task, progress: newProgress, status: "review" as Task["status"] };
        }

        return { ...task, progress: newProgress };
      }

      // 审核中的任务有30%概率完成
      if (task.status === "review" && Math.random() > 0.7) {
        return { ...task, status: "done" as Task["status"], progress: 100, timestamp: "刚刚" };
      }

      return task;
    });

    // 更新列计数
    this.updateColumnCounts();
  }

  private updateColumnCounts() {
    this.kanbanColumns.forEach((col) => {
      col.count = this.tasks.filter((t) => t.status === col.status).length;
    });
  }

  // ========== 事件处理 ==========

  private handleTaskClick(task: Task) {
    console.log("Task clicked:", task);
    // TODO: 打开任务详情
  }

  private handleAgentClick(agent: Agent) {
    console.log("Agent clicked:", agent);
    // TODO: 打开成员详情或筛选
  }

  // ========== 渲染辅助方法 ==========

  private formatTime(date: Date): string {
    return date.toLocaleTimeString("zh-CN", { hour12: false });
  }

  private formatDate(date: Date): string {
    const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const months = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];
    return `${days[date.getDay()]} ${months[date.getMonth()]}${date.getDate()}日`;
  }

  private getRoleTagColor(tag: Agent["roleTag"]): string {
    switch (tag) {
      case "LEAD":
        return "#f59e0b";
      case "INT":
        return "#3b82f6";
      case "SPC":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  }

  private getRoleTagName(tag: Agent["roleTag"]): string {
    switch (tag) {
      case "LEAD":
        return "负责人";
      case "INT":
        return "专员";
      case "SPC":
        return "专家";
      default:
        return "";
    }
  }

  private getThemeColor(theme: string | undefined): string {
    switch (theme) {
      case "小红书运营":
        return "#ff2442";
      case "官网重构":
        return "#3b82f6";
      case "内容创作":
        return "#8b5cf6";
      case "股票投资":
        return "#22c55e";
      case "战略规划":
        return "#f59e0b";
      case "运营管理":
        return "#06b6d4";
      case "产品规划":
        return "#ec4899";
      case "运营分析":
        return "#84cc16";
      default:
        return "#6b7280";
    }
  }

  private getTasksByStatus(status: Task["status"]): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  // ========== 渲染方法 ==========

  render() {
    if (this.loading) {
      return html`
        <div class="mission-control-loading">加载中...</div>
      `;
    }

    return html`
      <div class="mission-control">
        <!-- 顶部状态栏 -->
        <header class="mission-header">
          <div class="header-left">
            <button class="docs-button">文档</button>
          </div>
          <div class="header-center">
            <div class="time-display">${this.formatTime(this.currentTime)}</div>
            <div class="date-display">${this.formatDate(this.currentTime)}</div>
          </div>
          <div class="header-right">
            <div class="online-status">
              <span class="online-dot"></span>
              <span>在线</span>
            </div>
          </div>
        </header>

        <!-- 全局统计 -->
        <div class="mission-stats">
          <div class="stat-item">
            <span class="stat-number">${this.activeAgentsCount}</span>
            <span class="stat-label">活跃成员</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${this.tasksInQueue}</span>
            <span class="stat-label">待处理任务</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${this.tasks.filter((t) => t.status === "done").length}</span>
            <span class="stat-label">已完成</span>
          </div>
        </div>

        <!-- 两栏布局 -->
        <div class="mission-layout">
          <!-- 左侧：Agents 面板 -->
          <aside class="agents-panel">
            <div class="panel-header">
              <h2 class="panel-title">团队成员</h2>
              <span class="panel-count">${this.agents.length}</span>
            </div>
            <div class="agents-list">
              ${this.agents.map(
                (agent) => html`
                  <div
                    class="agent-card"
                    @click=${() => this.handleAgentClick(agent)}
                    role="button"
                    tabindex="0"
                    aria-label="查看成员 ${agent.name}"
                  >
                    <div class="agent-avatar">
                      ${
                        agent.avatar.startsWith("/")
                          ? html`<img src="${agent.avatar}" alt="${agent.name}" />`
                          : html`${agent.avatar}`
                      }
                    </div>
                    <div class="agent-info">
                      <div class="agent-name">${agent.name}</div>
                      <div class="agent-role">${agent.role}</div>
                    </div>
                    ${
                      agent.roleTag
                        ? html`
                          <span class="agent-role-tag ${agent.roleTag.toLowerCase()}"
                            >${this.getRoleTagName(agent.roleTag)}</span
                          >
                        `
                        : nothing
                    }
                    ${
                      agent.status === "working"
                        ? html`
                            <span class="agent-status working">工作中</span>
                          `
                        : html`
                            <span class="agent-status idle">空闲</span>
                          `
                    }
                  </div>
                `,
              )}
            </div>
          </aside>

          <!-- 右侧：Kanban 看板 -->
          <main class="kanban-board">
            ${this.kanbanColumns.map(
              (column) => html`
                <div class="kanban-column">
                  <div class="column-header">
                    <span class="column-icon">${column.icon}</span>
                    <span class="column-title">${column.title}</span>
                    <span class="column-count">${column.count}</span>
                  </div>
                  <div class="column-tasks">
                    ${this.getTasksByStatus(column.status).map(
                      (task) => html`
                        <div
                          class="task-card ${task.status}"
                          @click=${() => this.handleTaskClick(task)}
                          role="button"
                          tabindex="0"
                          aria-label="查看任务 ${task.title}"
                        >
                          ${
                            task.theme
                              ? html`
                                <div class="task-theme" style="background: ${this.getThemeColor(task.theme)}15; color: ${this.getThemeColor(task.theme)}">
                                  ${task.theme}
                                </div>
                              `
                              : nothing
                          }
                          <div class="task-header">
                            <div class="task-assignee">
                              <span class="assignee-avatar">
                                ${
                                  task.assigneeAvatar.startsWith("/")
                                    ? html`<img src="${task.assigneeAvatar}" alt="${task.assignee}" />`
                                    : html`${task.assigneeAvatar}`
                                }
                              </span>
                              <span class="assignee-name">${task.assignee}</span>
                            </div>
                            <span class="task-time">${task.timestamp}</span>
                          </div>
                          <h3 class="task-title">${task.title}</h3>
                          <p class="task-description">${task.description}</p>
                          ${
                            task.progress !== undefined &&
                            task.status !== "inbox" &&
                            task.status !== "assigned"
                              ? html`
                                <div class="task-progress-bar">
                                  <div class="task-progress-fill" style="width: ${task.progress}%"></div>
                                  <span class="task-progress-text">${task.progress}%</span>
                                </div>
                              `
                              : nothing
                          }
                          <div class="task-tags">
                            ${task.tags.map(
                              (tag) => html`
                                <span class="task-tag">${tag}</span>
                              `,
                            )}
                          </div>
                        </div>
                      `,
                    )}
                  </div>
                </div>
              `,
            )}
          </main>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-mission-control": MissionControlView;
  }
}
