/**
 * Skills 按职业分类映射表
 *
 * 用于将 OpenClaw Skills 按职业角度分类，方便左侧导航展示
 */
// 所有分类，适合中国用户
export const JOB_CATEGORIES = [
    { id: "marketing", name: "营销", emoji: "📢", description: "营销活动、内容生成、广告投放" },
    { id: "product", name: "产品", emoji: "🎯", description: "产品规划、需求管理、用户研究" },
    { id: "legal", name: "法律", emoji: "⚖️", description: "合同审阅、合规审核、法律风险评估" },
    { id: "finance", name: "财务", emoji: "💰", description: "财务报表、对账核销、预算分析" },
    { id: "service", name: "客服", emoji: "💬", description: "客户支持、售后处理" },
    { id: "brand", name: "品牌", emoji: "✨", description: "品牌形象、声誉管理" },
    { id: "data", name: "数据", emoji: "📊", description: "数据分析、报表生成" },
    { id: "efficiency", name: "效率工具", emoji: "📋", description: "办公自动化、文档处理" },
    { id: "dev", name: "开发", emoji: "💻", description: "代码开发、技术工具" },
    { id: "communication", name: "通讯", emoji: "📱", description: "即时通讯、消息发送" },
    { id: "media", name: "媒体", emoji: "🎬", description: "音视频处理、图像编辑" },
    { id: "tools", name: "工具", emoji: "🛠️", description: "实用工具、系统工具" },
    { id: "other", name: "其他", emoji: "📦", description: "其他技能" },
];
// 完整映射表（按类别分组）
export const SKILL_JOB_CATEGORY_MAPPINGS = [
    // ==================== 营销 (26) ====================
    {
        skillName: "content-strategy",
        category: "marketing",
        icon: "📝",
        displayName: "内容营销策略",
        description: "规划内容策略、选题方向和话题集群",
    },
    {
        skillName: "copywriting",
        category: "marketing",
        icon: "✍️",
        displayName: "文案写作",
        description: "撰写营销页面、落地页和产品介绍文案",
    },
    {
        skillName: "copy-editing",
        category: "marketing",
        icon: "📝",
        displayName: "文案编辑",
        description: "审核和优化现有营销文案",
    },
    {
        skillName: "social-content",
        category: "marketing",
        icon: "📱",
        displayName: "社交媒体内容",
        description: "创作LinkedIn、Twitter、Instagram等平台内容",
    },
    {
        skillName: "email-sequence",
        category: "marketing",
        icon: "📧",
        displayName: "邮件序列",
        description: "设计自动化邮件营销流程和触达序列",
    },
    {
        skillName: "instagram-marketing",
        category: "marketing",
        icon: "📸",
        displayName: "Instagram营销",
        description: "根据产品链接生成Instagram营销内容和标签策略",
    },
    {
        skillName: "product-marketing-context",
        category: "marketing",
        icon: "📋",
        displayName: "产品营销上下文",
        description: "创建产品定位和营销基础信息文档",
    },
    {
        skillName: "launch-strategy",
        category: "marketing",
        icon: "🚀",
        displayName: "发布策略",
        description: "规划产品发布、功能上线和市场推广策略",
    },
    {
        skillName: "pricing-strategy",
        category: "marketing",
        icon: "💰",
        displayName: "定价策略",
        description: "制定产品定价方案、套餐设计和付费模式",
    },
    {
        skillName: "competitor-alternatives",
        category: "marketing",
        icon: "🔄",
        displayName: "SEO落地页面",
        description: "创作竞品对比页和替代产品页，用于SEO和销售赋能",
    },
    {
        skillName: "referral-program",
        category: "marketing",
        icon: "👥",
        displayName: "推荐计划",
        description: "设计用户推荐、分销和口碑增长方案",
    },
    {
        skillName: "free-tool-strategy",
        category: "marketing",
        icon: "🎁",
        displayName: "免费工具策略",
        description: "规划免费工具获客和技术驱动营销方案",
    },
    {
        skillName: "programmatic-seo",
        category: "marketing",
        icon: "🔍",
        displayName: "程序化SEO",
        description: "批量生成模板化SEO页面，覆盖长尾关键词",
    },
    {
        skillName: "seo-audit",
        category: "marketing",
        icon: "📊",
        displayName: "SEO审计",
        description: "诊断网站SEO问题，优化技术和内容表现",
    },
    {
        skillName: "schema-markup",
        category: "marketing",
        icon: "🏷️",
        displayName: "结构化数据",
        description: "添加Schema.org标记，优化搜索结果展示",
    },
    {
        skillName: "analytics-tracking",
        category: "marketing",
        icon: "📈",
        displayName: "分析追踪",
        description: "配置GA4、GTM等数据追踪和转化埋点",
    },
    {
        skillName: "form-cro",
        category: "marketing",
        icon: "📝",
        displayName: "表单优化",
        description: "优化表单设计、字段和转化率",
    },
    {
        skillName: "page-cro",
        category: "marketing",
        icon: "📄",
        displayName: "落地页优化",
        description: "提升营销页面转化率和用户体验",
    },
    {
        skillName: "popup-cro",
        category: "marketing",
        icon: "🪟",
        displayName: "弹窗优化",
        description: "优化弹窗、模态框和横幅转化效果",
    },
    {
        skillName: "onboarding-cro",
        category: "marketing",
        icon: "🎯",
        displayName: "用户引导优化",
        description: "优化注册后激活流程和新用户体验",
    },
    {
        skillName: "signup-flow-cro",
        category: "marketing",
        icon: "✅",
        displayName: "注册流程优化",
        description: "减少注册摩擦，提升账号创建转化率",
    },
    {
        skillName: "paywall-upgrade-cro",
        category: "marketing",
        icon: "💎",
        displayName: "付费墙优化",
        description: "优化产品内升级提示和付费转化界面",
    },
    {
        skillName: "paid-ads",
        category: "marketing",
        icon: "💵",
        displayName: "付费广告",
        description: "管理Google、Meta、LinkedIn等付费广告投放",
    },
    {
        skillName: "marketing-ideas",
        category: "marketing",
        icon: "💡",
        displayName: "营销创意库",
        description: "提供139种验证有效的SaaS营销策略和灵感",
    },
    {
        skillName: "marketing-psychology",
        category: "marketing",
        icon: "🧠",
        displayName: "营销心理学",
        description: "应用70+心理学原理和行为科学优化营销",
    },
    {
        skillName: "ab-test-setup",
        category: "marketing",
        icon: "🧪",
        displayName: "A/B测试",
        description: "设计和规划A/B测试、多变量实验方案",
    },
    // ==================== 产品管理 (6) ====================
    {
        skillName: "feature-spec",
        category: "product",
        icon: "📝",
        displayName: "产品需求",
        description: "撰写PRD文档，定义问题陈述、用户故事和验收标准",
    },
    {
        skillName: "roadmap-management",
        category: "product",
        icon: "🗺️",
        displayName: "路线规划",
        description: "使用RICE/MoSCoW框架规划产品路线图和优先级",
    },
    {
        skillName: "user-research-synthesis",
        category: "product",
        icon: "🔬",
        displayName: "用研综合",
        description: "分析用户访谈、问卷和行为数据，提炼洞察和机会点",
    },
    {
        skillName: "competitive-analysis",
        category: "product",
        icon: "🔍",
        displayName: "竞品分析",
        description: "制作竞品对比矩阵、定位分析和战略建议",
    },
    {
        skillName: "metrics-tracking",
        category: "product",
        icon: "📊",
        displayName: "指标追踪",
        description: "设定OKR、搭建数据看板、执行周度指标复盘",
    },
    {
        skillName: "stakeholder-comms",
        category: "product",
        icon: "📣",
        displayName: "干系人沟通",
        description: "撰写项目周报、风险通报和决策文档，适配不同受众",
    },
    // ==================== 法务合同 (6) ====================
    {
        skillName: "compliance",
        category: "legal",
        icon: "⚖️",
        displayName: "合规审核",
        description: "审核GDPR、CCPA等隐私法规合规性，处理数据主体请求",
    },
    {
        skillName: "contract-review",
        category: "legal",
        icon: "📜",
        displayName: "合同审核",
        description: "根据企业谈判手册审核合同条款，生成修改建议",
    },
    {
        skillName: "legal-risk-assessment",
        category: "legal",
        icon: "⚠️",
        displayName: "法律风险评估",
        description: "评估合同和交易法律风险等级，确定升级标准",
    },
    {
        skillName: "nda-triage",
        category: "legal",
        icon: "🔒",
        displayName: "NDA分级审查",
        description: "快速筛选NDA，分类为标准/需审/风险三级",
    },
    {
        skillName: "canned-responses",
        category: "legal",
        icon: "📋",
        displayName: "法务模板回复",
        description: "为常见法律咨询生成标准化回复模板",
    },
    {
        skillName: "meeting-briefing",
        category: "legal",
        icon: "📑",
        displayName: "会议简报",
        description: "准备法务相关会议材料，追踪行动项",
    },
    // ==================== 财务会计 (6) ====================
    {
        skillName: "financial-statements",
        category: "finance",
        icon: "📊",
        displayName: "财务报表",
        description: "生成利润表、资产负债表和现金流量表，支持同比分析",
    },
    {
        skillName: "journal-entry-prep",
        category: "finance",
        icon: "📝",
        displayName: "凭证录入",
        description: "准备月末结账分录，包括应计、摊销、折旧等",
    },
    {
        skillName: "reconciliation",
        category: "finance",
        icon: "🔍",
        displayName: "账务核对",
        description: "核对总账与明细账、银行对账、公司间往来核销",
    },
    {
        skillName: "variance-analysis",
        category: "finance",
        icon: "📈",
        displayName: "差异分析",
        description: "分解财务差异驱动因素，生成瀑布图和解释说明",
    },
    {
        skillName: "close-management",
        category: "finance",
        icon: "📅",
        displayName: "结账管理",
        description: "管理月末结账流程、任务排期和进度追踪",
    },
    {
        skillName: "audit-support",
        category: "finance",
        icon: "🔒",
        displayName: "审计支持",
        description: "支持SOX 404合规控制测试、样本选取和工作底稿",
    },
    // ==================== 客服 (3) ====================
    {
        skillName: "imsg",
        category: "service",
        icon: "💬",
        displayName: "iMessage客服",
        description: "通过iMessage/SMS处理客户咨询和支持",
    },
    {
        skillName: "wacli",
        category: "service",
        icon: "📱",
        displayName: "WhatsApp客服",
        description: "通过WhatsApp处理客户消息和售后服务",
    },
    {
        skillName: "bluebubbles",
        category: "service",
        icon: "📱",
        displayName: "BlueBubbles",
        description: "通过BlueBubbles桥接iMessage消息",
    },
    // ==================== 品牌 (2) ====================
    {
        skillName: "social-content",
        category: "brand",
        icon: "📱",
        displayName: "社交媒体品牌",
        description: "管理品牌社交媒体形象和内容调性",
    },
    {
        skillName: "competitor-alternatives",
        category: "brand",
        icon: "🔄",
        displayName: "竞品分析",
        description: "分析竞品定位、差异化策略和市场对比",
    },
    // ==================== 数据 (5) ====================
    {
        skillName: "analytics-tracking",
        category: "data",
        icon: "📈",
        displayName: "数据分析",
        description: "设置和优化数据追踪方案，分析用户行为",
    },
    {
        skillName: "seo-audit",
        category: "data",
        icon: "📊",
        displayName: "SEO数据审计",
        description: "分析网站SEO数据表现和优化机会",
    },
    {
        skillName: "session-logs",
        category: "data",
        icon: "📜",
        displayName: "会话日志分析",
        description: "搜索和分析历史对话记录",
    },
    {
        skillName: "model-usage",
        category: "data",
        icon: "💸",
        displayName: "成本追踪",
        description: "按模型统计API调用成本和用量",
    },
    {
        skillName: "summarize",
        category: "data",
        icon: "🧾",
        displayName: "内容摘要",
        description: "从URL、播客和文件中提取和总结内容",
    },
    // ==================== 效率工具 (7) ====================
    {
        skillName: "apple-notes",
        category: "efficiency",
        icon: "📝",
        displayName: "Apple笔记",
        description: "通过CLI管理Apple Notes笔记",
    },
    {
        skillName: "notion",
        category: "efficiency",
        icon: "📔",
        displayName: "Notion",
        description: "通过API管理Notion页面和数据库",
    },
    {
        skillName: "apple-reminders",
        category: "efficiency",
        icon: "⏰",
        displayName: "提醒事项",
        description: "管理Apple Reminders待办事项",
    },
    {
        skillName: "trello",
        category: "efficiency",
        icon: "📋",
        displayName: "Trello看板",
        description: "通过API管理Trello看板、列表和卡片",
    },
    {
        skillName: "himalaya",
        category: "efficiency",
        icon: "📧",
        displayName: "邮件CLI",
        description: "通过命令行管理IMAP/SMTP邮件",
    },
    {
        skillName: "nano-pdf",
        category: "efficiency",
        icon: "📄",
        displayName: "PDF编辑",
        description: "使用自然语言指令编辑PDF文档",
    },
    {
        skillName: "slack",
        category: "efficiency",
        icon: "💬",
        displayName: "Slack",
        description: "在Slack频道发送消息、表情和固定消息",
    },
    // ==================== 开发 (13) ====================
    {
        skillName: "coding-agent",
        category: "dev",
        icon: "💻",
        displayName: "AI编程助手",
        description: "运行Codex、Claude Code等AI编程代理",
    },
    {
        skillName: "openai-whisper",
        category: "dev",
        icon: "🎙️",
        displayName: "Whisper本地",
        description: "本地运行Whisper语音转文字",
    },
    {
        skillName: "openai-whisper-api",
        category: "dev",
        icon: "☁️",
        displayName: "Whisper API",
        description: "调用OpenAI Whisper API转录音频",
    },
    {
        skillName: "openai-image-gen",
        category: "dev",
        icon: "🖼️",
        displayName: "OpenAI图像",
        description: "批量生成图像并创建HTML画廊",
    },
    {
        skillName: "nano-banana-pro",
        category: "dev",
        icon: "🍌",
        displayName: "Gemini图像",
        description: "通过Gemini 3 Pro生成或编辑图像",
    },
    {
        skillName: "oracle",
        category: "dev",
        icon: "🧿",
        displayName: "代码分析",
        description: "使用oracle CLI分析代码和文件",
    },
    {
        skillName: "mcporter",
        category: "dev",
        icon: "⚙️",
        displayName: "MCP工具",
        description: "配置和调用MCP服务器及工具",
    },
    {
        skillName: "tmux",
        category: "dev",
        icon: "🧵",
        displayName: "tmux",
        description: "远程控制tmux会话和交互式命令行",
    },
    {
        skillName: "skill-creator",
        category: "dev",
        icon: "🛠️",
        displayName: "技能创建",
        description: "创建或更新OpenClaw技能包",
    },
    {
        skillName: "peekaboo",
        category: "dev",
        icon: "🖱️",
        displayName: "UI自动化",
        description: "捕获和自动化macOS界面操作",
    },
    {
        skillName: "canvas",
        category: "dev",
        icon: "🎨",
        displayName: "Canvas",
        description: "Canvas画布和可视化开发",
    },
    {
        skillName: "remotion",
        category: "dev",
        icon: "🎬",
        displayName: "Remotion视频",
        description: "使用React创建程序化视频",
    },
    // ==================== 通讯 (6) ====================
    {
        skillName: "slack",
        category: "communication",
        icon: "💬",
        displayName: "Slack",
        description: "通过Slack发送消息和管理频道",
    },
    {
        skillName: "discord",
        category: "communication",
        icon: "🎮",
        displayName: "Discord",
        description: "通过Discord机器人发送消息",
    },
    {
        skillName: "imsg",
        category: "communication",
        icon: "💬",
        displayName: "iMessage",
        description: "发送和接收iMessage/SMS消息",
    },
    {
        skillName: "wacli",
        category: "communication",
        icon: "📱",
        displayName: "WhatsApp",
        description: "通过CLI发送WhatsApp消息",
    },
    {
        skillName: "bluebubbles",
        category: "communication",
        icon: "📱",
        displayName: "BlueBubbles",
        description: "通过BlueBubbles发送iMessage",
    },
    {
        skillName: "voice-call",
        category: "communication",
        icon: "📞",
        displayName: "语音通话",
        description: "发起OpenClaw语音通话",
    },
    // ==================== 媒体 (12) ====================
    {
        skillName: "sag",
        category: "media",
        icon: "🗣️",
        displayName: "文本转语音",
        description: "使用ElevenLabs生成高质量语音",
    },
    {
        skillName: "sherpa-onnx-tts",
        category: "media",
        icon: "🗣️",
        displayName: "离线TTS",
        description: "本地运行文本转语音，无需网络",
    },
    {
        skillName: "video-frames",
        category: "media",
        icon: "🎞️",
        displayName: "视频帧提取",
        description: "从视频中提取帧或片段",
    },
    {
        skillName: "camsnap",
        category: "media",
        icon: "📷",
        displayName: "摄像头截图",
        description: "从RTSP/ONVIF摄像头捕获画面",
    },
    {
        skillName: "gifgrep",
        category: "media",
        icon: "🔍",
        displayName: "GIF搜索",
        description: "搜索GIF资源库并下载结果",
    },
    {
        skillName: "openai-image-gen",
        category: "media",
        icon: "🖼️",
        displayName: "AI图像生成",
        description: "使用OpenAI API生成图像",
    },
    {
        skillName: "nano-banana-pro",
        category: "media",
        icon: "🍌",
        displayName: "Gemini图像",
        description: "使用Gemini生成或编辑图像",
    },
    {
        skillName: "remotion",
        category: "media",
        icon: "🎬",
        displayName: "Remotion",
        description: "使用React代码创建视频动画",
    },
    // ==================== 工具 (14) ====================
    {
        skillName: "weather",
        category: "tools",
        icon: "🌤️",
        displayName: "天气查询",
        description: "查询当前天气和预报，无需API密钥",
    },
    {
        skillName: "local-places",
        category: "tools",
        icon: "📍",
        displayName: "本地商家",
        description: "通过Google Places API搜索附近商家",
    },
    {
        skillName: "summarize",
        category: "tools",
        icon: "🧾",
        displayName: "内容摘要",
        description: "从URL、视频和文件中提取摘要",
    },
    {
        skillName: "openhue",
        category: "tools",
        icon: "💡",
        displayName: "Hue灯光",
        description: "控制Philips Hue智能灯光和场景",
    },
    {
        skillName: "sonoscli",
        category: "tools",
        icon: "🔊",
        displayName: "Sonos音箱",
        description: "控制Sonos音箱播放和音量",
    },
    {
        skillName: "blogwatcher",
        category: "tools",
        icon: "👀",
        displayName: "博客监控",
        description: "监控博客和RSS/Atom订阅更新",
    },
    {
        skillName: "ordercli",
        category: "tools",
        icon: "🍕",
        displayName: "外卖查询",
        description: "查询Foodora历史订单和配送状态",
    },
];
// 按技能名称查找分类
export function findSkillCategory(skillName) {
    return SKILL_JOB_CATEGORY_MAPPINGS.find((m) => m.skillName === skillName);
}
// 按职业分类筛选技能
export function filterSkillsByCategory(category) {
    return SKILL_JOB_CATEGORY_MAPPINGS.filter((m) => m.category === category);
}
// 获取职业类别信息
export function getCategoryInfo(category) {
    return JOB_CATEGORIES.find((c) => c.id === category);
}
// 根据职业类别筛选真实技能数据
export function filterRealSkillsByCategory(allSkills, category) {
    const categoryMappings = filterSkillsByCategory(category);
    const results = [];
    for (const skill of allSkills) {
        for (const cm of categoryMappings) {
            if (skill.skillKey === cm.skillName) {
                results.push({
                    skill,
                    mapping: {
                        skillKeyPattern: cm.skillName,
                        displayName: cm.displayName,
                        description: skill.description,
                        category: cm.category,
                        visual: {
                            variant: "secondary",
                            icon: cm.icon || "📦",
                            size: "medium",
                            featured: false,
                        },
                        interaction: {
                            type: "prompt",
                            prompt: `/${cm.skillName}`,
                        },
                        priority: 50,
                    },
                });
                break;
            }
        }
    }
    return results.toSorted((a, b) => b.mapping.priority - a.mapping.priority);
}
// 根据多个职业类别筛选技能（交集）
// 找出同时属于所有指定类别的技能
export function filterSkillsByMultipleCategories(allSkills, categories) {
    // 找出同时属于所有指定类别的技能名称
    const categorySkillNames = new Map();
    for (const cat of categories) {
        const mappings = filterSkillsByCategory(cat);
        for (const m of mappings) {
            if (!categorySkillNames.has(m.skillName)) {
                categorySkillNames.set(m.skillName, new Set());
            }
            categorySkillNames.get(m.skillName).add(cat);
        }
    }
    // 筛选出属于所有指定类别的技能
    const targetSkillNames = new Set(Array.from(categorySkillNames.entries())
        .filter(([_, cats]) => cats.size === categories.length)
        .map(([name]) => name));
    const results = [];
    for (const skill of allSkills) {
        if (targetSkillNames.has(skill.skillKey)) {
            const mapping = findSkillCategory(skill.skillKey);
            if (mapping) {
                results.push({
                    skill,
                    mapping: {
                        skillKeyPattern: mapping.skillName,
                        displayName: mapping.displayName,
                        description: skill.description,
                        category: categories[0], // 使用第一个类别作为主类别
                        visual: {
                            variant: "secondary",
                            icon: mapping.icon || "📦",
                            size: "medium",
                            featured: false,
                        },
                        interaction: {
                            type: "prompt",
                            prompt: `/${mapping.skillName}`,
                        },
                        priority: 50,
                    },
                });
            }
        }
    }
    return results.toSorted((a, b) => b.mapping.priority - a.mapping.priority);
}
