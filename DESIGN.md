# Luxehome - 精致单品电商平台

## 1. 项目目标

### 1.1 核心目标
- 创建统一品牌的精致单品电商网站
- 整合多品类产品，打造精选购物体验
- 实现 SEO/GEO 优化，获取自然流量

### 1.2 品牌定位
- **品牌名**: Luxehome (精致之家)
- **定位**: 精选优质单品电商
- **目标市场**: 澳新为主，北美为辅
- **产品类别**: 家居生活、户外运动、科技数码等
- **运营模式**: 供应商直发 + 集运仓发货（未来可能自有库存）

### 1.3 目标用户
- 追求品质生活的年轻专业人士
- 注重产品质量而非低价
- 偏好简洁现代的购物体验

---

## 2. 功能需求

### 2.1 前台功能

#### 首页
- [ ] 品牌 Hero Banner
- [ ] 精选产品展示 (Featured Products)
- [ ] 品类导航卡片
- [ ] 新品推荐区
- [ ] 品牌故事简介
- [ ] Newsletter 订阅

#### 品类页
- [ ] 厨房用品 (Kitchen)
- [ ] 户外运动 (Outdoor)
- [ ] 科技数码 (Tech)
- [ ] 生活家居 (Lifestyle)
- [ ] 筛选/排序功能
- [ ] 分页/无限滚动

#### 产品详情页
- [ ] 高清产品图片轮播
- [ ] 产品描述 (SEO 优化)
- [ ] 规格参数
- [ ] 价格显示 (多货币)
- [ ] 库存状态
- [ ] 加入购物车
- [ ] 相关产品推荐
- [ ] 结构化数据 (Schema.org)

#### 购物流程
- [ ] 购物车页面
- [ ] 结账流程
- [ ] 地址填写
- [ ] 支付接口预留 (Stripe)
- [ ] 订单确认页

#### 博客/内容中心
- [ ] 博客列表页
- [ ] 博客文章页
- [ ] 分类标签
- [ ] 相关文章推荐
- [ ] 社交分享

#### 多地区支持
- [ ] 地区切换器 (AU/NZ/US)
- [ ] 多货币显示 (AUD/NZD/USD)
- [ ] 本地化内容
- [ ] hreflang 标签

#### 其他页面
- [ ] 关于我们 (About)
- [ ] 联系我们 (Contact)
- [ ] FAQ/帮助中心
- [ ] 隐私政策
- [ ] 服务条款
- [ ] 退换货政策

### 2.2 后台功能 (Payload CMS)

#### 产品管理
- [ ] 产品 CRUD
- [ ] 批量导入/导出
- [ ] 库存管理
- [ ] 价格管理 (多货币)
- [ ] 媒体资源管理

#### 内容管理
- [ ] 博客文章编辑
- [ ] 页面内容编辑
- [ ] SEO 元数据管理
- [ ] 媒体库

#### 订单管理
- [ ] 订单列表
- [ ] 订单详情
- [ ] 订单状态更新
- [ ] 发货管理

#### 数据分析
- [ ] 访问统计
- [ ] 销售报表
- [ ] 产品表现

### 2.3 与选品工具整合 (未来)
- [ ] 从 aunz-product-finder 导入产品
- [ ] 复用市场分析数据
- [ ] 自动同步产品信息

---

## 3. 技术选型

### 3.1 前端框架
| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 14.x | App Router, SSG/SSR |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式框架 |
| next-intl | 3.x | 多语言/多地区 |

### 3.2 CMS 后台
| 技术 | 版本 | 说明 |
|------|------|------|
| Payload CMS | 3.0 | TypeScript 原生，Next.js 集成 |

**选择 Payload CMS 的原因**:
- TypeScript 原生支持
- 和 Next.js 14 完美集成 (可共享代码)
- 自托管，数据完全控制
- 开源免费
- 强大的 API 和自定义能力

### 3.3 数据库
| 技术 | 说明 |
|------|------|
| MongoDB | Payload CMS 默认数据库 |
| MongoDB Atlas | 云托管 (免费层可用) |

### 3.4 部署
| 服务 | 用途 |
|------|------|
| Vercel | Next.js 前端 + Payload |
| MongoDB Atlas | 数据库托管 |
| Cloudinary/S3 | 媒体资源存储 |

### 3.5 支付 (预留)
| 服务 | 说明 |
|------|------|
| Stripe | 主要支付网关 |
| PayPal | 备选支付方式 |

### 3.6 其他工具
| 工具 | 用途 |
|------|------|
| Google Analytics 4 | 流量分析 |
| Google Search Console | SEO 监控 |
| Sentry | 错误追踪 |

---

## 4. 网站架构

### 4.1 URL 结构 (SEO 优化)

```
/                           → 首页 (自动重定向到地区)
/au/                        → 澳洲站首页
/nz/                        → 新西兰站首页
/us/                        → 美国站首页

/[region]/kitchen/          → 厨房品类
/[region]/outdoor/          → 户外品类
/[region]/tech/             → 科技品类
/[region]/lifestyle/        → 生活品类

/[region]/p/[slug]/         → 产品详情页
/[region]/cart/             → 购物车
/[region]/checkout/         → 结账

/[region]/blog/             → 博客列表
/[region]/blog/[slug]/      → 博客文章

/[region]/about/            → 关于我们
/[region]/contact/          → 联系我们
/[region]/faq/              → 常见问题
/[region]/privacy/          → 隐私政策
/[region]/terms/            → 服务条款
```

### 4.2 项目目录结构

```
luxehome/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # 前台路由组
│   │   │   ├── [region]/       # 地区动态路由
│   │   │   │   ├── page.tsx    # 首页
│   │   │   │   ├── [category]/ # 品类页
│   │   │   │   ├── p/[slug]/   # 产品详情
│   │   │   │   ├── cart/       # 购物车
│   │   │   │   ├── blog/       # 博客
│   │   │   │   └── ...
│   │   │   └── layout.tsx
│   │   ├── (admin)/            # Payload Admin
│   │   └── api/                # API 路由
│   ├── components/             # React 组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   ├── layout/             # 布局组件
│   │   ├── product/            # 产品相关组件
│   │   └── blog/               # 博客相关组件
│   ├── lib/                    # 工具函数
│   ├── hooks/                  # 自定义 Hooks
│   ├── types/                  # TypeScript 类型
│   └── styles/                 # 全局样式
├── payload/
│   ├── collections/            # Payload 集合定义
│   │   ├── Products.ts
│   │   ├── Categories.ts
│   │   ├── BlogPosts.ts
│   │   ├── Orders.ts
│   │   └── ...
│   ├── globals/                # 全局配置
│   └── payload.config.ts       # Payload 配置
├── public/                     # 静态资源
├── messages/                   # i18n 翻译文件
│   ├── en-AU.json
│   ├── en-NZ.json
│   └── en-US.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. 数据模型

### 5.1 Product (产品)

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;           // Rich Text
  shortDescription: string;

  // 媒体
  images: Media[];
  featuredImage: Media;

  // 分类
  category: Category;
  tags: string[];

  // 价格 (多货币)
  prices: {
    AUD: number;
    NZD: number;
    USD: number;
  };
  compareAtPrices?: {            // 原价 (用于显示折扣)
    AUD?: number;
    NZD?: number;
    USD?: number;
  };

  // 库存
  sku: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockQuantity?: number;

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  // 规格
  specifications: {
    key: string;
    value: string;
  }[];

  // 状态
  status: 'draft' | 'published';
  featured: boolean;

  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.2 Category (品类)

```typescript
interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: Media;

  // SEO
  seo: {
    title: string;
    description: string;
  };

  // 显示顺序
  order: number;

  status: 'active' | 'inactive';
}
```

### 5.3 BlogPost (博客文章)

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;               // Rich Text

  featuredImage: Media;
  author: string;

  // 分类
  category: 'guide' | 'review' | 'news' | 'tips';
  tags: string[];

  // 关联产品
  relatedProducts: Product[];

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  status: 'draft' | 'published';
  publishedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
```

### 5.4 Order (订单)

```typescript
interface Order {
  id: string;
  orderNumber: string;

  // 客户信息
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };

  // 地址
  shippingAddress: Address;
  billingAddress: Address;

  // 订单项
  items: {
    product: Product;
    quantity: number;
    price: number;
    currency: string;
  }[];

  // 金额
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;

  // 状态
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  // 配送
  trackingNumber?: string;
  shippingCarrier?: string;

  // 备注
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

### 5.5 Region (地区配置)

```typescript
interface RegionConfig {
  code: 'au' | 'nz' | 'us';
  name: string;
  currency: 'AUD' | 'NZD' | 'USD';
  currencySymbol: string;
  locale: string;
  defaultLanguage: string;
  shippingZones: ShippingZone[];
  taxRate: number;
}

const regions: RegionConfig[] = [
  {
    code: 'au',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: '$',
    locale: 'en-AU',
    defaultLanguage: 'en',
    taxRate: 0.10,  // GST 10%
  },
  {
    code: 'nz',
    name: 'New Zealand',
    currency: 'NZD',
    currencySymbol: '$',
    locale: 'en-NZ',
    defaultLanguage: 'en',
    taxRate: 0.15,  // GST 15%
  },
  {
    code: 'us',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    defaultLanguage: 'en',
    taxRate: 0,     // 税率按州计算
  },
];
```

---

## 6. SEO/GEO 策略

### 6.1 技术 SEO

#### SSG/SSR 策略
- **产品页**: SSG 预渲染 + ISR (Incremental Static Regeneration)
- **品类页**: SSG 预渲染
- **博客页**: SSG 预渲染
- **动态页面**: SSR (购物车、结账)

#### Meta 标签
```html
<!-- 基础 Meta -->
<title>{产品名} | Luxehome</title>
<meta name="description" content="{产品描述}">
<meta name="keywords" content="{关键词}">

<!-- Open Graph -->
<meta property="og:title" content="{标题}">
<meta property="og:description" content="{描述}">
<meta property="og:image" content="{图片URL}">
<meta property="og:type" content="product">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{标题}">
<meta name="twitter:description" content="{描述}">
```

#### hreflang 标签 (多地区)
```html
<link rel="alternate" hreflang="en-AU" href="https://luxehome.com/au/p/product-slug">
<link rel="alternate" hreflang="en-NZ" href="https://luxehome.com/nz/p/product-slug">
<link rel="alternate" hreflang="en-US" href="https://luxehome.com/us/p/product-slug">
<link rel="alternate" hreflang="x-default" href="https://luxehome.com/au/p/product-slug">
```

#### 结构化数据 (Schema.org)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "产品名称",
  "description": "产品描述",
  "image": ["图片URL"],
  "brand": {
    "@type": "Brand",
    "name": "Luxehome"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "AUD",
    "availability": "https://schema.org/InStock"
  }
}
```

#### 站点地图
- `/sitemap.xml` - 主站点地图索引
- `/sitemap-products.xml` - 产品页面
- `/sitemap-categories.xml` - 品类页面
- `/sitemap-blog.xml` - 博客文章
- `/sitemap-pages.xml` - 静态页面

### 6.2 内容 SEO 策略

#### 内容类型
1. **购买指南**: "Best [Product Type] in Australia 2024"
2. **产品对比**: "[Product A] vs [Product B]: Which is Better?"
3. **使用技巧**: "How to [Use/Maintain] Your [Product]"
4. **品类专题**: "Complete Guide to [Category] Products"

#### 关键词策略
- **主关键词**: 品类名 + 地区 (e.g., "kitchen gadgets Australia")
- **长尾关键词**: 具体产品 + 购买意图 (e.g., "best vegetable chopper buy online")
- **地区关键词**: 针对各地区优化

---

## 7. 开发计划

### Phase 1: 基础框架 (1-2周)
- [x] 项目初始化 (Next.js 14 + TypeScript)
- [ ] Payload CMS 集成
- [ ] Tailwind CSS 配置
- [ ] 多地区路由设置
- [ ] 基础布局组件 (Header, Footer, Navigation)
- [ ] 首页开发

### Phase 2: 产品功能 (1-2周)
- [ ] 产品数据模型
- [ ] 品类页面
- [ ] 产品详情页
- [ ] 产品列表组件
- [ ] 筛选/排序功能
- [ ] 初始产品数据 (2个产品)

### Phase 3: 购物功能 (1周)
- [ ] 购物车状态管理
- [ ] 购物车页面
- [ ] 结账流程 (无支付)
- [ ] 订单数据模型

### Phase 4: 博客/内容 (1周)
- [ ] 博客数据模型
- [ ] 博客列表页
- [ ] 博客文章页
- [ ] 初始博客内容

### Phase 5: SEO 优化 (1周)
- [ ] Meta 标签组件
- [ ] 结构化数据
- [ ] 站点地图生成
- [ ] hreflang 实现
- [ ] 性能优化

### Phase 6: 支付集成 (预留)
- [ ] Stripe 接入
- [ ] 支付流程
- [ ] 订单确认

### Phase 7: 选品工具整合 (预留)
- [ ] 与 aunz-product-finder 数据同步
- [ ] 产品导入功能

---

## 8. 验收标准

### 8.1 性能指标
- [ ] Lighthouse Performance 分数 > 90
- [ ] Lighthouse SEO 分数 > 95
- [ ] Lighthouse Accessibility 分数 > 90
- [ ] 首屏加载时间 (FCP) < 1.5s
- [ ] 页面完全加载时间 < 3s
- [ ] Core Web Vitals 全部达标

### 8.2 功能验收
- [ ] 多地区切换正常工作
- [ ] 产品 CRUD 流程完整
- [ ] 购物车功能正常
- [ ] 博客内容管理正常
- [ ] 响应式设计适配所有设备

### 8.3 SEO 验收
- [ ] 所有页面有正确的 Meta 标签
- [ ] hreflang 标签正确实现
- [ ] 结构化数据通过 Google 验证
- [ ] 站点地图正确生成
- [ ] robots.txt 正确配置

### 8.4 代码质量
- [ ] TypeScript 无类型错误
- [ ] ESLint 无警告
- [ ] 代码格式统一 (Prettier)
- [ ] 组件有适当的注释

---

## 9. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| Payload CMS 学习曲线 | 中 | 参考官方文档，从简单功能开始 |
| SEO 效果不理想 | 高 | 持续监控，优化内容策略 |
| 支付集成复杂 | 中 | 先完成无支付版本，支付作为后续阶段 |
| 多地区数据同步 | 中 | 设计好数据模型，使用地区配置 |

---

## 10. 参考资源

- [Next.js 14 文档](https://nextjs.org/docs)
- [Payload CMS 文档](https://payloadcms.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [next-intl 文档](https://next-intl-docs.vercel.app/)
- [Schema.org 产品标记](https://schema.org/Product)
- [Google SEO 指南](https://developers.google.com/search/docs)
