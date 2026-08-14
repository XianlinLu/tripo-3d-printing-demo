# TRIPO 3D Printing Landing Page — 设计思路说明

## 1. 设计目标

本页面以 **TRIPO 3D Printing SEO Landing Page** 为内容主体，以 TRIPO 的 3D 产品属性、品牌识别和商业增长目标为核心，构建沉浸式滚动叙事与实时 3D 交互体验。核心目标不是单纯“做酷炫动效”，而是把 3D Printing 的产品卖点、应用场景、模型能力与转化路径组织成一条由强视觉吸引 → 能力理解 → 场景证明 → 转化行动的完整体验链路。

设计遵循三个原则：

1. **首屏先建立记忆点**：用高质感黑色 WebGL 3D 模型、交互导引线和 HOLD TO BLAST 机制，快速形成品牌差异化。
2. **中段用滚动讲清能力**：通过 pinned scene、横向 case study、黑白主题切换等方式，把复杂的 3D Printing 信息拆成连续、可理解的故事。
3. **结尾完成 SEO 与转化闭环**：用 Formats、FAQ、最终 CTA 和 Footer 承接搜索流量，降低用户对“能不能打印 / 支持什么格式 / 是否需要专业技能”的疑虑。

---

## 2. 信息架构

### 01 / Hero — 核心价值 + 首次转化
**主要信息**
- Get Production-Ready 3D Print Files from Inspiration
- Image to 3D / Text to 3D / Print-ready
- Create Models for 3D Printing / See Print Examples

**作用**
第一屏不堆叠大量产品解释，而是先回答用户最重要的问题：**“我能不能快速得到可直接用于 3D 打印的模型？”**。同时将产品定位与交互体验绑定，让用户在第一次操作中直接感知“模型生成 / 拆解 / 重组”的概念。

### 02 / Statement — 从概念转向产品能力
**主要信息**
- Turn Vision Into Final Prints
- create print-ready 3D models effortlessly

**作用**
承接 Hero 的情绪价值，开始进入理性表达。通过大字号 editorial typography 和长滚动 pin，让用户在视觉节奏中完成从“被吸引”到“理解 TRIPO 是什么”的过渡。

### 03 / Key Facts — 快速建立认知锚点
**主要信息**
- 1 minute
- Image + Text
- Print-ready

**作用**
用极短信息降低认知成本，把生成速度、输入方式和最终输出结果三个最关键卖点压缩成可快速扫读的指标。

### 04 / Case Studies — 用真实应用场景证明能力
**主要场景**
- Personalized Jewelry
- Art Sculpture
- Tabletop Miniatures

**作用**
把抽象的“AI 3D Modeling”转化为用户能立即联想到的具体使用场景。横向滚动让每个案例获得独立视觉焦点，同时避免传统竖向卡片列表的信息疲劳。

### 05 / Core Benefits — 解释为什么更适合 3D Printing
**核心能力**
- Turn image and/or text to 3D model instantly
- Significant Boost in 3D Printing Success Rate
- Clear and Clean 3D Topology, Less Error, Less Repairs
- Lifelike 3D Models with High-Fidelity and Natural Look

**作用**
这是页面的“产品说服核心”。通过深色长滚动 3D 场景，把四个能力拆成连续章节，分别回应：生成门槛、打印失败、拓扑修复、细节质量四类主要痛点。

### 06 / Formats — 消除落地疑虑
**作用**
用清晰矩阵表达可导出/可进入后续生产流程的格式支持，承担 SEO 页面中的“技术规格确认”角色。

### 07 / Discovery Helix — 内容与场景导航
**作用**
以 3D 螺旋卡片承载更多主题入口，在保持视觉一致性的同时给 SEO 深层内容留下入口；滚动后展开为 3×3 Grid，完成从“沉浸浏览”到“可操作信息列表”的切换。

### 08 / FAQ — 搜索意图收口
**作用**
覆盖用户在 3D Printing 场景中最常见的问题：是否 print-ready、是否支持图片/文本输入、是否需要专业建模技能、格式与后处理等。FAQ 同时兼顾 SEO 长尾词与转化前疑虑消除。

### 09 / Final CTA + Footer — 完成转化
**作用**
在用户已经看完能力、案例和技术说明之后再次出现明确 CTA，避免首屏 CTA 过早转化的问题；Footer 保留 TRIPO 产品、Program、Company、Resources 信息，形成完整商业站结构。

---

## 3. 交互设计要点

### A. Hero：Pointer + Hold + Scroll 三种输入同时存在
Hero 是全站最核心的交互场景，采用三层输入模型：

- **Pointer Hover**：Three.js Raycaster 实时检测鼠标命中的独立 3D Mesh，而不是普通 DOM hover。被命中的 panel 会增强高光、反射与材质响应，形成 magnetic feeling。
- **Touch the Lines**：鼠标靠近三条导引线约 14px 范围时，触发黄色电弧 / weld spark，并随机连接至另外 1–2 条 guide line，强化“系统被激活”的感觉。
- **Hold to Blast**：用户在 3D 模型上按住约 500ms，进入 charge；标题和导航产生 1–3px 轻微 vibration，随后 panel 沿各自预设 explode direction / spin axis 爆开。松开鼠标后模型平滑重新组装。
- **Scroll Contribution**：Hero 下滑时沿用同一组 explosion state，使模型不是“突然消失”，而是自然过渡进入下一章节。

Hero 底部固定保留两行操作提示：

**HOLD TO BLAST**  
**DARE ⚡ TO TOUCH THE LINES**

这样既给第一次进入的用户明确操作暗示，又不会使用传统“拖动 / 点击这里”的 UI 教学破坏视觉沉浸感。

### B. Smooth Scroll
页面使用 Lenis 统一滚动惯性，并将滚动状态同步到动画系统。目的是让 pinned section、横向滚动和 3D 场景之间保持统一速度感，避免浏览器默认滚动造成“动效模块之间像拼接”的割裂感。

### C. Scroll-driven Storytelling
页面中大量段落采用 **高 scroll range + sticky 100vh**，让“页面滚动”本身成为时间轴：
- Statement：文字、规则线和大词依次进入。
- Case Studies：纵向滚轮映射为横向案例移动。
- Benefits：一个 3D 场景连续承载四个能力章节，而不是反复进入/退出多个独立模块。
- Helix：滚动驱动卡片深度、旋转和 Z 轴位置，最后展开到二维 Grid。

### D. Audio Interaction
右上角 SOUND 控件采用显式用户触发，符合浏览器 autoplay 限制：
- 第一次点击后播放用户提供的 MP3；再次点击暂停，再次点击从暂停位置继续。
- 音乐循环播放。
- Hero 的 hover / weld / blast 可以叠加 Web Audio 短音效，使声音反馈与视觉交互同步。

### E. Hover & Micro-interaction
- Format 卡片：hover 黑白反转，快速表达“可交互”。
- Helix 卡片：hover 提升阴影/深度，不改变主体布局，避免破坏 3D 空间关系。
- Header Dropdown：Resources 使用轻量 hover/click dropdown，不与 Hero 主交互争抢注意力。

---

## 4. 视觉体系

### 色彩
- **Primary Background**：#000 / 极深黑灰
- **Primary Accent**：TRIPO Yellow
- **Supporting Accent**：电弧黄色、少量暖橙光、冷灰金属高光
- **Light Sections**：纯白 / 浅灰，用于 Key Facts、Formats 等理性信息模块

黑白切换不是装饰，而是信息层级工具：深色用于情绪、3D、交互；浅色用于事实、参数、规格，从而在长页面中建立节奏。

### Typography
采用大字号、紧字距、高对比 editorial typography，与小型 uppercase label、1px rule 形成尺度反差。大标题负责视觉记忆，小标签负责系统化信息定位。

### 3D Visual
Hero 不使用“产品 UI 截图放进卡片”的常规 SaaS 首屏，而是直接让 3D 物体成为页面主体。黑色高金属度材质、低 roughness、高 clearcoat 与小范围暖色 emissive 共同形成高级 CG / industrial design 气质，更贴近 TRIPO 的 3D 产品属性。

---

## 5. 转化路径

页面刻意设置两类 CTA：

1. **Immediate CTA（Hero）**：针对目标明确、已经知道自己需要 3D 模型的用户，直接进入 Create Models for 3D Printing。
2. **Educated CTA（Footer）**：针对需要先理解模型质量、案例与打印能力的用户，在完整浏览后再次转化。

Case Study、Benefits、Formats、FAQ 都不是独立内容模块，而是在逐层消除“是否适合我的场景 / 是否能打印成功 / 是否需要专业能力 / 是否能进入我的生产流程”的阻力。

---

## 6. 落地与开发考虑

- 3D Hero：Three.js + Raycaster + requestAnimationFrame。
- 长按爆炸：共享 `explode` 状态统一驱动所有 mesh，确保按住、松开和 scroll transition 使用同一套模型状态。
- Smooth Scroll：Lenis。
- Scroll Animation：GSAP / requestAnimationFrame + section progress。
- Audio：HTMLAudioElement 播放主音乐；Web Audio API 合成交互短音效。
- Desktop QA 基准：1440px。
- 3D 场景应限制 devicePixelRatio，并根据页面是否可见暂停不必要的高频计算，兼顾性能。
- prefers-reduced-motion 场景下应降低爆炸距离、关闭高频 shake / particle，保留信息结构与基本转化能力。

---

## 7. 总结

这套设计以 **沉浸式 3D 场景、scroll choreography 与实时交互反馈** 作为体验骨架，以 **TRIPO 3D Printing 的产品信息与转化目标** 作为商业内容。最终目标不是把动效和内容简单拼接，而是让“3D 模型可生成、可拆解、可重组、可最终打印”这一产品逻辑直接被用户通过页面操作感知，从而让 SEO 页面同时具备视觉记忆、产品解释和商业转化能力。
