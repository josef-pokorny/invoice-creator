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
- [ ] Sharing (navigator.share())
- [x] Deleting profiles
- [ ] Make multiple pages pdf when more items (activate pages buttons in svelte-pdf, add "Page x of y" in footer)
