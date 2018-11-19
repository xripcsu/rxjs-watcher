import { finalize, tap, startWith, filter } from 'rxjs/operators';
const generateId = () => Math.random().toString(36).substr(2, 5);
export const getDebugGroup = (groupName, duration = 10) => {
    const groupId = generateId();
    getSender(groupId)('GROUP_INIT', { groupName });
    return (marbleName) => {
        const marbleId = generateId();
        const sendMessage = getSender(groupId, marbleId);
        sendMessage('MARBLE_INIT', { marbleName });
        return (source) => {
            return source.pipe(startWith(duration * 10), filter((value, index) => {
                if (index === 0) {
                    sendMessage('SUBSCRIBE', { interval: value });
                    return false;
                }
                else {
                    return true;
                }
            }), tap((value) => sendMessage('VALUE', { value: JSON.stringify(value) })), finalize(() => sendMessage('COMPLETE')));
        };
    };
};
const getSender = (groupId, marbleId) => (type, body) => {
    postMessage({
        message: {
            type,
            body: Object.assign({}, body, { groupId,
                marbleId })
        },
        source: 'rx-visualize'
    }, '*');
};
