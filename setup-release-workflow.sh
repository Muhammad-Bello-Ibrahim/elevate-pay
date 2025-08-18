#!/bin/bash

# Setup script for APK Release Workflow
# This script ensures all dependencies and configuration are ready

set -e

echo "🔧 ElevateX APK Release Workflow Setup"
echo "======================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    if [ -f "package.json" ]; then
        npm install
        echo "✅ Dependencies installed"
    else
        echo "❌ package.json not found"
        exit 1
    fi
}

# Function to install/check EAS CLI
setup_eas_cli() {
    echo ""
    echo "🛠️ Setting up EAS CLI..."
    if command_exists eas; then
        echo "✅ EAS CLI already installed: $(eas --version)"
    else
        echo "Installing EAS CLI..."
        npm install -g eas-cli@latest
        echo "✅ EAS CLI installed: $(eas --version)"
    fi
}

# Function to create/verify EAS configuration
setup_eas_config() {
    echo ""
    echo "⚙️ Setting up EAS configuration..."
    if [ -f "eas.json" ]; then
        echo "✅ eas.json already exists"
    else
        echo "Creating eas.json..."
        cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF
        echo "✅ eas.json created"
    fi
}

# Function to verify workflow files
verify_workflow() {
    echo ""
    echo "🔍 Verifying GitHub Actions workflow..."
    if [ -f ".github/workflows/release.yml" ]; then
        echo "✅ Release workflow found"
        # Validate YAML syntax
        if python3 -c "import yaml; yaml.safe_load(open('.github/workflows/release.yml'))" 2>/dev/null; then
            echo "✅ Workflow YAML syntax is valid"
        else
            echo "❌ Workflow YAML syntax error"
            exit 1
        fi
    else
        echo "❌ Release workflow not found at .github/workflows/release.yml"
        exit 1
    fi
}

# Function to check app configuration
verify_app_config() {
    echo ""
    echo "📱 Verifying app configuration..."
    if [ -f "app.json" ]; then
        echo "✅ app.json found"
        if python3 -c "import json; json.load(open('app.json'))" 2>/dev/null; then
            echo "✅ app.json syntax is valid"
        else
            echo "❌ app.json syntax error"
            exit 1
        fi
    else
        echo "❌ app.json not found"
        exit 1
    fi
}

# Function to display setup instructions
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. 🔑 Add Expo Token to GitHub Secrets:"
    echo "   • Go to https://expo.dev/accounts/[username]/settings/access-tokens"
    echo "   • Create a new access token"
    echo "   • In your GitHub repo: Settings → Secrets and variables → Actions"
    echo "   • Add secret: Name = EXPO_TOKEN, Value = [your token]"
    echo ""
    echo "2. 🚀 Test the workflow:"
    echo "   git add ."
    echo "   git commit -m \"Test APK release workflow\""
    echo "   git push origin main"
    echo ""
    echo "3. 📱 Monitor the build:"
    echo "   • Check GitHub Actions tab for build progress"
    echo "   • Download APK from GitHub Releases when complete"
    echo ""
    echo "📖 For more details, see:"
    echo "   • .github/workflows/README.md"
    echo "   • WORKFLOW_SETUP.md"
}

# Main execution
main() {
    echo "Starting setup process..."
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "app.json" ]; then
        echo "❌ Please run this script from the root of the ElevateX project"
        exit 1
    fi
    
    install_dependencies
    setup_eas_cli
    setup_eas_config
    verify_workflow
    verify_app_config
    show_next_steps
}

# Run main function
main "$@"