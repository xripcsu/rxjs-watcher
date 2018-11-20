import { Observable } from 'rxjs';
import { finalize, tap, startWith, filter } from 'rxjs/operators';

const generateId = () => Math.random().toString(36).substr(2, 5);

export const getDebugGroup = (groupName: string, duration: number = 10) => {
    const groupId = generateId()
    getSender(groupId)('GROUP_INIT', { groupName });
    return (marbleName: string) => {
        const marbleId = generateId();
        const sendMessage = getSender(groupId, marbleId)
        sendMessage('MARBLE_INIT', { marbleName });
        return (source: Observable<any>) => {
            return source.pipe(
                startWith(duration * 10),
                filter((value, index) => {
                    if(index === 0) {
                        sendMessage('SUBSCRIBE', { interval: value });
                        return false;
                    } else {
                        return true
                    }
                }),
                tap((value) => sendMessage('VALUE', { value: JSON.stringify(value) })),
                finalize(() => sendMessage('COMPLETE'))
            );
        };
    }
}

const getSender = (groupId: string, marbleId?: string) => (type: string, body?: any) => {
    postMessage({
        message: {
            type,
            body: {
                ...body,
                groupId,
                marbleId
            }
        },
        source: 'rx-visualize'
    }, '*')
}