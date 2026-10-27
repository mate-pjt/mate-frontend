import { resolveDataConfig } from "../src/data/config";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  viteFinal(config) {
    config.define = { ...config.define, "process.env.NEXT_PUBLIC_MATE_DATA_CONFIG": JSON.stringify(JSON.stringify(resolveDataConfig(process.env, true))) };
    return config;
  },
};

export default config;
