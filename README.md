# AetherWidget - Mobile Video Widget for Android

Complete Android Video Widget application configured with your custom size (2x2), Lively battery conservation engine, FPS throttling (30 FPS), and real-time color filters.

---

## 🚀 How to Build your .apk in GitHub (Zero Setup)

### Step 1: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Upload or push all files from this project:
```bash
git init
git add .
git commit -m "feat: AetherWidget Android Video Widget"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

*(Or simply drag and drop all files into github.com in your browser!)*

### Step 2: Automated Cloud APK Build
1. Go to the **Actions** tab in your GitHub repository.
2. The workflow **"Build Android APK"** will execute automatically.
3. Wait ~3 minutes for completion.
4. Click on the finished run, scroll down to **Artifacts**, and download **`aether-video-widget-apk`**!
5. Unzip and transfer `app-debug.apk` to your Android phone.

### Step 3: Install & Add to Android Home Screen
1. On your phone, tap `app-debug.apk` to install.
2. Long-press your home screen ➔ tap **Widgets** ➔ find **AetherWidget** ➔ place on your screen!

---

## 💻 Local Testing & Android Studio Build
```bash
# 1. Install dependencies
npm install

# 2. Run locally in browser
npm run dev

# 3. Build & Open in Android Studio
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
