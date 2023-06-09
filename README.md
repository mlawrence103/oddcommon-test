# OddCommon Code Test

This repo is a bare bones vite + react boilerplate. If you have a go to starter that you're more comfortable with feel free to use just include instructions for building.

Note that fonts are included in this repo so feel free to grab them to use within your app.

🤘

## Instructions

1. Download this repo
2. Check out the figma
3. Read the readme
4. Make magic happen
5. Create a new repo and push

## The task:

Build a single page application that shows a list of curated videos from Vimeo. The page should populate with the static thumbnail provided by Vimeo, its title and a set of like and dislike buttons. These buttons should persist their like or disliked status between page refreshes.

As you scroll the cell that is the most in view should start playing its video inline. We look to you on how you want to handle scrolling and animating these cells. If you have a neat idea for an interaction that is different than just a native scroll that’s great and we’d love to see it.

When a user taps on a cell it should seamlessly transition to a detail view and begin playing the video with sound, and custom controls should appear below with a progress bar over the video. Again we defer to you on how you’d like to handle this transition.

When a user taps the next and previous buttons it should transition to the next or previous video in the config file. No need for infinite looping, it is okay to disable the previous and next buttons when you’ve hit the min and max of the list.

Your target should be mobile browsers.

Good luck!

### Helpers and things you will need

- The Vimeo API is rate limited so for the sake of caching in `src/scripts/data` you will find a config file from the vimeo API that contains a set of 16 featured videos. Use this as your data.

- In order to achieve the layout and design you will need to access the raw MP4 from Vimeo. To help you we've created a little proxy you can use to query for the config. `https://proxy.oddcommon.dev/vimeo/${video_id}`
  - That endpoint will return the config metadata for the Vimeo video. You will need to parse this data and merge it with your other data.
  - To get the actual MP4 you will need to look at `request.files.progressive` which will be a set of videos. Would suggest sorting and filtering the largest video.

# react-boilerplate

A minimal boilerplate for Vite + React.

## ⚙️ Setup

- `npm i`
- `npm start`

## 🔨 Build

- `npm run dist`

## 🚧 Config

You can find the `vite.config.js` in the root of the project, there you can modify the Vite setup and configuration.

## 📦 What's inside

- [zustand](https://github.com/pmndrs/zustand) - A small, fast and scalable bearbones state-management solution using simplified flux principles. Has a comfy api based on hooks, isn't boilerplatey or opinionated.

- [Normalize](modern-normalize)

- [GSAP](https://greensock.com/gsap/)

## 📐 Structure

The setup here is very basic so modify as you see fit.

- public
  - Any assets that should be considered static and don't need to be hashed at compile time.
- scripts
  - `components`
    - Repeated and shared components from the app
  - `data`
    - Where data lives
  - `index.jsx`
    - Where things get started
  - `styles`
    - `_fonts.scss` - Font imports & base styles
    - `index.scss` - Global Styles

# Mabel Documentation

### Tech Stack

- React
- Redux
- Redux Persist
- Gsap (for scroll events)
- React Icons

### Component Structure

Main component is VideoList that establishes the global state object with the video information. This also wraps around the VideoContainer components that show the individual thumbnails and in place players. DetailView is the component that comes up with a video or thumbnail is clicked.

### Known Bugs

Not smooth scrolling

- Exepected cause: resizing elements when loading playing videos is causing improper re-triggering of events
- Expected solution: look at inspector to see what elements are changing on scroll and add state console logs

Reloads with detail view open

- Expected cause: adding persistant state to track the like/dislike is also tracking the state of the detail viewer
- Expected solution: either ignore this element of the redux store in persist or reset this element of state on each reload
