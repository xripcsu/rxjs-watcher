const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect(null, { name: `panel-${tabId}` });
const tree = jsonTree.create({}, document.querySelector('.json-wrapper'));

port.onMessage.addListener(({ type, body }) => {
  switch (type) {
    case 'GROUP_INIT':
      onGroupInit(body);
      break;
    case 'MARBLE_INIT':
      onMarbleInit(body);
      break;
    case 'SUBSCRIBE':
      onSubscribe(body);
      break;
    case 'VALUE':
      onValue(body)
      break;
    case 'RELOAD':
      onReload();
      break;
    case 'COMPLETE':
      onComplete(body);
      break;
    default:
      break;
  }
})

function onGroupInit({ groupId, groupName }) {
  const groupElement = document.createElement('rx-group');
  const message = document.querySelector('.message');
  message && message.remove();
  groupElement.id = groupId;
  groupElement.name = groupName;
  document.getElementsByClassName('groups')[0].appendChild(groupElement);
}

function onMarbleInit({ groupId, marbleId, marbleName }) {
  const marbleElement = document.createElement('rx-marble');
  marbleElement.id = marbleId;
  marbleElement.name = marbleName;
  marbleElement.slot = 'marbles';
  marbleElement.handleClick = (clickedEl, value) => {
    tree.loadData({ value: JSON.parse(value) });
    document.querySelectorAll('rx-marble').forEach(marbleEl =>
      marbleEl.shadowRoot.querySelectorAll('.value').forEach(valueEl => valueEl.className = 'value')
    )
    clickedEl.className = 'value value--selected';
  };
  document.getElementById(groupId).appendChild(marbleElement);
}

function onSubscribe({ marbleId, interval }) {
  const marble = document.getElementById(marbleId);
  if (marble) marble.startInterval(interval);
}

function onValue({ marbleId, value }) {
  const marble = document.getElementById(marbleId);
  if (marble) marble.frame = value
}

function onReload() {
  const group = document.getElementsByClassName('groups')[0];
  while (group.firstChild) {
    group.firstChild.remove();
  }
}

function onComplete({ marbleId }) {
  const marble = document.getElementById(marbleId);
  if (marble) marble.complete();
}