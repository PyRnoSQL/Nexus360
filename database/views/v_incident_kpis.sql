-- Incident KPIs View for BigQuery
CREATE OR REPLACE VIEW v_incident_kpis AS
WITH incident_metrics AS (
  SELECT
    COUNT(*) AS total_incidents,
    COUNTIF(status = 'closed') AS resolved_incidents,
    COUNTIF(severity IN ('high', 'critical')) AS high_severity_incidents,
    COUNTIF(status = 'in-progress') AS in_progress,
    COUNTIF(status = 'escalated to parquet') AS escalated,
    AVG(TIMESTAMP_DIFF(updated_at, created_at, HOUR)) AS avg_resolution_hours
  FROM incidents
  WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
)
SELECT
  total_incidents,
  resolved_incidents,
  ROUND(SAFE_DIVIDE(resolved_incidents, total_incidents) * 100, 1) AS resolution_rate,
  high_severity_incidents,
  ROUND(SAFE_DIVIDE(high_severity_incidents, total_incidents) * 100, 1) AS high_severity_rate,
  in_progress,
  escalated,
  ROUND(avg_resolution_hours, 1) AS avg_resolution_hours
FROM incident_metrics;
