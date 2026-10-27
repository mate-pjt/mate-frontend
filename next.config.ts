import type { NextConfig } from "next";
import { resolveDataConfig } from "./src/data/config";

const config = resolveDataConfig(process.env, process.env.NODE_ENV === "development");
const nextConfig: NextConfig = {
  allowedDevOrigins: ["local.mate-bid.com"],
  env: { NEXT_PUBLIC_MATE_DATA_CONFIG: JSON.stringify(config) },
};
export default nextConfig;
