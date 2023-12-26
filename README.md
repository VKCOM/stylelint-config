# @vkontakte/stylelint-config

Правила линтинга CSS от [VK](https://vk.com/).

## Установка

```sh
yarn add -D @vkontakte/stylelint-config stylelint stylelint-declaration-strict-value postcss
```

или

```sh
npm install -D @vkontakte/stylelint-config stylelint stylelint-declaration-strict-value postcss
```

## Использование

```js
// на примере, .stylelintrc.js

modules.exports = {
  extends: ["@vkontakte/stylelint-config"],
};
```
