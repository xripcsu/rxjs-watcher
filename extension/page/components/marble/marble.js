import { html } from './../../utils/utils.js';

const templateElement = html`
    <link rel="stylesheet" href="./components/marble/marble.css">
    <div class="d-flex">
        <h3></h3>
        <span class="message">Waiting for subscribe</span>
    </div>
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
        this.started = false;
        this.finishedWithError = false;
        this.overlapCount = 0;
    }

    set name(name) {
        this.shadowRoot.querySelector('h3').innerHTML = name;
    }

    set message(message) {
        this.shadowRoot.querySelector('.message').innerHTML = message;
    }

    set lineWidth(width) {
        const line = this.shadowRoot.querySelector('.past-line');
        line.style.width = `${width}%`;
    }

    move(currentTime) {
        this.overlapCount = 0;
        if (!this.started) {
            this.message = '';
        }
        const lineWidth = (currentTime - this.startTime) / this.duration;
        if (lineWidth === 1000 || lineWidth > 100) {
            this.handleTimeOut();
            this.message = 'Observable may still running, increase duration if you want to see what is going on'
        }
        this.lineWidth = lineWidth;
        this.started = true;
    }

    appendPoint(type, content = '', offset = 0 ) {
        const left = (new Date().getTime() - this.startTime) / this.duration;
        const el = document.createElement('div')
        el.style.left = `calc(${left}% - ${offset}px)`;
        if (type === 'value') {
            el.style.top = `${this.overlapCount * 15}px`
        }
        this.overlapCount++;
        el.className = `point ${type}`;
        el.innerHTML = content;
        this.lineWidth = left;
        this.shadowRoot.querySelector('.marble').appendChild(el);

        return el;
    }

    next(value) {
        const el = this.appendPoint('value', this.index, 12.5);
        el.addEventListener('click', () => this.handleClick(el, {value}));
        this.index++;
    }

    error(error) {
        const el = this.appendPoint('error', '&times', 12.5);
        el.addEventListener('click', () => this.handleClick(el, {error}));
        this.finishedWithError = true;
    }

    complete() {
        this.message = this.finishedWithError ? 'Observable finished with error' : 'Observable finished'
        this.appendPoint('complete');
    }
}

