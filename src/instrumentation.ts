export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertDeployment, getDataConfig } = await import("./data/config");
    try {
      assertDeployment(getDataConfig(), process.env, process.env.NODE_ENV === "development");
    } catch (error) {
      // Next logs a rejected hook without terminating its listening server.
      console.error(error instanceof Error ? error.message : "데이터 공급원 실행 환경을 확인하지 못했습니다.");
      process.exit(1);
    }
  }
}
