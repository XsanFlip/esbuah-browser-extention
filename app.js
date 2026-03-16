// ESBUAH - Extension Security for Browser User Against Hijackers
// c0ded by XsanLahci

const API_URL = "https://www.virustotal.com/api/v3";
const resultsList = document.getElementById('results-list');
const apiKeyInput = document.getElementById('api-key');
const statusBadge = document.getElementById('status-badge');
const threatCounter = document.getElementById('threat-count');
const stealerAlert = document.getElementById('stealer-alert');

let threatsFound = 0;

// Load API key yang tersimpan
chrome.storage.local.get(['vt_api_key'], (result) => {
    if (result.vt_api_key) apiKeyInput.value = result.vt_api_key;
});

// Simpan API key saat berubah
apiKeyInput.addEventListener('change', (e) => {
    chrome.storage.local.set({ vt_api_key: e.target.value });
});

function updateThreatUI(count) {
    threatsFound += count;
    threatCounter.innerText = `${threatsFound} DETECTED`;
    if (threatsFound > 0) {
        statusBadge.className = 'px-2 py-1 text-[9px] bg-red-500/20 text-red-400 rounded border border-red-500/30 uppercase font-bold tracking-widest';
        statusBadge.innerText = 'System Compromised';
    }
}

function addLog(message, type = 'info', details = '') {
    const log = document.createElement('div');
    const colorClass = type === 'danger' ? 'border-red-500/40 bg-red-900/10 text-red-200' : 
                      type === 'warning' ? 'border-yellow-500/40 bg-yellow-900/10 text-yellow-200' : 
                      'border-gray-700 bg-gray-800/40 text-gray-300';
    
    log.className = `p-2 rounded border text-[11px] ${colorClass} animate-fade-in flex flex-col gap-1 backdrop-blur-sm`;
    log.innerHTML = `
        <div class="flex justify-between items-start">
            <strong class="tracking-widest uppercase text-[9px]">${type}</strong>
            <span class="text-[9px] opacity-40 font-mono">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="font-bold leading-tight">${message}</div>
        ${details ? `<div class="text-[10px] opacity-70 mt-1 p-1.5 bg-black/40 rounded border border-white/5 font-mono break-all">${details}</div>` : ''}
    `;
    
    if (resultsList.querySelector('p') || resultsList.querySelector('svg')) resultsList.innerHTML = '';
    resultsList.prepend(log);
}

// --- MODULE 1: STEALER AUDIT ---
document.getElementById('stealer-check').addEventListener('click', () => {
    addLog('ESBUAH: Scanning for credential stealers...', 'info');
    
    chrome.management.getAll((extensions) => {
        let stealerRisks = 0;
        stealerAlert.classList.add('hidden');

        extensions.forEach(ext => {
            if (ext.id === chrome.runtime.id) return;

            const criticalPerms = ['cookies', 'identity', 'storage', 'identity.email'];
            const foundCritical = ext.permissions.filter(p => criticalPerms.includes(p));

            if (foundCritical.length > 0) {
                const desc = `DANGEROUS PERMISSIONS: ${foundCritical.join(', ')}`;
                addLog(`CRITICAL: ${ext.name}`, 'danger', desc);
                stealerRisks++;
                stealerAlert.classList.remove('hidden');
            }
        });

        if (stealerRisks === 0) {
            addLog('Audit Selesai: Kredensial browser Anda aman.', 'info');
        } else {
            updateThreatUI(stealerRisks);
        }
    });
});

// --- MODULE 2: EXTENSION AUDIT ---
document.getElementById('scan-extensions').addEventListener('click', async () => {
    addLog('ESBUAH: Initiating full extension audit...', 'info');
    
    chrome.management.getAll(async (extensions) => {
        let issuesFound = 0;
        
        for (const ext of extensions) {
            if (ext.id === chrome.runtime.id) continue;

            const riskyPermissions = ['management', 'webRequest', 'proxy', '<all_urls>'];
            const foundRisky = ext.permissions.filter(p => riskyPermissions.includes(p));

            if (foundRisky.length >= 2) {
                addLog(`SUSPICIOUS: ${ext.name}`, 'warning', `High-level access found. Potential hijacker/adware pattern detected.`);
                issuesFound++;
            }
        }

        if (issuesFound === 0) {
            addLog('Audit selesai: Tidak ada ekstensi berbahaya.', 'info');
        } else {
            updateThreatUI(issuesFound);
        }
    });
});

// --- MODULE 3: VIRUSTOTAL URL SCAN ---
document.getElementById('scan-url').addEventListener('click', async () => {
    const apiKey = apiKeyInput.value;
    if (!apiKey) {
        addLog('ESBUAH Error: VT API Key is missing!', 'danger');
        return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url.startsWith('http')) {
        addLog('Invalid protocol for analysis.', 'warning');
        return;
    }

    addLog(`ESBUAH Analyzer: Querying VirusTotal for ${new URL(tab.url).hostname}...`);

    try {
        const urlId = btoa(tab.url).replace(/=/g, "");
        const response = await fetch(`${API_URL}/urls/${urlId}`, {
            headers: { 'x-apikey': apiKey }
        });

        if (response.status === 404) {
            addLog('URL not found in VT database. Consider manual scan.', 'info');
            return;
        }

        const data = await response.json();
        const stats = data.data.attributes.last_analysis_stats;

        if (stats.malicious > 0) {
            addLog(`THREAT DETECTED: ${new URL(tab.url).hostname}`, 'danger', `Flagged by ${stats.malicious} security vendors!`);
            updateThreatUI(1);
        } else {
            addLog('URL Reputation: Clean/Safe.', 'info');
        }
    } catch (err) {
        addLog('Network Error: Check API Key/Connection.', 'danger');
    }
});
