# Luxehome 项目进度

## 当前状态
- **版本**: v1.0.0 (已发布)
- **线上地址**: https://claude-luxehome.netlify.app/nz
- **GitHub**: https://github.com/derek33808/claude-luxehome
- **路线图文档**: ROADMAP.md

---

## v1.0.0 功能清单

| 功能 | 状态 | 说明 |
|------|------|------|
| 多区域电商 (AU/NZ/US) | ✅ 完成 | 支持三个区域，自动货币切换 |
| 产品目录与分类 | ✅ 完成 | 产品展示、分类浏览 |
| 购物车 | ✅ 完成 | 本地存储持久化 |
| Stripe 支付 | ✅ 完成 | 测试模式可用 |
| 订单持久化 | ✅ 完成 | Supabase 数据库 |
| 订单确认邮件 | ✅ 完成 | Resend 发送 |
| 发货通知邮件 | ✅ 完成 | 管理后台触发 |
| 退款通知邮件 | ✅ 完成 | 自定义 HTML 邮件 |
| 管理后台 | ✅ 完成 | 订单列表、详情、状态更新、退款 |
| 库存管理 | ⏳ Schema Ready | 数据库和 API 已就绪，缺少管理界面 |
| 物流追踪 | ⏳ 部分完成 | 可录入物流单号，缺少客户自助查询页面 |

---

## 执行日志（按时间倒序）

### 2026-01-29 - 1688 选品整合方案设计 📋

**任务**: 设计 Luxehome 与 1688 选品平台整合方案，实现从选品到上架的半自动化流程
**状态**: ✅ 设计完成，待开发

**需求背景**:
- 用户希望将 Luxehome 与选品平台整合
- 选品来源：1688（中国批发平台）
- 产品标准：小巧轻便、≤500 RMB、运费便宜
- 目标市场：新西兰、澳洲
- 需要 AI 自动生成英文产品页面，处理中文图片

**已确认决策**:

| 决策项 | 用户选择 |
|--------|----------|
| 数据获取 | 半自动（Chrome 浏览器插件） |
| 图片处理 | AI 去除中文 + 只选无文字图片 |
| 部署方式 | 手动 git push |
| 批量抓取 | 单个抓取即可 |
| 价格倍率 | 3-4 倍（成本 ¥100 → 售价 $65-90 AUD） |
| 供应商信息 | 需要保留（后台记录，前台不显示） |

**整体流程**:
```
1688 浏览产品 → 插件一键抓取 → Claude Code AI处理 → 人工审核 → 手动部署上线
```

**开发任务**:
1. **浏览器插件**（1-2天）- 1688 产品页数据抓取
2. **上架工作流**（1天）- AI 内容生成 + 图片处理 + 数据转换

**未来扩展**:
- 自动 1688 下单功能（收到订单后自动采购）

**新增文件**:
- `INTEGRATION_DESIGN.md` - 完整设计文档

**完整功能路线图**:

| Phase | 功能 | 优先级 |
|-------|------|--------|
| 1 | Chrome 浏览器插件 | 🟠 P1 |
| 2 | 上架工作流（AI生成+记录供应商） | 🟠 P1 |
| 3 | 选品平台改进 | 🟡 P2 |
| 4 | 订单采购视图（后台显示采购链接） | 🟠 P1 |
| 5 | AI 自动上架 | 🟢 P3 |
| 6 | 自动 1688 下单 | 🟢 P3 |

**相关文档**:
- `INTEGRATION_DESIGN.md` - 完整技术设计
- `TODO.md` - 待办事项列表
- `docs/2026-01-29-integration-meeting.md` - 交互记录

---

### 2026-01-26 16:00 - v1.0.0 正式发布 🎉

**任务**: QA 检查并发布 v1.0 版本
**状态**: ✅ 完成

**发布内容**:
- 修复硬编码邮箱安全问题（3 个文件）
- 通过 QA 检查（评分 8.5/10）
- 创建 Git tag: v1.0.0

**待后续版本完善**:
- 库存管理界面
- 客户物流追踪页面
- Stripe 生产模式切换

---

### 2026-01-26 15:30 - 退款邮件与结账提示优化 ✅

**任务**: 添加自定义退款邮件功能，优化结账表单邮箱填写提示
**状态**: ✅ 完成

**完成内容**:

1. **自定义退款邮件** (`netlify/functions/admin-orders.ts`)
   - 添加 Resend 邮件服务集成
   - 创建 `getResendClient()` 和 `formatCurrency()` 辅助函数
   - 在退款成功后发送精美的 HTML 邮件，包含：
     - 订单号和退款金额
     - 退款商品明细
     - 退款说明和预计到账时间
   - 邮件发送失败不会影响退款流程（try-catch 包裹）

2. **结账表单邮箱提示** (`src/components/checkout/CheckoutForm.tsx`)
   - 在邮箱输入框下方添加提示文字
   - 提醒用户："Please ensure your email is correct. We'll send order confirmation, shipping updates, and important notifications to this address."

**修改的文件**:
- `netlify/functions/admin-orders.ts` - 添加退款邮件发送功能
- `src/components/checkout/CheckoutForm.tsx` - 添加邮箱准确填写提示

**构建结果**: ✅ 通过

---

### 2026-01-26 14:00 - Phase 3 静态导出修复 ✅

**任务**: 修复 Phase 3 订单管理在静态导出模式下的兼容性问题
**状态**: ✅ 完成

**问题与解决方案**:
1. **动态路由问题**: `/admin/orders/[id]` 在静态导出模式下需要 `generateStaticParams()`
   - 解决：改用查询参数 `/admin/orders?id=xxx` 替代路径参数

2. **useSearchParams 问题**: 需要 Suspense 边界
   - 解决：创建 `AdminOrdersContent` 内部组件，外层用 `Suspense` 包装

3. **ESLint 错误**: `<a>` 标签应使用 `<Link>` 组件
   - 解决：在 admin 登录页面将 `<a>` 替换为 `<Link>`

**修改的文件**:
- `src/app/admin/page.tsx` - 修复 Link 组件
- `src/app/admin/orders/page.tsx` - 添加 Suspense 边界，改用查询参数
- `src/components/admin/OrderDetailClient.tsx` - 新建客户端组件
- `.env.example` - 添加 ADMIN_PASSWORD 配置说明

**构建结果**: ✅ 87 个静态页面生成成功

---

### 2026-01-26 - Phase 3/5/6 实现完成 ✅

**任务**: 实现订单管理后台、物流追踪、库存管理功能
**状态**: ✅ 代码实现完成

#### Phase 3: 订单管理后台

**新增文件**:
- `netlify/functions/admin-orders.ts` - Admin API 端点
  - GET / - 订单列表（筛选、搜索、分页）
  - GET /:id - 订单详情
  - PUT /:id - 更新订单状态
  - POST /:id/refund - 处理退款
- `src/app/admin/layout.tsx` - Admin 布局
- `src/app/admin/page.tsx` - 登录页面
- `src/app/admin/orders/page.tsx` - 订单列表页
- `src/app/admin/orders/[id]/page.tsx` - 订单详情页

**功能特点**:
- 简单密码保护（Bearer Token）
- 订单列表支持按状态筛选、搜索、分页
- 订单详情显示完整信息
- 支持更新订单状态（pending → processing → shipped → delivered）
- 支持添加物流单号和发货通知

**环境变量**:
```
ADMIN_PASSWORD=your-secure-password
```

#### Phase 5: 物流追踪集成

**新增文件**:
- `netlify/functions/send-shipping-notification.ts` - 发货通知邮件

**功能特点**:
- 在订单详情页添加物流单号
- 选择物流公司（支持 NZ Post, CourierPost, Australia Post, DHL, FedEx, UPS, USPS）
- 一键发送发货通知邮件给客户
- 邮件包含追踪链接
- 自动更新订单状态为 shipped

#### Phase 6: 库存管理

**新增文件**:
- `supabase/inventory-schema.sql` - 库存表结构
- `netlify/functions/check-inventory.ts` - 库存检查 API
- `src/components/product/StockStatus.tsx` - 库存状态组件

**修改文件**:
- `netlify/functions/stripe-webhook.ts` - 添加库存扣减逻辑
- `src/components/product/ProductHeroClient.tsx` - 使用动态库存状态组件

**数据库表结构**:
```sql
-- inventory 表
- id, product_id, product_name, color_variant
- stock_quantity, reserved_quantity, low_stock_threshold
- sku, location, notes
- created_at, updated_at

-- inventory_history 表（变更历史）
- id, inventory_id, product_id
- change_type (sale/restock/adjustment/reserve/release)
- quantity_change, previous_quantity, new_quantity
- order_id, notes, created_at
```

**数据库函数**:
- `check_and_deduct_inventory()` - 原子性检查和扣减库存
- `get_available_stock()` - 获取可用库存
- `restore_inventory()` - 恢复库存（用于退款/取消）

**前端功能**:
- 产品页面动态显示库存状态
- 低库存提醒（显示剩余数量）
- 缺货提示
- 购物车库存验证 hook

**下一步**:
1. 在 Supabase 运行 `supabase/inventory-schema.sql` 创建库存表
2. 在 Netlify 添加 `ADMIN_PASSWORD` 环境变量
3. 部署并测试
4. 在 Supabase 中为产品设置初始库存

---

### 2026-01-26 - 端到端支付流程测试 ✅

**任务**: 验证完整支付流程（Stripe → Webhook → Supabase → Email）
**状态**: ✅ 全部通过

**测试结果**:

| 验证项 | 状态 | 说明 |
|--------|------|------|
| Stripe Webhook 响应 | ✅ 200 OK | 最新事件返回成功状态 |
| 订单保存到 Supabase | ✅ 13 条记录 | orders 表正常写入 |
| 确认邮件发送 | ✅ 正常 | 客户收到 Order Confirmation 邮件 |

**修复的问题**:
- Netlify 构建失败：Edge Function 的 TypeScript 无法解析远程模块
- 解决方案：删除 `netlify/edge-functions/` 目录，使用 Netlify Functions 版本

**关键操作**:
```bash
# 删除有问题的 Edge Function
mv netlify/edge-functions .deleted/edge-functions_20260126_114356
git add -A && git commit -m "Remove edge function causing build failure"
git push
```

**当前工作配置**:
- Webhook URL: `https://claude-luxehome.netlify.app/.netlify/functions/stripe-webhook`
- 验证方式: Stripe API 验证（无签名验证）
- 数据库: Supabase PostgreSQL
- 邮件服务: Resend

---

### 2026-01-26 - Stripe Webhook 签名验证问题 - 已解决 ✅

**任务**: 修复 Netlify Functions 与 Stripe webhook 签名验证兼容性问题
**状态**: ✅ 已解决

**问题描述**:
Stripe webhook 签名验证在 Netlify 上持续失败，原因是 Netlify 会修改请求体导致签名不匹配。

**最终解决方案: Stripe API 验证**

由于 Netlify 无法保持原始请求体不变，我们采用 **Stripe API 直接验证** 作为安全替代方案：

```typescript
// 通过 Stripe API 直接验证支付状态
const verifiedSession = await stripe.checkout.sessions.retrieve(session.id)
if (!verifiedSession || verifiedSession.payment_status !== 'paid') {
  return { statusCode: 400, body: JSON.stringify({ error: 'Payment not verified' }) }
}
console.log('✅ Payment verified via Stripe API')
```

**安全性分析**:
- ✅ 攻击者无法伪造有效的 Stripe session ID
- ✅ API 验证会发现 session 不存在或未支付
- ✅ 幂等性检查防止重复订单

**尝试过的方案** (均失败):
1. ❌ event.rawBody - Netlify v1 不可用
2. ❌ request.text() - Netlify v2 内容被修改
3. ❌ 手动 HMAC-SHA256 签名计算 - 签名不匹配
4. ❌ Edge Functions + Web Crypto API - 仍然不匹配 (2026-01-26 测试确认)

**Edge Function 测试详情** (2026-01-26 上午1:03):
- 使用 Deno 运行时的 Edge Function + Web Crypto API
- 端点: `/api/stripe-webhook-edge`
- **结果**: HTTP 400 - "Webhook signature verification failed"
- **结论**: Netlify 即使在 Edge Function 层面也会修改请求体

**当前配置**:
- Webhook URL: `https://claude-luxehome.netlify.app/.netlify/functions/stripe-webhook`
- 验证方式: Stripe API 验证 (无签名验证)

---

### 2026-01-24 - Phase 7 Sprint 1 启动

**任务**: 实现订单持久化和邮件通知核心功能
**状态**: 🔄 进行中
**执行方式**: PM 协调开发

**Sprint 目标**: 让网站能够接收真实订单并发送确认邮件

**任务分解**:

#### Task 1: Supabase 数据库设置
- [ ] 连接现有 Supabase 项目 (iffatevotcxghjsovedr)
- [ ] 创建 orders 表
- [ ] 创建 order_items 表
- [ ] 配置 Row Level Security
- [ ] 更新环境变量

#### Task 2: Stripe Webhook 实现
- [ ] 创建 `netlify/functions/stripe-webhook.ts`
- [ ] 处理 `checkout.session.completed` 事件
- [ ] 保存订单到 Supabase
- [ ] 生成唯一订单号 (LH-XXXXXX 格式)
- [ ] 在 Stripe Dashboard 配置 webhook

#### Task 3: Resend 邮件集成
- [ ] 创建 Resend 账户
- [ ] 创建订单确认邮件模板
- [ ] 创建 `netlify/functions/send-email.ts`
- [ ] 集成到 webhook 流程
- [ ] 测试邮件发送

#### Task 4: 成功页面增强
- [ ] 创建 `netlify/functions/get-order.ts`
- [ ] 从数据库获取订单详情
- [ ] 显示订单号和商品信息
- [ ] 显示配送地址
- [ ] 支付成功后清空购物车

**技术架构**:
```
Customer → Stripe Checkout → Webhook → Supabase → Email (Resend)
                                          ↓
                              Success Page ← Order Details
```

**完成内容**:

#### Task 1: Supabase 数据库设置 - ✅ 完成
- [x] 创建 `supabase/schema.sql` 数据库 schema 文件
- [x] 创建 `src/lib/supabase.ts` Supabase 客户端配置
- [x] 定义 TypeScript 类型 (Order, OrderItem, Database)
- [x] 生成订单号函数 `generateOrderNumber()`

#### Task 2: Stripe Webhook 实现 - ✅ 完成
- [x] 创建 `netlify/functions/stripe-webhook.ts`
- [x] 处理 `checkout.session.completed` 事件
- [x] 保存订单到 Supabase (orders + order_items 表)
- [x] 支持从 metadata 获取详细商品信息和收货地址
- [x] 实现幂等性检查 (防止重复订单)

#### Task 3: Resend 邮件集成 - ✅ 完成
- [x] 安装 `resend` 依赖
- [x] 创建订单确认邮件模板 (HTML 格式，品牌风格)
- [x] 集成到 webhook 流程 (支付成功后自动发送)
- [x] 包含订单详情、商品列表、收货地址

#### Task 4: 成功页面增强 - ✅ 完成
- [x] 创建 `netlify/functions/get-order.ts` 订单查询 API
- [x] 更新 `SuccessContent.tsx` 显示完整订单详情
- [x] 显示订单号、商品列表、价格明细
- [x] 显示收货地址
- [x] 支付成功后自动清空购物车

**测试结果**:
- 单元测试: 49/49 通过 (100%)
- 构建验证: 86 个静态页面生成成功

**新增/修改文件**:
- `supabase/schema.sql` (新增) - 数据库表结构
- `src/lib/supabase.ts` (新增) - Supabase 客户端
- `netlify/functions/stripe-webhook.ts` (新增) - Webhook 处理器
- `netlify/functions/get-order.ts` (新增) - 订单查询 API
- `netlify/functions/create-checkout-session.ts` (修改) - 添加 metadata
- `src/components/checkout/SuccessContent.tsx` (修改) - 显示订单详情
- `.env.example` (更新) - 添加环境变量说明
- `package.json` (更新) - 添加 @supabase/supabase-js, resend 依赖

**下一步**:
- [ ] 在 Supabase 中运行 `supabase/schema.sql` 创建数据库表
- [ ] 创建 Resend 账户并获取 API Key
- [ ] 在 Netlify 配置环境变量 (SUPABASE_*, RESEND_API_KEY, STRIPE_WEBHOOK_SECRET)
- [ ] 在 Stripe Dashboard 配置 Webhook 端点
- [ ] 进行端到端测试

---

### 2026-01-24 - 制定生产运营功能开发路线图

**任务**: 为网站正式上线运营制定完整的功能开发路线图
**状态**: ✅ 完成

**背景分析**:

已完成功能:
- [x] 完整电商前端（产品展示、购物车、结账流程）
- [x] 多地区支持（AU/NZ/US，不同货币）
- [x] Stripe 在线支付（Netlify Functions 后端）
- [x] 支付成功/取消页面
- [x] 响应式设计和性能优化
- [x] 自动化测试（49 单元测试 + 35 E2E 测试）

关键缺失:
- 订单数据持久化（支付后订单未保存）
- 邮件通知系统（无订单确认邮件）
- 订单管理后台（无法追踪订单）
- Stripe 实际运营（仅测试模式）

**技术方案决策**:

| 组件 | 选型 | 理由 |
|------|------|------|
| 数据库 | **Supabase** | PostgreSQL、免费层慷慨、已有账户、实时订阅 |
| 邮件服务 | **Resend** | 3000封/月免费、优秀开发体验、React Email 集成 |
| 后台管理 | **分阶段** | 先用 Supabase Dashboard，后续按需自建 |

**开发路线图**:

| 阶段 | 内容 | 预估时间 |
|------|------|----------|
| Phase 1 | 订单持久化 + Stripe Webhook | 3-4 天 |
| Phase 2 | 邮件通知系统 | 2-3 天 |
| Phase 3 | 订单管理功能 | 3-5 天 |
| Phase 4 | Stripe 正式模式 | 1-2 天 |
| Phase 5 | 物流追踪集成 | 2-3 天 |
| Phase 6 | 库存管理 | 3-4 天 |

**总预估**: 3-4 周完成所有核心运营功能

**新增文件**:
- `ROADMAP.md` - 完整功能开发路线图文档

**下一步**:
- [ ] 确认技术方案选型
- [ ] 设置 Supabase 项目和数据库 schema
- [ ] 创建 Resend 账户
- [ ] 开始 Phase 1 开发

---

### 2026-01-23 - 修复 Newsletter 与 Footer 视觉重合问题

**任务**: 彻底修复页面底部 "Stay Updated" 区域与 Footer 链接区域的视觉融合问题
**状态**: ✅ 完成

**问题分析**:
- Newsletter 和 Footer 都使用 `bg-primary` (#1a1a1a) 纯黑背景
- 之前的分隔线 `border-white/10` 透明度太低，几乎看不见
- 之前多次修复（增加 padding）没有解决根本问题：缺乏视觉层次区分

**根本性解决方案**:
1. Newsletter 区域使用稍浅的背景色 `bg-[#242424]`
2. 添加金色装饰分隔线（符合奢华品牌调性）
3. 每个区域显式设置 `bg-primary` 防止样式继承问题

**代码修改** (`src/components/layout/Footer.tsx`):
```tsx
// Newsletter Section - 使用稍浅背景
<div className="bg-[#242424]">

// Visual Separator - 金色装饰线
<div className="bg-primary">
  <div className="container">
    <div className="flex items-center justify-center py-6">
      <div className="flex-1 h-px bg-white/10"></div>
      <div className="mx-6 w-16 h-px bg-accent"></div>
      <div className="flex-1 h-px bg-white/10"></div>
    </div>
  </div>
</div>

// Main Footer - 纯黑背景
<div className="bg-primary">
```

**为什么之前的修复失败**:
- 只增加 padding/spacing 不能解决背景色相同导致的视觉融合
- 10% 透明度的白色分隔线在深色背景上几乎不可见
- 没有创建真正的视觉层次

**部署信息**:
- GitHub Commit: b34708f
- 部署时间: 2026-01-23
- 线上地址: https://claude-luxehome.netlify.app/nz

---

### 2026-01-23 - 上线前测试验证

**任务**: 完成测试验证并准备上线
**状态**: 🔄 进行中

**测试验证**:

#### 单元测试 (Vitest)
- [x] 运行所有单元测试: 49/49 通过 (100%)
- [x] 测试覆盖: regions.ts, cart.ts, products.ts

#### E2E 测试 (Playwright) - 新增
- [x] 安装 Playwright 测试框架
- [x] 配置 playwright.config.ts
- [x] 创建 e2e/shopping-flow.spec.ts 测试文件
- [x] 运行 E2E 测试: **35/35 通过 (100%)**

**E2E 测试覆盖范围:**
- Homepage (4 tests): 页面加载、Header、Hero、分类
- Region Switching (3 tests): AU/NZ/US 地区和货币
- Product Browsing (4 tests): 产品页、图片、价格、购物车按钮
- Shopping Cart (2 tests): 添加商品、购物车抽屉
- Category Page (3 tests): 品类页导航和展示
- Checkout Flow (1 test): 结账页面
- Static Pages (5 tests): About/FAQ/Shipping/Contact/Blog
- Footer (3 tests): Footer、Newsletter、链接
- Product Features (3 tests): 评论、功能、FAQ
- Mobile (2 tests): 响应式设计
- SEO (3 tests): 页面标题
- Navigation (2 tests): 页面间导航

#### 构建验证
- [x] 运行 `npm run build`: 成功
- [x] 生成 80 个静态页面
- [x] 新增 Checkout 页面 (AU/NZ/US)
- [x] 无 TypeScript 错误

**新增文件**:
- `playwright.config.ts` - Playwright 配置
- `e2e/shopping-flow.spec.ts` - E2E 测试用例 (35 个测试)

**修改文件**:
- `package.json` - 添加 @playwright/test 依赖
- `QA_REPORT.md` - 更新测试记录

**已完成**:
- [x] 提交代码到 GitHub (commit: 6bc1dd2)
- [x] 验证 Netlify 自动部署
- [x] 确认线上功能正常 (E2E 测试 35/35 通过)

**部署信息**:
- GitHub Commit: 6bc1dd2
- 部署时间: 2026-01-23
- 线上地址: https://claude-luxehome.netlify.app/nz

---

### 2026-01-23 - 多 Agent 协作优化项目

**任务**: 处理 QA 报告中识别的 5 个遗留问题
**状态**: ✅ 完成
**执行方式**: 多 Agent 并行协作

**任务分解与执行**:

#### M2: 品类页筛选/排序功能 (Medium)
- [x] 创建 FilterSortBar 组件（支持排序和库存筛选）
- [x] 创建 CategoryProductsClient 客户端组件
- [x] 实现价格排序：低到高、高到低
- [x] 实现评分排序、名称排序
- [x] 实现库存筛选：全部、仅有货、无货
- [x] 重构品类页面使用新组件

**新增文件**:
- `src/components/category/FilterSortBar.tsx` - 筛选排序工具栏
- `src/components/category/CategoryProductsClient.tsx` - 品类产品客户端组件
- `src/components/category/index.ts` - 组件导出索引

#### M3: 结账流程表单验证 (Medium)
- [x] 创建 Checkout 页面（支持 3 个地区）
- [x] 创建 CheckoutForm 组件
- [x] 实现完整表单验证：
  - Email 格式验证
  - 电话号码验证
  - 地址字段必填验证
  - 邮编格式验证（AU/NZ: 4位, US: 5位或9位）
- [x] 集成 Netlify Forms
- [x] 添加订单确认页面
- [x] 更新 CartDrawer 结账按钮链接

**新增文件**:
- `src/app/(frontend)/[region]/checkout/page.tsx` - 结账页面
- `src/components/checkout/CheckoutForm.tsx` - 结账表单组件
- `src/components/checkout/index.ts` - 组件导出索引

#### M4: NotificationBar 布局修复 (Medium)
- [x] 分析布局问题：Header fixed 定位导致遮挡
- [x] 将 Header 从 `fixed` 改为 `sticky`
- [x] 移除 main 的 `pt-20` padding
- [x] 优化 NotificationBar 响应式文本
- [x] 修复 z-index 层级

**修改文件**:
- `src/components/layout/NotificationBar.tsx` - 添加固定高度和响应式优化
- `src/components/layout/Header.tsx` - 改为 sticky 定位
- `src/app/(frontend)/[region]/layout.tsx` - 移除多余 padding

#### L1: 货币格式化千分位 (Low)
- [x] 更新 formatPrice 函数支持千分位分隔符
- [x] 使用 toLocaleString 实现标准格式化
- [x] 更新测试用例覆盖千分位场景
- [x] 测试大额价格显示：$1,234 / $12,345 / $1,234,567

**修改文件**:
- `src/lib/regions.ts` - 更新 formatPrice 函数
- `src/lib/regions.test.ts` - 新增千分位测试用例

#### L2: 产品图片评估 (Low)
- [x] 评估现有图片资源
- [x] White 变体: 8 张图片（完整）
- [x] Grey 变体: 1 张图片（可接受 MVP）
- [x] Snow White 变体: 1 张图片（可接受 MVP）
- [x] 状态: 已记录为 Known Issue，后续产品更新时补充

**测试结果**:
- 单元测试: 49/49 通过 (100%)
- 构建验证: 53 个静态页面生成成功
- 新增页面: 3 个 checkout 页面

**修改文件汇总**:
- `src/components/category/FilterSortBar.tsx` (新增)
- `src/components/category/CategoryProductsClient.tsx` (新增)
- `src/components/category/index.ts` (新增)
- `src/components/checkout/CheckoutForm.tsx` (新增)
- `src/components/checkout/index.ts` (新增)
- `src/app/(frontend)/[region]/checkout/page.tsx` (新增)
- `src/app/(frontend)/[region]/[category]/page.tsx` (更新)
- `src/app/(frontend)/[region]/layout.tsx` (更新)
- `src/components/layout/NotificationBar.tsx` (更新)
- `src/components/layout/Header.tsx` (更新)
- `src/components/cart/CartDrawer.tsx` (更新)
- `src/lib/regions.ts` (更新)
- `src/lib/regions.test.ts` (更新)

---

### 2026-01-23 - 项目优化与技术债务清理

**任务**: 根据全面审视结果，执行项目优化
**状态**: ✅ 完成

**已完成优化**:

#### P1: 添加自动化测试 (高优先级)
- [x] 安装 Vitest + React Testing Library + jsdom
- [x] 创建 vitest.config.ts 配置文件
- [x] 创建测试 setup 文件 (src/__tests__/setup.ts)
- [x] 为 regions.ts 添加单元测试 (13 个测试用例)
- [x] 为 cart.ts 添加单元测试 (15 个测试用例)
- [x] 为 products.ts 添加单元测试 (19 个测试用例)
- [x] 添加 npm test 脚本

**测试结果**: 47 个测试全部通过

#### P2: 产品数据重构 (高优先级)
- [x] 创建 src/data/json/products.json 数据文件
- [x] 重构 products.ts 从 JSON 导入数据
- [x] 保持类型定义不变，数据与代码分离
- [x] 便于后续产品扩展和维护

#### P3: 清理 Payload CMS 遗留代码 (高优先级)
- [x] 创建删除缓冲目录 .deleted/payload-cleanup-2026-01-23/
- [x] 移动 src/payload/ 目录到删除缓冲
- [x] 移动 src/payload.config.ts 到删除缓冲
- [x] 移动 src/app/(admin)/ 到删除缓冲
- [x] 移动 src/app/(payload)/ 到删除缓冲
- [x] 创建 DELETION_LOG.md 记录删除原因
- [x] 更新 .gitignore 忽略 .deleted/ 目录

**清理文件**: 15 个 Payload 相关文件移至删除缓冲

#### P4: 创建可复用 UI 组件 (中优先级)
- [x] 创建 PageHero 组件 (页面标题区域)
- [x] 创建 Breadcrumb 组件 (面包屑导航)
- [x] 创建 Button 组件 (支持多种变体和大小)
- [x] 创建 Card 系列组件 (Card, CardHeader, CardTitle, CardContent)
- [x] 创建 FeatureCard 组件 (特性卡片)
- [x] 创建 Section 系列组件 (Section, SectionHeader)
- [x] 创建 ui/index.ts 索引文件

#### M1: 博客图片引用检查 (中优先级)
- [x] 验证所有博客图片路径
- [x] 确认 9 个博客图片全部存在
- [x] 问题状态: 已不存在

**修改文件**:
- `vitest.config.ts` - Vitest 配置
- `src/__tests__/setup.ts` - 测试环境设置
- `src/lib/regions.test.ts` - 地区配置测试
- `src/lib/cart.test.ts` - 购物车测试
- `src/data/products.test.ts` - 产品数据测试
- `src/data/json/products.json` - 产品 JSON 数据
- `src/data/products.ts` - 重构为从 JSON 导入
- `src/components/ui/*.tsx` - 6 个新 UI 组件
- `package.json` - 添加测试脚本和依赖
- `.gitignore` - 添加 .deleted/ 忽略

**构建结果**: 50 个静态页面全部生成成功，47 个测试通过

---

### 2026-01-23 - 调整 Footer Stay Updated 区域间距

**任务**: 增加 Stay Updated 部分的上下间距，改善视觉呼吸感
**状态**: ✅ 完成

**完成内容**:
- [x] 增加容器 padding：py-16 md:py-24 → py-20 md:py-32
- [x] 增加标题下边距：mb-6 → mb-8
- [x] 增加描述下边距：mb-8 → mb-10
- [x] 使用 Playwright 本地验证效果
- [x] 部署到 Netlify 并验证线上效果

**修改文件**:
- `src/components/layout/Footer.tsx` - Stay Updated 区域间距调整

**部署信息**:
- Commit: main@4d5d816
- 部署时间: 2026-01-23
- 线上地址: https://claude-luxehome.netlify.app/nz

**视觉改进**:
- FAQ 部分与 Stay Updated 之间的过渡更加自然
- Newsletter 表单区域有更充足的呼吸空间
- 整体视觉平衡性提升

---

### 2026-01-22 - 使用用户提供的源图片完善产品信息

**任务**: 使用 source-pics 目录中的高质量图片更新两个产品的图片和数据
**状态**: ✅ 完成

**完成内容**:
- [x] 使用用户提供的截图更新 Smart Digital Calendar 图片
- [x] 添加 8 张白色框架图片（main-new, angle, side, back, detail, screen, in-use, banner-features）
- [x] 添加灰色和雪白色变体的主图
- [x] 更新规格信息（Cover Material, Package Dimensions, Item Weight, Model Number, ASIN, Date First Available）
- [x] 更新 Mini Arcade Machine 增加 2 张新图片（screen-view, controls）
- [x] 部署到 Netlify

**修改文件**:
- `src/data/products.ts` - 更新两个产品的图片数组和规格
- `public/images/products/smart-digital-calendar/white/` - 8张图片
- `public/images/products/smart-digital-calendar/grey/` - 1张图片
- `public/images/products/smart-digital-calendar/snow-white/` - 1张图片
- `public/images/products/mini-arcade-machine/` - 17张图片

**构建结果**: 50 个静态页面全部生成成功
**部署地址**: https://claude-luxehome.netlify.app

---

### 2026-01-22 - 丰富电子日程表产品信息

**任务**: 从 Amazon 获取完整产品信息，添加颜色变体和更多图片
**状态**: ✅ 完成

**完成内容**:
- [x] 访问 Amazon 产品页获取完整信息
- [x] 获取3种颜色变体：White Frame, Grey Frame, Snow White Frame
- [x] 下载所有高清产品图片（White: 8张, Grey: 1张, Snow White: 1张）
- [x] 添加 ColorVariant 接口支持颜色变体
- [x] 更新产品数据：更多图片、详细规格、特性图标
- [x] 添加库存数量显示

**新增文件**:
- `public/images/products/smart-digital-calendar/white/` - 8张图片
- `public/images/products/smart-digital-calendar/grey/main.jpg`
- `public/images/products/smart-digital-calendar/snow-white/main.jpg`

**修改文件**:
- `src/data/products.ts` - 添加 ColorVariant 接口，丰富产品数据

**产品更新内容**:
- 7张高清产品图片（White Frame）
- 3种颜色变体可选
- 6个功能特性（带图标）
- 12项技术规格
- 更详细的产品描述

**构建结果**: 50 个静态页面全部生成成功

---

### 2026-01-22 - 修改产品价格和货币显示

**任务**: 修改产品价格，添加货币缩写
**状态**: ✅ 完成

**完成内容**:
- [x] 修改 Smart Digital Calendar 价格：US $249, NZ $429, AU $369
- [x] 修改 Mini Arcade Machine 价格：NZ $69, AU $59 (US 保持 $39)
- [x] 在价格显示中添加货币缩写（AUD $、NZD $、USD $）
- [x] 修改 currencySymbol 包含货币代码
- [x] 更新 formatPrice 函数
- [x] 创建 QA_REPORT.md

**修改文件**:
- `src/data/products.ts` - 更新产品价格
- `src/lib/regions.ts` - 修改 currencySymbol 和 formatPrice

**构建结果**: 50 个静态页面全部生成成功

---

### 2026-01-22 17:30 - 添加所有静态页面

**任务**: 为所有地区创建静态页面
**状态**: ✅ 完成

**完成内容**:
- [x] About 页面 - 品牌故事和价值观
- [x] Contact 页面 - Netlify Forms 联系表单
- [x] FAQ 页面 - 分类折叠式问答
- [x] Shipping 页面 - 配送信息（地区差异化）
- [x] Returns 页面 - 退换货政策
- [x] Privacy 页面 - 隐私政策
- [x] Terms 页面 - 服务条款
- [x] Blog 页面 - 博客列表（3篇示例文章）
- [x] Category 页面 - Kitchen/Outdoor/Tech/Lifestyle

**所有页面**:
- 使用 `generateStaticParams()` 为 AU/NZ/US 生成静态页面
- 统一设计风格（Hero + Breadcrumb + Content + CTA）
- 表单使用 Netlify Forms
- FAQ 使用客户端组件实现折叠交互

**新增文件**:
- `src/app/(frontend)/[region]/about/page.tsx`
- `src/app/(frontend)/[region]/contact/page.tsx`
- `src/app/(frontend)/[region]/faq/page.tsx`
- `src/app/(frontend)/[region]/shipping/page.tsx`
- `src/app/(frontend)/[region]/returns/page.tsx`
- `src/app/(frontend)/[region]/privacy/page.tsx`
- `src/app/(frontend)/[region]/terms/page.tsx`
- `src/app/(frontend)/[region]/blog/page.tsx`
- `src/app/(frontend)/[region]/[category]/page.tsx`
- `src/components/faq/FAQAccordion.tsx`

**构建结果**: 50个静态页面全部生成成功

---

### 2026-01-22 17:00 - 添加购物车功能

**任务**: 实现 localStorage 持久化购物车
**状态**: ✅ 完成

**完成内容**:
- [x] 创建 cart.ts - 购物车状态管理 Hook
- [x] 创建 CartProvider - Context Provider
- [x] 创建 CartDrawer - 滑出式购物车面板
- [x] 创建 CartButton - Header 购物车图标
- [x] 创建 AddToCartButton - 添加商品按钮
- [x] 创建 ProductActions - 产品页购买按钮组
- [x] 集成 localStorage 持久化

**新增文件**:
- `src/lib/cart.ts`
- `src/components/cart/CartProvider.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartButton.tsx`
- `src/components/cart/CartWrapper.tsx`
- `src/components/cart/AddToCartButton.tsx`
- `src/components/product/ProductActions.tsx`

**功能特点**:
- 跨页面购物车状态持久化
- 支持多地区货币显示
- 购物车数量徽章
- 滑出式购物车抽屉
- 自动计算小计和节省金额

---

### 2026-01-22 16:35 - 修复 Netlify 部署配置

**任务**: 修复静态站点部署失败问题
**状态**: ✅ 完成

**问题原因**:
- 原配置使用 @netlify/plugin-nextjs 插件，需要 `.next` 目录
- 纯静态站点应使用 `output: 'export'`，输出到 `out` 目录

**完成内容**:
- [x] 在 next.config.ts 添加 `output: 'export'`
- [x] 更新 netlify.toml，publish 目录从 `.next` 改为 `out`
- [x] 移除不需要的 @netlify/plugin-nextjs 插件
- [x] 本地构建测试通过
- [x] 推送到 GitHub (main@4ae4e89)

**修改文件**:
- `next.config.ts` - 添加 output: 'export'
- `netlify.toml` - 更新 publish 目录和移除插件

**下一步**:
- [ ] 验证 Netlify 部署成功
- [ ] 添加购物车功能（localStorage 持久化）

---

### 2026-01-22 16:00 - 转换为纯静态站点

**任务**: 移除 Payload CMS 和 Supabase，添加评论系统
**状态**: ✅ 完成

**完成内容**:
- [x] 移除 Payload CMS 依赖
- [x] 移除 Supabase 连接
- [x] 创建评论数据模型 (src/data/reviews.ts)
- [x] 添加 11 条模拟评论数据
- [x] 创建 ReviewSection 组件
- [x] 使用 Netlify Forms 收集评论（匿名提交）
- [x] 添加客服邮箱到 Footer (support@luxehome.com)
- [x] 更新 Newsletter 表单使用 Netlify Forms

**评论工作流程**:
1. 用户提交评论 → Netlify Forms 收集
2. 管理员收到邮件通知 → 审核评论
3. 手动添加到 reviews.ts → 重新部署

**新增文件**:
- `src/data/reviews.ts` - 评论数据模型和 11 条模拟评论
- `src/components/reviews/ReviewSection.tsx` - 评论展示和提交组件
- `src/lib/config.ts` - 网站配置（客服邮箱等）

**删除文件**:
- `src/app/(admin)/` - Payload Admin 目录
- `src/app/(payload)/` - Payload API 目录
- `src/payload/` - Payload 配置目录
- `src/payload.config.ts`

**修改文件**:
- `package.json` - 移除 Payload 依赖
- `next.config.ts` - 移除 Payload 配置
- `.env.local` - 移除 Supabase 配置
- `src/components/layout/Footer.tsx` - 添加客服邮箱和 Netlify Forms

**技术决策更新**:
- 从 Payload CMS + Supabase 转为纯静态站点
- 评论使用手动审核工作流，无需数据库
- 所有表单使用 Netlify Forms

---

### 2026-01-22 - 产品详情页 Landing Page 重构

**任务**: 参考 Skylight 网站重构产品页面为完整 Landing Page
**状态**: ✅ 完成

**完成内容**:
- [x] 创建 NotificationBar 组件（顶部促销栏）
- [x] 重构产品页为 Landing Page 风格
- [x] 添加 SAVE 折扣标签
- [x] 添加 Verified Buyers 评分标识
- [x] 添加 In Stock - Ready to Ship 库存状态
- [x] 增强 Trust Badges（4个信任徽章）
- [x] 添加日历同步图标（Google/iCloud/Outlook/Yahoo/Cozi）
- [x] 创建 Guarantee Banner（30天退款 + 2年保修）
- [x] 创建 "Why Families Love It" 功能展示区（带图标）
- [x] 创建客户评价区（3个评价卡片）
- [x] 改进 FAQ 为 Q&A 格式
- [x] 创建 Final CTA 区域（深色背景 + 金色按钮）

**新增文件**:
- `src/components/layout/NotificationBar.tsx` - 顶部通知栏组件

**修改文件**:
- `src/app/(frontend)/[region]/layout.tsx` - 添加 NotificationBar
- `src/app/(frontend)/[region]/p/[slug]/page.tsx` - 完整重构为 Landing Page

**部署信息**:
- Commit: main@279a3aa
- 部署时间: 2026-01-22 3:48 PM
- 构建时间: 1m 21s

**已知问题**:
- [ ] NotificationBar 可能被固定 Header 遮挡（布局调整）

**下一步**:
- [ ] 修复 NotificationBar 布局问题
- [ ] 添加更多产品数据
- [ ] 配置 Netlify 环境变量启用 Admin 后台

---

### 2026-01-22 - 产品图片本地化

**任务**: 下载 Amazon 图片到本地
**状态**: ✅ 完成

**完成内容**:
- [x] 下载 Smart Digital Calendar 8张图片
- [x] 下载 Mini Arcade Machine 7张图片
- [x] 更新 products.ts 使用本地图片路径
- [x] 部署到 Netlify

**新增文件**:
- `public/images/products/smart-digital-calendar/` - 8张图片
- `public/images/products/mini-arcade-machine/` - 7张图片

**部署信息**:
- Commit: main@91e5fd7
- 部署时间: 2026-01-22 3:04 PM

---

### 2026-01-22 - 产品详情页开发

**任务**: 创建产品数据和详情页
**状态**: ✅ 完成

**完成内容**:
- [x] 创建产品数据模型 (`src/data/products.ts`)
- [x] 添加 Smart Digital Calendar 产品（Amazon US）
- [x] 添加 Mini Arcade Machine 产品（Amazon UK）
- [x] 创建产品详情页 (`src/app/(frontend)/[region]/p/[slug]/page.tsx`)
- [x] 更新首页使用真实产品数据
- [x] SSG 静态生成所有产品页面
- [x] SEO 优化（JSON-LD 结构化数据）

**产品页面**:
- Smart Digital Calendar: https://claude-luxehome.netlify.app/nz/p/smart-digital-calendar
- Mini Arcade Machine: https://claude-luxehome.netlify.app/nz/p/mini-arcade-machine

**新增文件**:
- `src/data/products.ts` - 产品数据和类型定义
- `src/app/(frontend)/[region]/p/[slug]/page.tsx` - 产品详情页

**修改文件**:
- `src/app/(frontend)/[region]/page.tsx` - 首页使用真实产品数据

---

### 2026-01-22 - 首页优化和修复

**任务**: 修复问题并优化首页
**状态**: ✅ 完成

**完成内容**:
- [x] 修改 Netlify 项目名称为 claude-luxehome
- [x] 修复 Footer 显示问题（Tailwind v4 @theme 配置）
- [x] 更改默认地区从 AU 到 NZ
- [x] 新增 Best Sellers 区域（4 个产品卡片）
- [x] 新增 Why Choose Us 区域（3 个特色）

**部署信息**:
- 新 Netlify URL: https://claude-luxehome.netlify.app
- 默认地区: New Zealand (/nz)
- 部署时间: 2026-01-22 2:32 PM

**修改的文件**:
- `src/app/globals.css` - 修复 Tailwind v4 主题配置
- `src/lib/regions.ts` - 更改默认地区为 'nz'
- `src/app/(frontend)/[region]/page.tsx` - 新增 Best Sellers 和 Why Choose Us

**已验证功能**:
- [x] Footer 正常显示（黑色背景、金色按钮）
- [x] 默认跳转到 /nz（New Zealand）
- [x] Best Sellers 显示 4 个产品
- [x] Why Choose Us 显示 3 个特色
- [x] FAQ 显示 NZ 特定内容

**下一步**:
- [ ] 在 Netlify 配置环境变量 (DATABASE_URL, PAYLOAD_SECRET)
- [ ] 测试 Payload Admin 后台 (/admin)
- [ ] 开发产品详情页
- [ ] 添加实际产品数据

---

### 2026-01-22 - Netlify 部署完成

**任务**: 部署到 Netlify
**状态**: ✅ 完成

**完成内容**:
- [x] 修复 Payload CMS admin layout serverFunction 错误
- [x] 创建 server actions 文件 (src/app/(admin)/actions.ts)
- [x] 初始化 Git 仓库
- [x] 推送代码到 GitHub (derek33808/claude-luxehome)
- [x] 连接 Netlify 到 GitHub 仓库
- [x] 自动部署成功

**部署信息**:
- GitHub 仓库: https://github.com/derek33808/claude-luxehome
- Netlify 项目: claude-luxehome (原 chipper-caramel-1a4b15)
- 线上地址: https://claude-luxehome.netlify.app
- 构建时间: 1m 36s
- 部署时间: 2026-01-22 2:20 PM

**已验证功能**:
- [x] 首页 Hero 区域正常显示
- [x] 分类卡片（Kitchen/Outdoor/Tech/Lifestyle）正常
- [x] 精选产品区域显示正常
- [x] FAQ 区域显示 Australia 特定内容
- [x] Header 导航和地区切换器正常
- [x] 多地区路由 (/au, /nz, /us) 正常
- [x] Footer 显示问题（已在后续更新中修复）

**下一步**: 见最新日志

---

### 2026-01-22 - Phase 1 基础框架开发

**任务**: 完成基础框架搭建
**状态**: ✅ 完成

**完成内容**:
- [x] 初始化 Next.js 15 + TypeScript 项目
- [x] 集成 Payload CMS 3.0
- [x] 配置 Tailwind CSS（延续 luxe-home-store 的奢华风格）
- [x] 创建 Supabase 项目（PostgreSQL 数据库）
- [x] 配置多地区路由 (AU/NZ/US)
- [x] 创建 Header 组件（地区切换、导航、购物车）
- [x] 创建 Footer 组件（Newsletter、链接、社交）
- [x] 创建首页（Hero、分类、精选产品、FAQ）
- [x] 添加 SEO/GEO 优化（JSON-LD、FAQ Schema）

**关键文件**:
- `src/app/(frontend)/[region]/page.tsx` - 首页
- `src/app/(frontend)/[region]/layout.tsx` - 前端布局
- `src/components/layout/Header.tsx` - 头部导航
- `src/components/layout/Footer.tsx` - 页脚
- `src/lib/regions.ts` - 地区配置
- `src/payload.config.ts` - Payload CMS 配置
- `src/payload/collections/*.ts` - 数据模型

**Supabase 配置**:
- 项目名: luxehome
- 区域: Asia-Pacific
- Project ID: iffatevotcxghjsovedr
- URL: https://iffatevotcxghjsovedr.supabase.co

**下一步**:
- [ ] 填写 .env.local 中的数据库密码
- [ ] 运行 `npm run dev` 测试
- [ ] 部署到 Netlify
- [ ] 开发产品详情页
- [ ] 添加实际产品数据

**上下文备注**:
- 数据库密码在创建项目时已复制，需要填入 .env.local
- 设计风格延续自 luxe-home-store（黑金配色、奢华简约）

---

### 2026-01-22 - 域名调研

**任务**: 检查域名可用性
**状态**: ✅ 完成

**调研结果**:
| 域名 | 状态 | 备注 |
|------|------|------|
| luxehome.com | ❌ 已占用 | 重定向到 themart.com/design/ |
| luxehome.co | ❌ 已占用 | 停放页面，可能待售 |
| luxehome.shop | ❌ 已占用 | 停放页面，可能待售 |
| luxehome.store | ❌ 已占用 | 停放页面，可能待售 |

**决定**: 域名后续确定，先以 luxehome 为词根

---

### 2026-01-22 (项目启动)

**任务**: 创建项目规划文档
**状态**: ✅ 完成

**完成内容**:
- [x] 创建项目目录 `projects/software/luxehome/`
- [x] 创建 DESIGN.md 设计文档
- [x] 创建 PROGRESS.md 进度跟踪

---

## 里程碑

| 里程碑 | 目标日期 | 状态 |
|--------|---------|------|
| 项目规划完成 | 2026-01-22 | ✅ 完成 |
| 基础框架搭建 | 2026-01-22 | ✅ 完成 |
| 首页开发 | 2026-01-22 | ✅ 完成 |
| Netlify 部署 | 2026-01-22 | ✅ 完成 |
| 产品功能开发 | 2026-01-22 | ✅ 完成 |
| 购物功能开发 | 2026-01-22 | ✅ 完成 |
| 博客系统开发 | 2026-01-22 | ✅ 完成 |
| 代码优化与测试 | 2026-01-23 | ✅ 完成 |
| E2E 测试与上线 | 2026-01-23 | ✅ 完成 |
| 自定义域名 | - | ⏳ 待开始 |
| Stripe 支付集成 | - | ⏳ 待开始 |

---

## 技术决策记录

### 2026-01-22 - 数据库选择更新
**决定**: Supabase PostgreSQL (替代 MongoDB)
**原因**:
- 用户已有 Supabase 账户
- PostgreSQL 更适合电商数据
- Payload CMS 支持 PostgreSQL

### 2026-01-22 - 部署方案更新
**决定**: Netlify (Demo) → 后续绑定自定义域名
**原因**:
- 用户已有 Netlify 账户
- 可快速部署 Demo 版本
- 域名确定后再更换

### 2026-01-22 - CMS 选型 (已废弃)
**决定**: 使用 Payload CMS 3.0
**状态**: 已废弃 - 2026-01-23 清理
**原因**: 项目转为纯静态站点，不再需要 CMS

### 2026-01-23 - 架构简化
**决定**: 移除 Payload CMS，采用纯静态站点 + JSON 数据
**原因**:
- 产品数量少，不需要复杂 CMS
- 简化部署和维护
- 静态站点性能更好
- 降低技术复杂度

---

## 项目结构

```
luxehome/
├── src/
│   ├── app/
│   │   ├── (frontend)/       # 前台页面
│   │   │   └── [region]/     # 多地区路由
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # 重定向到默认地区
│   ├── components/
│   │   ├── cart/             # 购物车组件
│   │   ├── faq/              # FAQ 组件
│   │   ├── layout/           # 布局组件 (Header, Footer, NotificationBar)
│   │   ├── product/          # 产品组件
│   │   ├── reviews/          # 评论组件
│   │   └── ui/               # 可复用 UI 组件
│   ├── data/
│   │   ├── json/             # JSON 数据文件
│   │   │   └── products.json
│   │   ├── blog.ts           # 博客数据
│   │   ├── products.ts       # 产品数据模块
│   │   └── reviews.ts        # 评论数据
│   ├── lib/
│   │   ├── cart.ts           # 购物车逻辑
│   │   ├── config.ts         # 站点配置
│   │   └── regions.ts        # 地区配置
│   └── __tests__/            # 测试文件
│       └── setup.ts
├── public/
│   └── images/               # 产品图片
├── .deleted/                 # 删除缓冲 (gitignored)
├── vitest.config.ts          # 测试配置
├── DESIGN.md                 # 设计文档
├── PROGRESS.md               # 进度跟踪
├── QA_REPORT.md              # QA 报告
├── package.json
├── tailwind.config.ts
└── next.config.ts
```
