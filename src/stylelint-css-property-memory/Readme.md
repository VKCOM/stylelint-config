# Stylelint css

Плагин запрещает создавать [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
для универсального селектора из-за большого потребления оперативной памяти.

```css
// 🛑 Не используйте css переменные внутри универсального селектора
* {
  --bad: red;
}
```
