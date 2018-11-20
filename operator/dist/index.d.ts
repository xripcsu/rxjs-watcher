import { Observable } from 'rxjs';
export declare const getDebugGroup: (groupName: string, duration?: number) => (marbleName: string) => (source: Observable<any>) => Observable<any>;
