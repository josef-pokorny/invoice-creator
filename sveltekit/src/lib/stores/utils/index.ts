export const UndefinedReplacement = "undefinened#6Wundefinened";

export function saveToLocalStorage<T>(localStorageKey: string, value: T) {
    localStorage.setItem(
        localStorageKey,
        JSON.stringify(value, (k, v) =>
            v === undefined ? UndefinedReplacement : v,
        ),
    );
}
