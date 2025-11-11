package main

import (
	"fmt"
	"time"
)

// func main() {
// 	messages := make(chan string)

// 	go func() {
// 		// This goroutine sends a message. It will wait here
// 		// until the main goroutine is ready to receive it.
// 		fmt.Println("Goroutine: about to send 'Ping'")
// 		messages <- "Ping"
// 		fmt.Println("Goroutine: 'Ping' has been received.")
// 	}()

// 	fmt.Println("Main: waiting to receive a message...")
// 	// The main goroutine blocks here, waiting for the send.
// 	msg := <-messages
// 	fmt.Println("Main: received message:", msg)
// }

// -------------------------------------------------------------------------------------------------------------
// Understanding producer nd consumer go routine and channel of a fixed size
// func main() {
// 	jobs := make(chan int, 2)
// 	done := make(chan bool)

// 	go func() {
// 		// This is the receiver goroutine.
// 		// It will repeatedly receive from 'jobs' until the channel is closed.
// 		for {
// 			// The 'more' boolean will be 'false' if the channel is closed and empty.
// 			j, more := <-jobs
// 			if more {
// 				fmt.Println("received job", j)
// 			} else {
// 				fmt.Println("received all jobs")
// 				done <- true
// 				return
// 			}
// 		}
// 	}()

// 	// This is the sender. It sends 3 jobs to the channel.
// 	for j := 1; j <= 3; j++ {
// 		jobs <- j
// 		fmt.Println("sent job", j)
// 	}
// 	// The sender is done sending and closes the channel.
// 	close(jobs)
// 	fmt.Println("sent all jobs")

// 	// Wait for the receiver to finish.
// 	<-done
// 	// understanding the flow
// 	/*
// 		sent 1 job is printed , sent job 2 is also printed the channel of size 2 is full and one must be receiced so the main go routine is blocked
// 		go runtime procesesses the receiver and receives one from the conveyor belt
// 		now anything can happen out of two, either the received job 1 would be printed or go run time may process main go routine and send the 3rd job
// 	*/
// }

// ---------------------------------------------------------------------------------------

// Our worker will receive a job, work on it, and send the result.
func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		fmt.Printf("worker %d started job %d\n", id, j)
		time.Sleep(time.Second) // Simulate work
		fmt.Printf("worker %d finished job %d\n", id, j)
		results <- j * 2
	}
}

func main() {
	const numJobs = 5
	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)

	// Start up 3 workers. They will block initially because there are no jobs yet.
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	// Send 5 jobs to the 'jobs' channel.
	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs) // Close the jobs channel to signal that's all the work.

	// Finally, we collect all the results from the work.
	// This also ensures that the worker goroutines have finished. It acts as our synchronization, just like a WaitGroup.
	for a := 1; a <= numJobs; a++ {
		<-results
	}

	fmt.Println("All jobs and results have been processed.")
}
