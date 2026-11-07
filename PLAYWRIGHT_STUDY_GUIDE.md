# Playwright Test Automation Study Guide

A comprehensive reference covering core Playwright architecture, modern locator strategies, auto-waiting mechanics, web-first assertions, Page Object Model (POM), and advanced testing workflows.

---

## Table of Contents
1. [Setup, Installation & Core Architecture](#1-setup-installation--core-architecture)
2. [Anatomy of a Playwright Test & Lifecycle Hooks](#2-anatomy-of-a-playwright-test--lifecycle-hooks)
3. [Modern Locator Strategies (User-Facing vs. Technical)](#3-modern-locator-strategies)
4. [Actions & Auto-Waiting Mechanics](#4-actions--auto-waiting-mechanics)
5. [Web-First Assertions vs. Generic Assertions](#5-web-first-assertions-vs-generic-assertions)
6. [Asynchronous Execution & The `await` Golden Rule](#6-asynchronous-execution--the-await-golden-rule)
7. [Handling Complex Web Scenarios (iFrames, Tabs, Alerts & Network)](#7-handling-complex-web-scenarios)
8. [Page Object Model (POM) Design Pattern](#8-page-object-model-pom-design-pattern)
9. [Playwright CLI, Tooling & Debugging Workflows](#9-playwright-cli-tooling--debugging-workflows)
10. [Configuration (`playwright.config.ts`) & Best Practices](#10-configuration-and-best-practices)

---

## 1. Setup, Installation & Core Architecture

### Package Installation (`npm install`) vs. Browser Binaries (`playwright install`)

Setting up Playwright involves two distinct installation layers:

```
+-------------------------------------------------------------------------+
| Layer 1: Node Packages (Local to project: ./node_modules)              |
|          Command: npm install (or npm i)                                |
|          Installs: @playwright/test runner, test APIs, TypeScript types |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| Layer 2: Dedicated Browser Binaries (Global OS Cache)                  |
|          Command: npx playwright install                                |
|          Downloads: Headless-ready Chromium, Firefox, WebKit            |
|          Location (Windows): %LOCALAPPDATA%\ms-playwright               |
+-------------------------------------------------------------------------+
```

#### 1. Node Packages (`npm install`)
* Reads `package.json` and downloads `@playwright/test` into your local `node_modules/` folder.
* Generates/updates `package-lock.json` to lock dependency versions.
* **Run whenever:** You clone a project, pull dependency changes, or start a new repository.

#### 2. Browser Binaries (`npx playwright install`)
* Downloads dedicated browser binaries for **Chromium**, **Firefox**, and **WebKit**.
* Stored **globally on your operating system**, outside your project folder:
  * **Windows:** `C:\Users\<User>\AppData\Local\ms-playwright`
  * **macOS:** `~/Library/Caches/ms-playwright`
  * **Linux:** `~/.cache/ms-playwright`

---

### Why Doesn't Playwright Use Your Personal Desktop Browsers?

Even if Google Chrome, Edge, or Firefox are already installed on your PC, Playwright relies on its own dedicated binaries:

1. **Clean, Deterministic Environment (No "Dirty" Profiles):**
   * Personal desktop browsers contain extensions, ad-blockers, history, saved cookies, and cached authentication that cause automated tests to fail unpredictably.
   * Playwright browsers launch with a 100% clean, fresh profile every single time.
2. **Apple Safari (WebKit) on Windows & Linux:**
   * Apple does not build Safari for Windows. Playwright bundles an open-source, compiled build of **WebKit** for Windows, allowing you to test Safari rendering and behaviors without needing a Mac.
3. **Controlled & Patched Automation Builds:**
   * Automatic background updates to desktop Chrome can silently break test automation. Playwright pins exact, heavily-tested builds optimized for high-speed bi-directional WebSocket communication.

---

### Global Browser Caching: Do You Need to Install Browsers Every Time?

**No.** Because Playwright stores browser binaries in a global cache (`%LOCALAPPDATA%\ms-playwright`):
* **Reused Across Projects:** If you already ran `npx playwright install` for a given Playwright version on your PC, any other project using that version will automatically reuse those exact same browsers.
* **When you actually need to run `npx playwright install`:**
  1. On a brand-new computer that has never run Playwright before.
  2. Inside CI/CD runners (GitHub Actions, GitLab CI, Jenkins).
  3. When you upgrade `@playwright/test` to a newer version that requires updated browser builds.

---

### Recommended IDE Setup: "Playwright Test for VSCode" Extension

If you are developing in **VS Code** or **Google Antigravity IDE** (which is built on the VS Code architecture), it is strongly recommended to install the official Microsoft extension:

* **Extension Name:** **Playwright Test for VSCode** (Extension ID: `ms-playwright.playwright`)
* **How to install:** Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>, search for `Playwright Test for VSCode`, and click **Install**.

#### Key Features Provided by the Extension:
1. **One-Click Run & Debug:** Adds clickable green "Play" buttons directly in the editor gutter next to every `test()` and `test.describe()` block.
2. **Interactive Breakpoints:** Click next to line numbers to set breakpoints. Run tests in debug mode to inspect variables and DOM state mid-test.
3. **Dedicated Testing Sidebar:** Adds a flask icon (Testing view) showing your complete test hierarchy with live pass/fail badges.
4. **"Show Browser" Mode:** Toggle "Show Browser" in the testing panel to see tests execute headed in real time during development.
5. **"Record at Cursor" & "Pick Locator":** Click "Record at cursor" to interact with a page and have Playwright write the code into your file automatically.

---

### Why Playwright is Different
Traditional automation tools (like Selenium WebDriver) operate via HTTP commands through intermediary executable drivers (e.g., `chromedriver.exe`). Playwright directly drives browsers over a **single bi-directional WebSocket connection** via native browser debugging protocols (Chrome DevTools Protocol for Chromium, and equivalent internal protocols for Firefox and WebKit).

* **No intermediary driver binary required.**
* **Extremely low latency:** Near-instant command execution and DOM event subscription.
* **True multi-browser support:** Chromium (Chrome, Edge), WebKit (Safari), and Firefox from a unified API.

---

### The Playwright Trinity: `Browser` $\rightarrow$ `BrowserContext` $\rightarrow$ `Page`

```
  +-------------------------------------------------------------+
  |                        Browser                              |
  |  (Single OS process: Chromium / Firefox / WebKit)           |
  |                                                             |
  |   +--------------------------+   +----------------------+   |
  |   |     BrowserContext 1     |   |   BrowserContext 2   |   |
  |   | (Incognito session #1)   |   | (Incognito #2)       |   |
  |   |                          |   |                      |   |
  |   |   +--------+  +--------+ |   |   +--------+         |   |
  |   |   | Page 1 |  | Page 2 | |   |   | Page 3 |         |   |
  |   |   | (Tab)  |  | (Tab)  | |   |   | (Tab)  |         |   |
  |   |   +--------+  +--------+ |   |   +--------+         |   |
  |   +--------------------------+   +----------------------+   |
  +-------------------------------------------------------------+
```

| Entity | Description | Creation Speed | Isolation Level |
| :--- | :--- | :--- | :--- |
| **`Browser`** | The heavyweight OS browser process. | Slow (~1s) | Process level |
| **`BrowserContext`** | An isolated, incognito-like in-memory session. Shares browser binary but has dedicated cookies, cache, local storage, and session tokens. | **Super fast (~2-10 ms)** | Storage & session level |
| **`Page`** | A single browser tab or window inside a context. | Fast (~10 ms) | DOM & Frame level |

> 💡 **Why this matters for tests:**
> In Playwright, you do **not** restart the browser between tests. Playwright launches the browser once and creates a brand-new **`BrowserContext`** for each test. This gives **100% test isolation** with zero cross-contamination at maximum speed.

#### Multi-User Testing Example:
Because contexts are isolated, you can simulate two different logged-in users (e.g., Admin and Customer) in the exact same test:

```typescript
import { test } from '@playwright/test';

test('admin can see changes made by user', async ({ browser }) => {
  // Context 1: Admin
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://app.example.com/login');
  // Login as admin...

  // Context 2: Customer (completely independent session/cookies!)
  const customerContext = await browser.newContext();
  const customerPage = await customerContext.newPage();
  await customerPage.goto('https://app.example.com/login');
  // Login as customer...
});
```

---

## 2. Anatomy of a Playwright Test & Lifecycle Hooks

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('verify user can log in successfully', async ({ page }) => {
  // 1. Arrange (Navigate)
  await page.goto('https://example.com/login');

  // 2. Act (Perform actions)
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 3. Assert (Verify outcome)
  await expect(page).toHaveURL('https://example.com/inventory');
  await expect(page.getByText('Products')).toBeVisible();
});
```

---

### Built-in Test Fixtures
Playwright passes pre-configured test fixtures into your test function via object destructuring:

| Fixture | Type | Description |
| :--- | :--- | :--- |
| **`page`** | `Page` | Isolated tab created automatically for this test. |
| **`context`** | `BrowserContext` | The isolated context containing the test's `page`. |
| **`browser`** | `Browser` | The shared browser instance. |
| **`request`** | `APIRequestContext` | Lightweight HTTP client for direct API testing. |

---

### Test Lifecycle Hooks

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Feature', () => {

  // Runs ONCE before all tests in this describe block (e.g., database seed, test setup)
  test.beforeAll(async () => {
    console.log('--- Starting Cart Suite ---');
  });

  // Runs BEFORE EACH test in this describe block (e.g., auth, navigation)
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });

  // Runs AFTER EACH test (e.g., state cleanup, logging)
  test.afterEach(async ({ page }) => {
    console.log(`Finished test on: ${page.url()}`);
  });

  // Runs ONCE after all tests in this describe block complete
  test.afterAll(async () => {
    console.log('--- Completed Cart Suite ---');
  });

  test('add item to cart', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.locator('.cart-badge')).toHaveText('1');
  });

  test('remove item from cart', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.locator('.cart-badge')).toBeHidden();
  });
});
```

---

### Test Modifiers & Annotations

* **`test.only(...)`** $\rightarrow$ Runs only this specific test (handy during development).
* **`test.skip(...)`** $\rightarrow$ Skips the test unconditionally or based on a condition (`test.skip(browserName === 'webkit')`).
* **`test.fixme(...)`** $\rightarrow$ Marks test as broken; will not be executed.
* **`test.fail(...)`** $\rightarrow$ Expects the test to fail. If it passes, Playwright will report an error.
* **`test.slow(...)`** $\rightarrow$ Multiplies the default test timeout by 3.
* **Tags (`@smoke`, `@regression`)** $\rightarrow$ Organize tests by tags in the title:
  ```typescript
  test('checkout workflow @smoke @regression', async ({ page }) => { ... });
  ```
  Run tagged tests from CLI: `npx playwright test --grep "@smoke"`

---

## 3. Modern Locator Strategies

Playwright strongly recommends **User-Facing Locators**. These mirror how real users and assistive technology (screen readers) perceive and navigate the page, making your test suite resilient to CSS refactors and DOM restructuring.

### Locator Priority Guide

| Priority | Locator Method | Purpose / When to Use | Example |
| :---: | :--- | :--- | :--- |
| **1 (Best)** | `page.getByRole()` | Buttons, links, headings, checkboxes, inputs by accessible role & name. | `page.getByRole('button', { name: 'Submit' })` |
| **2** | `page.getByLabel()` | Form inputs with associated `<label>` elements. | `page.getByLabel('Email address')` |
| **3** | `page.getByPlaceholder()` | Form inputs with a placeholder attribute. | `page.getByPlaceholder('Search products...')` |
| **4** | `page.getByText()` | Non-interactive text (paragraphs, titles, alerts). | `page.getByText('Order confirmed')` |
| **5** | `page.getByAltText()` | Images and graphic elements by `alt` text. | `page.getByAltText('Company Logo')` |
| **6** | `page.getByTitle()` | Elements with a `title` tooltip attribute. | `page.getByTitle('Close window')` |
| **7** | `page.getByTestId()` | Dedicated QA test attributes (`data-testid`). | `page.getByTestId('checkout-btn')` |
| **8 (Fallback)** | `page.locator('css/xpath')` | Complex CSS selectors or XPath when no accessibility hooks exist. | `page.locator('div.card >> span.price')` |

---

### Detailed Locator Syntax

#### 1. `getByRole` (The Gold Standard)
Roles represent semantic HTML elements (`button`, `link`, `heading`, `checkbox`, `textbox`, `combobox`, `dialog`, etc.).
```typescript
// Button with visible text "Save Changes"
page.getByRole('button', { name: 'Save Changes' });

// Exact match vs substring (default is case-insensitive substring)
page.getByRole('button', { name: 'Submit', exact: true });

// Headings with specific level (<h1> vs <h2>)
page.getByRole('heading', { level: 1, name: 'Welcome' });

// Checkbox in checked state
page.getByRole('checkbox', { name: 'Subscribe to newsletter', checked: true });
```

#### 2. `getByLabel`
Automatically links to `<input>` associated via `<label for="...">` or wrapping `<label>`.
```typescript
// <label for="email">User Email</label><input id="email" />
page.getByLabel('User Email');
```

#### 3. `getByPlaceholder`
```typescript
// <input placeholder="e.g. john@doe.com" />
page.getByPlaceholder('e.g. john@doe.com');
```

#### 4. `getByText`
```typescript
// Matches exact text or substring
page.getByText('Payment successful!');
page.getByText('Total: $99.00', { exact: true });
```

#### 5. `getByTestId`
By default matches `data-testid="..."` (can be configured in `playwright.config.ts`).
```typescript
page.getByTestId('shopping-cart-badge');
```

---

### Locator Chaining & Filtering

#### Chaining Locators (Drilling Down)
You can chain locators to scope queries inside containers:
```typescript
const productCard = page.locator('.product-card').filter({ hasText: 'iPhone 15' });
await productCard.getByRole('button', { name: 'Add to Cart' }).click();
```

#### Filtering with `.filter()`
* **By text:** `.filter({ hasText: 'Active' })` or `.filter({ hasNotText: 'Draft' })`
* **By child locator:** `.filter({ has: page.getByRole('button', { name: 'Delete' }) })`

```typescript
// Find the row containing text 'Alice' and click its Edit button
await page.getByRole('row')
  .filter({ hasText: 'Alice' })
  .getByRole('button', { name: 'Edit' })
  .click();
```

---

### Strict Mode & Handling Multiple Elements

By default, Playwright operates in **Strict Mode**. If a locator resolves to **more than one** element when an action is executed, Playwright throws an error:
`Error: strict mode violation: locator('button') resolved to 5 elements`

#### How to resolve multiple elements:
```typescript
const items = page.getByRole('listitem');

// 1. Pick by index
await items.first().click();
await items.last().click();
await items.nth(2).click(); // 0-based index (3rd item)

// 2. Count elements
const count = await items.count();

// 3. Iterate over all elements
for (const item of await items.all()) {
  console.log(await item.textContent());
}
```

---

## 4. Actions & Auto-Waiting Mechanics

### Actionability Checks & Auto-Waiting
Before executing any action (click, fill, check), Playwright **automatically waits** (up to the action timeout, default 30s) for the element to pass actionable states:

| Check | Description | Required by `click()` | Required by `fill()` |
| :--- | :--- | :---: | :---: |
| **Attached** | Element is present in the DOM | Yes | Yes |
| **Visible** | Element has non-empty bounding box & no `display: none` / `visibility: hidden` | Yes | Yes |
| **Stable** | Element is not animating or moving across frames | Yes | Yes |
| **Receives Events** | Not covered by another overlay/backdrop/modal | Yes | No |
| **Enabled** | Element does not have `disabled` attribute | Yes | Yes |
| **Editable** | Element is not read-only | No | Yes |

> ⚠️ **The Anti-Pattern:** Never use `await page.waitForTimeout(5000)` (hard sleep)!
> Hard sleeps cause flaky tests, slow test runs, and mask timing bugs. Rely on Playwright's auto-waiting or explicit condition waits (e.g. `toBeVisible()`).

---

### Core Action Methods

#### Navigation
```typescript
// Wait until DOM is loaded or network is idle
await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
await page.goBack();
await page.reload();
```

#### Click Actions
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('button').dblclick();                          // Double click
await page.getByRole('button').click({ button: 'right' });          // Right click
await page.getByRole('button').click({ modifiers: ['Shift'] });     // Shift + Click
await page.getByRole('button').click({ force: true });              // Bypass actionability checks (use sparingly!)
```

#### Input & Typing (`fill` vs. `pressSequentially`)

| Method | Behavior | Speed | Best For |
| :--- | :--- | :--- | :--- |
| **`.fill('text')`** | Clears field and sets value instantly. Dispatches `input` and `change` events. | Fast (~1ms) | **95% of form fields** (standard textboxes, passwords). |
| **`.pressSequentially('text')`** | Types character-by-character emitting `keydown`, `keypress`, `keyup`. | Slower | Search bars with live debounced auto-complete. |

```typescript
// Recommended for standard inputs:
await page.getByLabel('Username').fill('john_doe');

// For live search inputs where each keystroke triggers an API call:
await page.getByPlaceholder('Search products').pressSequentially('laptop', { delay: 100 });

// Clear an input:
await page.getByLabel('Username').clear();
```

#### Checkboxes, Radio Buttons & Switches
```typescript
// Check and uncheck
await page.getByRole('checkbox', { name: 'Remember me' }).check();
await page.getByRole('checkbox', { name: 'Remember me' }).uncheck();

// Radio selection
await page.getByRole('radio', { name: 'Express Shipping' }).check();
```

#### Dropdowns (`<select>` elements)
```typescript
// Select by value, visible text label, or index
await page.getByLabel('Country').selectOption('US');                     // By value: <option value="US">
await page.getByLabel('Country').selectOption({ label: 'United States' });// By display text
await page.getByLabel('Country').selectOption({ index: 2 });             // By position
```

#### Keyboard & Mouse
```typescript
await page.keyboard.press('Enter');
await page.keyboard.press('Control+A');
await page.keyboard.press('Backspace');

// Hover over a navigation menu
await page.getByRole('link', { name: 'Services' }).hover();
```

#### File Uploads
```typescript
// Single file:
await page.locator('input[type="file"]').setInputFiles('path/to/receipt.pdf');

// Multiple files:
await page.locator('input[type="file"]').setInputFiles(['file1.png', 'file2.png']);

// Remove selected files:
await page.locator('input[type="file"]').setInputFiles([]);
```

---

## 5. Web-First Assertions vs. Generic Assertions

### The Critical Difference: Auto-Retrying

```javascript
// ❌ BAD: Generic Jest/Node Assertion (Evaluates ONCE immediately, does NOT retry)
// If the button takes 100ms to render, this fails immediately!
expect(await page.locator('#status').textContent()).toBe('Success');

// ✅ GOOD: Playwright Web-First Assertion (Auto-retries until condition is met or times out)
await expect(page.locator('#status')).toHaveText('Success');
```

Playwright's web-first assertions poll the DOM repeatedly (every 100ms) until the expected state is reached, or the timeout (default: 5 seconds) expires.

---

### Web-First Assertions Cheatsheet

| Category | Web-First Assertion | What it Verifies |
| :--- | :--- | :--- |
| **Visibility** | `await expect(locator).toBeVisible()` | Element is visible in viewport |
| | `await expect(locator).toBeHidden()` | Element is hidden or removed from DOM |
| **State** | `await expect(locator).toBeEnabled()` | Element is interactive (not disabled) |
| | `await expect(locator).toBeDisabled()` | Element has `disabled` attribute |
| | `await expect(locator).toBeChecked()` | Checkbox / radio is checked |
| | `await expect(locator).toBeEditable()` | Input can be edited |
| | `await expect(locator).toBeFocused()` | Element currently holds focus |
| **Text & Value** | `await expect(locator).toHaveText('Total: $50')` | Matches exact text or regex |
| | `await expect(locator).toContainText('Total')` | Substring match |
| | `await expect(locator).toHaveValue('admin')` | Form input current value |
| | `await expect(locator).toBeEmpty()` | Element or input has no text/value |
| **Attributes** | `await expect(locator).toHaveAttribute('href', '/home')`| Attribute equals expected value |
| | `await expect(locator).toHaveClass(/active/)` | Element contains specific class |
| **List Count** | `await expect(locator).toHaveCount(5)` | Number of matching DOM nodes |
| **Page Level** | `await expect(page).toHaveURL('https://example.com')`| Browser current URL |
| | `await expect(page).toHaveTitle('Dashboard')` | Browser tab title |

---

### Negations & Custom Timeouts

```typescript
// Negate any assertion with .not
await expect(page.getByRole('button', { name: 'Loading' })).not.toBeVisible();
await expect(page.getByRole('button', { name: 'Submit' })).not.toBeDisabled();

// Override default assertion timeout (e.g. for slow network operations)
await expect(page.getByText('Report Generated')).toBeVisible({ timeout: 15000 });
```

---

## 6. Asynchronous Execution & The `await` Golden Rule

### The Golden Rule
> **Every Playwright action, navigation, and web-first assertion returns a JavaScript `Promise` and MUST be prepended with `await`.**

```typescript
// ❌ WRONG: Missing await
test('broken test', async ({ page }) => {
  page.goto('https://example.com');             // Returns Promise<Response | null>
  page.getByRole('button', { name: 'Submit' }).click(); // Returns Promise<void>
  expect(page.getByText('Done')).toBeVisible(); // Returns Promise<void>
  // 💥 JavaScript reaches the end of the test function while promises are still pending!
});

// ✅ CORRECT: Every asynchronous call is awaited
test('solid test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Done')).toBeVisible();
});
```

### What happens when you forget `await`?
1. **Silent False Passes:** The test exits with "Pass" before the click or assertion ever executed.
2. **Race Conditions:** Actions execute out of order (e.g., clicking before the page loaded).
3. **Unhandled Promise Rejections:** Errors get logged after the test runner has already moved on to the next test.

---

## 7. Handling Complex Web Scenarios

### Working with iFrames
Use `page.frameLocator()` to pierce inside `<iframe>` elements without manually switching frames:

```typescript
// Locate the iframe, then locate elements inside it
const paymentFrame = page.frameLocator('iframe#stripe-frame');
await paymentFrame.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
await paymentFrame.getByRole('button', { name: 'Pay Now' }).click();
```

---

### Handling Multiple Tabs / Popups / Windows
When clicking a link opens a new tab (`target="_blank"`), capture the event using `context.waitForEvent('page')`:

```typescript
test('handles new tab popup', async ({ context, page }) => {
  await page.goto('https://example.com');

  // Listen for the new page event BEFORE triggering the action that opens it:
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Open External Docs' }).click(),
  ]);

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Assert on the new page
  await expect(newPage).toHaveTitle(/Documentation/);

  // You can still interact with original page
  await page.bringToFront();
});
```

---

### Handling Native Dialogs (Alerts, Confirms, Prompts)
Playwright **auto-dismisses** dialogs by default so your test doesn't freeze. To accept, dismiss, or check the alert text, register a listener:

```typescript
test('handle alert and confirm dialogs', async ({ page }) => {
  // Setup listener BEFORE triggering the dialog
  page.on('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    console.log(`Dialog type: ${dialog.type()}`); // 'alert', 'confirm', 'prompt'

    // Accept (Click OK):
    await dialog.accept();

    // Or Dismiss (Click Cancel):
    // await dialog.dismiss();

    // Or Provide input into a prompt:
    // await dialog.accept('User input text');
  });

  await page.getByRole('button', { name: 'Delete Account' }).click();
});
```

---

### Network Interception & API Mocking
Intercept HTTP requests to mock backend responses or inspect headers:

```typescript
test('mock API response', async ({ page }) => {
  // Mock GET request to /api/products
  await page.route('**/api/products', async (route) => {
    const mockData = [
      { id: 1, name: 'Mocked Super Phone', price: 99 }
    ];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData),
    });
  });

  await page.goto('https://example.com/products');
  await expect(page.getByText('Mocked Super Phone')).toBeVisible();
});
```

---

## 8. Page Object Model (POM) Design Pattern

The **Page Object Model** is an architectural pattern that abstracts web pages into reusable class objects. It separates **test logic** from **page structure / locators**.

### Architecture
```
      [ Test Specs ]
      (e.g., login.spec.ts, cart.spec.ts)
             │
             ▼ uses methods
      [ Page Objects ]
      (e.g., LoginPage.ts, CartPage.ts)
             │
             ▼ encapsulates
      [ Playwright Page & Locators ]
```

---

### Step 1: Create the Page Object Class

```typescript
// pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Define locators inside the constructor
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.locator('.error-banner');
  }

  // Navigation action
  async navigate() {
    await this.page.goto('/login');
  }

  // High-level business action
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Page assertions
  async assertLoginError(expectedText: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
```

---

### Step 2: Use the Page Object in Tests

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('successful login', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_password');
    await expect(page).toHaveURL('/dashboard');
  });

  test('failed login with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'wrong_pass');
    await loginPage.assertLoginError('Invalid username or password');
  });
});
```

---

## 9. Playwright CLI, Tooling & Debugging Workflows

### Essential CLI Commands

| Goal | Command | Description |
| :--- | :--- | :--- |
| **Run All Tests** | `npx playwright test` | Runs all tests headless across all configured browsers. |
| **Run Headed** | `npx playwright test --headed` | Shows browser UI during execution. |
| **Run Specific File** | `npx playwright test tests/login.spec.ts` | Runs only tests in target file. |
| **Run Specific Browser** | `npx playwright test --project=chromium` | Runs tests only in Chromium/Chrome. |
| **Interactive UI Mode** | `npx playwright test --ui` | **Best development tool:** Time-travel debugging, watch mode, locator picker. |
| **Debug Mode** | `npx playwright test --debug` | Opens Playwright Inspector to step through tests line-by-line. |
| **Code Generator** | `npx playwright codegen https://example.com` | Records your browser clicks/inputs and generates Playwright code! |
| **Show HTML Report** | `npx playwright show-report` | Opens the rich HTML report of the last test run. |
| **Inspect Trace File** | `npx playwright show-trace trace.zip` | Explores recorded DOM snapshots, network requests, and console logs. |

---

### Interactive UI Mode (`npx playwright test --ui`) - The Developer Cockpit

Playwright's **UI Mode** is the primary visual environment for authoring, running, and debugging tests locally. It integrates the test runner, trace viewer, live network inspector, and locator generator into a unified interactive desktop application.

#### Launching UI Mode
```bash
npx playwright test --ui
```

#### Core Capabilities & Features

1. **Time-Travel Debugging:**
   * Step through every action (`goto`, `click`, `fill`, `expect`) in your test suite.
   * Hover over the timeline scrubber at the top to see the exact state of the page at any millisecond.
   * View split **Before** and **After** DOM snapshots to see exactly how an element changed after a click or keystroke.

2. **Watch Mode (Eye Icon):**
   * Click the **Watch (Eye)** icon next to an individual test, a `describe` block, or an entire test file.
   * Whenever you save changes in your code editor, Playwright automatically re-runs the watched tests in milliseconds.

3. **Pick Locator Tool:**
   * Click the **Pick Locator** button in the preview pane.
   * Hover over any live element on the rendered page and click it. Playwright automatically suggests and copies the optimal, accessible locator (e.g., `page.getByRole('button', { name: 'Submit' })`).

4. **Action, Network & Console Telemetry:**
   * **Action Tab:** Shows action duration, scroll position, and which auto-waiting checks passed (attached, visible, stable, enabled).
   * **Network Tab:** Inspect every network request triggered by the application, including HTTP status codes, query parameters, request bodies, and JSON responses.
   * **Console Tab:** Shows real browser `console.log`, warnings, and errors emitted by the web page.
   * **Source Tab:** Highlights the exact line in your test file that executed each step.

5. **Multi-Browser & Status Filtering:**
   * Run tests simultaneously or selectively against **Chromium**, **Firefox**, and **WebKit** using the project filter checkboxes.
   * Filter tests by status (`Passed`, `Failed`, `Skipped`).

---

#### 💡 Troubleshooting: "No tests found" in UI Mode
If you launch UI Mode and the test sidebar appears empty:
1. **Wrong Working Directory:** Run `pwd` in your terminal. You must be in the folder containing `playwright.config.ts`. If you are in a parent or sub-folder, `cd` to the project root.
2. **Active Text Filter:** Check the text search bar at the top of the test list. If there is an accidental character or space, clear it.
3. **Unchecked Projects:** Under the search bar, verify that at least one project checkbox (`chromium`, `firefox`, `webkit`) is checked.
4. **Diagnostic Command:** Run `npx playwright test --list` in the terminal to verify Playwright discovers your spec files without syntax errors.

---

### The 7 Debugging Modes in Playwright

Playwright provides a dedicated debugging mode for every stage of development, from real-time step-by-step debugging to post-mortem CI failure analysis.

---

#### Mode 1: Interactive UI Mode (`npx playwright test --ui`)
* **Best for:** Everyday test development, time-travel scrubbing, watch mode, and picking locators.
* **How it works:** Opens the full Playwright desktop app where you can see DOM before/after snapshots and re-run tests on file save.
* **Command:**
  ```bash
  npx playwright test --ui
  ```

---

#### Mode 2: Playwright Inspector (`--debug`)
* **Best for:** Stepping through test execution line-by-line with a live browser and inspector panel.
* **How it works:** Automatically launches headed browsers, sets default timeout to infinity, and opens the Playwright Inspector. You can click **"Step over" (F10)**, **"Resume" (F5)**, or edit and evaluate locators live in the page.
* **Command:**
  ```bash
  # Debug all tests:
  npx playwright test --debug

  # Debug a specific file:
  npx playwright test tests/example.spec.ts --debug

  # Debug a specific test by line number:
  npx playwright test tests/example.spec.ts:10 --debug
  ```

---

#### Mode 3: Programmatic Pause (`await page.pause()`)
* **Best for:** Pausing execution at a specific line without running the entire suite in debug mode.
* **How it works:** Insert `await page.pause()` right before the failing step. Playwright will run at normal speed until it hits that line, then pause and open the Inspector.
* **Example:**
  ```typescript
  test('debug specific step', async ({ page }) => {
    await page.goto('https://example.com');
    await page.getByRole('button', { name: 'Filter' }).click();

    // 🛑 Execution freezes here! Inspector opens automatically:
    await page.pause();

    await page.getByRole('button', { name: 'Submit' }).click();
  });
  ```

---

#### Mode 4: VS Code / Antigravity IDE Debugger (Native Breakpoints)
* **Best for:** Debugging both Playwright actions and complex TypeScript/JavaScript variable logic.
* **How it works:**
  1. Click in the margin next to any line number in your test file to set a **red breakpoint**.
  2. Right-click the green "Play" arrow in the gutter and choose **Debug Test** (or click the bug icon).
  3. Use the standard IDE debug toolbar to step into/over code, view local variables in the Scope pane, and evaluate expressions in the Debug Console.

---

#### Mode 5: Trace Viewer (Post-Mortem Analysis)
* **Best for:** Investigating flaky or failing tests from CI/CD pipelines without re-running them locally.
* **How it works:** Records a `.zip` file containing every DOM snapshot, network call, console log, and screenshot.
* **Commands:**
  ```bash
  # 1. Run test and force trace recording:
  npx playwright test --trace on

  # 2. View the recorded trace:
  npx playwright show-trace test-results/<test-folder>/trace.zip

  # 3. Or view via HTML report:
  npx playwright show-report
  ```
  *(Alternatively, drag-and-drop `trace.zip` into [trace.playwright.dev](https://trace.playwright.dev)).*

---

#### Mode 6: Headed Mode with Slow-Motion (`--headed` & `--slowmo`)
* **Best for:** Visually watching the test execute in a real browser at human speed.
* **How it works:** Runs the real browser visibly and introduces an artificial delay (in milliseconds) between every action.
* **Command:**
  ```bash
  # Slow down each action by 500ms (half a second):
  npx playwright test --headed --slowmo 500
  ```
  *(Can also be set in `playwright.config.ts` under `use: { launchOptions: { slowMo: 500 } }`).*

---

#### Mode 7: Browser DevTools Console (`PWDEBUG=console`)
* **Best for:** Interacting with Playwright's locator engine directly inside the real Chrome DevTools console (F12).
* **How it works:** Exposes a global `playwright` object in the browser console.
* **Command (PowerShell):**
  ```powershell
  $env:PWDEBUG="console"
  npx playwright test --headed
  ```
* **Inside the browser F12 Console, you can run:**
  ```javascript
  playwright.$('text=Submit')
  playwright.locator('button.primary')
  playwright.inspect('button.primary') // Highlights element in DOM tree
  ```

---

### Verbose Protocol Logs (`DEBUG=pw:api`)
To print every low-level WebSocket protocol message and actionability check directly to your terminal:
```powershell
$env:DEBUG="pw:api"
npx playwright test
```

---

### Quick Comparison: Which Debugging Mode Should You Use?

| Goal / Scenario | Recommended Mode | Flag / Command |
| :--- | :--- | :--- |
| **Active Test Development & Tweaking** | **UI Mode** | `npx playwright test --ui` |
| **Step-by-step Execution with Live DOM** | **Debug Mode** | `npx playwright test --debug` |
| **Pause at a single tricky line** | **Page Pause** | `await page.pause()` |
| **Inspect TS Variables & Call Stack** | **IDE Debugger** | Breakpoint $\rightarrow$ *Debug Test* |
| **Diagnose CI/CD Failures** | **Trace Viewer** | `npx playwright show-trace trace.zip` |
| **Watch test at human speed** | **Headed + SlowMo** | `npx playwright test --headed --slowmo 500` |
| **Test locators directly in DevTools** | **Console Mode** | `PWDEBUG=console` |

---

## 10. Configuration & Best Practices

### Essential `playwright.config.ts` Settings

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,               // Run tests in parallel across files
  forbidOnly: !!process.env.CI,      // Fail CI if test.only was left in code
  retries: process.env.CI ? 2 : 0,   // Retry failed tests on CI
  workers: process.env.CI ? 1 : undefined, // Parallel worker threads
  reporter: [['html'], ['list']],    // Reporters

  use: {
    baseURL: 'https://saucedemo.com',// Base URL for page.goto('/')
    trace: 'on-first-retry',         // Record trace for failed runs
    screenshot: 'only-on-failure',   // Capture screenshot on error
    video: 'retain-on-failure',      // Record video on failure
    actionTimeout: 10 * 1000,        // 10s timeout for clicks/fills
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

### Golden Rules & Best Practices Checklist

- [x] **Always `await` every Playwright action and assertion.**
- [x] **Prefer User-Facing Locators** (`getByRole`, `getByLabel`, `getByText`) over fragile CSS classes (`.btn-primary-x23`).
- [x] **Use Web-First Assertions** (`await expect(loc).toBeVisible()`) instead of generic asserts (`expect(await loc.isVisible()).toBe(true)`).
- [x] **Never use hardcoded sleeps** (`page.waitForTimeout(3000)`). Let auto-waiting do its job.
- [x] **Keep tests isolated and independent:** Never depend on the outcome of a previous test.
- [x] **Leverage Page Object Model (POM)** to make suites clean, reusable, and easy to maintain.
- [x] **Use UI Mode (`--ui`) and Codegen (`codegen`)** to speed up authoring and debugging tests.
