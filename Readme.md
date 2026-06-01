<div align="center">

# PrepSphere

**An interactive interview-preparation dashboard for core CS, language, tooling, SQL, puzzles, and behavioral topics.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-prepsphere--os.vercel.app-f5a01e?style=for-the-badge&logo=vercel&logoColor=white)](https://prepsphere-os.vercel.app)
[![Built With](https://img.shields.io/badge/Built_With-HTML%20%2B%20CSS%20%2B%20JS-f5a01e?style=for-the-badge)]()
[![3D](https://img.shields.io/badge/3D-Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)]()

</div>

---

## Overview

PrepSphere is a static web app for interview preparation. The home page presents topics as an interactive 3D orbit-style dashboard, and each topic opens a structured study page with concise explanations, interview-focused notes, examples, comparisons, and quick navigation.

The project is intentionally simple to deploy: it uses plain HTML, CSS, and JavaScript with no backend, database, build step, or user authentication.

## Topics Covered

- DBMS
- Object-Oriented Programming
- Computer Networks
- Operating Systems
- C++ Core
- Java Core
- Python Core
- Puzzles
- Linux
- Git
- SQL
- Projects & Behavioral

## Features

- Interactive 3D dashboard built with Three.js.
- Topic-wise interview notes with structured sections and examples.
- Global search across topics and important interview concepts.
- Light and dark mode on study pages.
- Hyperjump menu for moving between topics without returning to the dashboard.
- Responsive layout improvements for mobile and desktop reading.
- Static deployment friendly: no server, database, or account system required.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Three.js via CDN
- Vercel for hosting

## Local Setup

Because the project is static, you can run it with any simple local server.

```bash
git clone https://github.com/sumitiitj493-boop/PrepSphere.git
cd PrepSphere
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Live Demo

Visit: [https://prepsphere-os.vercel.app](https://prepsphere-os.vercel.app)

## Notes

This is a public study resource. It does not include login, cloud sync, personalized progress tracking, or backend storage.
