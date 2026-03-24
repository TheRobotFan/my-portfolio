-- Update the first user in the system to be an admin
-- This will set the admin role for the user with the lowest created_at timestamp
UPDATE users
SET role = 'admin'
WHERE id = (
  SELECT id 
  FROM users 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Display the updated admin user
SELECT id, email, first_name, last_name, role, created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at ASC;
