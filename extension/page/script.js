import { removeChilds } from "./utils/utils.js";

const className = `theme-${chrome.devtools.panels.themeName}`;
document.body.classList.add(className);
document.querySelector(".right").classList.add(className);

const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect(null, { name: `panel-${tabId}` });

port.onMessage.addListener(({ type, body }) => {
  const handler = {
    GROUP_INIT: onGroupInit,
    MARBLE_INIT: onMarbleInit,
    SUBSCRIBE: onSubscribe,
    NEXT: onValue,
    ERROR: onError,
    COMPLETE: onComplete,
    RELOAD: onReload,
  }[type];

  handler && handler(body);
});

let activeMarbles = {};
let interval = null;
let lastClickedEl = null;

function onGroupInit({ groupId, groupName }) {
  const groupElement = document.createElement("rx-group");
  groupElement.id = groupId;
  groupElement.name = groupName;
  groupElement.classList.add(className);
  const groupsWrapper = document.querySelector(".groups");
  if (groupsWrapper) groupsWrapper.appendChild(groupElement);
}

function onMarbleInit({ groupId, marbleId, marbleName, duration }) {
  const marbleElement = document.createElement("rx-marble");
  marbleElement.id = marbleId;
  marbleElement.name = marbleName;
  marbleElement.duration = duration * 10;
  marbleElement.slot = "marbles";
  marbleElement.handleTimeOut = () => delete activeMarbles[marbleId];
  marbleElement.handleClick = valueClick;
  if (groupId) {
    const groupEl = document.getElementById(groupId);
    if (groupEl) groupEl.appendChild(marbleElement);
  } else {
    document.querySelector(".marbles").appendChild(marbleElement);
  }
}

function onSubscribe({ marbleId }) {
  const marble = document.getElementById(marbleId);
  if (marble) {
    marble.startTime = new Date().getTime();
    activeMarbles[marbleId] = marble;
    if (!interval) {
      interval = startAnimation();
    }
  }
}

function onReload() {
  activeMarbles = {};
  const groups = document.querySelector(".groups");
  const marbles = document.querySelector(".marbles");
  removeChilds(groups, marbles);
}

function onValue({ marbleId, value }) {
  const marble = activeMarbles[marbleId];
  if (marble) {
    marble.next(value);
  }
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
  }
}

function valueClick(clickedEl, value) {
  document.querySelector("json-tree").json = value;
  [lastClickedEl, clickedEl].forEach(
    (el) => el && el.classList.toggle("selected")
  );
  lastClickedEl = clickedEl;
}

function startAnimation() {
  return setInterval(() => {
    const marbles = Object.values(activeMarbles);
    marbles.forEach((node) => node.move(new Date().getTime()));
    if (!marbles.length) {
      clearInterval(interval);
      interval = null;
    }
  }, 100);
}
