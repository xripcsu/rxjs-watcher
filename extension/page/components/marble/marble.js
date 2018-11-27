let marbleTemplate = document.createElement('template');
marbleTemplate.innerHTML = //html
`
    <link rel="stylesheet" href="./components/marble/marble.css">
    <h3></h3>
    <div class="marble">
        <div class="line">
            <div class="past-line"></div>
        </div>
    </div>
`


class Marble extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(marbleTemplate.content.cloneNode(true));
        this.index = 0;
        this.startTime;
        this.duration;
    }

    set name(name) {
        this.shadowRoot.querySelector('h3').innerHTML = name;
    }

    move(currentTime) {
        const line = this.shadowRoot.querySelector('.past-line');
        const lineWidth = (currentTime - this.startTime) / this.duration;
        if (lineWidth === 1000 || lineWidth > 100) {
            this.handleTimeOut();
        }
        line.style.width = `${lineWidth}%`;
    }

    next(value) {
        const el = document.createElement('div')
        el.className = 'point value';
        el.innerHTML = this.index;
        const left = (new Date().getTime() - this.startTime) / this.duration;
        el.style.left = `calc(${left}% - 12.5px)`;
        el.addEventListener('click', () => this.handleClick(el, value));
        this.shadowRoot.querySelector('.marble').appendChild(el);
        this.index++;
    }

    error() {
        const el = document.createElement('div');
        el.className = 'point error';
        el.style.left = `${(new Date().getTime() - this.startTime) / this.duration}%`;
        this.shadowRoot.querySelector('.marble').appendChild(el);
    }

    complete() {
        const el = document.createElement('div');
        el.className = 'point complete';
        el.style.left = `${(new Date().getTime() - this.startTime) / this.duration}%`;
        this.shadowRoot.querySelector('.marble').appendChild(el);
    }
}

customElements.define('rx-marble', Marble);