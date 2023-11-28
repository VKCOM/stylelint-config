import { getTestRule } from "jest-preset-stylelint";
import { messageReport, ruleName } from ".";

const testRule = getTestRule();

testRule({
  plugins: ["./src/stylelint-logical-shorthands/index.ts"],
  ruleName,
  config: true,
  fix: true,

  accept: [
    { code: `.class{inset: 0;}` },
    { code: `.class{margin: 0;}` },
    { code: `.class{padding: 0;}` },
    { code: `.class{scroll-padding: 0;}` },
    { code: `.class{scroll-margin: 0;}` },
    { code: `.class{border-width: 0;}` },
    { code: `.class{border-style: solid;}` },
    { code: `.class{border-color: red;}` },
    { code: `.class{border-radius: 0;}` },

    { code: `.class{inset: 0 !important;}` },
    { code: `.class{margin: 0 !important;}` },
    { code: `.class{padding: 0 !important;}` },
    { code: `.class{scroll-padding: 0 !important;}` },
    { code: `.class{scroll-margin: 0 !important;}` },
    { code: `.class{border-width: 0 !important;}` },
    { code: `.class{border-style: solid !important;}` },
    { code: `.class{border-color: red !important;}` },
    { code: `.class{border-radius: 0 !important;}` },
    { code: `.class{inset: 0 ! important ;}` },

    {
      code: `.class{inset: calc(-1 * var(--vkui_internal--popover_safe_zone_padding));}`,
    },
  ],

  reject: [
    {
      code: `.class{inset: 1em 2em;}`,
      fixed: `.class{inset-block: 1em;inset-inline: 2em;}`,
      message: messageReport("inset"),
    },
    {
      code: `.class{inset: 1em auto 2em;}`,
      fixed: `.class{inset-block: 1em 2em;inset-inline: auto;}`,
      message: messageReport("inset"),
    },
    {
      code: `.class{inset: 2px 1em 0 auto;}`,
      fixed: `.class{inset-block: 2px 0;inset-inline: auto 1em;}`,
      message: messageReport("inset"),
    },
    {
      code: `.class{margin: 1em 2em;}`,
      fixed: `.class{margin-block: 1em;margin-inline: 2em;}`,
      message: messageReport("margin"),
    },
    {
      code: `.class{margin: 1em auto 2em;}`,
      fixed: `.class{margin-block: 1em 2em;margin-inline: auto;}`,
      message: messageReport("margin"),
    },
    {
      code: `.class{margin: 2px 1em 0 auto;}`,
      fixed: `.class{margin-block: 2px 0;margin-inline: auto 1em;}`,
      message: messageReport("margin"),
    },
    {
      code: `.class{padding: 1em 2em;}`,
      fixed: `.class{padding-block: 1em;padding-inline: 2em;}`,
      message: messageReport("padding"),
    },
    {
      code: `.class{padding: 1em auto 2em;}`,
      fixed: `.class{padding-block: 1em 2em;padding-inline: auto;}`,
      message: messageReport("padding"),
    },
    {
      code: `.class{padding: 2px 1em 0 auto;}`,
      fixed: `.class{padding-block: 2px 0;padding-inline: auto 1em;}`,
      message: messageReport("padding"),
    },

    {
      code: `.class{scroll-padding: 1em 2em;}`,
      fixed: `.class{scroll-padding-block: 1em;scroll-padding-inline: 2em;}`,
      message: messageReport("scroll-padding"),
    },
    {
      code: `.class{scroll-margin: 1em 2em;}`,
      fixed: `.class{scroll-margin-block: 1em;scroll-margin-inline: 2em;}`,
      message: messageReport("scroll-margin"),
    },

    {
      code: `.class{inset: 1em 2em !important;}`,
      fixed: `.class{inset-block: 1em !important;inset-inline: 2em !important;}`,
      message: messageReport("inset"),
    },

    // Border
    {
      code: `.class{border-width: 1em 2em;}`,
      fixed: `.class{border-block-width: 1em;border-inline-width: 2em;}`,
      message: messageReport("border-width"),
    },
    {
      code: `.class{border-width: 1em auto 2em;}`,
      fixed: `.class{border-block-width: 1em 2em;border-inline-width: auto;}`,
      message: messageReport("border-width"),
    },
    {
      code: `.class{border-width: 2px 1em 0 auto;}`,
      fixed: `.class{border-block-width: 2px 0;border-inline-width: auto 1em;}`,
      message: messageReport("border-width"),
    },
    {
      code: `.class{border-width: 1em 2em !important;}`,
      fixed: `.class{border-block-width: 1em !important;border-inline-width: 2em !important;}`,
      message: messageReport("border-width"),
    },

    {
      code: `.class{border-width: 1em 2em;}`,
      fixed: `.class{border-block-width: 1em;border-inline-width: 2em;}`,
      message: messageReport("border-width"),
    },
    {
      code: `.class{border-style: solid dash;}`,
      fixed: `.class{border-block-style: solid;border-inline-style: dash;}`,
      message: messageReport("border-style"),
    },
    {
      code: `.class{border-color: red blue;}`,
      fixed: `.class{border-block-color: red;border-inline-color: blue;}`,
      message: messageReport("border-color"),
    },

    // border-radius
    {
      code: `.class{border-radius: 1em 2em;}`,
      fixed: `.class{border-start-start-radius: 1em;border-start-end-radius: 2em;border-end-end-radius: 1em;border-end-start-radius: 2em;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 1em 2em 3em;}`,
      fixed: `.class{border-start-start-radius: 1em;border-start-end-radius: 2em;border-end-end-radius: 3em;border-end-start-radius: 2em;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 1em 2em 3em 4em;}`,
      fixed: `.class{border-start-start-radius: 1em;border-start-end-radius: 2em;border-end-end-radius: 3em;border-end-start-radius: 4em;}`,
      message: messageReport("border-radius"),
    },

    {
      code: `.class{border-radius: 10% / 20%;}`,
      fixed: `.class{border-start-start-radius: 10% 20%;border-start-end-radius: 10% 20%;border-end-end-radius: 10% 20%;border-end-start-radius: 10% 20%;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 10% 50% / 20%;}`,
      fixed: `.class{border-start-start-radius: 10% 20%;border-start-end-radius: 50% 20%;border-end-end-radius: 10% 20%;border-end-start-radius: 50% 20%;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 10% 50% 25% / 20%;}`,
      fixed: `.class{border-start-start-radius: 10% 20%;border-start-end-radius: 50% 20%;border-end-end-radius: 25% 20%;border-end-start-radius: 50% 20%;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 10% 50% 25% 75% / 20%;}`,
      fixed: `.class{border-start-start-radius: 10% 20%;border-start-end-radius: 50% 20%;border-end-end-radius: 25% 20%;border-end-start-radius: 75% 20%;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 1em 2em 3em 4em / 5em 6em 7em 8em;}`,
      fixed: `.class{border-start-start-radius: 1em 5em;border-start-end-radius: 2em 6em;border-end-end-radius: 3em 7em;border-end-start-radius: 4em 8em;}`,
      message: messageReport("border-radius"),
    },
    {
      code: `.class{border-radius: 1em 2em 3em 4em / 5em 6em 7em 8em !  important  ;}`,
      fixed: `.class{border-start-start-radius: 1em 5em !important;border-start-end-radius: 2em 6em !important;border-end-end-radius: 3em 7em !important;border-end-start-radius: 4em 8em !important;}`,
      message: messageReport("border-radius"),
    },
  ],
});
