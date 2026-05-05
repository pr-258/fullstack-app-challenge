CREATE TABLE users (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    role        VARCHAR(20)  NOT NULL,
    manager_id  UUID         REFERENCES users(id),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE vacation_requests (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id  UUID        NOT NULL REFERENCES users(id),
    start_date       DATE        NOT NULL,
    end_date         DATE        NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reason           TEXT,
    rejection_reason TEXT,
    reviewed_by_id   UUID        REFERENCES users(id),
    reviewed_at      TIMESTAMPTZ,
    cancelled_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
