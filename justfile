default:
    @just --list

build:
    mkdir -p out
    npx --yes @bytecodealliance/jco componentize src/index.mjs --wit wit/world.wit --world-name function --out out/{{project-name}}.wasm --disable=all

inspect: build
    wasm-tools component wit out/{{project-name}}.wasm
