const groupTemplate = document.createElement('template');
groupTemplate.innerHTML = //html
`
    <style>
        :host {
            display: flex;
            flex-direction: column;
        }

        h2 {
            margin: 0;
            padding: 15px;
            background-color: #db1f60;
            color: #fff;
        }

        .marbles-wrapper {
            max-height: 270px;
            overflow: auto;
            border-bottom: 1px solid #eee;
            flex-grow: 1;
            transition: max-height 0.3s ease-in-out;
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
 
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        }
        
        ::-webkit-scrollbar-thumb {
            background-color: #6e6e6e;
            outline: #333 solid 1px;
        }

    </style>
    <h2></h2>
    <div class="marbles-wrapper">
        <slot name="marbles"></slot>
    </div>
`

class Group extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(groupTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        let opened = true;
        this.shadowRoot.querySelector('h2').addEventListener('click', () => {
            const marblesWrapper = this.shadowRoot.querySelector('.marbles-wrapper');
            marblesWrapper.style.maxHeight = `${opened ? 0 : 270}px`;
            marblesWrapper.children
            opened = !opened;
        })
    }


    set name(name) {
        this.shadowRoot.querySelector('h2').innerHTML = name;
    }
}

customElements.define('rx-group', Group);