## Flow

### Developing

```bash
pnpm i
```

```bash
pnpm run dev
```

### Building

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

## TODO

- [ ] en translation for invoice
- [x] rerender invoice on item property change
- [x] FIX: date with wrong title in invoice
- [x] sum every single column
- [x] Ares autocomplete
- [x] Storing "profiles" of invoices (different keys in localStorage)
- [x] Exporting/importing profiles to JSON file ("key-from-local-storage: { ...profile }")
- [x] Sharing (navigator.share())
- [x] Deleting profiles
- [x] Make multiple pages pdf when more items (activate pages buttons in svelte-pdf, add "Page x of y" in footer)
- [ ] Checking VAT ID with VIES (https://ec.europa.eu/taxation_customs/vies/#/technical-information) - npm: https://www.npmjs.com/package/viesapi-client
- [x] Rename "Profiles" to "Invoices"
- [ ] Storing suppliers and receivers (button -> dialog for storing with name), autocomplete in form
    - [x] Suppliers
    - [ ] Receivers
- [ ] Message in suppliers/receivers that it will store to that object
- [ ] Exporting suppliers/receivers along with invoices
- [x] Move invoices list from dialog
- [x] Searching for invoices in the list
- [ ] Move PDF preview to Resizable group

## FIX

- [x] !!!! Cant update supplier name
- [ ] !!! Cant scroll and touch on touch devices (even on browser simulated) when scrolling/touching is done on the lower side of display. Idk why, possibly something with paneforge
