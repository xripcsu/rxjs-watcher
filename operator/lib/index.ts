import { Observable, defer, throwError } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';

const generateId = () => Math.random().toString(36).substr(2, 5);

const getSender = ({groupId, marbleId}: any) => (type: string, body?: any) => {
  postMessage({
    message: {
      type,
      body: { ...body, groupId, marbleId}
    },
    source: 'rxjs-watcher'
  }, '*');
};

/**
 * Create group in devtools panel and return pipeable operator to visualize rxjs marbles in specific group
 * @param groupName title for group
 * @param duration duration in seconds
 * @example
 * const watchInGroup = getGroup('Interval of even numbers', 20);
 * const interval$ = interval(1000).pipe(
 *     watchInGroup('source'),
 *     filter(value => value % 2 === 0),
 *     watchInGroup('filter odd numbers out')
 * )
 */
export function getGroup(groupName: string, duration = 10) {
  const groupId = generateId();
  getSender({groupId})('GROUP_INIT', { groupName });
  return function (marbleName: string) {
      const marbleId = generateId();
      const sendMessage = getSender({groupId, marbleId});
      sendMessage('MARBLE_INIT', { marbleName, duration });
      return operatorFactory(sendMessage);
  };
}

/**
 * Pipeable operator to visualize rxjs marble
 * @param marbleName title for marble
 * @param duration duration in seconds
 * @example
 * const interval$ = interval(1000).pipe(
 *     watch('source'),
 *     filter(value => value % 2 === 0),
 *     watch('filter odd numbers out')
 * )
 */
export function watch(marbleName: string, duration = 10) {
    const marbleId = generateId();
    const sendMessage = getSender({marbleId});
    sendMessage('MARBLE_INIT', { marbleName, duration });
    return operatorFactory(sendMessage);
}

const operatorFactory = (sender: Function) => <T>(source: Observable<T>) => defer(() => {
    sender('SUBSCRIBE');
    return source.pipe(
        catchError(error => {
            sender('ERROR', {error});
          return throwError(error);
        }),
        tap((value) => sender('NEXT', { value: JSON.stringify(value) })),
        finalize(() => sender('COMPLETE'))
    );
});


