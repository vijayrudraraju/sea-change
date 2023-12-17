# Sea Change

## Submission for BitRate 2020

## Local development

```
> brew install node
> cd sea-change
> npm i

In 2 terminal tabs:
> npm run build (1st tab)
> npm run serve (2nd tab)
```

## Local hosting

Simply:
```
npm run start
```

## Webpack

Webpack is used for TypeScript compilation and bundling.

See `webpack.config.js` for configuration.

## TypeScript

Typescript is an option but not required.

See `tsconfig.json` for configuration.

## Glitch.com

[How to Clone Glitch repo locally](https://support.glitch.com/t/possible-to-code-locally-and-push-to-glitch-with-git/2704/3)

```
> brew install node
> git clone $GLITCH_REPO_URL
> cd sea-change
> npm i
> npm run start
(check console for PORT: GOTO localhost:PORT)
```
