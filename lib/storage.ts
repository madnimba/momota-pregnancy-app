export interface HealthLog {
  id: string
  type: "anemia" | "bp" | "diabetes" | "infection" | "nutrition"
  timestamp: number
  data: any
  result: string
  riskLevel: "low" | "medium" | "high"
}

export function saveHealthLog(log: Omit<HealthLog, "id" | "timestamp">) {
  const logs = getHealthLogs()
  const newLog: HealthLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: Date.now(),
  }
  logs.push(newLog)
  localStorage.setItem("momota-health-logs", JSON.stringify(logs))
  return newLog
}

export function getHealthLogs(): HealthLog[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("momota-health-logs")
  return stored ? JSON.parse(stored) : []
}

export function clearHealthLogs() {
  localStorage.removeItem("momota-health-logs")
}
