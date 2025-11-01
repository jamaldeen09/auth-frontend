# 🔐 Auth Frontend (Next.js + Redux Toolkit)

A production-ready authentication frontend built with **Next.js 15**, **TypeScript**, **Redux Toolkit**, and **RTK Query**.  
It handles **JWT-based authentication**, **token refresh**, and **state persistence** through **localStorage**.

---

## 🚀 Features

- ⚛️ Built with **Next.js App Router**
- 🧠 **Redux Toolkit** + **RTK Query** for global state & API management
- 🔁 **Automatic token refresh** using a custom `baseQueryWithReauth`
- 🧱 Modular folder structure for scalability
- ✅ **Zod validation** for forms
- 🔒 **LocalStorage-based session handling**
- 🧩 Reusable UI components & hooks (`useAuth`, `useValidations`)

---

## 🧭 Folder Structure
/app
├── dashboard/
├── providers/
├── page.tsx
├── layout.tsx
├── favicon.ico
└── globals.css
/components
├── authUi/
└── reusableUi/
/hooks
├── useAuth.tsx
└── useValidations.tsx
/redux
├── store.ts
├── apiSettings.ts
├── apis/
└── slices/

---

## ⚙️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 15](https://nextjs.org) |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org) |
| API Handling | [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| Form Validation | [Zod](https://zod.dev) |
| Language | TypeScript |

---

## 🧩 Core Logic Overview

### 🔸 Token Refresh Flow
- `baseQueryWithReauth` automatically retries failed requests (401)
- Refresh endpoint (`auth/refresh`) renews tokens
- Auth state updates via `setAuth()` in `userSlice`
- Tokens are stored in **localStorage** (`accessToken` + `refreshToken`)

### 🔸 State Management
- `store.ts` centralizes reducers and middleware
- `userSlice` controls authentication state and user profile
- `authApi` defines endpoints for register/login/logout/me

### 🔸 Hooks
- `useAuth` → access/set/clear user authentication
- `useValidations` → centralized Zod schema validation for forms

---

## 🧰 Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/jamaldeen09/auth-frontend.git
   cd auth-frontend
