import { assign, createMachine, interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor.js";

// states
const IDLE = "idle";
const DONE = "done";

// events
const SET_PAGE_DATA = "set-page-data";

// actions
const SET_TITLE = "set-title";

const pageDateMachine = createMachine(
  {
    id: "page-data-machine",

    predictableActionArguments: true,

    context: {
      title: "",
    },

    initial: IDLE,

    states: {
      [IDLE]: {
        on: {
          [SET_PAGE_DATA]: {
            actions: SET_TITLE,
            target: DONE,
          },
        },
      },

      [DONE]: {
        type: "final",
      },
    },
  },

  {
    actions: {
      [SET_TITLE]: assign({
        title: "Memory Leak Test",
      }),
    },
  }
);

export async function getPageData() {
  const pageDataService = interpret(pageDateMachine);
  const pageDataActor = pageDataService.start();

  pageDataService.send(SET_PAGE_DATA);

  const doneState = await waitFor(pageDataActor, (state) =>
    state.matches("done")
  );

  return { title: doneState.context.title };
}
