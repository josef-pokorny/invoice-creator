import { browser } from "$app/environment";

let isMobile = $state(false);
let isMobileSmaller = $state(false);

export const getIsMobile = () => isMobile;
export const getIsMobileSmaller = () => isMobileSmaller;

function handleResize() {
    window.innerWidth;

    isMobile = window.innerWidth < 768;
    isMobileSmaller = window.innerWidth < 425;
}

$effect.root(() => {
    if (browser) {
        $effect(() => {
            handleResize();

            window.addEventListener("resize", handleResize);

            return () => window.removeEventListener("resize", handleResize);
        });
    }
});
