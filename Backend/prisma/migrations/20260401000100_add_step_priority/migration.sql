ALTER TABLE "Step"
ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 1;

WITH ordered_steps AS (
  SELECT "step_id", ROW_NUMBER() OVER (ORDER BY "step_id") AS sequence_number
  FROM "Step"
)
UPDATE "Step" AS current_step
SET "priority" = ordered_steps.sequence_number
FROM ordered_steps
WHERE current_step."step_id" = ordered_steps."step_id";