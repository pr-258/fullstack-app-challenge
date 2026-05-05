-- Users
-- Admin
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Ana Silva',    'ana.admin@taskflow.test',      'ADMIN',        NULL, TRUE);

-- Managers
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000002', 'Bruno Costa',  'bruno.manager@taskflow.test',  'MANAGER',      NULL, TRUE),
    ('00000000-0000-0000-0000-000000000003', 'Carlos Dias',  'carlos.manager@taskflow.test', 'MANAGER',      NULL, TRUE);

-- Collaborators
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000004', 'Diego Ramos',  'diego@taskflow.test',          'COLLABORATOR', '00000000-0000-0000-0000-000000000002', TRUE),
    ('00000000-0000-0000-0000-000000000005', 'Eva Santos',   'eva@taskflow.test',            'COLLABORATOR', '00000000-0000-0000-0000-000000000002', TRUE),
    ('00000000-0000-0000-0000-000000000006', 'Fiona Lima',   'fiona@taskflow.test',          'COLLABORATOR', '00000000-0000-0000-0000-000000000003', TRUE);

-- Vacation Requests
-- Diego: PENDING
INSERT INTO vacation_requests (id, collaborator_id, start_date, end_date, status, reason) VALUES
    ('00000000-0000-0000-0001-000000000001',
     '00000000-0000-0000-0000-000000000004',
     '2026-08-01', '2026-08-05', 'PENDING', 'Family trip');

-- Eva: APPROVED by Bruno
INSERT INTO vacation_requests (id, collaborator_id, start_date, end_date, status, reason, reviewed_by_id, reviewed_at) VALUES
    ('00000000-0000-0000-0001-000000000002',
     '00000000-0000-0000-0000-000000000005',
     '2026-07-10', '2026-07-15', 'APPROVED', 'Summer holiday',
     '00000000-0000-0000-0000-000000000002', NOW());

-- Fiona: REJECTED by Carlos
INSERT INTO vacation_requests (id, collaborator_id, start_date, end_date, status, reason, rejection_reason, reviewed_by_id, reviewed_at) VALUES
    ('00000000-0000-0000-0001-000000000003',
     '00000000-0000-0000-0000-000000000006',
     '2026-08-01', '2026-08-03', 'REJECTED', 'Long weekend',
     'Team coverage not available during this period.',
     '00000000-0000-0000-0000-000000000003', NOW());
