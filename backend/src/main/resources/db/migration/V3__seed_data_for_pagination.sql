-- Additional seed data for pagination testing
-- Brings totals to: 15 users (1 admin, 3 managers, 11 collaborators)
--                   25 vacation requests (10 pending, 10 approved, 5 rejected)

-- ─── Users ────────────────────────────────────────────────────────────────────

-- New manager
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000007', 'Diana Fernandes', 'diana.manager@taskflow.test', 'MANAGER', NULL, TRUE);

-- Collaborators under Bruno (002)
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000008', 'Gabriel Alves',  'gabriel@taskflow.test',  'COLLABORATOR', '00000000-0000-0000-0000-000000000002', TRUE),
    ('00000000-0000-0000-0000-000000000009', 'Helena Costa',   'helena@taskflow.test',   'COLLABORATOR', '00000000-0000-0000-0000-000000000002', TRUE);

-- Collaborators under Carlos (003)
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000011', 'João Ferreira',  'joao@taskflow.test',     'COLLABORATOR', '00000000-0000-0000-0000-000000000003', TRUE),
    ('00000000-0000-0000-0000-000000000012', 'Luisa Martins',  'luisa@taskflow.test',    'COLLABORATOR', '00000000-0000-0000-0000-000000000003', TRUE),
    ('00000000-0000-0000-0000-000000000013', 'Miguel Sousa',   'miguel@taskflow.test',   'COLLABORATOR', '00000000-0000-0000-0000-000000000003', TRUE);

-- Collaborators under Diana (007)
INSERT INTO users (id, name, email, role, manager_id, active) VALUES
    ('00000000-0000-0000-0000-000000000010', 'Ines Moura',     'ines@taskflow.test',     'COLLABORATOR', '00000000-0000-0000-0000-000000000007', TRUE),
    ('00000000-0000-0000-0000-000000000014', 'Nuno Baptista',  'nuno@taskflow.test',     'COLLABORATOR', '00000000-0000-0000-0000-000000000007', TRUE),
    ('00000000-0000-0000-0000-000000000015', 'Olivia Rocha',   'olivia@taskflow.test',   'COLLABORATOR', '00000000-0000-0000-0000-000000000007', TRUE);

-- ─── Vacation Requests — APPROVED ─────────────────────────────────────────────
-- Each approved request occupies a distinct date range so the no-overlap rule holds.
-- Jan → Oct 2026, one per month, covering all three managers' teams.

INSERT INTO vacation_requests (id, collaborator_id, start_date, end_date, status, reason, reviewed_by_id, reviewed_at) VALUES
    ('00000000-0000-0000-0001-000000000004',
     '00000000-0000-0000-0000-000000000008',  -- Gabriel / Bruno
     '2026-01-05', '2026-01-10', 'APPROVED', 'Viagem em família',
     '00000000-0000-0000-0000-000000000002', '2025-12-20 09:00:00'),

    ('00000000-0000-0000-0001-000000000005',
     '00000000-0000-0000-0000-000000000009',  -- Helena / Bruno
     '2026-02-02', '2026-02-06', 'APPROVED', 'Descanso prolongado',
     '00000000-0000-0000-0000-000000000002', '2026-01-15 10:00:00'),

    ('00000000-0000-0000-0001-000000000006',
     '00000000-0000-0000-0000-000000000010',  -- Ines / Diana
     '2026-03-09', '2026-03-13', 'APPROVED', 'Visita familiar',
     '00000000-0000-0000-0000-000000000007', '2026-02-20 11:00:00'),

    ('00000000-0000-0000-0001-000000000007',
     '00000000-0000-0000-0000-000000000011',  -- João / Carlos
     '2026-04-06', '2026-04-10', 'APPROVED', 'Páscoa com a família',
     '00000000-0000-0000-0000-000000000003', '2026-03-18 09:30:00'),

    ('00000000-0000-0000-0001-000000000008',
     '00000000-0000-0000-0000-000000000012',  -- Luisa / Carlos
     '2026-05-04', '2026-05-08', 'APPROVED', 'Viagem de aniversário',
     '00000000-0000-0000-0000-000000000003', '2026-04-10 14:00:00'),

    ('00000000-0000-0000-0001-000000000009',
     '00000000-0000-0000-0000-000000000013',  -- Miguel / Carlos
     '2026-06-02', '2026-06-06', 'APPROVED', 'Férias de verão antecipadas',
     '00000000-0000-0000-0000-000000000003', '2026-05-12 10:00:00'),

    ('00000000-0000-0000-0001-000000000010',
     '00000000-0000-0000-0000-000000000014',  -- Nuno / Diana
     '2026-08-17', '2026-08-21', 'APPROVED', 'Férias de verão',
     '00000000-0000-0000-0000-000000000007', '2026-07-28 09:00:00'),

    ('00000000-0000-0000-0001-000000000011',
     '00000000-0000-0000-0000-000000000015',  -- Olivia / Diana
     '2026-09-07', '2026-09-11', 'APPROVED', 'Viagem ao estrangeiro',
     '00000000-0000-0000-0000-000000000007', '2026-08-20 11:30:00'),

    ('00000000-0000-0000-0001-000000000012',
     '00000000-0000-0000-0000-000000000004',  -- Diego / Bruno
     '2026-10-05', '2026-10-09', 'APPROVED', 'Semana de descanso',
     '00000000-0000-0000-0000-000000000002', '2026-09-15 09:00:00');

-- ─── Vacation Requests — PENDING ──────────────────────────────────────────────
-- Dates chosen to avoid conflicts with all approved requests above.

INSERT INTO vacation_requests (id, collaborator_id, start_date, end_date, status, reason) VALUES
    ('00000000-0000-0000-0001-000000000013',
     '00000000-0000-0000-0000-000000000005',  -- Eva / Bruno
     '2026-11-03', '2026-11-07', 'PENDING', 'Visita a familiar no estrangeiro'),

    ('00000000-0000-0000-0001-000000000014',
     '00000000-0000-0000-0000-000000000008',  -- Gabriel / Bruno
     '2026-11-17', '2026-11-21', 'PENDING', 'Mudança de casa'),

    ('00000000-0000-0000-0001-000000000015',
     '00000000-0000-0000-0000-000000000009',  -- Helena / Bruno
     '2026-12-01', '2026-12-05', 'PENDING', 'Natal antecipado'),

    ('00000000-0000-0000-0001-000000000016',
     '00000000-0000-0000-0000-000000000006',  -- Fiona / Carlos
     '2026-10-19', '2026-10-23', 'PENDING', 'Assuntos pessoais'),

    ('00000000-0000-0000-0001-000000000017',
     '00000000-0000-0000-0000-000000000011',  -- João / Carlos
     '2026-12-14', '2026-12-18', 'PENDING', 'Férias de fim de ano'),

    ('00000000-0000-0000-0001-000000000018',
     '00000000-0000-0000-0000-000000000012',  -- Luisa / Carlos
     '2026-08-24', '2026-08-28', 'PENDING', 'Viagem ao Algarve'),

    ('00000000-0000-0000-0001-000000000019',
     '00000000-0000-0000-0000-000000000013',  -- Miguel / Carlos
     '2026-09-15', '2026-09-19', 'PENDING', 'Casamento de familiar'),

    ('00000000-0000-0000-0001-000000000020',
     '00000000-0000-0000-0000-000000000010',  -- Ines / Diana
     '2026-10-26', '2026-10-30', 'PENDING', 'Viagem cultural'),

    ('00000000-0000-0000-0001-000000000021',
     '00000000-0000-0000-0000-000000000014',  -- Nuno / Diana
     '2026-12-22', '2026-12-26', 'PENDING', 'Férias de Natal');

-- ─── Vacation Requests — REJECTED ─────────────────────────────────────────────

INSERT INTO vacation_requests (id, collaborator_id, start_date, end_date, status, reason, rejection_reason, reviewed_by_id, reviewed_at) VALUES
    ('00000000-0000-0000-0001-000000000022',
     '00000000-0000-0000-0000-000000000005',  -- Eva / Bruno
     '2026-03-16', '2026-03-18', 'REJECTED', 'Consulta médica prolongada',
     'Cobertura insuficiente na equipa nesse período.',
     '00000000-0000-0000-0000-000000000002', '2026-03-01 10:00:00'),

    ('00000000-0000-0000-0001-000000000023',
     '00000000-0000-0000-0000-000000000004',  -- Diego / Bruno
     '2026-06-15', '2026-06-17', 'REJECTED', 'Fim de semana prolongado',
     'Período de entrega de projeto crítico.',
     '00000000-0000-0000-0000-000000000002', '2026-06-01 09:00:00'),

    ('00000000-0000-0000-0001-000000000024',
     '00000000-0000-0000-0000-000000000015',  -- Olivia / Diana
     '2026-04-14', '2026-04-16', 'REJECTED', 'Assuntos pessoais urgentes',
     'Coincide com formação obrigatória.',
     '00000000-0000-0000-0000-000000000007', '2026-04-02 11:00:00'),

    ('00000000-0000-0000-0001-000000000025',
     '00000000-0000-0000-0000-000000000012',  -- Luisa / Carlos
     '2026-07-20', '2026-07-22', 'REJECTED', 'Viagem de negócios pessoal',
     'Equipa já com número mínimo de elementos disponíveis.',
     '00000000-0000-0000-0000-000000000003', '2026-07-05 14:00:00');
