

const marbleTemplate = document.currentScript.ownerDocument.querySelector('#marble');

class Marble extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(marbleTemplate.content.cloneNode(true));
        this.index = 0;
        this.lineWidth;
        this.startTime;
        this.duration;
    }

    set name(name) {
        this.shadowRoot.querySelector('h3').innerHTML = name;
    }

    move(currentTime) {
        console.log((currentTime - this.startTime)/this.duration)
        const line = this.shadowRoot.querySelector('.past-line');
        this.lineWidth = (currentTime - this.startTime)/this.duration;
        if(this.lineWidth === 1000 || this.lineWidth > 100) {
            this.handleTimeOut();
        }
        line.style.width = `${this.lineWidth}%`;
    }

    next(value) {
        const el = document.createElement('div')
        el.className = 'value';
        el.innerHTML = this.index;
        el.style.left = `${(new Date().getTime() - this.startTime)/this.duration}%`;
        el.addEventListener('click', () => this.handleClick(el, value));
        this.shadowRoot.querySelector('.marble').appendChild(el);
        this.index++;
    }

    error() {
        const el = document.createElement('div');
        el.className = 'error';
        el.style.left = `${(new Date().getTime() - this.startTime)/this.duration}%`;
        this.shadowRoot.querySelector('.marble').appendChild(el);
    }

    complete() {
        const el = document.createElement('div');
        el.className = 'complete';
        el.style.left = `${(new Date().getTime() - this.startTime)/this.duration}%`;
        this.shadowRoot.querySelector('.marble').appendChild(el);
    }
}

customElements.define('rx-marble', Marble);