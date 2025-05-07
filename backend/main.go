package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

type Report struct {
	URL     string    `json:"url"`      
	Reason  string    `json:"reason"`
	Time    time.Time `json:"timestamp"` 
}

func reportHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost { 
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed) 
		return
	}

	var report Report

	err := json.NewDecoder(r.Body).Decode(&report) 
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	report.Time = time.Now()
	
	f, err := os.OpenFile("report.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		http.Error(w, "Could not write report", http.StatusInternalServerError)
		return
	}
	defer f.Close()
	
	logEntry, _ := json.Marshal(report) 
	f.WriteString(string(logEntry) + "\n") 

	
	w.WriteHeader(http.StatusOK) 
	w.Write([]byte("Report received"))
}

func main() {
	http.HandleFunc("/report", reportHandler)
	log.Println("Server is listening on port 8080") 
	log.Fatal(http.ListenAndServe(":8080", nil))
}
