# Stripe Webhook 配置指南

## 🎉 进度更新

✅ **已完成的配置**：
- Supabase 数据库 schema
- 所有 Netlify 环境变量（包括 Supabase 和 Resend）
- Resend API Key（新创建）

⏳ **还需完成**：Stripe Webhook 配置（5 分钟）

---

## Stripe Webhook 配置步骤

### 步骤 1: 登录 Stripe Dashboard

访问：https://dashboard.stripe.com/test/webhooks

### 步骤 2: 创建 Webhook Endpoint

1. 点击 **"Add endpoint"** 或 **"添加端点"** 按钮

2. 填写以下信息：

   **Endpoint URL（端点 URL）**:
   ```
   https://claude-luxehome.netlify.app/.netlify/functions/stripe-webhook
   ```

   **Description（描述）**（可选）:
   ```
   LuxeHome Order Processing
   ```

3. 选择要监听的事件（Events to send）:
   - 点击 **"Select events"** 或 **"选择事件"**
   - 搜索并勾选: **`checkout.session.completed`**
   - 这是唯一需要的事件

4. 点击 **"Add endpoint"** 完成创建

### 步骤 3: 获取 Webhook Secret

创建完成后，Stripe 会显示 Webhook 详情页面：

1. 找到 **"Signing secret"** 部分
2. 点击 **"Reveal"** 或 **"显示"** 按钮
3. 复制显示的密钥（格式：`whsec_...`）

### 步骤 4: 配置 Netlify 环境变量

打开终端，切换到项目目录，运行以下命令：

```bash
cd ~/Documents/macbookair_files/AI_path/projects/software/luxehome

# 设置 Webhook Secret
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_你复制的密钥"

# 重新部署
netlify deploy --prod
```

### 步骤 5: 测试 Webhook

部署完成后，在 Stripe Dashboard 的 Webhook 详情页面：

1. 点击 **"Send test webhook"** 或 **"发送测试 webhook"**
2. 选择事件: **`checkout.session.completed`**
3. 点击 **"Send test webhook"** 发送

如果配置正确，你应该看到：
- ✅ 状态显示为 "Succeeded" 或 "200 OK"
- Response 响应正常

---

## 完整测试流程

配置完成后，进行一次完整的订单测试：

### 1. 访问网站
```
https://claude-luxehome.netlify.app/nz
```

### 2. 完成购物流程
1. 添加商品到购物车
2. 进入结账页面
3. 填写地址信息
4. 使用测试卡号：**`4242 4242 4242 4242`**
   - 过期日期：任意未来日期（如 `12/25`）
   - CVC：任意 3 位数字（如 `123`）
   - 邮编：任意邮编（如 `12345`）

### 3. 验证结果

支付成功后，应该看到：

#### ✅ 前端验证
- 跳转到成功页面
- 显示订单号（格式：`LH-XXXXXX`）
- 显示订单详情（商品、价格、地址）
- 购物车已清空

#### ✅ 后端验证（Supabase）
访问：https://supabase.com/dashboard/project/cwmkzrgzjgtrkkxgrmra/editor

查看 `orders` 表：
- 应该有一条新订单记录
- `order_number` 为 `LH-XXXXXX`
- `payment_status` 为 `paid`
- `stripe_session_id` 已记录

查看 `order_items` 表：
- 应该有对应的订单项记录
- 包含商品详情和价格

#### ✅ 邮件验证
检查你在结账时填写的邮箱：
- 应该收到一封来自 LuxeHome 的订单确认邮件
- 邮件包含订单号和订单详情

---

## 故障排查

### 问题 1: Webhook 返回 401 或 403 错误

**原因**: Webhook Secret 配置错误

**解决**:
```bash
# 重新设置正确的 Secret
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_正确的密钥"
netlify deploy --prod
```

### 问题 2: 订单未保存到数据库

**检查步骤**:
1. 访问 Stripe Dashboard Webhooks 页面
2. 查看最近的 Webhook 事件
3. 点击查看详情和响应
4. 如果有错误信息，根据错误信息调试

### 问题 3: 未收到邮件

**可能原因**:
- Resend API Key 配置错误
- 邮件进入垃圾箱
- Resend 账户未验证

**检查**:
1. 访问 Resend Dashboard: https://resend.com/emails
2. 查看 "Emails" 列表，确认邮件是否已发送
3. 检查邮件状态（Delivered / Bounced / etc.）

---

## 环境变量检查清单

确保以下环境变量都已正确配置：

```bash
netlify env:list
```

应该看到：

- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET` ← **待配置**
- ✅ `RESEND_API_KEY`
- ✅ `RESEND_FROM_EMAIL`
- ✅ `NEXT_PUBLIC_SITE_URL`

---

## 重要链接

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Webhooks**: https://dashboard.stripe.com/test/webhooks
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cwmkzrgzjgtrkkxgrmra
- **Resend Dashboard**: https://resend.com
- **Netlify Dashboard**: https://app.netlify.com/projects/claude-luxehome
- **网站地址**: https://claude-luxehome.netlify.app

---

## 完成后

配置完成并测试成功后，你的 LuxeHome 电商网站将拥有：

- ✅ 完整的支付流程（Stripe）
- ✅ 自动订单保存（Supabase）
- ✅ 订单确认邮件（Resend）
- ✅ 订单管理能力（Supabase Dashboard）
- ✅ 全自动化工作流

**下一步建议**：
1. 添加更多产品
2. 自定义邮件模板
3. 配置自定义域名
4. 切换到 Stripe 正式模式（接受真实支付）

---

配置时间：2026-01-24
配置人：Claude AI Assistant
