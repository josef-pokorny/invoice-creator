import _ from "lodash";

import { AppStoragePrefix, SupplierKeyPrefix } from "$lib/constants";
import type { ISupplierBilling } from "$lib/pdf/invoice-types";

import { useLocalStorageStore } from "./sharedStore.svelte";

export const ImportSupplierKeyPrefix = AppStoragePrefix + SupplierKeyPrefix;

export const defaultSupplier: ISupplierBilling = {
    fullname: "",
    line1: "",
    postal: "",
    city: "",
    country: "",
    ine: "",
    vat: "",
    isSelfEmployed: false,
};

export function useSupplierStore({
    initialValue,
    key = "",
}: {
    initialValue?: typeof defaultSupplier;
    key?: string;
} = {}) {
    const store = useLocalStorageStore({
        key: SupplierKeyPrefix + key,
        defaultValue: defaultSupplier,
        initialValue,
    });

    return store;
}

export interface IDefaultSupplierKey {
    supplierName: string;
}

export const defaultSupplierKey: IDefaultSupplierKey = {
    supplierName: "",
};

export function useSupplierKeyStore({
    initialValue,
}: {
    initialValue?: IDefaultSupplierKey;
} = {}) {
    const store = useLocalStorageStore({
        key: "supplierkey-store",
        defaultValue: defaultSupplierKey,
        initialValue,
    });

    return store;
}

const rootCleanUp = $effect.root(() => {
    const supplierKeyStore = useSupplierKeyStore();
    const supplierStore = $derived(
        useSupplierStore({
            get key() {
                return supplierKeyStore.value.supplierName;
            },
        }),
    );

    const supplierEmptyStore = useSupplierStore({
        key: "",
    });

    $effect(() => {
        ({ ...supplierStore.value });

        if (!_.isEmpty(supplierStore.key)) {
            supplierEmptyStore.value = _.cloneDeep(supplierStore.value);
        }
    });

    return () => {
        rootCleanUp();
    };
});
