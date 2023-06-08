import stylelint, { Rule } from "stylelint";

export const message =
  "Внутренняя реализация компонентов, включая их классы — не публичное API VKUI и может измениться в любой момент без предупреждения. Не привязывайтесь к ней, если хотите сохранить возможность без проблем обновляться на новые версии библиотеки.";

export const ruleName = "plugin/vkui";
const messages = stylelint.utils.ruleMessages(ruleName, {});
const meta = {
  url: "https://github.com/VKCOM/stylelint-config/tree/master/src/stylelint-vkui",
};

const ruleFunction: Rule = () => {
  return (root, result) => {
    root.walkRules(/\.vkui/, (node) => {
      stylelint.utils.report({
        ruleName,
        node,
        result,
        message,
      });
    });

    root.walkRules(/class[*~^$|]?=['"].*?vkui.*?['"]/, (node) => {
      stylelint.utils.report({
        ruleName,
        node,
        result,
        message,
      });
    });

    root.walkDecls(/^--vkui_internal/, (node) => {
      stylelint.utils.report({
        ruleName,
        node,
        result,
        message,
      });
    });

    root.walkDecls((node) => {
      if (node.value.indexOf("--vkui_internal") > -1) {
        stylelint.utils.report({
          ruleName,
          node,
          result,
          message,
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
