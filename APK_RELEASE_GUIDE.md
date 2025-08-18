# 🚀 APK Release Workflow - Quick Reference

## Automatic APK Generation & GitHub Releases

This repository is configured with an automated workflow that builds and releases Android APKs whenever code is pushed to the main branch.

### 🔄 How It Works

1. **Push to main** → Workflow triggers automatically
2. **Version tag** → Creates unique timestamp-based version (e.g., `v1.0.20240118123045`)
3. **APK build** → Uses Expo EAS Build service to create production APK
4. **GitHub Release** → Publishes release with downloadable APK file

### ⚡ Quick Setup

```bash
# 1. Run setup script
./setup-release-workflow.sh

# 2. Add EXPO_TOKEN to GitHub Secrets
# Go to: Settings → Secrets and variables → Actions
# Add: Name=EXPO_TOKEN, Value=[your expo token from expo.dev]

# 3. Test the workflow
git add .
git commit -m "Test APK release"
git push origin main
```

### 📱 What You Get

Each successful build creates:
- ✅ **Git tag** with version number
- ✅ **GitHub Release** with build notes  
- ✅ **APK file** ready for download/distribution
- ✅ **Build metadata** for tracking

### 🔧 Configuration Files

- `.github/workflows/release.yml` - Main workflow definition
- `eas.json` - Expo build configuration
- `app.json` - App metadata (version auto-updated)

### 📋 Requirements

- **Node.js 18+** and npm
- **Expo account** at [expo.dev](https://expo.dev)
- **EXPO_TOKEN** added to repository secrets

### 🎯 File Outputs

APK files are named: `elevate-x-v1.0.YYYYMMDDHHMMSS.apk`

Download from: **GitHub Releases** → Latest release → Assets

---

For detailed setup instructions, see [WORKFLOW_SETUP.md](WORKFLOW_SETUP.md)