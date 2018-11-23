import { Observable, defer, throwError } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';

const generateId = () => Math.random().toString(36).substr(2, 5);

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
    source: 'rxjs-watcher'
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
export function getGroup(groupName: string, duration = 10) {
  const groupId = generateId();
  getSender(groupId)('GROUP_INIT', { groupName });
  return function (marbleName: string) {
      const marbleId = generateId();
      const sendMessage = getSender(groupId, marbleId);
      sendMessage('MARBLE_INIT', { marbleName, duration });
      return <T>(source: Observable<T>) => defer(() => {
          sendMessage('SUBSCRIBE');
          return source.pipe(
              catchError(error => {
                  sendMessage('ERROR', {error});
                return throwError(error);
              }),
              tap((value) => sendMessage('NEXT', { value: JSON.stringify(value) })),
              finalize(() => sendMessage('COMPLETE'))
          );
      });
  };
}
