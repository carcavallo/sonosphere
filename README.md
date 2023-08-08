# sonosphere 🎵

A WebApp designed to remotely control Sonos Boxes using the Sonos API. Built with a Node.js backend and a React frontend.

## Features

- 🎛️ **Remote Control**: Seamlessly control your Sonos Box from anywhere.
- 🌍 **Web-based Interface**: Accessible from any modern browser.
- ⚙️ **API Integration**: Directly integrated with the Sonos API for real-time feedback.
- 👨‍💻 **Modern Stack**: Built on top of Node.js and React for performance and scalability.

## Prerequisites

- Node.js (version 14 or higher)
- Sonos Box connected to your local network


## Installation

### Manual

1. Clone this repository:
###
    git clone https://github.com/carcavallo/sonosphere.git
    
2. Install dependencies
###
    cd ./sonosphere/frontend && npm install
    
###
    cd ./sonosphere/core && npm install
3. Add credentials (Sonos, Spotify)
###
    cd ./sonosphere/core && nano .env
    
###
    SONOS_IP=""
    SPOTIFY_CLIENT_ID=""
    SPOTIFY_CLIENT_SECRET=""
3. Start Backend and Frontend
###
    cd ./sonosphere/core && npm run dev
    
###
    cd ./sonosphere/frontend && npm start

### Docker
1. Add credentials (Sonos, Spotify)
###
    cd ./sonosphere/core && nano .env
    
###
    SONOS_IP=""
    SPOTIFY_CLIENT_ID=""
    SPOTIFY_CLIENT_SECRET=""
2. Start Docker Compose
###
    cd ./sonosphere && docker compose up
