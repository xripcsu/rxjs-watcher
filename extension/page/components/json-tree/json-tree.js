import { html, filterJsonTree, ignoreCaseIncludes } from "./../../utils/utils.js";

const templateComponent = html`
  <link href="libs/jsonTree/jsonTree.css" rel="stylesheet" />
  <link rel="stylesheet" href="./components/json-tree/json-tree.css" />
  <div class="border"><div class="border__visible"></div></div>

  <div class="json-wrapper">
    <div class="controls">
      <input type="text" placeholder="Filter properties" /> <button id="expand-btn">Expand</button>
      <button id="collapse-btn">Collapse</button>
    </div>
    <div class="json"></div>
  </div>
`;

export class JsonTree extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateComponent.content.cloneNode(true));
    this.tree = jsonTree.create({}, shadowRoot.querySelector(".json"));
    this.currentValue;
  }

  connectedCallback() {
    const border = this.shadowRoot.querySelector(".border");

    const resize = this.resize.bind(this);

    border.addEventListener(
      "mousedown",
      e => {
        document.body.style.cursor = "col-resize";
        document.addEventListener("mousemove", resize, false);
      },
      false
    );

    document.addEventListener(
      "mouseup",
      e => {
        document.body.style.cursor = "default";
        document.removeEventListener("mousemove", resize, false);
      },
      false
    );

    border.addEventListener("dblclick", this.resizeToFitContent.bind(this));

    const actions = [
      [
        "#collapse-btn",
        () => {
          this.tree.collapse();
          this.resizeToFitContent();
        }
      ],
      [
        "#expand-btn",
        () => {
          this.tree.expand();
          this.resizeToFitContent();
        }
      ]
    ];

    actions.forEach(([selector, cb]) =>
      this.shadowRoot.querySelector(selector).addEventListener("click", cb)
    );

    this.shadowRoot
      .querySelector("input")
      .addEventListener("keyup", e => this.loadData(e.target.value));
  }

  loadData(searched) {
    const [key, value] = Object.entries(this.currentValue)[0];
    const out = {[key]: (searched && typeof value === 'object') ? filterJsonTree(value, searched)[0] : value};
    this.tree.loadData(out);
    this.shadowRoot.querySelectorAll(".jsontree_label").forEach((el, index) => {
      if (index && searched && ignoreCaseIncludes(el.textContent, searched)) {
        el.classList.add("highlight");
      }
    });

    this.tree.expand();
  }

  resizeToFitContent() {
    const jsonTree = this.shadowRoot.querySelector(".jsontree_tree");
    const jsonWrapper = this.shadowRoot.querySelector(".json-wrapper");
    jsonWrapper.style.width = `${jsonTree.getClientRects()[0].width + 30}px`;
  }

  resize(event) {
    const width = document.body.offsetWidth - event.clientX;
    if (width > 350) {
      this.shadowRoot.querySelector(".json-wrapper").style.width = `${width - 10}px`;
    }
  }

  set json(value) {
    this.currentValue = value;
    const [_, rootValue] = Object.entries(this.currentValue)[0];
    this.shadowRoot.querySelector("input").disabled = (typeof rootValue !== 'object')
    const searched = this.shadowRoot.querySelector("input").value;
    this.loadData(searched);
    this.tree.expand(v => {
      return true;
    });
  }
}
