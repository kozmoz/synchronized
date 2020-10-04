`synchronized` guarantees that the order that a mutex was requested 
is the order that access will be given.

This simple function is inspired by Java's synchronized method.

````Javascript
synchronized(release => {

  // Locked now, execute code.
  // This can also be async code.  
  
  // Release the lock when the work is done.
  release();
});
````

Similar libraries
-----------------

* https://www.npmjs.com/package/mutexify
