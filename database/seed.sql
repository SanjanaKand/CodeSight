USE codesight;

-- Insert test user if it does not already exist
INSERT INTO users (name, email)
VALUES ('Test User', 'test@codesight.local')
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

-- Insert test session if it does not already exist
INSERT INTO sessions (user_id, session_name, language)
SELECT id, 'Python AST Test', 'Python'
FROM users
WHERE email = 'test@codesight.local'
  AND NOT EXISTS (
      SELECT 1
      FROM sessions
      WHERE session_name = 'Python AST Test'
        AND language = 'Python'
  );

-- Insert test snippet if it does not already exist
INSERT INTO snippets (session_id, code, language, ast_json)
SELECT
    id,
    'x = 10
print(x)',
    'Python',
    JSON_OBJECT(
        'type', 'module',
        'children', JSON_ARRAY(
            'assignment',
            'call'
        )
    )
FROM sessions
WHERE session_name = 'Python AST Test'
  AND language = 'Python'
  AND NOT EXISTS (
      SELECT 1
      FROM snippets
      WHERE code = 'x = 10
print(x)'
        AND language = 'Python'
  );

-- Verify the seed data
SELECT * FROM users;

SELECT * FROM sessions;

SELECT * FROM snippets;