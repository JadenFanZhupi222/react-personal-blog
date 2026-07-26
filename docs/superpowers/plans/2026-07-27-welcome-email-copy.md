# Welcome Email Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Welcome contact subtitle and make the email control copy the CMS address with localized GSAP success feedback.

**Architecture:** Keep the interaction inside the existing client-side `ContactScene`. GitHub remains a CMS-backed anchor; email becomes a native button that calls a small clipboard helper, updates local copied state, animates a checkmark, and restores its label after 1.8 seconds.

**Tech Stack:** React 19, TypeScript, GSAP, Vitest, Testing Library, Next.js translations.

---

### Task 1: Add localized clipboard interaction tests

**Files:**
- Modify: `src/components/welcome/scenes/ContactScene.test.tsx`
- Modify: `src/lib/translations/server.test.ts`
- Modify: `src/i18n/types.ts`
- Modify: `src/i18n/locales/en.ts`
- Modify: `src/i18n/locales/zh.ts`

- [ ] **Step 1: Write the failing component tests**

Extend the mocked contact translations with `copied: 'Copied'`. Assert that the subtitle is absent, the email is a button, clicking it calls `navigator.clipboard.writeText('zhupi222.fan@gmail.com')`, and the button changes to `Copied`. Add a rejected clipboard test that confirms `Copied` is not shown.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```powershell
pnpm test:run -- src/components/welcome/scenes/ContactScene.test.tsx src/lib/translations/server.test.ts
```

Expected: FAIL because email is still a `mailto:` link and `welcome.contact.copied` does not exist.

- [ ] **Step 3: Add the localized copied label**

Add `copied: string` to `Translations['welcome']['contact']`, then add:

```ts
copied: 'Copied'
```

to English and:

```ts
copied: '已复制'
```

to Chinese. Extend the translation test to assert both values.

- [ ] **Step 4: Run the translation test**

Run:

```powershell
pnpm test:run -- src/lib/translations/server.test.ts
```

Expected: PASS.

### Task 2: Implement the always-visible copy button

**Files:**
- Modify: `src/components/welcome/scenes/ContactScene.tsx`
- Test: `src/components/welcome/scenes/ContactScene.test.tsx`

- [ ] **Step 1: Remove subtitle rendering**

Delete the description element and its GSAP query/tween. Keep the title animation unchanged.

- [ ] **Step 2: Add clipboard state and animation**

Add `copied`, a checkmark ref, and a reset timer ref. Implement an async click handler that:

```ts
await navigator.clipboard.writeText(email);
setCopied(true);
requestAnimationFrame(() => {
  if (checkRef.current) {
    gsap.fromTo(
      checkRef.current,
      { scale: 0, rotate: -25, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' },
    );
  }
});
```

Clear any existing timer and restore `copied` to `false` after 1,800 ms. Catch clipboard failures without entering the success state. Clear the timer during component cleanup.

- [ ] **Step 3: Render GitHub and email with distinct semantics**

Render GitHub as the existing external anchor. Render email as:

```tsx
<button type="button" onClick={copyEmail} aria-live="polite">
  {copied ? (
    <>
      <span ref={checkRef} aria-hidden>✓</span>
      {t.welcome.contact.copied}
    </>
  ) : (
    t.welcome.contact.platforms[1]
  )}
</button>
```

Reuse the existing contact-control classes so both controls remain visually consistent.

- [ ] **Step 4: Run focused tests**

Run:

```powershell
pnpm test:run -- src/components/welcome/scenes/ContactScene.test.tsx src/lib/translations/server.test.ts
```

Expected: PASS.

- [ ] **Step 5: Run full verification**

Run:

```powershell
pnpm test:run
pnpm typecheck
pnpm lint
$env:PAYLOAD_SECRET='build-verification-only-not-production'; pnpm build
```

Expected: all commands exit successfully.

- [ ] **Step 6: Verify the local preview**

Restart the development server on port 3100 after the production build, refresh `/`, and confirm:

- the subtitle is absent;
- GitHub points to `https://github.com/JadenFanZhupi222`;
- clicking Email displays the animated localized copied state;
- the page has no horizontal scrollbar.

- [ ] **Step 7: Commit**

```powershell
git add -- src/components/welcome/scenes/ContactScene.tsx src/components/welcome/scenes/ContactScene.test.tsx src/i18n/types.ts src/i18n/locales/en.ts src/i18n/locales/zh.ts src/lib/translations/server.test.ts
git commit -m "feat: add welcome email copy feedback"
```
