/**
 * lodash 함수 대체 유틸리티
 * 
 * 전략:
 * - debounce/throttle: just-debounce-it + just-throttle (검증된 경량 라이브러리)
 * - isEqual, omit 등: es-toolkit (경량)
 * - 단순 함수: native 구현
 */

// es-toolkit: 경량 유틸리티
export { isEqual, omit, range, groupBy, sortBy, noop } from 'es-toolkit';

// just-debounce-it + just-throttle: lodash 옵션 호환 래퍼
import justDebounce from 'just-debounce-it';
import justThrottle from 'just-throttle';

type AnyFunction = (...args: any[]) => any;

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * lodash 호환 debounce 래퍼
 * - {leading: true} → immediate mode
 * - {leading: false, trailing: true} → 기본 동작 (default)
 */
export function debounce<T extends AnyFunction>(
  func: T,
  wait = 0,
  options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => void } {
  const immediate = options.leading === true;
  return justDebounce(func, wait, immediate);
}

/**
 * lodash 호환 throttle 래퍼
 */
export function throttle<T extends AnyFunction>(
  func: T,
  wait = 0,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  return justThrottle(func, wait, {
    leading: options.leading ?? true,
    trailing: options.trailing ?? true
  });
}

// Native 대체 함수들
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value);

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

export const isDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const first = <T>(array: T[] | null | undefined): T | undefined =>
  array?.[0];

export const get = <T>(
  obj: unknown,
  path: string | string[],
  defaultValue?: T
): T | undefined => {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result: unknown = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }
  return (result as T) ?? defaultValue;
};

export const inRange = (value: number, start: number, end?: number): boolean => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return value >= Math.min(start, end) && value < Math.max(start, end);
};

export const times = <T>(n: number, iteratee: (index: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => iteratee(i));

export const flatten = <T>(array: (T | T[])[]): T[] =>
  array.flat() as T[];

export const dropRight = <T>(array: T[], n = 1): T[] =>
  n >= array.length ? [] : array.slice(0, -n);

export const findIndex = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): number => array.findIndex(predicate);

export const filter = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] => array.filter(predicate);

export const map = <T, R>(
  array: T[],
  iteratee: (value: T, index: number, array: T[]) => R
): R[] => array.map(iteratee);

export const some = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): boolean => array.some(predicate);

export const includes = <T>(array: T[], value: T): boolean =>
  array.includes(value);

export const min = (array: number[]): number | undefined =>
  array.length ? Math.min(...array) : undefined;

export const pickBy = <T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: unknown, key: string) => boolean
): Partial<T> => {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
};
