# CargoLink Documentation

Welcome to the CargoLink documentation directory. This folder centralizes all historical, architectural, and debugging documentation for the CargoLink logistics and freight matching platform.

## Overview

CargoLink is a full-stack web application connecting Shippers and Drivers. 
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Custom JWT-based role authorization

The documentation has been meticulously structured to show the chronological evolution of the project from initial analysis through the migration from Supabase to a custom Node.js architecture.

## Documentation Structure

### 1. Project Phases (`/docs/phases/`)
This folder contains the step-by-step evolution of the CargoLink platform.
*Recommended Reading Order:*

- **`PHASE_00_STRUCTURE_SUMMARY.txt`**: High-level overview of the intended phase structure.
- **`PHASE_01_INITIAL_ANALYSIS.md`**: Initial code analysis and migration strategy from Supabase.
- **`PHASE_02_SUMMARY.txt`**: Basic backend setup and configuration.
- **`PHASE_03_SUMMARY.txt`**: Database models and Mongoose schemas creation.
- **`PHASE_04_SUMMARY.txt`**: Authentication endpoints and JWT middleware.
- **`PHASE_05_SUMMARY.txt`**: Shipper-focused load management routes (create, read, update, delete).
- **`PHASE_06_SUMMARY.txt`**: Driver-focused load routes (browsing available loads).
- **`PHASE_07_SUMMARY.txt`**: Load acceptance and booking workflow.
- **`PHASE_08_SUMMARY.txt`**: Load lifecycle updates (in_transit, completed).
- **`PHASE_09_SUMMARY.txt`**: Driver dashboard metrics and aggregation endpoints.
- **`PHASE_10_BATCH1_SUMMARY.txt`**: Shipper API frontend integration.
- **`PHASE_11_BATCH2_SUMMARY.txt`**: Shipper UI enhancements and debugging.
- **`PHASE_11_BATCH3_SUMMARY.txt`**: Driver API frontend integration.
- **`PHASE_11_DRIVER_SYSTEM_SUMMARY.txt`**: Driver UI state transitions, race-condition protection.
- **`PHASE_12_CLEANUP_SUMMARY.txt`**: Final teardown of all remaining Supabase code and dependencies.

### 2. Architecture & Guides (`/docs/architecture/`)
Core technical references for understanding the system.

- **`Backend_Explanation.txt`**: Detailed breakdown of the Express backend structure.
- **`FRONTEND_CONNECTION_GUIDE.md`**: Guide on how the React frontend interfaces with the API via the `apiFetch` wrapper.
- **`TESTING_GUIDE.md`**: Instructions for running the backend End-to-End (E2E) testing suite.
- **`migration_implementationPlan.txt`**: The original blueprint used to execute the backend migration.

### 3. Debug Logs (`/docs/debug/`)
Historical records of critical bug fixes.

- **`AUTH_DEBUG_SUMMARY.txt`**: Resolution of JWT and middleware authentication errors.
- **`MYLOADS_DEBUG_SUMMARY.txt`**: Fixes applied to the React Query data fetching and null-safe UI rendering.

### 4. Original README
- **`ORIGINAL_README.md`**: The boilerplate README file from the initial Lovable/Vite scaffold.
