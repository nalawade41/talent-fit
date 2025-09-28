package models

// CandidateScore represents AI scoring result for a candidate
type CandidateScore struct {
	CandidateID int    `json:"candidate_id"`
	Score       int    `json:"score"`
	Reason      string `json:"reason"`
}

// MatchSuggestion represents a complete match suggestion with candidate details
type MatchSuggestion struct {
	CandidateScore
	Profile *EmployeeProfileModel `json:"profile"`
}
