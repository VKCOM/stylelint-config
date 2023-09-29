# Stylelint logical shorthands

Плагин запрещает использование четырехнаправленных сокращений для свойств:

- `inset`
- `margin`
- `padding`
- `scroll-padding`
- `scroll-margin`
- `border-width`
- `border-style`
- `border-color`
- `border-radius`

Если вам необходимо запретить `padding-left` и прочие физические свойства,
используйте [stylelint-use-logical](https://github.com/csstools/stylelint-use-logical)

## Причины

Сокращения свойств `margin`, `padding`, `border-*`, `scroll-*` устанавливают
физические величины. То есть

```css
.block {
  margin: 1em 2em 3em 4em;
}
```

эквивалентно

```css
.block {
  margin-top: 1em;
  margin-right: 2em;
  margin-bottom: 3em;
  margin-left: 4em;
}
```

Это противоречит концепции [css logical](https://www.w3.org/TR/css-logical-1/).
Поэтому требуется запретить использование четырехнаправленные сокращения

На данный момент(2023 год) существует [черновик](https://www.w3.org/TR/css-logical-1/#logical-shorthand-keyword)
на добавление ключевого слова `logical`, но c большой вероятностью от него
откажутся.

## Пример запретов

```diff
/* Apply to all four sides */
margin: 1em; // ok

/* top and bottom | left and right */
- margin: 5% auto;
+ margin-block: 5%;
+ margin-inline: auto;

/* top | left and right | bottom */
- margin: 1em auto 2em;
+ margin-block: 1em 2em;
+ margin-inline: auto;

/* top | right | bottom | left */
- margin: 2px 1em 0 auto;
+ margin-block: 2px 0;
+ margin-inline: 1em auto;

/* Global values */
margin: inherit; // ok
margin: initial; // ok
margin: revert; // ok
margin: revert-layer; // ok
margin: unset; // ok
```
