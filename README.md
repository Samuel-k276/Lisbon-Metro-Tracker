# LisbonMetro

Interactive web application providing real-time information about the Lisbon Metro system, built with React, TypeScript, and Vite.

![Lisbon Metro](src/assets/metro-icon.png)

## 📋 Description

LisbonMetro is a web application that allows users to:

- View the complete Lisbon metro network map with real-time train positions
- Get detailed information about stations and lines
- Check upcoming trains and waiting times at each station
- Access service alerts and current status of each line
- Plan journeys between any two stations on the network
- View fare information and ticket options

This application consumes real-time data from the official Lisbon Metro API to provide up-to-date information about the service.

## 🚀 Technologies Used

- **React 19** - UI Framework
- **TypeScript** - Static typing for enhanced code quality
- **Vite** - Fast build tool and dev server
- **Konva/React-Konva** - Canvas-based graphics rendering for the interactive map
- **Lisbon Metro API** - Real-time train and service data


## 📂 Project Structure

- `src/api/` - API client for Lisbon Metro service
- `src/assets/` - Images and static resources
- `src/components/` - Reusable React components
- `src/constants/` - Application constants and configuration
- `src/hooks/` - Custom React hooks for data fetching and state management
- `src/pages/` - Page components and views
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions, including graph algorithms for route planning

## 📱 Features

- **Interactive Map**: Real-time visualization of the network with trains and stations
- **Station Details**: Information about facilities, connections, and upcoming trains
- **Journey Planner**: Calculate the optimal route between any two stations
- **Service Alerts**: Real-time notifications about disruptions or maintenance
- **Fare Information**: Comprehensive details about tickets, passes, and payment options


## 🖥️ Deployment

This application is deployed using Vercel. The deployment configuration is included in the `vercel.json` file in the project root.

## 🧪 Future Improvements

- Mobile app version with notifications
- Accessibility enhancements
- Better algorithm for route planning


---

⌨️ with ❤️ by [Samuel] (2025)

