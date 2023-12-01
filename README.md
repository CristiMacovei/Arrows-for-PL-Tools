# Arrows for PL-Tools

A chromium plugin designed to work with the website [PL-Tools](https://alin1popa.github.io/pl-tools/).

### Functionality

On tabs `Karnaugh`, `Sequence` and `Organigram`, this plugin allows you to move to an adjacent cell by clicking the arrow keys.

### How to install

#### Step 0 (prerequisites)

- have a computer
- use a chromium based browser (Google Chrome, Brave, Opera)
  - not firefox yet, waiting on the plugin to be approved by mozilla

#### Step 1 - Enable dev mode

- Navigate to `chrome://extensions`
- In the top-right corner, you should see a switch with `Developer mode` written on it
- Make sure it's set to enabled

#### Step 2 - Download the extension

- In this repo there is a Release named `v1.0.0`
- Click that and download the file named `arrows-for-pl-tools-v1.0.0.zip`
- After downloading, unzip the file into a new directory
- You should have a directory containing a `manifest.json` file and a `build` directory with a js file named `arrows.js` inside

#### Step 3 - Add the extension to Chrome

- After enabling dev mode (see Step 1), you should have three buttons in the top-left (`Load unpacked`, `Pack extension`, `Update`)
- Click `Load unpacked` and when it prompts for a file, give it the directory where you unzipped the release file
- It should say `Extension Loaded`

#### Other things

- After installing the extension, there may be an error shown in chrome, you can safely ignore it. That error is due to me trying to make this compatible with firefox (and failing horribly)
