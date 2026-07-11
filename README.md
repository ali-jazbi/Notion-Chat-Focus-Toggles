# Notion Chat Focus Toggles

A lightweight Chrome extension that lets you hide/show parts of a Notion AI
chat with one click, so you can focus on exactly what you need:

- Hide/show code blocks
- Hide/show your own prompts
- Hide/show the AI's non-code explanation text

Each toggle works independently. A shared **percentage slider** lets you
limit hides to only the oldest N% of the conversation — for example, set it
to 50% and only the older half of the chat is affected by the active
toggles; the newer half always stays fully visible. As the conversation
grows, the cutoff point automatically shifts.

A "Show All / Reset" button restores everything at once.

## Why

Long AI chats in Notion get cluttered with code blocks and explanatory
text, making it hard to scan for exactly what you need. This extension
lets you temporarily hide the noise — without deleting or altering any
actual content.

## Install

1. Download and extract the `notion-focus-toggles.zip` file into its own folder.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the extracted folder.
5. Confirm "Notion Chat Focus Toggles" now appears in your extensions list.

## Usage

1. Open any Notion AI chat page (`notion.so` or `notion.site`).
2. Click the extension's icon in the Chrome toolbar.
3. Click any of the three buttons to hide that type of content; click again to bring it back.
4. Drag the percentage slider to control how far back (from the oldest message) the active hides should apply.
5. Click **Show All (Reset)** to clear all active hides at once.

Each button turns blue while its hide is active, so you always know what's currently hidden.

## Notes

- Works only on Notion pages (`*.notion.so`, `notion.so`, `*.notion.site`).
- Purely visual: hidden content is not deleted, only hidden. Reloading the page or clicking the button again restores it.
- Settings (which toggles are active and the percentage) are remembered per browser profile via `chrome.storage.local`.
- If a future Notion layout update changes some CSS class names, the selectors in `content.js` may need updating.

## License

MIT
