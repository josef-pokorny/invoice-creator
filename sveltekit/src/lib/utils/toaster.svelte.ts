import _ from "lodash";
import { type AddToastArgs, Toaster } from "melt/builders";

import { type ToastData, useToasterStore } from "$lib/stores/toaster.svelte";

const toaster = useToasterStore({
    initialValue: new Toaster<ToastData>(),
}).value;

export const addToast = (args: AddToastArgs<ToastData>) => {
    if (_.isString(args.data.description) && args.closeDelay) {
        args.closeDelay = args.closeDelay + args.data.description?.length * 30;
    }
    if (_.isString(args.data.title) && args.closeDelay) {
        args.closeDelay = args.closeDelay + args.data.title.length * 30;
    }

    if (toaster) {
        toaster.addToast(args);
    }
};
