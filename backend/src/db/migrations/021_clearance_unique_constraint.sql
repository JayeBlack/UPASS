-- Add unique constraint so ON CONFLICT DO NOTHING works in initSteps
ALTER TABLE clearance_steps
  ADD CONSTRAINT clearance_steps_student_dept_unique UNIQUE (student_id, department);
