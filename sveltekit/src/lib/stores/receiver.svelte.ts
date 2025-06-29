import _ from "lodash";

import { AppStoragePrefix, ReceiverKeyPrefix } from "$lib/constants";
import type { IReceiverBilling } from "$lib/pdf/invoice-types";

import { useLocalStorageStore } from "./sharedStore.svelte";

export const ImportReceiverKeyPrefix = AppStoragePrefix + ReceiverKeyPrefix;

export const defaultReceiver: IReceiverBilling = {
    fullname: "",
    line1: "",
    postal: "",
    city: "",
    country: "",
    ine: "",
    vat: "",
};

export function useReceiverStore({
    initialValue,
    key = "",
}: {
    initialValue?: typeof defaultReceiver;
    key?: string;
} = {}) {
    const store = useLocalStorageStore({
        key: ReceiverKeyPrefix + key,
        defaultValue: defaultReceiver,
        initialValue,
    });

    return store;
}

export interface IDefaultReceiverKey {
    receiverName: string;
}

export const defaultReceiverKey: IDefaultReceiverKey = {
    receiverName: "",
};

export function useReceiverKeyStore({
    initialValue,
}: {
    initialValue?: IDefaultReceiverKey;
} = {}) {
    const store = useLocalStorageStore({
        key: "receiverkey-store",
        defaultValue: defaultReceiverKey,
        initialValue,
    });

    return store;
}

const rootCleanUp = $effect.root(() => {
    const receiverKeyStore = useReceiverKeyStore();
    const receiverStore = $derived(
        useReceiverStore({
            get key() {
                return receiverKeyStore.value.receiverName;
            },
        }),
    );

    const receiverEmptyStore = useReceiverStore({
        key: "",
    });

    $effect(() => {
        ({ ...receiverStore.value });

        if (!_.isEmpty(receiverStore.key)) {
            receiverEmptyStore.value = receiverStore.value;
        }
    });

    return () => {
        rootCleanUp();
    };
});
