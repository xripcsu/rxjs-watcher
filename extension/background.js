const connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "content") {
    const tabId = port.sender.tab.id;
    connections[tabId] = {
      ...(connections[tabId] ?  connections[tabId] : {}),
      content: port
    }

    port.onMessage.addListener( (message) => {
      connections[tabId].panel && connections[tabId].panel.postMessage(message)
    })
    
  } else if (port.name.startsWith("panel")){
    const [name, tabId] = port.name.split('-');
    connections[tabId] = {
      ...(connections[tabId] ?  connections[tabId] : {}),
      panel: port
    }
    port.onMessage.addListener(function (message) {
    })
    
  }
});