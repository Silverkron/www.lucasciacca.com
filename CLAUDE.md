# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Hugo static site. Hugo is installed at `/opt/homebrew/bin/hugo`.

- **Local development server**: `hugo server` (starts development server with live reload)
- **Build site**: `hugo` (generates static files in `public/` directory)
- **Build with drafts**: `hugo --buildDrafts` (includes draft content)
- **Clean build**: `hugo --cleanDestinationDir` (removes orphaned files from destination)

## Architecture Overview

This is a Hugo-based personal website for Luca Sciacca (lucasciacca.com) built with a custom theme structure:

### Directory Structure
- `config.toml` - Main Hugo configuration file with site settings, menus, and theme parameters
- `content/` - Markdown content files (posts, projects, about, contact pages)
- `layouts/` - Hugo template files defining site structure and page layouts
- `assets/sass/` - SCSS stylesheets organized in ITCSS methodology (settings, tools, base, modules, layouts)
- `static/` - Static assets (images, favicon, etc.)
- `data/` - Data files for Hugo
- `archetypes/` - Content templates for new posts/pages

### Key Configuration
- Site language: Italian (it-IT) 
- Base URL: https://www.lucasciacca.com/
- Color scheme: auto (supports light/dark mode switching)
- Main sections: Blog, Changelog, Contact
- Projects section currently commented out in menu

### Content Types
- **Posts** (`content/posts/`) - Blog articles in Italian about development, full-text search, sliders, and programming
- **Projects** (`content/projects/`) - Technical project showcases
- **Static pages** - About, Contact, Changelog, Elements

### Theme Architecture
The site uses a custom Hugo theme with:
- Responsive SCSS architecture following ITCSS principles
- JavaScript for common functionality and custom scripts
- Partial templates for modular components (header, footer, hero, etc.)
- Support for testimonials, gallery, and blog sections
- Built-in contact form integration

### Asset Pipeline
- SCSS compilation through Hugo's asset pipeline
- Generated assets stored in `resources/_gen/`
- Image optimization for WebP format
- Syntax highlighting for code blocks