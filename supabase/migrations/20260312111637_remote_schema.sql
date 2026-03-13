create type "public"."booking_status" as enum ('pending', 'paid', 'cancelled');

create type "public"."movie_status" as enum ('upcoming', 'streaming');

create type "public"."payment_status" as enum ('succeeded', 'processing', 'requires_action', 'requires_payment_method', 'canceled');

create type "public"."user_role" as enum ('admin', 'user');

revoke delete on table "public"."movies" from "anon";

revoke insert on table "public"."movies" from "anon";

revoke references on table "public"."movies" from "anon";

revoke select on table "public"."movies" from "anon";

revoke trigger on table "public"."movies" from "anon";

revoke truncate on table "public"."movies" from "anon";

revoke update on table "public"."movies" from "anon";

revoke delete on table "public"."movies" from "authenticated";

revoke insert on table "public"."movies" from "authenticated";

revoke references on table "public"."movies" from "authenticated";

revoke select on table "public"."movies" from "authenticated";

revoke trigger on table "public"."movies" from "authenticated";

revoke truncate on table "public"."movies" from "authenticated";

revoke update on table "public"."movies" from "authenticated";

revoke delete on table "public"."movies" from "service_role";

revoke insert on table "public"."movies" from "service_role";

revoke references on table "public"."movies" from "service_role";

revoke select on table "public"."movies" from "service_role";

revoke trigger on table "public"."movies" from "service_role";

revoke truncate on table "public"."movies" from "service_role";

revoke update on table "public"."movies" from "service_role";

alter table "public"."movies" drop constraint "movies_pkey";

drop index if exists "public"."movies_pkey";

drop table "public"."movies";


  create table "public"."profile" (
    "user_id" uuid not null,
    "role" public.user_role not null default 'user'::public.user_role,
    "first_name" character varying,
    "last_name" character varying,
    "email" character varying,
    "mobile_no" character varying,
    "age" character varying,
    "address" character varying,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."profile" enable row level security;

CREATE UNIQUE INDEX profile_email_key ON public.profile USING btree (email);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (user_id);

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."profile" add constraint "profile_email_key" UNIQUE using index "profile_email_key";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profile (
    user_id, 
    email, 
    first_name, 
    last_name, 
    role
  )
  VALUES (
    NEW.id,
    NEW.email, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    'user' -- <--- THIS IS THE ONLY LINE THAT CHANGED
  );
  
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";


  create policy "Users can update own profile"
  on "public"."profile"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own profile"
  on "public"."profile"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


