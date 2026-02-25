import type { IconName } from "./icons.js";

// Tab 分组定义 - 用于导航区域的分组显示
export const TAB_GROUPS = [
  {
    label: "",
    tabs: ["home", "chat"],
  },
  {
    label: "",
    tabs: ["statistics"],
  },
  {
    label: "",
    tabs: ["docs"],
  },
  {
    label: "AI助理",
    tabs: [
      "marketing",
      "product-management",
      "legal",
      "finance",
      "data-processing",
      "market-analysis",
      "customer-service",
      "brand-management",
      "sentiment-monitor",
    ],
    subtabs: true,
  },
  {
    label: "配置",
    tabs: ["config", "channels", "nodes", "instances", "sessions", "skills", "logs"],
    subtabs: true,
    collapsed: true,
  },
  {
    label: "应用",
    tabs: ["wordstudy"],
    subtabs: false,
    collapsed: false,
  },
] as const;

export type Tab =
  // 主导航
  | "chat"
  | "home"
  | "statistics"
  | "docs"
  | "ai-assistant"
  // AI助手子页面
  | "marketing"
  | "product-management"
  | "legal"
  | "finance"
  | "data-processing"
  | "market-analysis"
  | "customer-service"
  | "brand-management"
  | "sentiment-monitor"
  // 保留现有功能
  | "channels"
  | "nodes"
  | "instances"
  | "sessions"
  | "skills"
  | "config"
  | "logs"
  // 应用
  | "wordstudy";

const TAB_PATHS: Record<Tab, string> = {
  // 主导航
  chat: "/chat",
  home: "/home",
  statistics: "/statistics",
  docs: "/docs",
  "ai-assistant": "/ai-assistant",
  // AI助手子页面
  marketing: "/marketing",
  "product-management": "/product-management",
  legal: "/legal",
  finance: "/finance",
  "data-processing": "/data-processing",
  "market-analysis": "/market-analysis",
  "customer-service": "/customer-service",
  "brand-management": "/brand-management",
  "sentiment-monitor": "/sentiment-monitor",
  // 保留现有功能
  channels: "/channels",
  nodes: "/nodes",
  instances: "/instances",
  sessions: "/sessions",
  skills: "/skills",
  config: "/config",
  logs: "/logs",
  // 应用
  wordstudy: "https://edu.52tuan.com/wordstudy/",
};

const PATH_TO_TAB = new Map(Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab as Tab]));

export function normalizeBasePath(basePath: string): string {
  if (!basePath) {
    return "";
  }
  let base = basePath.trim();
  if (!base.startsWith("/")) {
    base = `/${base}`;
  }
  if (base === "/") {
    return "";
  }
  if (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  return base;
}

export function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  let normalized = path.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function pathForTab(tab: Tab, basePath = ""): string {
  const base = normalizeBasePath(basePath);
  const path = TAB_PATHS[tab];
  // 如果是外部 URL，直接返回，不拼接 basePath
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return base ? `${base}${path}` : path;
}

export function tabFromPath(pathname: string, basePath = ""): Tab | null {
  const base = normalizeBasePath(basePath);
  let path = pathname || "/";
  if (base) {
    if (path === base) {
      path = "/";
    } else if (path.startsWith(`${base}/`)) {
      path = path.slice(base.length);
    }
  }
  let normalized = normalizePath(path).toLowerCase();
  if (normalized.endsWith("/index.html")) {
    normalized = "/";
  }
  if (normalized === "/") {
    return "chat";
  }
  return PATH_TO_TAB.get(normalized) ?? null;
}

export function inferBasePathFromPathname(pathname: string): string {
  let normalized = normalizePath(pathname);
  if (normalized.endsWith("/index.html")) {
    normalized = normalizePath(normalized.slice(0, -"/index.html".length));
  }
  if (normalized === "/") {
    return "";
  }
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }
  for (let i = 0; i < segments.length; i++) {
    const candidate = `/${segments.slice(i).join("/")}`.toLowerCase();
    if (PATH_TO_TAB.has(candidate)) {
      const prefix = segments.slice(0, i);
      return prefix.length ? `/${prefix.join("/")}` : "";
    }
  }
  return `/${segments.join("/")}`;
}

export function iconForTab(tab: Tab): IconName {
  switch (tab) {
    // 主导航
    case "chat":
      return "messageCircle";
    case "home":
      return "home";
    case "statistics":
      return "barChart";
    case "docs":
      return "book";
    case "ai-assistant":
      return "bot";
    // AI助手子页面
    case "marketing":
      return "megaphone";
    case "product-management":
      return "puzzle";
    case "legal":
      return "scale";
    case "finance":
      return "coins";
    case "data-processing":
      return "database";
    case "market-analysis":
      return "trendingUp";
    case "customer-service":
      return "headphones";
    case "brand-management":
      return "palette";
    case "sentiment-monitor":
      return "eye";
    // 保留现有功能
    case "channels":
      return "link";
    case "nodes":
      return "monitor";
    case "instances":
      return "radio";
    case "sessions":
      return "fileText";
    case "skills":
      return "zap";
    case "config":
      return "settings";
    case "logs":
      return "scrollText";
    // 应用
    case "wordstudy":
      return "bookOpen";
    default:
      return "folder";
  }
}

export function titleForTab(tab: Tab) {
  switch (tab) {
    // 主导航
    case "chat":
      return "涌现工作台";
    case "home":
      return "首页";
    case "statistics":
      return "统计";
    case "docs":
      return "文档";
    case "ai-assistant":
      return "AI助理";
    // AI助手子页面
    case "marketing":
      return "广告营销";
    case "product-management":
      return "产品管理";
    case "legal":
      return "法务合同";
    case "finance":
      return "财务会计";
    case "data-processing":
      return "数据处理";
    case "market-analysis":
      return "市场分析";
    case "customer-service":
      return "客户服务";
    case "brand-management":
      return "品牌管理";
    case "sentiment-monitor":
      return "舆情监控";
    // 保留现有功能
    case "channels":
      return "频道";
    case "nodes":
      return "节点管理";
    case "instances":
      return "实例";
    case "sessions":
      return "会话";
    case "skills":
      return "技能";
    case "config":
      return "配置";
    case "logs":
      return "日志";
    // 应用
    case "wordstudy":
      return "识字学习";
    default:
      return "控制";
  }
}

export function subtitleForTab(tab: Tab) {
  switch (tab) {
    // 主导航
    case "chat":
      return "与 AI 协作，释放涌现智能";
    case "home":
      return "欢迎回来，这里是您的工作空间";
    case "statistics":
      return "消息统计和工具调用分析";
    case "docs":
      return "查看完整的使用文档和 API 参考";
    case "ai-assistant":
      return "选择专业的 AI 助手来帮助您";
    // AI助手子页面
    case "marketing":
      return "营销活动策划、内容生成和效果分析";
    case "product-management":
      return "产品规划、需求管理和用户研究";
    case "legal":
      return "合同审核、合规审查和法律风险评估";
    case "finance":
      return "财务报表、对账核销和预算分析";
    case "data-processing":
      return "数据处理、清洗和转换工具";
    case "market-analysis":
      return "市场趋势分析和竞争情报";
    case "customer-service":
      return "客户支持和问题解决方案";
    case "brand-management":
      return "品牌策略和形象管理";
    case "sentiment-monitor":
      return "舆情监测和声誉管理";
    // 保留现有功能
    case "channels":
      return "管理频道和相关设置";
    case "nodes":
      return "设备配对、执行权限和节点绑定管理";
    case "instances":
      return "已连接客户端和节点的状态信标";
    case "sessions":
      return "检查活动会话并调整会话默认值";
    case "skills":
      return "管理技能可用性和 API 密钥注入";
    case "config":
      return "安全编辑 ~/.openclaw/openclaw.json";
    case "logs":
      return "实时查看网关文件日志";
    // 应用
    case "wordstudy":
      return "帮助读写障碍儿童学习汉字的工具";
    default:
      return "";
  }
}
