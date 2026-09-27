CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.admin_exists() TO authenticated;

DROP POLICY "Admins can add site images" ON public.site_images;
DROP POLICY "Admins can update site images" ON public.site_images;
DROP POLICY "Admins can delete site images" ON public.site_images;
DROP POLICY "Admins can upload site image files" ON storage.objects;
DROP POLICY "Admins can update site image files" ON storage.objects;
DROP POLICY "Admins can delete site image files" ON storage.objects;

DROP FUNCTION IF EXISTS public.claim_admin();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

CREATE POLICY "Admins can add site images"
ON public.site_images FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site images"
ON public.site_images FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site images"
ON public.site_images FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload site image files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site image files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site image files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));

GRANT INSERT ON public.user_roles TO authenticated;

CREATE POLICY "First account can claim admin"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'admin' AND NOT private.admin_exists());