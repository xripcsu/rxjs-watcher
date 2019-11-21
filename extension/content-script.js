const port = chrome.runtime.connect(null, { name: "content" });
port.onDisconnect.addListener(() => port = null);
port.postMessage({ type: 'RELOAD' }, "*");

addEventListener('message', async ({ data, source }) => {
    if (source !== window || !data || typeof data !== 'object' || data.source !== 'rxjs-watcher') {
        return;
    }
    port.postMessage(data.message, "*");

    await new Promise(resolve => setTimeout(resolve, 100));
});
