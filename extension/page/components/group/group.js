import { html } from './../../utils/utils.js';

const templateElement = html`
    <link rel="stylesheet" href="./components/group/group.css">
    <header>
        <h2></h2>
        <span class="chevron"></span>
    </header>
    <div class="marbles-wrapper">
        <slot name="marbles"></slot>
    </div>
`

export class Group extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateElement.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('header').addEventListener('click', () => {
            this.shadowRoot.host.classList.toggle('hidden')
        })
    }

    set name(name) {
        this.shadowRoot.querySelector('h2').innerHTML = name;
    }
}

