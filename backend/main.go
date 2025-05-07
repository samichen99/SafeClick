package main
import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)
 type Report struct {
	Url string `json: "url"`
	Time time.Time `json: "timestamp"`
 }

 func reportHandler (w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodePost {
		http.Error(w, "Only POST methode is allowed", http.StatusMehodNotAllowed )
		return
	}
	var report Report
	err:= json.NewDecoder(r.body).Decode(&report)
	if err = nil {
		http.Error(w, "Could no write report !", http.StatusBadRequest)
		return
	}
	report.Timestamp = time.Now()
	f, err: = os.OpenFile("report.log", os.O_APPEND| os.O_CREATE| os.O_WRONGLY, 0644)
	if err != nil {
		http.Error(w, "Could not write report", http.StatusInternalServerError)
		return
	}
	defer f.close()

	logEntry, _ := json.Marchal(report)
	f.WriteString(string(logEntry) + "/n")

	w.WriteHeader(http.StatusOk)
	w.Write([]byte("Report received"))

	func main() {
		http.HandleFunc ("/report", reportHandler)
		log.PrintLn ("Server is listening on port 8888")
		log.Fatal(http.ListenAndServe(":8080", nil))
	}
 }
