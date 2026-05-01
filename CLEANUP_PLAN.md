# 项目全量清理计划 (Super Cleanup)

> 部署环境：Vercel (Serverless)
> 执行方式：逐 Phase 推进，每步完成后验证 lint + build

---

## Phase 1：工具链与依赖清理 ✦ 无风险，纯清理

**分支：** `feature/cleanup/phase1-tooling`

### 1.1 统一 ESLint 配置

**问题：** `.eslintrc.json`（旧格式）与 `eslint.config.mjs`（ESLint 9）同时存在，规则冲突。

- 删除 `.eslintrc.json`
- 将其自定义规则迁移到 `eslint.config.mjs`：
  ```js
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-img-element': 'off',
  }
  ```

### 1.2 卸载冗余依赖

逐个 grep 确认无导入后卸载，每次 `npm run build` 验证：

| 包 | 卸载原因 |
|---|---|
| `gsap` | 与 `framer-motion` 功能重叠 |
| `swr` | 项目全部手动 fetch，未使用 |
| `@tailwindcss/line-clamp` | Tailwind v4 已内置，此插件废弃 |
| `postcss-theme-ui` | 项目未使用 |
| `swiper` | 验证无导入后卸载 |
| `recharts` | 验证无导入后卸载 |
| `@headlessui/react` | 已用 Radix UI 替代；验证无导入后卸载 |
| `react-spinners` | 有自定义 Loader；验证无导入后卸载 |

---

## Phase 2：安全修复 ✦ 需测试

**分支：** `feature/cleanup/phase2-security`

### 2.1 LeetCode 代理添加查询白名单

**问题：** `/api/leetcode` 将任意 GraphQL query 转发给 LeetCode，可被滥用。

**文件：** `src/app/api/leetcode/route.ts`

```typescript
if (!body?.query?.includes('matchedUser')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 2.2 next.config.ts 添加启动时 env 校验

**文件：** `next.config.ts`

```typescript
const required = ['MONGODB_URI', 'STEAM_API_KEY', 'STEAM_ID'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
}
```

### 2.3 API 限流

**注意：** Vercel Serverless 无法用 in-memory Map 做进程级限流。

**方案：**
- 在路由中校验 `Origin` header，拒绝非本站来源请求
- Vercel Dashboard 开启内置 DDoS Protection
- 后续可接入 Upstash Redis 实现真正的 rate limiting

---

## Phase 3：数据获取架构重构 ✦ 改动最大

**分支：** `feature/cleanup/phase3-data-architecture`

### 架构决策

| 数据 | 当前 | 目标 | 原因 |
|---|---|---|---|
| Blog 列表/详情 | Client + Zustand + `/api/blog` | **Pure Server Component + 直接查 DB** | 纯展示，无需客户端 JS |
| Projects | Client + Zustand + `/api/projects` | **Pure Server Component + 直接查 DB** | 纯展示 |
| About | Client + Zustand + `/api/about` | **Pure Server Component + 直接查 DB** | 纯展示 |
| Contact | Client + Zustand + `/api/contact` | **Pure Server Component + 直接查 DB** | 纯展示 |
| LeetCode | Client + Zustand + `/api/leetcode` | **TanStack Query** (server prefetch + client refresh) | 有 Refresh 按钮 |
| Steam | Client + Zustand + `/api/steam` | **TanStack Query** (server prefetch + client refresh) | 有 Refresh 按钮，成就按需加载 |
| Translations | Zustand | **保留 Zustand** | UI 状态，语言切换 |

### 3.1 安装 TanStack Query

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 3.2 创建 QueryClient 基础设施

**新文件：** `src/lib/queryClient.ts`
```typescript
// Server-side: 每次请求创建新实例（Vercel serverless 安全）
export function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } })
}

// Client-side: 单例
let browserQueryClient: QueryClient | undefined
export function getQueryClient() {
  if (isServer) return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}
```

**新文件：** `src/components/providers/QueryProvider.tsx` (Client Component)
```typescript
// 包裹 ReactQueryDevtools + 传递 queryClient
```

**更新：** `src/app/layout.tsx` → 加入 `<QueryProvider>`

### 3.3 迁移 Blog / Projects / About / Contact 到 Server Components

**操作：**
1. 页面组件去掉 `'use client'`，改为 async Server Component
2. 在页面层直接 `await dbConnect()` + 调用 Model 查询（复用 `src/lib/*/server.ts` 已有的函数）
3. 将数据作为 props 传递给子 UI 组件
4. 删除对应的 Zustand store：`blogStore.ts`、`projectStore.ts`、`aboutStore.ts`、`contactStore.ts`

**顺带修复的 Bug：**
- `ProjectListPage`：fetch 没有依赖数组，每次 render 都触发
- `ContactPage`：同样的 bug

### 3.4 迁移 LeetCode / Steam 到 TanStack Query

**新文件：** `src/lib/queries/leetcode.ts`
```typescript
export const leetcodeQueryKey = ['leetcode']
export const leetcodeQueryFn = () => fetch('/api/leetcode', { method: 'POST', ... }).then(r => r.json())
```

**新文件：** `src/lib/queries/steam.ts`
```typescript
export const steamQueryKey = ['steam']
export const steamQueryFn = () => fetch('/api/steam').then(r => r.json())
// achievements 按需加载：queryKey: ['steam', 'achievements', appid, locale]
```

**更新 Home page (`src/app/home/page.tsx`)：**
```typescript
// 改为 async Server Component
export default async function Home() {
  const queryClient = makeQueryClient()
  // Server prefetch: 首屏无 loading
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: steamQueryKey, queryFn: getSteamStats }),
    queryClient.prefetchQuery({ queryKey: leetcodeQueryKey, queryFn: getLeetCodeStats }),
  ])
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  )
}
```

**更新 SteamCard / LeetCodeCard：** 用 `useQuery` 替换 `useSteamStore` / `useLeetCodeStore`

**删除：** `src/store/leetcode.ts`、`src/store/steam.ts`

---

## Phase 4：性能 & 代码质量 ✦ 低风险

**分支：** `feature/cleanup/phase4-perf-quality`

### 4.1 API 路由缓存（仅 Steam / LeetCode 保留 API route）

Phase 3 后，Blog/Projects/About/Contact 不再有 API route 被客户端调用。
Steam 和 LeetCode API route 加缓存：

```typescript
// /api/steam/route.ts 和 /api/leetcode/route.ts
export const revalidate = 3600;
```

### 4.2 修复 useIsMobile SSR 初始值

**文件：** `src/lib/hooks/useIsMobile.ts`

```typescript
const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
```

### 4.3 Blog 模型添加复合索引

**文件：** `src/models/Blog.ts`

```typescript
BlogSchema.index({ slug: 1, language: 1 });
```

### 4.4 CardImage 硬编码中文修复

**文件：** `src/components/ui/Card.tsx`

`"将鼠标悬停在左侧游戏上预览大图"` → 改为 `placeholder` prop

### 4.5 加强 Translation Store 类型

**文件：** `src/store/translations.ts`

消除隐式 `any`，确保 `t()` 返回类型明确。

### 4.6 修复 `react-hooks/set-state-in-effect` 反模式

> 由 Phase 3 启动时 lint 修复暴露。eslint-plugin-react-hooks v7 新规则当前在 `eslint.config.mjs` 中降为 `warn`，本节做掉后改回 `error`。

**4.6.1 `src/components/features/ControlPanel/ThemeSwitch.tsx:10`**

```tsx
useEffect(() => { setMounted(true); }, []);
```

经典 SSR mounted hack。改用 `next/dynamic({ ssr: false })` 包裹组件，或 `useSyncExternalStore` 暴露挂载状态。

**4.6.2 `src/components/achievements/AchievementsPageMobile/index.tsx:48`**

```tsx
useEffect(() => { setModalPage(1); }, [selectedAppId]);
```

派生状态反模式：把 `setModalPage(1)` 移到 `selectedAppId` 变更对应的事件 handler 中（事件驱动而非 effect 驱动）。

---

## Phase 5：工程化补全 ✦ 长期收益

**分支：** `feature/cleanup/phase5-engineering`

### 5.1 添加 Vitest 测试框架

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

新建 `vitest.config.ts`，`package.json` 添加 `"test": "vitest"` 脚本。

### 5.2 Parser 单元测试

| 测试文件 | 覆盖函数 |
|---|---|
| `src/lib/blog/parser.test.ts` | `parseBlogs()` |
| `src/lib/about/parser.test.ts` | `parseAboutData()` |
| `src/lib/project/parser.test.ts` | `parseProjects()` |
| `src/lib/leetcode/parser.test.ts` | `parseLeetCodeStats()` |
| `src/lib/achievements/parser.test.ts` | `filterGamesByPlaytime()`, `sortAchievementsByStatusAndRarity()` |

### 5.3 GitHub Actions CI

**新文件：** `.github/workflows/ci.yml`

Push / PR 时自动执行 lint → build → test，构建失败阻断合并。

---

## 分支管理

| 分支名 | 内容 |
|---|---|
| `feature/cleanup/phase1-tooling` | ESLint 整合 + 依赖清理 |
| `feature/cleanup/phase2-security` | LeetCode 白名单 + env 校验 + 限流 |
| `feature/cleanup/phase3-data-architecture` | Server Components + TanStack Query |
| `feature/cleanup/phase4-perf-quality` | 缓存 + useIsMobile + 索引 + 代码质量 |
| `feature/cleanup/phase5-engineering` | Vitest + 单元测试 + GitHub Actions CI |

---

## 执行检查清单

```
[ ] Phase 1.1  删除 .eslintrc.json，迁移规则 → npm run lint ✓
[ ] Phase 1.2  卸载冗余依赖 → npm run build ✓

[ ] Phase 2.1  LeetCode 代理白名单
[ ] Phase 2.2  next.config.ts env 启动校验
[ ] Phase 2.3  Origin header 校验

[ ] Phase 3.1  安装 TanStack Query
[ ] Phase 3.2  创建 QueryClient 基础设施 + QueryProvider
[ ] Phase 3.3  Blog/Projects/About/Contact → Server Components，删除 4 个 Zustand store
[ ] Phase 3.4  LeetCode/Steam → TanStack Query + server prefetch，删除 2 个 Zustand store

[ ] Phase 4.1  Steam/LeetCode API route revalidate
[ ] Phase 4.2  useIsMobile 初始值修复
[ ] Phase 4.3  Blog 模型复合索引
[ ] Phase 4.4  CardImage placeholder prop
[ ] Phase 4.5  Translation Store 类型加强
[ ] Phase 4.6  set-state-in-effect 反模式修复（ThemeSwitch + AchievementsPageMobile），并把 lint 规则改回 error

[ ] Phase 5.1  安装 Vitest
[ ] Phase 5.2  Parser 单元测试
[ ] Phase 5.3  GitHub Actions CI
```

---

## 每步验证标准

1. `npm run lint` — 无新 error
2. `npm run build` — 构建成功
3. 本地 `npm run dev` — 各页面正常渲染，语言/主题切换正常
4. Phase 5 后：`npm test` — 全部通过
