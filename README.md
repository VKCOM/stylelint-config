# @vkontakte/stylelint-config

Правила линтинга CSS от [VK](https://vk.com/).

## Установка

`yarn add @vkontakte/stylelint-config` или `npm i @vkontakte/stylelint-config`

Учтите, что помимо основого пакета, вам нужно установить его peerDependencies. Выполните команду
`npm info "@vkontakte/stylelint-config" peerDependencies`, чтобы увидеть требуемые версии зависимостей.

## Использование

В вашем .stylelintrc.json добавьте extends:

```js
// .stylelintrc.json

modules.exports = {
  "extends": ["@vkontakte/stylelint-config"]
}
```
