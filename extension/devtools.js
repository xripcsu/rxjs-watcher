chrome.devtools.panels.create(
  'Rx debug', // title for the panel tab
  null, // you can specify here path to an icon
  'src/panel.html', // html page for injecting into the tab's content
  null // you can pass here a callback function
);