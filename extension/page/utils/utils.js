export function removeChilds(...elements) {
    elements.forEach(element => {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    });
}