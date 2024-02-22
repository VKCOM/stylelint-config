import stylelint, { Rule } from "stylelint";

export const message =
  "Не используйте css переменные внутри универсального селектора. Это может привести к большому потреблению памяти";

export const ruleName = "plugin/css-property-memory";
const messages = stylelint.utils.ruleMessages(ruleName, {});
const meta = {
  url: "https://github.com/VKCOM/stylelint-config/tree/master/src/stylelint-css-property-memory",
};

const ruleFunction: Rule = () => {
  return (root, result) => {
    root.walkRules(/\*/, (node) => {
      node.walkDecls(/^--/, (node) => {
        stylelint.utils.report({
          ruleName,
          node,
          result,
          message,
        });
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
