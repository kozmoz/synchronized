function synchronize() {

    const workQueue = [];
    const context = {
        locked: false
    };

    /**
     * Release the lock and start new work if the queue contains work.
     */
    function releaseFn() {
        context.locked = false;
        if (workQueue.length) {
            startWork(workQueue.shift());
        }
    }

    /**
     * Start or queue new work.
     *
     * @param {Function} fn The function to start or queue
     */
    function startWork(fn) {

        // Currently there's a lock active, queue the new function.
        if (context.locked) {
            workQueue.push(fn);
            return;
        }
        context.locked = true;
        setTimeout(() => {
            fn(releaseFn);
        }, 0);
    }

    return startWork
}

const synchronized = synchronize();

const data = {
    counter: 0
}

/**
 * Some heavy calculations in a promise.
 *
 * @param {number} executionSequence The index number of execution
 * @param {{counter:number}} data Wrapper object with counter
 * @return {Promise<number>} Promise that resolves on success or rejects otherwise
 */
function execute(executionSequence, data) {
    const promise = new Promise(resolve => {
        synchronized(release => {

            // Release the lock when the promise is done.
            promise.finally(release);

            // Wait a random time between 0 and 2 seconds.
            setTimeout(() => {

                data.counter++;
                console.log('==== Execute promise: ' + executionSequence);
                console.log('==== Counter: ' + data.counter);
                resolve(data.counter);

            }, Math.random() * 2 * 1000);
        });
    });
    return promise;
}

for (let i = 1; i <= 10; i++) {
    console.log(`==== Create promise: ${i}`);
    execute(i, data).then(result => {
        console.log(`==== Promise success: ${i}, result: ${result}`);
    })
}

