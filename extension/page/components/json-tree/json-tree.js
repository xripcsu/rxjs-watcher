import { html } from './../../utils/utils.js';

const templateComponent = html`   
    <link href="libs/jsonTree/jsonTree.css" rel="stylesheet" />
    <link rel="stylesheet" href="./components/json-tree/json-tree.css">
    <div class="border"></div>
    <div class="json-wrapper"></div>
`

export class JsonTree extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateComponent.content.cloneNode(true));
        this.tree =  jsonTree.create({}, shadowRoot.querySelector('.json-wrapper'));
    }
    
    connectedCallback() {
        const border = this.shadowRoot.querySelector('.border');

        const resize = this.resize.bind(this);

        border.addEventListener("mousedown", (e) =>{
            document.addEventListener("mousemove", resize, false);
        }, false);
        
        document.addEventListener("mouseup", (e) => {
            document.removeEventListener("mousemove", resize, false);
        }, false);

        border.addEventListener('dblclick', e => {
            this.shadowRoot.querySelector('.json-wrapper').style.width = `max-content`;
        })
    }

    resize(event) {
        const width = document.body.offsetWidth - event.clientX;
        if(width > 200) {
            this.shadowRoot.querySelector('.json-wrapper').style.width = `${width}px`;
        }
    }

    set json(value) {
        this.tree.loadData(value);
    }
}

