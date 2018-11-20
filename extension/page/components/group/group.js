const groupTemplate = document.currentScript.ownerDocument.querySelector('#group');

class Group extends HTMLElement {
    constructor() {
        super(); // always call super() first in the constructor.
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(groupTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        let height = null;
        let opened = true;
        this.shadowRoot.querySelector('h2').addEventListener('click', () => {
            const marblesWrapper = this.shadowRoot.querySelector('.marbles-wrapper');
            if(height === null) {
                height = this.shadowRoot.querySelector('.marbles-wrapper').offsetHeight;
                marblesWrapper.style.height = `${height}px`;
            }
            marblesWrapper.style.height = `${opened ? 0 : height}px`;
            opened = !opened;
        })
    }


    set name(name) {
        this.shadowRoot.querySelector('h2').innerHTML = name;
    }
}

customElements.define('rx-group', Group);