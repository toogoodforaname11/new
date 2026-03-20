# AMS Chatbot Widget v2.0

Floating chat widget with animated robot, peekaboo speech bubble, typing dots, and Voiceflow chatbot.

---

## Folder Structure

```
ams-chatbot-widget-v2/
  ams-chatbot-widget.php        <-- WordPress plugin file
  chat-widget-standalone.html   <-- Non-WordPress snippet (for any HTML site)
  assets/
    chatbotpix.png              <-- Robot + speech bubble image (floating button)
    ams-chatbot-voiceflow.html  <-- Voiceflow chatbot UI (loaded in iframe)
    logoams.png                 <-- AMS logo (chat header)
    robotams.png                <-- Robot avatar (bot messages inside chat)
```

---

## Option 1: WordPress Plugin Install

### Steps

1. **Zip the plugin folder**
   - Zip the entire `ams-chatbot-widget-v2` folder (keeping the folder structure intact)

2. **Upload to WordPress**
   - Go to **WordPress Admin > Plugins > Add New > Upload Plugin**
   - Upload the zip file
   - Click **Install Now**, then **Activate**

3. **Done** — the widget appears on every page automatically

### How It Works
- The PHP plugin uses `plugin_dir_url(__FILE__)` to find its own location
- All images and the chatbot iframe load from the `assets/` subfolder
- No external URLs — everything runs from your WordPress server
- Works on any domain, no configuration needed

---

## Option 2: Any HTML Website (Non-WordPress)

### Steps

1. **Upload the 4 asset files** to the same directory on your web server:
   - `chatbotpix.png`
   - `ams-chatbot-voiceflow.html`
   - `logoams.png`
   - `robotams.png`

2. **Open `chat-widget-standalone.html`** and copy everything inside it

3. **Paste** the copied code into your webpage, just before `</body>`

4. **If your assets are in a subfolder**, update the paths in the HTML:
   - Change `src="chatbotpix.png"` to `src="your-folder/chatbotpix.png"`
   - Change `src="ams-chatbot-voiceflow.html"` to `src="your-folder/ams-chatbot-voiceflow.html"`

---

## Widget Features

- **Floating bot button** — fixed bottom-right corner, wobbles and floats
- **Peekaboo animation** — speech bubble fades in/out on 8-second cycle
- **Typing dots** — 3 white bouncing dots on the speech bubble, synced with peekaboo
- **Click to open** — opens a 380x650 chat window with Voiceflow chatbot
- **Mobile fullscreen** — chat goes fullscreen on screens under 640px
- **Close via X button** or Voiceflow's built-in close message

---

## Customization

| What | Where |
|------|-------|
| Button position | `#chatToggleBtn` — change `bottom` and `right` values |
| Button size | `.chat-icon-wrap` and `.chat-icon-wrap img` — change `width: 150px` |
| Chat window size | `#chatBox` — change `width: 380px` and `height: 650px` |
| Animation speed | `peekaboo` keyframes — change `8s` duration |
| Typing dot size | `.typing-dots span` — change `width` and `height` |
| Replace bot image | Swap `assets/chatbotpix.png` with a new image (same filename) |
