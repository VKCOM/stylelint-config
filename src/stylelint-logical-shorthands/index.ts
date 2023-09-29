import stylelint, { Rule } from "stylelint";
import valueParser from "postcss-value-parser";
import postcss from "postcss";
import {
  messageReportBorder,
  messageReportBorderRadius,
  messageReportSimple,
} from "./messageReport";

function ignoreCommentAndSpaceNodes(valueNode: valueParser.Node): boolean {
  return valueNode.type !== "comment" && valueNode.type !== "space";
}

/**
 * Собирает сообщение в зависимости от свойства
 */
export function messageReport(prop: string) {
  if (prop === "border-radius") {
    return messageReportBorderRadius(prop);
  } else if (prop.startsWith("border")) {
    return messageReportBorder(prop);
  }

  return messageReportSimple(prop);
}

/**
 * Преобразует название свойства в логическое.
 *
 * ```js
 * logicalProp('margin', 'block') //=> 'margin-block'
 * logicalProp('border-width', 'block') //=> 'border-block-width'
 * ```
 */
function logicalProp(prop: string, type: string) {
  if (prop.startsWith("border")) {
    return prop.replace("-", `-${type}-`);
  }

  return `${prop}-${type}`;
}

/**
 * Превращает свойства из физических в логические
 */
function fixSimple(node: postcss.Declaration, valueNodes: valueParser.Node[]) {
  let blockValue = "";
  let inlineValue = "";

  switch (valueNodes.length) {
    case 2:
      blockValue = valueParser.stringify(valueNodes[0]);
      inlineValue = valueParser.stringify(valueNodes[1]);
      break;
    case 3:
      blockValue =
        valueParser.stringify(valueNodes[0]) +
        " " +
        valueParser.stringify(valueNodes[2]);
      inlineValue = valueParser.stringify(valueNodes[1]);
      break;
    case 4:
      blockValue =
        valueParser.stringify(valueNodes[0]) +
        " " +
        valueParser.stringify(valueNodes[2]);
      inlineValue =
        valueParser.stringify(valueNodes[1]) +
        " " +
        valueParser.stringify(valueNodes[3]);
      break;
    default:
      return;
  }

  node.after({
    prop: logicalProp(node.prop, "inline"),
    value: inlineValue,
    important: node.important,
  });
  node.after({
    prop: logicalProp(node.prop, "block"),
    value: blockValue,
    important: node.important,
  });
  node.remove();
}

/**
 * Превращает свойства из физических в логические для border radius
 */
function fixBorderRadius(
  node: postcss.Declaration,
  valueNodes: valueParser.Node[]
) {
  let startStartValue = "";
  let startEndValue = "";
  let endEndValue = "";
  let endStartValue = "";

  let firstStartStartValue = "";
  let firstStartEndValue = "";
  let firstEndEndValue = "";
  let firstEndStartValue = "";

  const indexDiv = valueNodes.findIndex(
    (valueNode) => valueNode.type === "div"
  );

  switch (indexDiv) {
    case 1:
      const v = valueParser.stringify(valueNodes[0]) + " ";
      firstStartStartValue = v;
      firstStartEndValue = v;
      firstEndEndValue = v;
      firstEndStartValue = v;
      break;
    case 2:
      firstStartStartValue = valueParser.stringify(valueNodes[0]) + " ";
      firstStartEndValue = valueParser.stringify(valueNodes[1]) + " ";
      firstEndEndValue = valueParser.stringify(valueNodes[0]) + " ";
      firstEndStartValue = valueParser.stringify(valueNodes[1]) + " ";
      break;
    case 3:
      firstStartStartValue = valueParser.stringify(valueNodes[0]) + " ";
      firstStartEndValue = valueParser.stringify(valueNodes[1]) + " ";
      firstEndEndValue = valueParser.stringify(valueNodes[2]) + " ";
      firstEndStartValue = valueParser.stringify(valueNodes[1]) + " ";
      break;
    case 4:
      firstStartStartValue = valueParser.stringify(valueNodes[0]) + " ";
      firstStartEndValue = valueParser.stringify(valueNodes[1]) + " ";
      firstEndEndValue = valueParser.stringify(valueNodes[2]) + " ";
      firstEndStartValue = valueParser.stringify(valueNodes[3]) + " ";
      break;
  }

  switch (valueNodes.length - (indexDiv + 1)) {
    case 1:
      const v = valueParser.stringify(valueNodes[indexDiv + 1]);
      startStartValue = v;
      startEndValue = v;
      endEndValue = v;
      endStartValue = v;
      break;
    case 2:
      startStartValue = valueParser.stringify(valueNodes[indexDiv + 1]);
      startEndValue = valueParser.stringify(valueNodes[indexDiv + 2]);
      endEndValue = valueParser.stringify(valueNodes[indexDiv + 1]);
      endStartValue = valueParser.stringify(valueNodes[indexDiv + 2]);
      break;
    case 3:
      startStartValue = valueParser.stringify(valueNodes[indexDiv + 1]);
      startEndValue = valueParser.stringify(valueNodes[indexDiv + 2]);
      endEndValue = valueParser.stringify(valueNodes[indexDiv + 3]);
      endStartValue = valueParser.stringify(valueNodes[indexDiv + 2]);
      break;
    case 4:
      startStartValue = valueParser.stringify(valueNodes[indexDiv + 1]);
      startEndValue = valueParser.stringify(valueNodes[indexDiv + 2]);
      endEndValue = valueParser.stringify(valueNodes[indexDiv + 3]);
      endStartValue = valueParser.stringify(valueNodes[indexDiv + 4]);
      break;
  }

  node.after({
    prop: "border-end-start-radius",
    value: firstEndStartValue + endStartValue,
    important: node.important,
  });
  node.after({
    prop: "border-end-end-radius",
    value: firstEndEndValue + endEndValue,
    important: node.important,
  });
  node.after({
    prop: "border-start-end-radius",
    value: firstStartEndValue + startEndValue,
    important: node.important,
  });
  node.after({
    prop: "border-start-start-radius",
    value: firstStartStartValue + startStartValue,
    important: node.important,
  });
  node.remove();
}

/**
 * Превращает свойства из физических в логические
 */
function fix(node: postcss.Declaration, valueNodes: valueParser.Node[]) {
  if (node.prop === "border-radius") {
    fixBorderRadius(node, valueNodes);
    return;
  }

  fixSimple(node, valueNodes);
}

export const ruleName = "plugin/logical-shorthands";
const messages = stylelint.utils.ruleMessages(ruleName, {});
const meta = {
  url: "https://github.com/VKCOM/stylelint-config/tree/master/src/stylelint-logical-shorthands",
};

const ruleFunction: Rule = (_, __, context) => {
  return (root, result) => {
    root.walkDecls(
      /^(inset|margin|padding|scroll-padding|scroll-margin|border-(width|style|color)|border-radius)$/,
      (node) => {
        const parsedValue = valueParser(node.value);
        const valueNodes = parsedValue.nodes.filter(ignoreCommentAndSpaceNodes);

        if (valueNodes.length === 1) {
          return;
        }

        if (context.fix) {
          fix(node, valueNodes);

          return;
        }

        const message = messageReport(node.prop);

        stylelint.utils.report({
          ruleName,
          node,
          result,
          message,
        });
      }
    );
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
