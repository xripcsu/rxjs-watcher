export function serialize(obj, depth = 0, references = []) {
    if (obj instanceof Window) {
        return "window";
    }
    else if (obj instanceof Node && depth > 1) {
        return "Node (to see this value use selector)";
    }
    else if (typeof obj === "function") {
        return "function";
    }
    else if (typeof obj === "object") {
        if (!references.includes(obj)) {
            references.push(obj);
            const isArray = Array.isArray(obj);
            let out;
            for (const key in obj) {
                const value = obj[key];
                out = isArray
                    ? [...(out || []), serialize(value, depth + 1, references)]
                    : Object.assign({}, (out || {}), { [key]: serialize(value, depth + 1, references) });
            }
            return out;
        }
        else {
            return "Circular reference";
        }
    }
    else {
        return obj;
    }
}
