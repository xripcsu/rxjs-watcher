export function removeChilds(...elements) {
    elements.forEach(element => {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    });
}

export function html([template]) {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = template;
    return templateElement;
}