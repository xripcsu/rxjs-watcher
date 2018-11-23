const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect(null, { name: `panel-${tabId}` });
const tree = jsonTree.create({}, document.querySelector('.json-wrapper'));

port.onMessage.addListener(({ type, body }) => {
  if (type) {
    ({
      'GROUP_INIT': onGroupInit,
      'MARBLE_INIT': onMarbleInit,
      'SUBSCRIBE': onSubscribe,
      'NEXT': onValue,
      'ERROR': onError,
      'COMPLETE': onComplete,
      'RELOAD': onReload
    })[type](body);
  }
});

let activeMarbles = {};

function onGroupInit({ groupId, groupName }) {
  const groupElement = document.createElement('rx-group');
  const message = document.querySelector('.message');
  message && message.remove();
  groupElement.id = groupId;
  groupElement.name = groupName;
  const groupsWrapper = document.querySelector('.groups');
  if(groupsWrapper) groupsWrapper.appendChild(groupElement);
}

function onMarbleInit({ groupId, marbleId, marbleName, duration }) {
  const marbleElement = document.createElement('rx-marble');
  marbleElement.id = marbleId;
  marbleElement.name = marbleName;
  marbleElement.duration = duration * 10;
  marbleElement.slot = 'marbles';
  marbleElement.handleTimeOut = () => delete activeMarbles[marbleId];
  marbleElement.handleClick = valueClick;

  const groupEl = document.getElementById(groupId);
  if(groupEl) groupEl.appendChild(marbleElement);
}

function onSubscribe({ marbleId }) {
  const marble = document.getElementById(marbleId);
  if (marble) {
    marble.startTime = new Date().getTime();
    activeMarbles[marbleId] = marble;
  }
}


function onReload() {
  activeMarbles = {}

  const group = document.getElementsByClassName('groups')[0];
  while (group.firstChild) {
    group.firstChild.remove();
  }
}

function onValue({ marbleId, value }) {
  const marble = activeMarbles[marbleId];
  if (marble) marble.next(value);
}

function onError({ marbleId, error }) {
  const marble = activeMarbles[marbleId];
  if (marble) {
    marble.error(error);
  }
}

function onComplete({ marbleId }) {
  const marble = activeMarbles[marbleId];
  if (marble) {
    delete activeMarbles[marbleId];
    marble.complete();
  };
}

function valueClick(clickedEl, value) {
  tree.loadData({ value: JSON.parse(value) });
  document.querySelectorAll('rx-marble').forEach(marbleEl =>
    marbleEl.shadowRoot.querySelectorAll('.value').forEach(valueEl => valueEl.className = 'value')
  );
  clickedEl.className = 'value value--selected';
};

function step() {
  Object.values(activeMarbles).forEach(node => node.move(new Date().getTime()));
  requestAnimationFrame(step)
}

requestAnimationFrame(step)