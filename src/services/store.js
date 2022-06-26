import axios from "axios";

const request = axios.create({
  baseURL: "https://stock-1f956.firebaseio.com/",
});

export async function getSessions() {
  return request.get("session.json");
}

export async function getSession(id) {
  return request.get(`session/${id}.json`);
}

export async function getCandidates(sessionId) {
  return request.get(`session.json/${sessionId}/candidates.json`);
}

export async function getCandidate(sessionId, candidateId) {
  return request.get(`session/${sessionId}/candidates/${candidateId}.json`);
}

export async function getPersonalRequests(sessionId) {
  return request.get(`session/${sessionId}/personalRequest.json`);
}

export async function putSession(id, data) {
  return request.put(`session/${id}.json`, data);
}

export async function putCandidate(sessionId, candidateId, data) {
  return request.put(`session/${sessionId}/candidates/${candidateId}.json`, data);
}

export async function postPersonalRequest(sessionId, name, account) {
  return request.post(`session/${sessionId}/personalRequest.json`, {
    name,
    account,
  });
}

export async function deletePersonalRequest(sessionId, personalRequestId) {
  return request.delete(`session/${sessionId}/personalRequest/${personalRequestId}.json`);
}
