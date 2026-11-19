Все изменения делаем в отдельной ветке.

Используем Yarn 4 через Corepack (версия закреплена в `package.json`):

```sh
npm install --global corepack
corepack enable
yarn install --immutable
```

Для разработки используем версию Node.js из `.nvmrc`. Тесты запускаются встроенным раннером Node.js и проверяют собранные плагины:

```sh
yarn build
yarn test
```

1. Вносим и коммитим изменения.
2. Создаем MR в master.
3. После принятия MR запускам GitHub Actions -> Publish, указав новую версию. Мы следуем принципам semver.
4. Обязательно в releases пишем, что поменялось.
