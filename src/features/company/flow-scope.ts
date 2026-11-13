type FlowSession = { getAccountKey: () => string | null; getSessionEpoch: () => number };

export function createCompanyFlowScope(session: FlowSession) {
  let active = true;
  let revision = 0;
  let pending = false;

  function capture() {
    const account = session.getAccountKey();
    const epoch = session.getSessionEpoch();
    const version = revision;
    return {
      current(committed = false) {
        const currentAccount = session.getAccountKey();
        return active && version === revision && account !== null && epoch === session.getSessionEpoch()
          && (account === currentAccount || (committed && currentAccount === null));
      },
      finish() { if (version === revision) pending = false; },
    };
  }

  return {
    capture,
    begin() {
      if (!active || pending || session.getAccountKey() === null) return null;
      pending = true;
      return capture();
    },
    activate() { active = true; },
    dispose() { active = false; revision += 1; pending = false; },
  };
}
