// Experimental infinite loop agent named "Windsurf".
// The agent strives for minimal resource usage while running indefinitely.
// This example implements the behavior described in the custom instructions.

const RAM_LIMIT_MB = 128;
const CPU_PERCENT_MAX = 15;
const GC_FREQUENCY = 50; // cycles
const SLEEP_DURATION_MS = 200;

let cycles = 0;
const startUsage = process.cpuUsage();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
  while (true) {
    cycles++;
    const mem = process.memoryUsage().heapUsed / (1024 * 1024);
    if (mem > RAM_LIMIT_MB && global.gc) {
      global.gc();
    }

    const usage = process.cpuUsage(startUsage);
    const cpuTimeMs = (usage.user + usage.system) / 1000; // microseconds to ms
    const cpuPercent = cpuTimeMs / (process.uptime() * 10); // rough estimate

    if (cpuPercent > CPU_PERCENT_MAX) {
      await sleep(SLEEP_DURATION_MS);
    }

    if (cycles % GC_FREQUENCY === 0 && global.gc) {
      global.gc();
    }

    await sleep(1); // yield control briefly
  }
}

loop();
