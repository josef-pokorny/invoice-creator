export const prerender = true;
export const csr = true;

// long pending on dev server fix (maybe):
import { dev } from "$app/environment";
export const ssr = !dev;
