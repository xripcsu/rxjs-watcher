import { OperatorFunction } from "rxjs";
export declare const disableRxjsWatcher: () => void;
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
export declare function getGroup(groupName: string, duration?: number): <T>(marbleName: string, selector?: ((value: T) => any) | undefined) => OperatorFunction<T, T>;
/**
 * Pipeable operator to visualize rxjs marble
 * @param marbleName title for marble
 * @param duration duration in seconds
 * @param selector selector function to change value shown in extension
 * @example
 * const interval$ = interval(1000).pipe(
 *   watch('source'),
 *   filter(value => value % 2 === 0),
 *   watch('filter odd numbers out')
 * )
 */
export declare function watch<T>(marbleName: string, duration?: number, selector?: (value: T) => any): OperatorFunction<T, T>;
/**
 * Helper function to get array of watch operators with specified duration
 * @param durations sequence of durations in seconds
 * @example
 * const [watch10, watch20] = getWatchers(10, 20);
 * interval(1000).pipe(watch10('Inerval'))
 */
export declare const getWatchers: (...durations: number[]) => (<T>(name: string, selector?: ((value: T) => any) | undefined) => OperatorFunction<T, T>)[];
