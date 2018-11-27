import { Observable } from 'rxjs';
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
export declare function getGroup(groupName: string, duration?: number): (marbleName: string) => <T>(source: Observable<T>) => Observable<T>;
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
export declare function watch(marbleName: string, duration?: number): <T>(source: Observable<T>) => Observable<T>;
