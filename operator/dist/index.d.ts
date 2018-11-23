import { Observable } from 'rxjs';
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
export declare function getGroup(groupName: string, duration?: number): (marbleName: string) => <T>(source: Observable<T>) => Observable<T>;
