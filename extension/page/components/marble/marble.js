

const marbleTemplate = document.currentScript.ownerDocument.querySelector('#marble');

class Marble extends HTMLElement {
    constructor() {
        super(); // always call super() first in the constructor.
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(marbleTemplate.content.cloneNode(true));
        this.lineWidth = 0;
        this.index = 0;
        this.interval;
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }

    startInterval(interval) {
        this.interval = setInterval(() => {
            this.lineWidth++;
            if(this.lineWidth === 100) {
                clearInterval(this.interval);
            }
            this.shadowRoot.querySelector('.past-line').style.width = `${this.lineWidth}%`;
        }, interval)
    }

    set name(name) {
        this.shadowRoot.querySelector('h3').innerHTML = name;
    }

    set frame(frame) {
        const el = document.createElement('div')
        el.className = 'value';
        el.innerHTML = this.index;
        el.style.left = `calc(${this.lineWidth}% - 12.5px)`;
        el.addEventListener('click', () => this.handleClick(el, frame));
        this.shadowRoot.querySelector('.marble').appendChild(el);
        this.index++;
    }

    complete() {    
        const el = document.createElement('div');
        const line = this.shadowRoot.querySelector('.past-line');

        el.className = 'complete';
        el.style.left = `${this.lineWidth + 1}%`;
        line.style.width = `${this.lineWidth + 1}%`;
        this.shadowRoot.querySelector('.marble').appendChild(el);
        clearInterval(this.interval);
    }
}

customElements.define('rx-marble', Marble);