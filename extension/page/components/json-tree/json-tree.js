const JsonTreeTemplate = document.createElement('template');
JsonTreeTemplate.innerHTML = //html
`   <style>
        :host {
            border-left: 1px solid #eee;
            display: flex;
        }

        .border {
            width: 1px;
            height: 100%;
            user-select: none;
            flex-shrink: 0;
            cursor: col-resize;
            background-color: #eee;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .json-wrapper {
            width: 300px;
            overflow: auto;
        }

        .jsontree_tree {
            width: max-content;
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
    <link href="libs/jsonTree/jsonTree.css" rel="stylesheet" />
    <div class="border" dragable="true"></div>
    <div class="json-wrapper"></div>
`

class JsonTree extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(JsonTreeTemplate.content.cloneNode(true));
        this.tree =  jsonTree.create({}, shadowRoot.querySelector('.json-wrapper'));

        function resize(e){
            const width = document.body.offsetWidth - e.clientX;
            shadowRoot.querySelector('.json-wrapper').style.width = `${width}px`;
        }
        
        const border = shadowRoot.querySelector('.border');
        border.addEventListener("mousedown", (e) =>{
            document.addEventListener("mousemove", resize, false);
        }, false);
        
        document.addEventListener("mouseup", (e) => {
            document.removeEventListener("mousemove", resize, false);
        }, false);

    }

    set json(value) {
        this.tree.loadData({ value: JSON.parse(value) });
    }
}

customElements.define('json-tree', JsonTree);