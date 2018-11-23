import { defer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
const generateId = () => Math.random().toString(36).substr(2, 5);
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
/**
 * Return pipeable operator to watch observable in devtools
 * @param groupName
 * @param duration
 * @example
 * const watch = getGroup('Interval of even numbers', 20);
 * const interval$ = interval(1000).pipe(
 *     watch('source'),
 *     filter(value => value % 2 === 0),
 *     watch('filter odd numbers out')
 * )
 */
export function getGroup(groupName, duration = 10) {
    const groupId = generateId();
    getSender(groupId)('GROUP_INIT', { groupName, interval: duration * 10 });
    return function (marbleName) {
        const marbleId = generateId();
        const sendMessage = getSender(groupId, marbleId);
        sendMessage('MARBLE_INIT', { marbleName });
        return (source) => defer(() => {
            sendMessage('SUBSCRIBE', { interval: duration * 10 });
            return source.pipe(tap((value) => sendMessage('VALUE', { value: JSON.stringify(value) })), finalize(() => sendMessage('COMPLETE')));
        });
    };
}
