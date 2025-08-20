# Activity Graph Generator

[![Deploy with Vercel](https://vercel.com/button)](https://activity-graph-generator.vercel.app/)

A simple tool to generate a dynamic, GitHub-style activity graph (heatmap calendar) for your profile README. Visualize any daily activity data from platforms like Github commits, BOJ, LeetCode, or personal study logs.

![Activity Graph Generator Screenshot](https://activity-graph-generator.vercel.app/api/graph?start=20241229&data=8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23,8,4,2,1,0,11,15,23&theme=grass&size=14)

---

## Features

- **Dynamic SVG Generation**: Creates an SVG image based on URL parameters.
- **Customizable Themes**: Multiple color themes to match your style.
- **Adjustable Size**: Control the size of the graph for a perfect fit.
- **Cool Animations**: Squares appear sequentially with a subtle animation, ordered by activity level.
- **Easy to Use**: A simple web UI to generate the URL and preview the graph.

---

## How to Use

1.  **Visit the Generator Website**: Open [activity-graph-generator.vercel.app](https://activity-graph-generator.vercel.app/)
2.  **Input Your Data**:
    -   **Start Date**: The first day of your data in `YYYYMMDD` format.
    -   **Activity Data**: A series of numbers separated by commas. Each number represents the activity count for a day, starting from the `Start Date`.
3.  **Customize Options**:
    -   Select a **Theme**.
    -   Choose a **Size**.
4.  **Copy the Markdown**: Click the "Copy" button to get the Markdown code.
5.  **Paste it** into your GitHub profile README or any other Markdown file.

---

## Available Options

You can customize the graph by changing the query parameters in the image URL.

### `start`

The start date of the data.
- **Format**: `YYYYMMDD`
- **Required**: `true`
- **Example**: `start=20250101`

### `data`

Comma-separated values representing daily activity counts. The number of values determines the length of the graph.
- **Format**: `Integer,Integer,...`
- **Required**: `true`
- **Example**: `data=1,5,0,12,8`

### `theme`

The color theme of the graph.
- **Required**: `false`
- **Default**: `grass`
- **Available Themes**: `grass`, `ocean`, `violet`, `rose`, `amber`, `teal`, `mono`
- **Example**: `theme=ocean`

### `size`

The size of each square in pixels. This affects the overall size of the graph.
- **Required**: `false`
- **Default**: `14`
- **Available Sizes**: `12` (Smaller), `14` (Regular), `16` (Larger)
- **Example**: `size=16`

---

## Theme Examples

Here are previews of all available themes. The sample data used is `0,1,2,...,25` to show all color levels.

- **Grass** (`theme=grass`)

![Grass Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=grass&size=14)

- **Ocean** (`theme=ocean`)

![Ocean Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=ocean&size=14)

- **Violet** (`theme=violet`)

![Violet Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=violet&size=14)

- **Rose** (`theme=rose`)

![Rose Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=rose&size=14)

- **Amber** (`theme=amber`)

![Amber Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=amber&size=14)

- **Teal** (`theme=teal`)

![Teal Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=teal&size=14)

- **Mono** (`theme=mono`)

![Mono Theme](https://activity-graph-generator.vercel.app/api/graph?start=20250101&data=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25&theme=mono&size=14)

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=badge&logo=vercel&logoColor=white)