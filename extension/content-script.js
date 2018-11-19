const port = chrome.runtime.connect(null, { name: "content" });
    port.onDisconnect.addListener(function () {
      port = null;
    });

    port.postMessage({type: 'RELOAD'})

addEventListener('message', ({data, source}) => {
    if (source !== window) {
        return;
    }

    if (typeof data !== 'object' || data === null || !(data.source === 'rx-visualize')) {
        return;
    }
    port.postMessage(data.message);
});

//chrome.runtime.onMessage.addListener( (request) =>  window.postMessage(request, '*'));