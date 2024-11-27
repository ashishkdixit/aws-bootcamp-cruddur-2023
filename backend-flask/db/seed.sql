-- this file was manually created
INSERT INTO public.users (display_name,email, handle, cognito_user_id)
VALUES
  ('Andrew Brown','devopsash+1@outlook.com','andrewbrown' ,'MOCK'),
  ('Andrew Bayko','devopsash+2@outlook.com','bayko' ,'MOCK'),
  ('Luffy Sencho','devopsash+3@outlook.com','thecat' ,'MOCK'),
  ('Ashish Dixit','devopsash+4@outlook.com','ashish' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'ashish' LIMIT 4),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )