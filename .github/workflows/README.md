# GitHub Actions Android Release Workflow

This workflow automatically builds and releases Android APKs when changes are pushed to the main branch.

## 🚀 Features

- **Automatic Versioning**: Generates unique version tags (v1.0.YYYYMMDDHHMMSS)
- **Duplicate Protection**: Skips build if version tag already exists
- **EAS Build Integration**: Uses Expo's EAS Build service for reliable APK generation
- **GitHub Releases**: Automatically creates releases with APK attachments
- **Build Artifacts**: Preserves APK files for download

## 📋 Prerequisites

### 1. Expo Account Setup
1. Create an account at [expo.dev](https://expo.dev)
2. Install EAS CLI locally: `npm install -g eas-cli`
3. Login to your account: `eas login`

### 2. Repository Secrets Configuration

Add the following secret to your GitHub repository:

**`EXPO_TOKEN`** (Required for production builds)
1. Go to [Expo Access Tokens](https://expo.dev/accounts/[username]/settings/access-tokens)
2. Create a new access token
3. Copy the token
4. In your GitHub repository, go to Settings → Secrets and variables → Actions
5. Add new repository secret named `EXPO_TOKEN` with your token value

### 3. EAS Build Configuration (Optional)

The workflow creates a basic `eas.json` if none exists, but you may want to customize it:

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🔧 How It Works

1. **Trigger**: Workflow runs on every push to `main` branch
2. **Version Generation**: Creates unique timestamp-based version tag
3. **Dependency Setup**: Installs Node.js, npm dependencies, and Expo tools
4. **Build Process**: 
   - Updates `app.json` with new version
   - Authenticates with Expo (if token provided)
   - Builds APK using EAS Build service
5. **Release Creation**: 
   - Creates Git tag
   - Generates GitHub release
   - Attaches APK file to release

## 📱 Build Outputs

Each successful build creates:
- **Git Tag**: `v1.0.YYYYMMDDHHMMSS` format
- **GitHub Release**: With detailed build information
- **APK File**: Android application package ready for distribution

## 🛠️ Customization

### Version Format
To change the version format, modify the `Generate version tag` step:

```yaml
TIMESTAMP=$(date +'%Y%m%d%H%M%S')
VERSION_NAME="v2.0.${TIMESTAMP}"  # Change major.minor version here
```

### Build Profile
To use different EAS build profiles, modify the build step:

```yaml
eas build --platform android --profile preview --non-interactive --wait
```

### Release Content
Customize the release body in the `Create GitHub Release` step.

## 🚨 Troubleshooting

### Common Issues

1. **"No EXPO_TOKEN found"**
   - Add EXPO_TOKEN to repository secrets
   - Verify token is valid and not expired

2. **"Build failed"**
   - Check EAS build logs in Expo dashboard
   - Verify app.json configuration
   - Ensure all dependencies are properly configured

3. **"APK not found"**
   - EAS build may have failed silently
   - Check build status in Expo dashboard
   - Verify build profile configuration

### Debug Mode

To enable debug information, add these environment variables to the workflow:

```yaml
env:
  DEBUG: 1
  EAS_DEBUG: 1
```

## 📈 Usage Example

After setup, simply push to main branch:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

The workflow will automatically:
1. Generate version `v1.0.20240118123045`
2. Build APK with EAS
3. Create GitHub release
4. Attach APK for download

## 🔗 Related Links

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📝 Recent Changes & Compatibility Notes

### Expo CLI & EAS Compatibility Updates

**Changes Made for Expo CLI Future Compatibility:**

1. **Added `cli.appVersionSource` to eas.json**: 
   - Satisfies upcoming Expo CLI requirements
   - Prevents version conflict warnings
   - Set to `"remote"` to use Expo's version management

2. **Removed Deprecated Authentication Step**:
   - Eliminated `eas login --non-interactive` which caused CI failures
   - Authentication now handled via `EXPO_TOKEN` environment variable
   - More reliable for automated CI/CD workflows

3. **ESM Import Compatibility**:
   - Replaced `require()` calls with ESM imports in config files
   - Ensures compatibility with modern Node.js and Expo CLI versions
   - Example: `tailwindcss-animate` now uses ESM import

**For Future Maintenance:**
- Keep `cli.appVersionSource` in all eas.json configurations
- Use `EXPO_TOKEN` environment variable for authentication
- Avoid Node.js `require()` in config files unless specifically supported
- Monitor Expo CLI changelog for breaking changes
- [Android App Bundle vs APK](https://developer.android.com/guide/app-bundle)