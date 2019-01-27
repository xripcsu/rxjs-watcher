export function removeChilds(...elements) {
  elements.forEach(element => {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  });
}

export function html([template]) {
  const templateElement = document.createElement("template");
  templateElement.innerHTML = template;
  return templateElement;
}

export function ignoreCaseIncludes(string, searched) {
  return string.toLowerCase().includes(searched.toLowerCase());
}

export function filterJsonTree(obj, text) {
  let keyFound = false;
  const isArray = Array.isArray(obj);
  return [
    Object.entries(obj).reduce(
      (prev, [key, value]) => {
        if (typeof value === "object") {
          const [filteredObject, ancestorFound] = filterJsonTree(value, text);
          const keepProp = ancestorFound || ignoreCaseIncludes(key, text);
          if (!keyFound) {
            keyFound = keepProp;
          }
          return isArray
            ? [...prev, ...(keepProp ? [ancestorFound ? filteredObject : value] : [])]
            : { ...prev, ...(keepProp ? { [key]: ancestorFound ? filteredObject : value } : {}) };
        } else {
          const keepProp = ignoreCaseIncludes(key, text);
          if (!keyFound && !isArray) {
            keyFound = keepProp;
          }
          return isArray ? [...prev, value] : { ...prev, ...(keepProp ? { [key]: value } : {}) };
        }
      },
      isArray ? [] : {}
    ),
    keyFound
  ];
}
