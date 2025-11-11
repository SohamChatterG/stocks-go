package main

import (
	"fmt"
	"sync"
)

/*
A Race Condition
A race condition occurs when multiple goroutines try to access and modify the same shared data at the same time. The final result depends on the unpredictable order in which they execute, leading to corrupted data.
*/
// func main() {
// 	// wg will be used to wait for all goroutines to finish.
// 	var wg sync.WaitGroup

// 	// counter is the shared variable that multiple goroutines will access.
// 	var counter int = 0

// 	// Launch 1000 goroutines.
// 	for i := 0; i < 1000; i++ {
// 		wg.Add(1)
// 		go func() {
// 			defer wg.Done()
// 			// This is the race condition!
// 			// Multiple goroutines try to read and write to 'counter' at the same time.
// 			counter++
// 		}()
// 	}

// 	// Wait for all goroutines to complete.
// 	wg.Wait()

// 	// The result is unpredictable and almost never 1000.
// 	// It could be 945, 961, or some other random number.
// 	fmt.Println("Final Counter (with race condition):", counter)
// }

/*
Why Does This Happen?
The operation counter++ is not a single, atomic action. It's actually three steps:

Read the current value of counter from memory.

Increment that value.

Write the new value back to memory.

Imagine two goroutines (A and B) running at nearly the same time when counter is 50:
Goroutine A reads 50.
Goroutine B reads 50.
Goroutine A increments its value to 51.
Goroutine B increments its value to 51.
Goroutine A writes 51 back.
Goroutine B writes 51 back.
We performed two increments, but the final value is 51, not 52. We lost an operation. This is a race condition.
*/

// Solution : Mutex
func main() {
	// wg will be used to wait for all goroutines to finish.
	var wg sync.WaitGroup

	// mutex is the "key" that will protect our shared data.
	var mutex sync.Mutex

	// counter is the shared variable that needs protection.
	var counter int = 0

	// Launch 1000 goroutines.
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			// ---- This is the "Critical Section" ----
			// Lock the mutex. This ensures only one goroutine
			// can execute the code between Lock() and Unlock() at any given time.
			mutex.Lock()

			// IMPORTANT: 'defer' guarantees that the mutex will be unlocked
			// when the function exits, even if it panics. This prevents deadlocks.
			defer mutex.Unlock()

			// Now, this operation is safe. No other goroutine can interfere.
			counter++
			// ------------------------------------------
		}()
	}

	// Wait for all goroutines to complete.
	wg.Wait()

	// The result is now reliably and correctly 1000 every single time.
	fmt.Println("Final Counter (fixed with mutex):", counter)
}
