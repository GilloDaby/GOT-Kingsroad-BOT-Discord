# GOT Kingsroad Discord Bot

A Discord bot for **Game of Thrones: Kingsroad** guilds, providing centralized timers, private reminders, and various utility commands to streamline guild management.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Setup Steps](#setup-steps)
3. [Slash Commands](#slash-commands)
   - [Admin Commands](#admin-commands)
   - [User Commands](#user-commands)
4. [Usage Examples](#usage-examples)
5. [Contributing & Support](#contributing--support)
6. [License](#license)

---

## Features

- **Auto Setup**  
  Automatically creates required channels/roles and posts timer messages.
- **Global Countdowns**  
  Shared countdowns for Drogon, Peddler, daily/weekly resets, and Beast events.
- **DM Reminders**  
  Private reminders sent before any timer you subscribe to.
- **Alert Role Management**  
  Reaction-based interface for guild members to opt in/out of alert roles.
- **Patch Notes & Calendar Screenshots**  
  Posts patch notes and captures event calendars for quick reference.
- **Marker Search**  
  Retrieves a screenshot centered on a specific in-game map marker.

---

## Installation

### Prerequisites
- **Node.js 18+**
- **MySQL** database with accessible credentials
- **Discord Bot Token** and **Application ID**

### Setup Steps
1. **Clone the repository and install dependencies**
   ```bash
   git clone https://github.com/username/GOT-Kingsroad-BOT-Discord.git
   cd GOT-Kingsroad-BOT-Discord
   npm install
   ```
2. **Create a `.env` file** at the project root:
   ```ini
   DISCORD_TOKEN=your-bot-token
   CLIENT_ID=your-application-id  # or DISCORD_CLIENT_ID
   DB_HOST=localhost
   DB_USER=gotbot
   DB_PASS=password
   DB_NAME=gotbot
   BROWSERLESS_TOKEN=optional-token  # for calendar screenshots
   ```
3. **Register slash commands** (run whenever commands are updated):
   ```bash
   npm run register
   ```
4. **Start the bot**
   ```bash
   npm start
   ```

---

## Slash Commands

### Admin Commands
| Command | Description | Permission |
| --- | --- | --- |
| `/gotkingsroad setup` | Create channels, roles, and initial timer message | Admin |
| `/gotkingsroad reload` | Reload config and regenerate missing messages | Admin |
| `/gotkingsroad cleanup` | Remove duplicate messages posted by the bot | Admin |
| `/gotkingsroad permissions` | Verify channel permissions | Admin |
| `/gotkingsroad config export` | Export server configuration as JSON | Admin |
| `/gotkingsroad config import <file>` | Import configuration from a JSON file | Admin |
| `/gotkingsroad set timezone <IANA>` | Set server’s timezone | Admin |
| `/gotkingsroad set language <fr|en|es|pt-br>` | Set message language | Admin |
| `/gotkingsroad set style <compact|embed>` | Choose timer message style | Admin |
| `/gotkingsroad rank post` | Post the reaction-based role-subscription message | Admin |
| `/gotkingsroad rank <timer> <role>` | Assign a role for a specific timer | Admin |
| `/gotkingsroad message` | Send or refresh timer message in the global channel | Admin |
| `/gotkingsroad reset` | Clear recorded timer message | Admin |
| `/gotkingsroad patchnote` | Post latest patch notes and store message ID | Admin |
| `/gotkingsroad summon <timer>` | Trigger an alert manually | Admin |
| `/gotkingsroad status` | Display current server configuration | Admin |
| `/gotkingsroad helpadmin` | Show admin-only help | Admin |

### User Commands
| Command | Description |
| --- | --- |
| `/gotkingsroad timers` | Display upcoming events with countdowns |
| `/gotkingsroad reminder add <timer> <minutes>` | DM reminder before an event |
| `/gotkingsroad reminder list` | List your active reminders |
| `/gotkingsroad reminder remove <timer> <minutes>` | Remove a specific reminder |
| `/gotkingsroad reminder clear <timer>` | Remove all reminders for an event |
| `/gotkingsroad reminder clearall` | Remove all your reminders |
| `/gotkingsroad searchmarker <name>` | Screenshot centered on a map marker |
| `/gotkingsroad event` | Capture of the current event calendar |
| `/gotkingsroad about` | Info about the bot and project |
| `/gotkingsroad help` | General help for users |
| `/gotkingsroad ping` | Check bot latency |
| `/gotkingsroad uptime` | Show bot uptime |

---

## Usage Examples

- **Fresh Installation**  
  `/gotkingsroad setup` → `/gotkingsroad rank post` to let members subscribe to alerts.
- **Daily Tracking**  
  Post the timer message via `/gotkingsroad message` or check upcoming events with `/gotkingsroad timers`.
- **Personal Reminders**  
  Use `/gotkingsroad reminder add` to receive a DM ahead of each event.
- **Additional Tools**  
  `/gotkingsroad patchnote`, `/gotkingsroad event`, and `/gotkingsroad searchmarker` provide quick info and screenshots for players.

---

## Contributing & Support
1. Fork the repository.
2. Create a branch and make your changes.
3. Submit a pull request.

Questions or issues? Open an issue in the repository.

---

## License
This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

