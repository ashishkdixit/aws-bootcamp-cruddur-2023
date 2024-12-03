-- this file was manually created
INSERT INTO public.users (display_name,email, handle, cognito_user_id)
VALUES
  ('Andrew Brown','devopsash+2@outook.com','andrewbrown' ,'MOCK'),
  ('Andrew Bayko','devopsash+1@outlook.com','bayko' ,'MOCK');


INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 2),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  );