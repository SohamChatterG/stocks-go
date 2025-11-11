package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	// 1. Create a WaitGroup to keep track of our goroutines.
	var wg *sync.WaitGroup

	// 2. Tell the WaitGroup that we are about to start ONE goroutine.
	wg.Add(1)
	// 3. firing a go routine
	go sayHello(wg)
	// Tell the WaitGroup that we are about to start ONE goroutine.
	wg.Add(1)

	go sayHi(wg)
	fmt.Println("Main is waiting...")
	wg.Wait()
	fmt.Println("Main is done waiting. Exiting.")

}

func sayHello(wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Println("Hello Soham")
	time.Sleep(2 * time.Second)
	fmt.Println("hello after 2 sec")
}

func sayHi(wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Println("Hi Soham")

}
