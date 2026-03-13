drop extension if exists "pg_net";


  create table "public"."movies" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "img" text,
    "genre" text,
    "duration" text,
    "director" text,
    "status" text
      );



  create table "public"."news" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text,
    "subtitle" text,
    "img" text,
    "release_date" date,
    "category" text,
    "tag" text,
    "content" text,
    "likes" integer default 0
      );


CREATE UNIQUE INDEX movies_pkey ON public.movies USING btree (id);

CREATE UNIQUE INDEX news_pkey ON public.news USING btree (id);

alter table "public"."movies" add constraint "movies_pkey" PRIMARY KEY using index "movies_pkey";

alter table "public"."news" add constraint "news_pkey" PRIMARY KEY using index "news_pkey";

alter table "public"."news" add constraint "news_likes_check" CHECK ((likes >= 0)) not valid;

alter table "public"."news" validate constraint "news_likes_check";

grant delete on table "public"."movies" to "anon";

grant insert on table "public"."movies" to "anon";

grant references on table "public"."movies" to "anon";

grant select on table "public"."movies" to "anon";

grant trigger on table "public"."movies" to "anon";

grant truncate on table "public"."movies" to "anon";

grant update on table "public"."movies" to "anon";

grant delete on table "public"."movies" to "authenticated";

grant insert on table "public"."movies" to "authenticated";

grant references on table "public"."movies" to "authenticated";

grant select on table "public"."movies" to "authenticated";

grant trigger on table "public"."movies" to "authenticated";

grant truncate on table "public"."movies" to "authenticated";

grant update on table "public"."movies" to "authenticated";

grant delete on table "public"."movies" to "service_role";

grant insert on table "public"."movies" to "service_role";

grant references on table "public"."movies" to "service_role";

grant select on table "public"."movies" to "service_role";

grant trigger on table "public"."movies" to "service_role";

grant truncate on table "public"."movies" to "service_role";

grant update on table "public"."movies" to "service_role";

grant delete on table "public"."news" to "anon";

grant insert on table "public"."news" to "anon";

grant references on table "public"."news" to "anon";

grant select on table "public"."news" to "anon";

grant trigger on table "public"."news" to "anon";

grant truncate on table "public"."news" to "anon";

grant update on table "public"."news" to "anon";

grant delete on table "public"."news" to "authenticated";

grant insert on table "public"."news" to "authenticated";

grant references on table "public"."news" to "authenticated";

grant select on table "public"."news" to "authenticated";

grant trigger on table "public"."news" to "authenticated";

grant truncate on table "public"."news" to "authenticated";

grant update on table "public"."news" to "authenticated";

grant delete on table "public"."news" to "service_role";

grant insert on table "public"."news" to "service_role";

grant references on table "public"."news" to "service_role";

grant select on table "public"."news" to "service_role";

grant trigger on table "public"."news" to "service_role";

grant truncate on table "public"."news" to "service_role";

grant update on table "public"."news" to "service_role";


  create policy "Allow authenticated uploads 1tnhfnw_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'movies_imgs'::text));



  create policy "Allow authenticated uploads 1tnhfnw_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'movies_imgs'::text));



  create policy "Allow authenticated uploads 1tnhfnw_2"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'movies_imgs'::text));



  create policy "Allow authenticated uploads 1tnhfnw_3"
  on "storage"."objects"
  as permissive
  for update
  to public
using ((bucket_id = 'movies_imgs'::text));



  create policy "Allow authenticated uploads bnbwlr_0"
  on "storage"."objects"
  as permissive
  for select
  to anon
using ((bucket_id = 'news_Image'::text));



  create policy "Allow authenticated uploads bnbwlr_1"
  on "storage"."objects"
  as permissive
  for insert
  to anon
with check ((bucket_id = 'news_Image'::text));



