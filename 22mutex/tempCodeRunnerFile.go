func main() {
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