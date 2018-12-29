import { html } from './../../utils/utils.js';

const templateElement = html`
    <link rel="stylesheet" href="./components/marble/marble.css">
    <h3></h3>
    <div class="marble">
        <div class="line">
            <div class="past-line"></div>
        </div>
    </div>
`

export class Marble extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateElement.content.cloneNode(true));
        this.index = 0;
        this.startTime;
        this.duration;
    }

    set name(name) {
        this.shadowRoot.querySelector('h3').innerHTML = name;
    }

    set lineWidth(width) {
        const line = this.shadowRoot.querySelector('.past-line');
        line.style.width = `${width}%`;
    }

    move(currentTime) {
        const lineWidth = (currentTime - this.startTime) / this.duration;
        if (lineWidth === 1000 || lineWidth > 100) {
            this.handleTimeOut();
        }
        this.lineWidth = lineWidth;
    }

    appendPoint(type, content = '', offset = 0 ) {
        const left = (new Date().getTime() - this.startTime) / this.duration;
        const el = document.createElement('div')
        el.style.left = `calc(${left}% - ${offset}px)`;
        el.className = `point ${type}`;
        el.innerHTML = content;
        this.lineWidth = left;
        this.shadowRoot.querySelector('.marble').appendChild(el);

        return el;
    }

    next(value) {
        const el = this.appendPoint('value', this.index, 12.5);
        el.addEventListener('click', () => this.handleClick(el, {value: JSON.parse(value) }));
        this.index++;
    }

    error(error) {
        const el = this.appendPoint('error', '&times', 12.5);
        el.addEventListener('click', () => this.handleClick(el, {error: JSON.parse(error)}));
    }

    complete() {
        this.appendPoint('complete');
    }
}

