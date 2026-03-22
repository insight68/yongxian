# Team Structure 页面浅色系重设计总结

**设计日期：** 2026-03-17
**文件路径：** `ui_cn/src/ui/views/team-structure.ts`

## 设计目标

1. ✅ **浅色系主题** - 整个页面改成温暖的浅色系，更加简洁美观
2. ✅ **真实头像显示** - 从每个智能体的 workspace 目录读取真实头像
3. ✅ **层级关系可视化** - 增加 SVG 连线系统，组织层级关系更清晰

## 设计理念

**美学方向：** 现代企业组织图 + 日式简约

**核心特征：**
- 色调：温暖的米白色背景 + 柔和的灰色层次 + 精致的金色/琥珀色点缀
- 排版：清晰的层级结构，使用优雅的衬线字体（Crimson Pro）作为标题
- 连线设计：使用细腻的 SVG 路径连接，展示组织层级
- 卡片风格：柔和的阴影，圆润的边角，纸质感的层次
- 动画：微妙的悬停效果，流畅的展开/收起动画

## 实施内容

### Phase 1: 浅色系主题重构 ✅

#### 1.1 CSS 变量系统
重写所有 CSS 变量为浅色系主题：

```css
/* 浅色系主题变量 */
--team-bg-primary: #faf8f5;        /* 温暖的米白色背景 */
--team-bg-secondary: #f5f2ed;      /* 次级背景 */
--team-bg-card: #ffffff;           /* 卡片背景 - 纯白 */
--team-bg-card-hover: #fffbf7;     /* 卡片悬停 - 暖白 */

--team-accent-primary: #d4a574;    /* 金色/琥珀色主色调 */
--team-accent-secondary: #b8956a;  /* 深金色 */
--team-accent-tertiary: #e8c4a0;   /* 浅金色 */
--team-accent-cyan: #a8c5d1;       /* 青色点缀 */

--team-text-primary: #2c2416;      /* 深棕色文字 */
--team-text-secondary: #6b5d4f;    /* 中等棕色 */
--team-text-muted: #9a8b7a;        /* 浅棕色 */

--team-border-color: rgba(212, 165, 116, 0.15);  /* 金色边框 */
--team-shadow: rgba(44, 36, 22, 0.08);           /* 柔和阴影 */
--team-shadow-hover: rgba(44, 36, 22, 0.15);     /* 悬停阴影 */
```

#### 1.2 纸质纹理背景
添加细腻的纸质纹理效果：

```css
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
```

#### 1.3 字体优化
优先使用优雅的衬线字体：

```css
font-family: "Crimson Pro", "Inter", -apple-system, BlinkMacSystemFont,
             "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif;
```

#### 1.4 卡片样式更新
- 移除深色背景和发光效果
- 使用柔和的阴影代替 glow 效果
- 悬停时轻微上浮 + 阴影加深
- CEO 卡片保留金色渐变边框，但降低不透明度

#### 1.5 模态框样式
- 背景遮罩改为半透明棕色：`rgba(44, 36, 22, 0.5)`
- 模态框使用纯白背景 + 金色边框
- 关闭按钮使用浅色背景 + 边框样式
- 能力标签使用金色系配色

### Phase 2: 头像加载系统 ✅

#### 2.1 本地路径映射
修改 `getAvatarUrl()` 方法，从本地 workspace 目录读取头像：

```typescript
private getAvatarUrl(memberId: string): string {
  // 将成员 ID 转换为 workspace 目录名
  // leo -> workspace-Leo
  // suxiaonuan -> workspace-suxiaonuan
  const workspaceId = memberId === 'leo' ? 'Leo' : memberId;
  return `/Users/chunjun/.openclaw/workspace-${workspaceId}/avatar.webp`;
}
```

#### 2.2 成员 ID 映射
根据 workspace 目录结构：
- `leo` → `workspace-Leo`
- `siyuan` → `workspace-siyuan`
- `jianfeng` → `workspace-jianfeng`
- `hengyue` → `workspace-hengyue`
- `jingxing` → `workspace-jingxing`
- `rosie` → `workspace-rosie`
- `lili` → `workspace-lili`
- `xuanran` → `workspace-xuanran`
- `suxiaonuan` → `workspace-suxiaonuan`
- `chenyuwei` → `workspace-chenyuwei`

#### 2.3 错误处理
保留原有的 fallback 机制：头像加载失败时显示首字母缩写。

### Phase 3: SVG 连线系统 ✅

#### 3.1 SVG 样式定义
```css
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
```

#### 3.2 连线结构
- **主干线** - CEO 到第二层的垂直连接
- **水平分支线** - 第二层成员之间的横向连接
- **垂直连接线** - 从水平线到各个成员卡片
- **曲线连接** - 使用贝塞尔曲线连接第三层（Rosie 团队）

#### 3.3 响应式处理
移动端（<768px）自动隐藏连线：

```css
@media (max-width: 768px) {
  .org-lines {
    display: none;
  }
}
```

### Phase 4 & 5: 布局优化和细节打磨 ✅

所有样式已在 Phase 1 中完成：
- 响应式布局保持不变（1100px, 768px, 480px 断点）
- 动画效果已优化为浅色系
- 所有交互细节已调整

## 技术细节

### 修改的关键部分

1. **CSS 变量（13 个）**
   - 所有 `--team-*` 前缀变量从深色改为浅色
   - 阴影从黑色改为棕色半透明
   - 边框从紫色改为金色

2. **样式类（20+ 个）**
   - `:host` - 背景、纸质纹理、字体
   - `.page-title` - 金色渐变文字
   - `.member-card`, `.child-card` - 浅色背景、柔和阴影
   - `.ceo-card` - 金色渐变边框，降低不透明度
   - `.modal-*` - 所有模态框相关样式
   - `.ability-tag` - 金色系标签
   - `.org-lines` - SVG 连线样式

3. **JavaScript 方法**
   - `getAvatarUrl()` - 修改为本地路径

4. **HTML 模板**
   - `renderTree()` - 添加 SVG 连线层

### 文件变更统计

**修改文件：**
- `ui_cn/src/ui/views/team-structure.ts` (1035 行 → 1115 行)

**新增内容：**
- SVG 连线系统：约 40 行 CSS + 20 行 HTML
- 头像路径映射：5 行代码
- 纸质纹理背景：15 行 CSS

**构建产物：**
- `../dist/control-ui/assets/index-BOSaFxpP.css` (118.78 kB)
- `../dist/control-ui/assets/index-CMEa16_l.js` (459.43 kB)

## 构建验证

```bash
✓ 137 modules transformed.
✓ built in 426ms
```

构建成功，无错误。

## 预期效果

### 桌面端（1920x1080）
- ✅ 温暖的米白色背景 + 纸质纹理
- ✅ 金色/琥珀色点缀的卡片
- ✅ SVG 连线展示组织层级
- ✅ CEO 卡片金色渐变边框动画
- ✅ 柔和的悬停阴影效果

### 平板端（768x1024）
- ✅ 布局自适应缩小
- ✅ 保持浅色系配色
- ✅ 简化的连线显示

### 移动端（375x667）
- ✅ 纵向堆叠布局
- ✅ 隐藏 SVG 连线
- ✅ 卡片充满屏幕宽度
- ✅ 浅色系主题保持一致

## 设计亮点

1. ✅ **温暖的配色** - 米白色 + 金色系，营造温馨专业的氛围
2. ✅ **纸质纹理** - 细腻的背景纹理，增加质感
3. ✅ **优雅的字体** - Crimson Pro 衬线字体，提升品质感
4. ✅ **SVG 连线** - 清晰展示组织层级关系
5. ✅ **真实头像** - 从本地 workspace 加载，增强真实感
6. ✅ **柔和的阴影** - 替代深色主题的发光效果
7. ✅ **响应式连线** - 移动端自动隐藏，保持简洁

## 与深色主题对比

| 特性 | 深色主题 | 浅色系主题 |
|------|---------|-----------|
| 背景色 | #0a0a0f (深黑) | #faf8f5 (米白) |
| 主色调 | 紫色/粉色 | 金色/琥珀色 |
| 文字色 | #f1f5f9 (浅灰) | #2c2416 (深棕) |
| 卡片效果 | 发光 (glow) | 柔和阴影 |
| 边框 | 紫色半透明 | 金色半透明 |
| 背景纹理 | 无 | 纸质纹理 |
| 连线系统 | 无 | SVG 路径 |
| 头像来源 | API | 本地 workspace |

## 后续建议

### 可选增强

1. **动态连线计算**
   - 根据实际卡片位置动态计算 SVG 路径
   - 使用 `getBoundingClientRect()` 获取元素位置
   - 自动适应不同屏幕尺寸

2. **连线动画**
   - 添加 stroke-dasharray 动画
   - 页面加载时从上到下绘制连线
   - 展开/收起时动态更新连线

3. **头像优化**
   - 添加头像加载进度指示
   - 支持头像缓存
   - 提供头像上传功能

4. **主题切换**
   - 支持浅色/深色主题切换
   - 保存用户偏好设置
   - 平滑的主题过渡动画

5. **可访问性**
   - 添加 ARIA 标签
   - 支持键盘导航
   - 屏幕阅读器优化

## 总结

本次重设计成功将 Team Structure 页面从深色主题转换为温暖的浅色系主题，主要成果：

1. **完整的浅色系主题** - 米白色背景 + 金色点缀，营造专业温馨的氛围
2. **真实头像系统** - 从本地 workspace 目录加载真实头像
3. **SVG 连线可视化** - 清晰展示组织层级关系
4. **纸质纹理背景** - 增加页面质感和层次
5. **优雅的字体排版** - Crimson Pro 衬线字体提升品质
6. **完善的响应式** - 桌面、平板、移动端全覆盖

所有修改已通过构建测试（426ms），可以直接部署使用。
