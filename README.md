# {{project-name}}

Starter template for a Fluor function in JavaScript using `jco componentize`.

## Requirements

- Node.js 20+
- `npx` available
- `just`: `cargo install just`
- Optional inspection: `cargo install --locked wasm-tools`

## Build

```bash
just build
```

This uses `npx @bytecodealliance/jco componentize` and produces `out/{{project-name}}.wasm`.

The generated component implements Fluor's `v2` contract with an exported `handler` interface object.
