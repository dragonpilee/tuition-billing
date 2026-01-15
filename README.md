# Tuition Billing Hub 🧾

A modern, Dockerized web application for managing student tuition billing, built with React, TypeScript, and Tailwind CSS.

## ✨ Features
- **Student Management**: Track student names and previous balances.
- **Dynamic Billing**: Choose from multiple hourly rates (₹150, ₹200, ₹250, ₹300).
- **Work Entries**: Add, edit, and delete daily work hours.
- **Automatic Calculations**: Real-time updates for total hours, bill amount, and grand total.
- **PDF Invoices**: Generate professional PDF invoices using `jsPDF`.
- **Persistent Storage**: Data is saved locally in the browser.
- **Responsive Design**: Premium UI with glassmorphism and "Outfit" typography.

## 🚀 Quick Start (Docker)

The easiest way to run the application is using Docker.

### 1. Development Mode
Run the following command to start the development server with hot-reloading:
```bash
docker compose up
```
Access the app at: [http://localhost:4321](http://localhost:4321)

### 2. Production Build
To build and run the production-ready container:
```bash
docker build -t tuition-billing .
docker run -p 80:80 tuition-billing
```
Access the app at: [http://localhost](http://localhost)

## 🛠️ Technology Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **PDF Utility**: jsPDF & jsPDF-AutoTable
- **Containerization**: Docker

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by Alan Cyril Sunny
