-- A loan can record a device loss without a corresponding inventory item.
CREATE TABLE sample_losses_next (
 request_id TEXT PRIMARY KEY REFERENCES sample_requests(id),
 asset_id TEXT REFERENCES sample_assets(id),
 verified_at TEXT NOT NULL,
 reason TEXT NOT NULL,
 evidence TEXT NOT NULL,
 conversion_at TEXT,
 notification_evidence TEXT,
 compensation_due_at TEXT,
 closed_at TEXT,
 recovered_at TEXT
);
INSERT INTO sample_losses_next(request_id,asset_id,verified_at,reason,evidence,conversion_at,notification_evidence,compensation_due_at,closed_at,recovered_at)
 SELECT request_id,asset_id,verified_at,reason,evidence,conversion_at,notification_evidence,compensation_due_at,closed_at,recovered_at FROM sample_losses;
DROP TABLE sample_losses;
ALTER TABLE sample_losses_next RENAME TO sample_losses;
