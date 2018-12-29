import { Group } from './group/group.js';
import { Marble } from './marble/marble.js';
import { JsonTree } from './json-tree/json-tree.js'

[
    ['rx-group', Group],
    ['json-tree', JsonTree],
    ['rx-marble', Marble]
].forEach(([selector, component]) => customElements.define(selector, component))
