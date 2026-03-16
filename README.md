
# ESBUAH (Extension Security for Browser User Against Hijackers)

### c0ded by XsanLahci

<p align="center">
  <img src="icon.png" alt="Alt text">
</p>

**ESBUAH** is a lightweight browser extension specifically designed to detect threats at the browser level, ranging from _Adware_ and _Browser Hijackers_ to _Credential Stealers_ masquerading as legitimate extensions.

Built on _DevSecOps_ and _Red Teaming_ principles, this tool helps users perform integrity audits of their browsing environment using heuristic permission analysis and VirusTotal API integration.

## 🚀 Key Features

1.  **Audit Extension:** Detects extensions with excessively broad permissions (_high-privilege permissions_) frequently used by Adware.
    
2.  **Stealer Check:** A specialized module to scan for extensions that have access to sensitive data such as `Cookies`, `Storage`, and `Identity`.
    
3.  **VirusTotal Integration:** Performs real-time URL reputation checks through the VirusTotal global threat database.
    
4.  **Security Log:** An informative log interface to monitor threat findings directly.
    

## 📁 File Structure

To run this tool, ensure you save the following files in a single folder (e.g., a folder named `ESBUAH-Extension`) with this structure:

```
ESBUAH-Extension/
├── manifest.json  (Extension Configuration)
├── index.html     (User Interface/UI)
├── app.js         (Main Logic & Engine)
└── icon.png       (Extension Icon - 48x48 pixel size)

```

## 🛠️ Installation Guide (Developer Mode)

### 1. Chromium-Based Browsers (Chrome, Edge, Brave, Opera)

As ESBUAH is a custom security tool, you need to install it via developer mode:

1.  **Download/Clone** all files and place them in a single folder.
    
2.  Open the extensions page in your browser:
    
    -   **Google Chrome:** `chrome://extensions/`
        
    -   **Brave Browser:** `brave://extensions/`
        
    -   **Microsoft Edge:** `edge://extensions/`
        
3.  Enable **Developer Mode** in the top-right or bottom-left corner.
    
4.  Click the **Load unpacked** button.
    
5.  Select the folder where you stored the **ESBUAH** files.
    

### 2. Mozilla Firefox

Firefox handles unpublished extensions slightly differently:

1.  Open Firefox and type `about:debugging` in the address bar, then press Enter.
    
2.  Click on the **This Firefox** menu in the left-hand column.
    
3.  Look for the **Temporary Extensions** section and click the **Load Temporary Add-on...** button.
    
4.  Navigate to your extension folder and select the `manifest.json` file.
    
5.  _Note: Extensions loaded temporarily in Firefox will disappear when the browser is closed. You will need to reload it when starting a new session for audit purposes._
    

## ⚙️ VirusTotal Configuration

To utilize the _Scan URL_ feature, you will need an API Key:

1.  Register for a free account at [VirusTotal](https://www.virustotal.com/ "null").
    
2.  Open your profile and retrieve your **API Key** from the "API Key" section.
    
3.  Open the ESBUAH popup and enter the key in the provided field. The key will be automatically saved to your browser's _local storage_.
    

## ⚠️ Disclaimer

This tool is developed for educational and security (_SecOps_) purposes. While ESBUAH can detect extension-based threats, it does not replace the function of an Antivirus/EDR at the operating system (OS) level. Always exercise caution when granting permissions to third-party extensions.

**Coded with ⚡ by XsanLahci**
