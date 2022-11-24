
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- database name in pool.js is: tradeout

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (40) NOT NULL,
    "legal_name" VARCHAR (80) NOT NULL
);

CREATE TABLE "contract" (
    "id" SERIAL PRIMARY KEY,
    "contract_key" VARCHAR (40) UNIQUE,
    "contract_status" VARCHAR (40) NOT NULL,
    "contract_created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "contract_title" VARCHAR (40) NOT NULL,
    "first_party_type" VARCHAR (20) NOT NULL,
    "first_party_email" VARCHAR (80),
    "first_party_name" VARCHAR (80),
    "second_party_type" VARCHAR (20) NOT NULL,
    "second_party_email" VARCHAR (80),
    "second_party_name" VARCHAR (80),
    "item_name" VARCHAR (80) NOT NULL,
    "item_description" VARCHAR (600) NOT NULL,
    "item_price" NUMERIC (20, 2) NOT NULL,
    "item_pickup_date" DATE NOT NULL,
    "item_pickup_location" VARCHAR (120) NOT NULL,
    "contract_deadline" DATE,
    "contract_notes" VARCHAR (600),
    "edit_reason" VARCHAR (600),
    "first_party_signature" VARCHAR (80),
    "first_party_signature_created_at" TIMESTAMP,
    "second_party_signature" VARCHAR (80),
    "second_party_signature_created_at" TIMESTAMP,
    "contract_approval" BOOLEAN NOT NULL DEFAULT FALSE,
    "contract_finalized_at" TIMESTAMP,
    "contract_receipt" VARCHAR (1200)
);

CREATE TABLE "user_contract" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "user" NOT NULL,
  "contract_id" INT REFERENCES "contract" NOT NULL
);

CREATE TABLE "photo" (
  "id" SERIAL PRIMARY KEY,
  "contract_id" INT REFERENCES "contract" NOT NULL,
  "item_image" VARCHAR (1200) NOT NULL,
  "item_image_description" VARCHAR (80)
);

CREATE TABLE "contract_edit" (
  "id" SERIAL PRIMARY KEY,
  "contract_id" INT REFERENCES "contract" NOT NULL,
  "item_description" VARCHAR (600) NOT NULL,
  "item_price" NUMERIC (20, 2) NOT NULL,
  "item_pickup_date" DATE NOT NULL,
  "item_pickup_location" VARCHAR (120) NOT NULL,
  "contract_deadline" DATE,
  "contract_notes" VARCHAR (600),
  "edit_reason" VARCHAR (600),
  "created_by" VARCHAR (80),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "contract_notification" (
  "id" SERIAL PRIMARY KEY,
  "contract_id" INT REFERENCES "contract" NOT NULL,
  "previous_contract_status" VARCHAR (40) NOT NULL,
  "current_contract_status" VARCHAR (40) NOT NULL,
  "notification_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "first_party_notification" BOOLEAN NOT NULL DEFAULT FALSE,
  "second_party_notification" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_by" VARCHAR (80),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);