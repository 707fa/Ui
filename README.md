# Neurynth 2.0 - Management Platform

A high-performance, modern business management platform built with React, Vite, and Tailwind CSS.

## 🚀 Key Modules
- **POS System**: Fast checkout with support for multiple payment systems.
- **Inventory**: Real-time stock tracking and price management.
- **HR Module**: Complete employee management and role tracking.
- **Sales Analytics**: Interactive charts and detailed order history.

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4 (supporting dynamic dark/light themes)
- **State/Routing**: React Router DOM, Framer Motion
- **API**: Internal fetch-based API layer configured for mock/real backend switching.

## 💻 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
```bash
npm install
```

### Development
Starts both the frontend and the mock API server:
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## 🔌 API Integration
The project is structured to switch between the developmental mock server and a real backend. See `.env.example` and `API_CONTRACT.md` for more details.
