//interfaces
export const IStateFetcher = { $$name: '$$isStateFetcher' };
export const IActionDispatcher = { $$name: '$$isActionDispatcher' };

IStateFetcher[IStateFetcher.$$name] = true;
IActionDispatcher[IActionDispatcher.$$name] = true;
