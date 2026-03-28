-- Incident Statistics by Region
CREATE OR REPLACE VIEW v_incident_stats AS
SELECT
  region,
  COUNT(*) AS total_incidents,
  COUNTIF(severity IN ('high', 'critical')) AS high_severity,
  COUNTIF(status = 'closed') AS resolved,
  ROUND(SAFE_DIVIDE(COUNTIF(status = 'closed'), COUNT(*)) * 100, 1) AS resolution_rate,
  ROUND(SAFE_DIVIDE(COUNTIF(severity IN ('high', 'critical')), COUNT(*)) * 100, 1) AS severity_index,
  AVG(TIMESTAMP_DIFF(updated_at, created_at, HOUR)) AS avg_response_hours
FROM incidents
GROUP BY region
ORDER BY total_incidents DESC;
