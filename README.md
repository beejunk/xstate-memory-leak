# XState Memory Leak

Minimal reproduction of the XState memory leak issue reported
[here](https://github.com/statelyai/xstate/issues/3616).

## Prerequisites

To follow the steps for reproducing the issue, the
[K6 load testing tool](https://k6.io/) needs to be installed on your system.

## Process Summary

The following tests use the same basic steps:

1. Start a test server with the `--insepct` flag.
2. Connect the Chrome debugger to the running Node process.
3. Start the Chrome Dev Tools "Allocation instrumentaiton on timeline" memory profiler.
4. Execute the K6 script.
5. Stop the memory profiler once the K6 script is complete.

## Test App 1

App 1 uses `xstate@4.32.1`. This version _does not_ exhibit signs of a memory leak.

Start the server:

```shell
npm run start:inspect --workspace=app1
```

In the Chrome Dev Tools, start the "Allocation instrumentation on timeline" profiler.

In a separate terminal, run the K6 load-testing script:

```shell
npm run load:test
```

After the K6 script is complete, stop the profiler.

Once the results are compiled, click the "Constructor" column to order the results
by constructor name. Scroll down until the constructor "StateNode" comes into view.
You should see something like this:

```
...
SocketAddress x2
StateNode x3
StatsBase x2
...
```

Note that there are 3 `StateNode` objects that were still in memory by the time
the profiler finished running. There are _no_ `State` objects in memory.

## Test App 2

App 2 uses `xstate@4.33.0`, and _does_ exhibit signs of a memory leak.

Repeat the above steps, only this time start the App 2 server:

```shell
npm run start:inspect --workspace=app2
```

The results for App 2 should look something like this:

```shell
...
SocketAddress x2
State x200 <-- These did not appear in the prevoius test!
StateNode x3
StatsBase x2
...
```

In addition to the 3 `StateNode` objects observed before, there are now 200
`State` objects that were still in memory by the time the profiler was stopped.

## Resources

- [Node JS documentation on using the heap profiler](https://nodejs.org/en/docs/guides/diagnostics/memory/using-heap-profiler/).
