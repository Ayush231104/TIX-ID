-- ─────────────────────────────────────────
-- SEED DATA FOR TIX_ID
-- Order: cities → brands → movies → theater → screen → seats → showtimes → discount
-- ─────────────────────────────────────────


-- ─────────────────────────────────────────
-- 1. CITIES (All Major Indian Cities)
-- ─────────────────────────────────────────

insert into public.cities (id, name, state, latitude, longitude) values
  (gen_random_uuid(), 'Mumbai',          'Maharashtra',      19.0760,  72.8777),
  (gen_random_uuid(), 'Delhi',           'Delhi',            28.6139,  77.2090),
  (gen_random_uuid(), 'Bangalore',       'Karnataka',        12.9716,  77.5946),
  (gen_random_uuid(), 'Hyderabad',       'Telangana',        17.3850,  78.4867),
  (gen_random_uuid(), 'Ahmedabad',       'Gujarat',          23.0225,  72.5714),
  (gen_random_uuid(), 'Chennai',         'Tamil Nadu',       13.0827,  80.2707),
  (gen_random_uuid(), 'Kolkata',         'West Bengal',      22.5726,  88.3639),
  (gen_random_uuid(), 'Surat',           'Gujarat',          21.1702,  72.8311),
  (gen_random_uuid(), 'Pune',            'Maharashtra',      18.5204,  73.8567),
  (gen_random_uuid(), 'Jaipur',          'Rajasthan',        26.9124,  75.7873),
  (gen_random_uuid(), 'Lucknow',         'Uttar Pradesh',    26.8467,  80.9462),
  (gen_random_uuid(), 'Kanpur',          'Uttar Pradesh',    26.4499,  80.3319),
  (gen_random_uuid(), 'Nagpur',          'Maharashtra',      21.1458,  79.0882),
  (gen_random_uuid(), 'Indore',          'Madhya Pradesh',   22.7196,  75.8577),
  (gen_random_uuid(), 'Thane',           'Maharashtra',      19.2183,  72.9781),
  (gen_random_uuid(), 'Bhopal',          'Madhya Pradesh',   23.2599,  77.4126),
  (gen_random_uuid(), 'Visakhapatnam',   'Andhra Pradesh',   17.6868,  83.2185),
  (gen_random_uuid(), 'Pimpri-Chinchwad','Maharashtra',      18.6298,  73.7997),
  (gen_random_uuid(), 'Patna',           'Bihar',            25.5941,  85.1376),
  (gen_random_uuid(), 'Vadodara',        'Gujarat',          22.3072,  73.1812),
  (gen_random_uuid(), 'Ghaziabad',       'Uttar Pradesh',    28.6692,  77.4538),
  (gen_random_uuid(), 'Ludhiana',        'Punjab',           30.9010,  75.8573),
  (gen_random_uuid(), 'Agra',            'Uttar Pradesh',    27.1767,  78.0081),
  (gen_random_uuid(), 'Nashik',          'Maharashtra',      19.9975,  73.7898),
  (gen_random_uuid(), 'Faridabad',       'Haryana',          28.4089,  77.3178),
  (gen_random_uuid(), 'Meerut',          'Uttar Pradesh',    28.9845,  77.7064),
  (gen_random_uuid(), 'Rajkot',          'Gujarat',          22.3039,  70.8022),
  (gen_random_uuid(), 'Kalyan-Dombivli', 'Maharashtra',      19.2350,  73.1300),
  (gen_random_uuid(), 'Vasai-Virar',     'Maharashtra',      19.4259,  72.8225),
  (gen_random_uuid(), 'Varanasi',        'Uttar Pradesh',    25.3176,  82.9739),
  (gen_random_uuid(), 'Srinagar',        'Jammu & Kashmir',  34.0837,  74.7973),
  (gen_random_uuid(), 'Aurangabad',      'Maharashtra',      19.8762,  75.3433),
  (gen_random_uuid(), 'Dhanbad',         'Jharkhand',        23.7957,  86.4304),
  (gen_random_uuid(), 'Amritsar',        'Punjab',           31.6340,  74.8723),
  (gen_random_uuid(), 'Navi Mumbai',     'Maharashtra',      19.0330,  73.0297),
  (gen_random_uuid(), 'Allahabad',       'Uttar Pradesh',    25.4358,  81.8463),
  (gen_random_uuid(), 'Ranchi',          'Jharkhand',        23.3441,  85.3096),
  (gen_random_uuid(), 'Howrah',          'West Bengal',      22.5958,  88.2636),
  (gen_random_uuid(), 'Coimbatore',      'Tamil Nadu',       11.0168,  76.9558),
  (gen_random_uuid(), 'Jabalpur',        'Madhya Pradesh',   23.1815,  79.9864),
  (gen_random_uuid(), 'Gwalior',         'Madhya Pradesh',   26.2183,  78.1828),
  (gen_random_uuid(), 'Vijayawada',      'Andhra Pradesh',   16.5062,  80.6480),
  (gen_random_uuid(), 'Jodhpur',         'Rajasthan',        26.2389,  73.0243),
  (gen_random_uuid(), 'Madurai',         'Tamil Nadu',        9.9252,  78.1198),
  (gen_random_uuid(), 'Raipur',          'Chhattisgarh',     21.2514,  81.6296),
  (gen_random_uuid(), 'Kota',            'Rajasthan',        25.2138,  75.8648),
  (gen_random_uuid(), 'Chandigarh',      'Chandigarh',       30.7333,  76.7794),
  (gen_random_uuid(), 'Guwahati',        'Assam',            26.1445,  91.7362),
  (gen_random_uuid(), 'Solapur',         'Maharashtra',      17.6599,  75.9064),
  (gen_random_uuid(), 'Hubli-Dharwad',   'Karnataka',        15.3647,  75.1240),
  (gen_random_uuid(), 'Tiruchirappalli', 'Tamil Nadu',       10.7905,  78.7047),
  (gen_random_uuid(), 'Bareilly',        'Uttar Pradesh',    28.3670,  79.4304),
  (gen_random_uuid(), 'Mysore',          'Karnataka',        12.2958,  76.6394),
  (gen_random_uuid(), 'Tiruppur',        'Tamil Nadu',       11.1085,  77.3411),
  (gen_random_uuid(), 'Gurgaon',         'Haryana',          28.4595,  77.0266),
  (gen_random_uuid(), 'Aligarh',         'Uttar Pradesh',    27.8974,  78.0880),
  (gen_random_uuid(), 'Jalandhar',       'Punjab',           31.3260,  75.5762),
  (gen_random_uuid(), 'Bhubaneswar',     'Odisha',           20.2961,  85.8245),
  (gen_random_uuid(), 'Salem',           'Tamil Nadu',       11.6643,  78.1460),
  (gen_random_uuid(), 'Warangal',        'Telangana',        17.9784,  79.5941),
  (gen_random_uuid(), 'Kochi',           'Kerala',            9.9312,  76.2673),
  (gen_random_uuid(), 'Thiruvananthapuram','Kerala',           8.5241,  76.9366),
  (gen_random_uuid(), 'Kozhikode',       'Kerala',           11.2588,  75.7804),
  (gen_random_uuid(), 'Noida',           'Uttar Pradesh',    28.5355,  77.3910),
  (gen_random_uuid(), 'Dehradun',        'Uttarakhand',      30.3165,  78.0322),
  (gen_random_uuid(), 'Jammu',           'Jammu & Kashmir',  32.7266,  74.8570),
  (gen_random_uuid(), 'Mangalore',       'Karnataka',        12.9141,  74.8560),
  (gen_random_uuid(), 'Udaipur',         'Rajasthan',        24.5854,  73.7125),
  (gen_random_uuid(), 'Siliguri',        'West Bengal',      26.7271,  88.3953),
  (gen_random_uuid(), 'Bhopal',          'Madhya Pradesh',   23.2599,  77.4126),
  (gen_random_uuid(), 'Thrissur',        'Kerala',           10.5276,  76.2144),
  (gen_random_uuid(), 'Guntur',          'Andhra Pradesh',   16.3067,  80.4365),
  (gen_random_uuid(), 'Bhiwandi',        'Maharashtra',      19.2967,  73.0631),
  (gen_random_uuid(), 'Nellore',         'Andhra Pradesh',   14.4426,  79.9865),
  (gen_random_uuid(), 'Bikaner',         'Rajasthan',        28.0229,  73.3119),
  (gen_random_uuid(), 'Cuttack',         'Odisha',           20.4625,  85.8830),
  (gen_random_uuid(), 'Gorakhpur',       'Uttar Pradesh',    26.7606,  83.3732),
  (gen_random_uuid(), 'Amravati',        'Maharashtra',      20.9320,  77.7523),
  (gen_random_uuid(), 'Durgapur',        'West Bengal',      23.4800,  87.3200),
  (gen_random_uuid(), 'Ajmer',           'Rajasthan',        26.4499,  74.6399),
  (gen_random_uuid(), 'Jamshedpur',      'Jharkhand',        22.8046,  86.2029),
  (gen_random_uuid(), 'Rajpur Sonarpur', 'West Bengal',      22.4500,  88.4000),
  (gen_random_uuid(), 'Bhilai',          'Chhattisgarh',     21.1938,  81.3509),
  (gen_random_uuid(), 'Kolhapur',        'Maharashtra',      16.7050,  74.2433);


-- ─────────────────────────────────────────
-- 2. BRANDS
-- ─────────────────────────────────────────

insert into public.brands (id, name, logo_url) values
  (gen_random_uuid(), 'PVR',       'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/PVR_Cinemas_new_logo.svg/1200px-PVR_Cinemas_new_logo.svg.png'),
  (gen_random_uuid(), 'INOX',      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/INOX_Movies_logo.svg/1200px-INOX_Movies_logo.svg.png'),
  (gen_random_uuid(), 'Cinepolis', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cinepolis_logo.svg/1200px-Cinepolis_logo.svg.png'),
  (gen_random_uuid(), 'Miraj',     'https://example.com/miraj.png'),
  (gen_random_uuid(), 'Carnival',  'https://example.com/carnival.png'),
  (gen_random_uuid(), 'SPI',       'https://example.com/spi.png');


-- ─────────────────────────────────────────
-- 3. MOVIES
-- ─────────────────────────────────────────

insert into public.movies (id, name, director, duration, age_rating, genre, movies_status, audience_score, movie_img) values
  (gen_random_uuid(), 'Spider-Man: No Way Home',     'Sukumar',              '02:40:00', 'UA',   'action',   'streaming', 8.5, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/1773074609353.png'),
  (gen_random_uuid(), 'Yowis Ben',                 'Sandeep Reddy Vanga',  '03:21:00', 'A',    'action',   'streaming', 7.8, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/Yowis%20Ben.png'),
  (gen_random_uuid(), 'House of Gucci',                'Amar Kaushik',         '02:15:00', 'UA',   'horror',   'streaming', 8.9, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/House%20of%20Gucci.png'),
  (gen_random_uuid(), 'Ghostbusters Afterlife',          'Nag Ashwin',           '02:58:00', 'UA',   'action',   'streaming', 7.5, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/Ghostbusters%20Afterlife.png'),
  (gen_random_uuid(), 'John Wick Chapter 3 - Parabellum',        'Rohit Shetty',         '02:30:00', 'UA',   'action',   'upcoming',  0.0, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/John%20Wick_%20Chapter%203%20-%20Parabellum.png'),
  (gen_random_uuid(), 'Resident Evil_ Welcome to Raccoon City',                  'Ayan Mukerji',         '02:45:00', 'UA',   'action',   'upcoming',  0.0, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/Resident%20Evil_%20Welcome%20to%20Raccoon%20City.png'),
  (gen_random_uuid(), 'Sword Art Online_ Progressive - Aria of a Starless Night',                   'Rosshan Andrrews',     '02:20:00', 'UA',   'action',   'streaming', 7.2, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/Sword%20Art%20Online_%20Progressive%20-%20Aria%20of%20a%20Starless%20Night.png'),
  (gen_random_uuid(), 'Tenet',              'Abhishek Anil Kapur',  '02:10:00', 'UA',   'war',      'streaming', 8.1, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/Tenet.png'),
  (gen_random_uuid(), 'The Matrix Resurrections',        'Sriram Raghavan',      '02:15:00', 'UA',   'thriller', 'streaming', 7.9, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/The%20Matrix%20Resurrections.png'),
  (gen_random_uuid(), 'Avengers Endgame',                'Siddharth Anand',      '02:46:00', 'UA',   'war',      'streaming', 7.0, 'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/movies_imgs/movies-imgs/Avengers_%20Endgame.png');


-- ─────────────────────────────────────────
-- 4. DISCOUNT
-- ─────────────────────────────────────────

insert into public.discount (id, code, valid_until, is_active, discounted_amount, min_amount, usage_limit, usage_count, discount_type) values
  (gen_random_uuid(), 'FIRST50',    now() + interval '30 days', true, 50,  200, 1000, 0, 'flat'),
  (gen_random_uuid(), 'SAVE20',     now() + interval '15 days', true, 20,  300, 500,  0, 'percent'),
  (gen_random_uuid(), 'WEEKEND100', now() + interval '7 days',  true, 100, 500, 200,  0, 'flat'),
  (gen_random_uuid(), 'NEWUSER',    now() + interval '60 days', true, 30,  150, 2000, 0, 'percent');

  -- ─────────────────────────────────────────
-- NEWS DATA (from remote)
-- ─────────────────────────────────────────

insert into public.news (id, created_at, title, subtitle, img, release_date, category, tag, content, likes) values
(
  'a59c443c-48a5-4a73-af63-d4bd923c697e',
  '2026-03-05 04:40:24.731881+00',
  'House of Gucci: The Story of Gucci''s Sole Heir in 1955.',
  'The Rise, Fall, and Legacy of the Gucci Dynasty''s Third Generation',
  'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/news_Image/news-imgs/1772685623484.png',
  '2026-03-19',
  'News',
  'HouseofGucci',
  'The latest trailer for Spider-Man: No Way Home has finally dropped, giving fans a deeper look into the chaos unfolding in the multiverse. With Peter Parker’s identity now exposed, he turns to Doctor Strange for help, but things quickly spiral out of control. The trailer teases intense action, emotional stakes, and the return of familiar villains from previous Spider-Man franchises.

One of the most exciting aspects of the trailer is the appearance of iconic antagonists like Doctor Octopus and hints at Green Goblin. These characters bring a nostalgic element for long-time fans while raising the stakes for Tom Holland’s Spider-Man. The visuals are stunning, blending high-energy combat with emotional moments that explore Peter’s struggle with responsibility and consequences.

As anticipation builds, fans are speculating about possible surprise appearances and crossovers. The trailer sets the tone for a film that promises to redefine the Spider-Man universe, making it one of the most talked-about releases in recent times. It’s clear that this installment aims to deliver both spectacle and heartfelt storytelling.',
  2
),
(
  '199ae328-cad1-44ef-8fc2-ad7478171e83',
  '2026-03-02 10:00:37.643554+00',
  'Spider-Man: No Way Home Releases New Trailer.',
  'Spider-Man: No Way Home menjadi film yang sangat dinantikan oleh banyak orang.',
  'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/news_Image/news-imgs/1772445627291.png',
  '2026-03-08',
  'Spotlight',
  'Spiderman',
  'brings a fresh take on the beloved franchise while honoring its roots. The film introduces a new generation of ghostbusters who uncover their connection to the original team. Set in a small town, the story builds a mysterious atmosphere as supernatural occurrences begin to rise.

One of the highlights of the movie is the wide variety of ghosts, each with unique designs and personalities. From mischievous spirits to more menacing entities, the film strikes a balance between humor and suspense. The special effects elevate the ghost-hunting experience, making every encounter visually engaging and entertaining.

Alongside the new characters, the film includes nostalgic callbacks that longtime fans will appreciate. The blend of old and new elements creates a story that feels both familiar and refreshing. It successfully captures the spirit of the original films while introducing a new chapter for the franchise.',
  0
),
(
  'd3ad89d9-2e18-49cf-9eec-96ab416f1163',
  '2026-03-02 10:02:35.169371+00',
  'Facts About Yowis Ben Finale That You Need to Know Before Watching!',
  'Film Yowis Ben Finale merupakan film akhir dari tetralogi film Yowis Ben.',
  'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/news_Image/news-imgs/1772445750381.png',
  '2026-04-04',
  'Spotlight',
  'Yowis Ben',
  'Renowned martial artist and actor Donnie Yen returns to the screen in a thrilling new Hong Kong action film. Known for his exceptional combat skills and intense screen presence, Yen delivers another powerful performance filled with high-octane sequences and gripping storytelling.

The film showcases a blend of traditional martial arts and modern action choreography, creating visually stunning fight scenes. Each sequence is carefully crafted to highlight Yen’s agility and precision, keeping audiences on the edge of their seats. The storyline complements the action, adding depth and emotional weight to the character’s journey.

Beyond the action, the film explores themes of justice, loyalty, and redemption. Donnie Yen’s performance brings authenticity and intensity, making the character both relatable and compelling. It’s a must-watch for fans of action cinema and martial arts enthusiasts alike.',
  2
),
(
  '2248134c-07be-4078-a8b6-500248775a47',
  '2026-03-02 10:25:39.277658+00',
  'Ghostbusters: Afterlife Arrives Featuring a New Variety of Ghosts',
  'Ghostbusters: Film Yowis Ben Finale merupakan film akhir dari tetralogi film Yowis Ben.',
  'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/news_Image/news-imgs/1772447136646.png',
  '2026-11-08',
  'News',
  'Ghostbusters',
  'Renowned martial artist and actor Donnie Yen returns to the screen in a thrilling new Hong Kong action film. Known for his exceptional combat skills and intense screen presence, Yen delivers another powerful performance filled with high-octane sequences and gripping storytelling.

The film showcases a blend of traditional martial arts and modern action choreography, creating visually stunning fight scenes. Each sequence is carefully crafted to highlight Yen’s agility and precision, keeping audiences on the edge of their seats. The storyline complements the action, adding depth and emotional weight to the character’s journey.

Beyond the action, the film explores themes of justice, loyalty, and redemption. Donnie Yen’s performance brings authenticity and intensity, making the character both relatable and compelling. It’s a must-watch for fans of action cinema and martial arts enthusiasts alike.',
  9
),
(
  '52f68eee-3681-4644-b749-4f813372a270',
  '2026-03-05 04:42:43.722141+00',
  'Donnie Yen in Action in the Latest Hong Kong Action Film',
  'The film features an ensemble cast including Julian Cheung, Francis Ng, and Michael Hui.',
  'https://hrcxheiyttrbccjsngkr.supabase.co/storage/v1/object/public/news_Image/news-imgs/1772685762308.png',
  '2026-03-13',
  'News',
  'Action Film',
  'dives into the dramatic history of the Gucci fashion empire, focusing on the complexities of family, ambition, and betrayal. Set against the backdrop of luxury and power, the film tells a gripping story of how internal conflicts shaped the brand’s legacy.

The narrative highlights the rise of key figures within the Gucci family, exploring their relationships and struggles. With strong performances and detailed storytelling, the film captures the glamour as well as the darker side of wealth and influence. It paints a vivid picture of a family torn apart by greed and ambition.

Visually, the film stands out with its stunning costumes and rich settings that reflect the era’s elegance. Combined with its intense drama, it offers an engaging cinematic experience. It’s not just a story about fashion, but a deep exploration of human emotions and power dynamics.',
  46
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- STEP 1: Create temp variables for IDs
-- We use DO block so we can reference same IDs
-- across theater → screen → showtimes
-- ─────────────────────────────────────────

do $$
declare
  -- City IDs
  city_surat      uuid;
  city_mumbai     uuid;
  city_delhi      uuid;

  -- Brand IDs
  brand_pvr       uuid;
  brand_inox      uuid;
  brand_cinepolis uuid;

  -- Movie IDs
  movie_spiderman uuid;
  movie_avengers  uuid;
  movie_matrix    uuid;
  movie_tenet     uuid;
  movie_johnwick  uuid;

  -- Theater IDs
  theater_pvr_surat      uuid := gen_random_uuid();
  theater_inox_surat     uuid := gen_random_uuid();
  theater_cinepolis_surat uuid := gen_random_uuid();

  -- Screen IDs
  screen_pvr_regular     uuid := gen_random_uuid();
  screen_pvr_gold        uuid := gen_random_uuid();
  screen_inox_2d         uuid := gen_random_uuid();
  screen_inox_imax       uuid := gen_random_uuid();
  screen_cinepolis_2d    uuid := gen_random_uuid();
  screen_cinepolis_4dx   uuid := gen_random_uuid();

begin

  -- ─────────────────────────────────────────
  -- Fetch existing City IDs
  -- ─────────────────────────────────────────
  select id into city_surat   from public.cities where name = 'Surat'   limit 1;
  select id into city_mumbai  from public.cities where name = 'Mumbai'  limit 1;
  select id into city_delhi   from public.cities where name = 'Delhi'   limit 1;

  -- ─────────────────────────────────────────
  -- Fetch existing Brand IDs
  -- ─────────────────────────────────────────
  select id into brand_pvr       from public.brands where name = 'PVR'       limit 1;
  select id into brand_inox      from public.brands where name = 'INOX'      limit 1;
  select id into brand_cinepolis from public.brands where name = 'Cinepolis' limit 1;

  -- ─────────────────────────────────────────
  -- Fetch existing Movie IDs
  -- ─────────────────────────────────────────
  select id into movie_spiderman from public.movies where name ilike '%Spider-Man%'  limit 1;
  select id into movie_avengers  from public.movies where name ilike '%Avengers%'    limit 1;
  select id into movie_matrix    from public.movies where name ilike '%Matrix%'      limit 1;
  select id into movie_tenet     from public.movies where name ilike '%Tenet%'       limit 1;
  select id into movie_johnwick  from public.movies where name ilike '%John Wick%'   limit 1;

  -- ─────────────────────────────────────────
  -- 4. THEATERS
  -- ─────────────────────────────────────────
insert into public.theater (id, name, address, brand_id, city_id, latitude, longitude) values
  (theater_pvr_surat,       'PVR Surat Central',        'Surat Central Mall, Ring Road, Surat',        brand_pvr,       city_surat, 21.1934, 72.8310),
  (theater_inox_surat,      'INOX VR Surat',             'VR Mall, Dumas Road, Surat',                  brand_inox,      city_surat, 21.1425, 72.7718),
  (theater_cinepolis_surat, 'Cinepolis Dreams The Mall', 'Dreams The Mall, Sarthana Jakatnaka, Surat',  brand_cinepolis, city_surat, 21.2138, 72.8560);
  -- ─────────────────────────────────────────
  -- 5. SCREENS
  -- ─────────────────────────────────────────
  insert into public.screen (id, name, theater_id, type, total_seats, seat_row, seat_col) values
    -- PVR Surat Central
    (screen_pvr_regular, 'Regular 2D', theater_pvr_surat,       'Regular', 120, 10, 12),
    (screen_pvr_gold,    'Gold Class', theater_pvr_surat,       'Gold',     40,  5,  8),

    -- INOX VR Surat
    (screen_inox_2d,     'Standard 2D', theater_inox_surat,     'Standard', 150, 10, 15),
    (screen_inox_imax,   'IMAX',        theater_inox_surat,     'IMAX',      80,  8, 10),

    -- Cinepolis Dreams
    (screen_cinepolis_2d,  '2D Standard', theater_cinepolis_surat, 'Standard', 130, 10, 13),
    (screen_cinepolis_4dx, '4DX',         theater_cinepolis_surat, '4DX',       60,  6, 10);

  -- ─────────────────────────────────────────
  -- 6. SEATS
  -- (generates seats for each screen based on row x col)
  -- ─────────────────────────────────────────
  insert into public.seats (id, screen_id, seat_row, seat_col)
  select
    gen_random_uuid(),
    s.id,
    r.row_num,
    c.col_num
  from public.screen s
  cross join generate_series(1, s.seat_row) as r(row_num)
  cross join generate_series(1, s.seat_col) as c(col_num)
  where s.id in (
    screen_pvr_regular,
    screen_pvr_gold,
    screen_inox_2d,
    screen_inox_imax,
    screen_cinepolis_2d,
    screen_cinepolis_4dx
  );

  -- ─────────────────────────────────────────
  -- 7. SHOWTIMES
  -- Using now()::date so dates are always today + future
  -- Multiple movies × multiple theaters × multiple screens
  -- ─────────────────────────────────────────
  insert into public.showtimes (id, movie_id, theater_id, screen_id, show_time, price, is_active) values

    -- ── SPIDER-MAN at PVR (Regular 2D) ──
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '10 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '13 hours 45 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '16 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '19 hours 15 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '22 hours 00 minutes')::timestamptz, 220, true),

    -- ── SPIDER-MAN at PVR (Gold Class) ──
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '11 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '14 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '18 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '21 hours 30 minutes')::timestamptz, 450, true),

    -- ── SPIDER-MAN at INOX (Standard 2D) ──
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_2d, (now()::date + interval '09 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_2d, (now()::date + interval '12 hours 45 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_2d, (now()::date + interval '15 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_2d, (now()::date + interval '18 hours 45 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_2d, (now()::date + interval '21 hours 15 minutes')::timestamptz, 190, true),

    -- ── SPIDER-MAN at INOX (IMAX) ──
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_imax, (now()::date + interval '10 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_imax, (now()::date + interval '13 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_imax, (now()::date + interval '17 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox_surat, screen_inox_imax, (now()::date + interval '20 hours 30 minutes')::timestamptz, 380, true),

    -- ── SPIDER-MAN at Cinepolis (2D) ──
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '10 hours 15 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '13 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '16 hours 15 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '19 hours 30 minutes')::timestamptz, 200, true),

    -- ── SPIDER-MAN at Cinepolis (4DX) ──
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '11 hours 30 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '15 hours 00 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '18 hours 30 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '22 hours 00 minutes')::timestamptz, 500, true),

    -- ── AVENGERS at PVR (Regular 2D) ──
    (gen_random_uuid(), movie_avengers, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '1 day' + interval '10 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '1 day' + interval '14 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '1 day' + interval '18 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr_surat, screen_pvr_regular, (now()::date + interval '1 day' + interval '21 hours 30 minutes')::timestamptz, 220, true),

    -- ── AVENGERS at INOX (IMAX) ──
    (gen_random_uuid(), movie_avengers, theater_inox_surat, screen_inox_imax, (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox_surat, screen_inox_imax, (now()::date + interval '1 day' + interval '15 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox_surat, screen_inox_imax, (now()::date + interval '1 day' + interval '19 hours 00 minutes')::timestamptz, 380, true),

    -- ── MATRIX at Cinepolis (2D) ──
    (gen_random_uuid(), movie_matrix, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '2 days' + interval '10 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '2 days' + interval '17 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis_surat, screen_cinepolis_2d, (now()::date + interval '2 days' + interval '21 hours 00 minutes')::timestamptz, 200, true),

    -- ── TENET at INOX (Standard 2D) ──
    (gen_random_uuid(), movie_tenet, theater_inox_surat, screen_inox_2d, (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_tenet, theater_inox_surat, screen_inox_2d, (now()::date + interval '3 days' + interval '14 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_tenet, theater_inox_surat, screen_inox_2d, (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 190, true),

    -- ── JOHN WICK at PVR (Gold Class) ──
    (gen_random_uuid(), movie_johnwick, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '4 days' + interval '12 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '4 days' + interval '15 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '4 days' + interval '19 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr_surat, screen_pvr_gold, (now()::date + interval '4 days' + interval '22 hours 00 minutes')::timestamptz, 450, true);

end $$;

-- ─────────────────────────────────────────
-- ADDITIONAL SHOWTIMES
-- Covers all 5 active dates for all movies
-- ─────────────────────────────────────────

do $$
declare
  -- Movie IDs
  movie_spiderman uuid;
  movie_avengers  uuid;
  movie_matrix    uuid;
  movie_tenet     uuid;
  movie_johnwick  uuid;
  movie_gucci     uuid;
  movie_ghost     uuid;
  movie_yowis     uuid;

  -- Theater IDs (fetch existing)
  theater_pvr      uuid;
  theater_inox     uuid;
  theater_cinepolis uuid;

  -- Screen IDs (fetch existing)
  screen_pvr_regular  uuid;
  screen_pvr_gold     uuid;
  screen_inox_2d      uuid;
  screen_inox_imax    uuid;
  screen_cinepolis_2d uuid;
  screen_cinepolis_4dx uuid;

begin

  -- ─────────────────────────────────────────
  -- Fetch Movie IDs
  -- ─────────────────────────────────────────
  select id into movie_spiderman from public.movies where name ilike '%Spider-Man%'     limit 1;
  select id into movie_avengers  from public.movies where name ilike '%Avengers%'       limit 1;
  select id into movie_matrix    from public.movies where name ilike '%Matrix%'         limit 1;
  select id into movie_tenet     from public.movies where name ilike '%Tenet%'          limit 1;
  select id into movie_johnwick  from public.movies where name ilike '%John Wick%'      limit 1;
  select id into movie_gucci     from public.movies where name ilike '%Gucci%'          limit 1;
  select id into movie_ghost     from public.movies where name ilike '%Ghostbusters%'   limit 1;
  select id into movie_yowis     from public.movies where name ilike '%Yowis%'          limit 1;

  -- ─────────────────────────────────────────
  -- Fetch Theater IDs
  -- ─────────────────────────────────────────
  select id into theater_pvr       from public.theater where name ilike '%PVR%'       limit 1;
  select id into theater_inox      from public.theater where name ilike '%INOX%'      limit 1;
  select id into theater_cinepolis from public.theater where name ilike '%Cinepolis%' limit 1;

  -- ─────────────────────────────────────────
  -- Fetch Screen IDs
  -- ─────────────────────────────────────────
  select id into screen_pvr_regular   from public.screen where name = 'Regular 2D'  and theater_id = theater_pvr      limit 1;
  select id into screen_pvr_gold      from public.screen where name = 'Gold Class'  and theater_id = theater_pvr      limit 1;
  select id into screen_inox_2d       from public.screen where name = 'Standard 2D' and theater_id = theater_inox     limit 1;
  select id into screen_inox_imax     from public.screen where name = 'IMAX'        and theater_id = theater_inox     limit 1;
  select id into screen_cinepolis_2d  from public.screen where name = '2D Standard' and theater_id = theater_cinepolis limit 1;
  select id into screen_cinepolis_4dx from public.screen where name = '4DX'         and theater_id = theater_cinepolis limit 1;

  -- ─────────────────────────────────────────
  -- SPIDER-MAN: Day 1, 2, 3, 4 (today already exists)
  -- ─────────────────────────────────────────

  -- Day 1
  insert into public.showtimes (id, movie_id, theater_id, screen_id, show_time, price, is_active) values
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '13 hours 45 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '20 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '1 day' + interval '15 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '1 day' + interval '19 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '09 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '16 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '20 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '1 day' + interval '10 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '1 day' + interval '14 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '1 day' + interval '18 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '10 hours 15 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '14 hours 15 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '18 hours 15 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '1 day' + interval '20 hours 00 minutes')::timestamptz, 500, true),

  -- Day 2
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '2 days' + interval '16 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '09 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '13 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '17 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '15 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '20 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '10 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '15 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '2 days' + interval '13 hours 00 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 500, true),

  -- Day 3
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '10 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '14 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '19 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '3 days' + interval '12 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '09 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '13 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '16 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '14 hours 00 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '19 hours 00 minutes')::timestamptz, 500, true),

  -- Day 4
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '19 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '4 days' + interval '12 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_pvr,       screen_pvr_gold,      (now()::date + interval '4 days' + interval '17 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '4 days' + interval '11 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_inox,      screen_inox_imax,     (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '10 hours 45 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '15 hours 45 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '4 days' + interval '13 hours 30 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_spiderman, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '4 days' + interval '18 hours 30 minutes')::timestamptz, 500, true),

  -- ─────────────────────────────────────────
  -- AVENGERS: Day 0, 2, 3, 4 (day 1 already exists)
  -- ─────────────────────────────────────────

  -- Day 0 (today)
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '11 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '15 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '19 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '10 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '14 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '18 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '12 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '16 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '13 hours 00 minutes')::timestamptz, 500, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '18 hours 00 minutes')::timestamptz, 500, true),

  -- Day 2
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '16 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '13 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '2 days' + interval '17 hours 00 minutes')::timestamptz, 500, true),

  -- Day 3
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '10 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '3 days' + interval '12 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '16 hours 00 minutes')::timestamptz, 500, true),

  -- Day 4
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_inox,      screen_inox_imax,     (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '12 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_avengers, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '4 days' + interval '17 hours 00 minutes')::timestamptz, 500, true),

  -- ─────────────────────────────────────────
  -- MATRIX: All 5 days (day 2 already exists)
  -- ─────────────────────────────────────────

  -- Day 0
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '10 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '14 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_2d,       (now()::date + interval '11 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_2d,       (now()::date + interval '16 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '13 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '18 hours 00 minutes')::timestamptz, 200, true),

  -- Day 1
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '15 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 200, true),

  -- Day 3
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '11 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_imax,     (now()::date + interval '3 days' + interval '16 hours 30 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '12 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 500, true),

  -- Day 4
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_matrix, theater_pvr,       screen_pvr_gold,      (now()::date + interval '4 days' + interval '15 hours 30 minutes')::timestamptz, 450, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_matrix, theater_inox,      screen_inox_imax,     (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 380, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '13 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_matrix, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '4 days' + interval '19 hours 00 minutes')::timestamptz, 500, true),

  -- ─────────────────────────────────────────
  -- TENET: All 5 days (day 3 already exists)
  -- ─────────────────────────────────────────

  -- Day 0
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '10 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '14 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_2d,       (now()::date + interval '12 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_2d,       (now()::date + interval '17 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '11 hours 30 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '16 hours 30 minutes')::timestamptz, 180, true),

  -- Day 1
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '15 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '17 hours 30 minutes')::timestamptz, 180, true),

  -- Day 2
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_gold,      (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '12 hours 30 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '17 hours 00 minutes')::timestamptz, 360, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '2 days' + interval '16 hours 00 minutes')::timestamptz, 480, true),

  -- Day 4
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_tenet, theater_inox,      screen_inox_imax,     (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 360, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '13 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_tenet, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 480, true),

  -- ─────────────────────────────────────────
  -- JOHN WICK: All 5 days (day 4 already exists)
  -- ─────────────────────────────────────────

  -- Day 0
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '11 hours 00 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '16 hours 00 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_2d,       (now()::date + interval '10 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_2d,       (now()::date + interval '15 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '13 hours 00 minutes')::timestamptz, 480, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '18 hours 00 minutes')::timestamptz, 480, true),

  -- Day 1
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '15 hours 30 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '1 day' + interval '14 hours 00 minutes')::timestamptz, 480, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '1 day' + interval '19 hours 00 minutes')::timestamptz, 480, true),

  -- Day 2
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '2 days' + interval '16 hours 30 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '09 hours 30 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_imax,     (now()::date + interval '2 days' + interval '14 hours 30 minutes')::timestamptz, 360, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '2 days' + interval '13 hours 00 minutes')::timestamptz, 480, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 200, true),

  -- Day 3
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_gold,      (now()::date + interval '3 days' + interval '12 hours 00 minutes')::timestamptz, 420, true),
    (gen_random_uuid(), movie_johnwick, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 220, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_johnwick, theater_inox,      screen_inox_imax,     (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 360, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 480, true),
    (gen_random_uuid(), movie_johnwick, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '16 hours 00 minutes')::timestamptz, 200, true),

  -- ─────────────────────────────────────────
  -- HOUSE OF GUCCI: All 5 days
  -- ─────────────────────────────────────────

    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '10 hours 00 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '14 hours 30 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_gold,      (now()::date + interval '12 hours 00 minutes')::timestamptz, 440, true),
    (gen_random_uuid(), movie_gucci, theater_inox,      screen_inox_2d,       (now()::date + interval '11 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_gucci, theater_inox,      screen_inox_2d,       (now()::date + interval '16 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_gucci, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '13 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '15 hours 00 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_gucci, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '14 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '13 hours 30 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_gucci, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '16 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '14 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_gucci, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_gucci, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '11 hours 30 minutes')::timestamptz, 210, true),
    (gen_random_uuid(), movie_gucci, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 180, true),
    (gen_random_uuid(), movie_gucci, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '17 hours 00 minutes')::timestamptz, 190, true),

  -- ─────────────────────────────────────────
  -- GHOSTBUSTERS: All 5 days
  -- ─────────────────────────────────────────

    (gen_random_uuid(), movie_ghost, theater_pvr,       screen_pvr_regular,   (now()::date + interval '10 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_ghost, theater_pvr,       screen_pvr_regular,   (now()::date + interval '15 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_ghost, theater_inox,      screen_inox_2d,       (now()::date + interval '12 hours 00 minutes')::timestamptz, 175, true),
    (gen_random_uuid(), movie_ghost, theater_inox,      screen_inox_2d,       (now()::date + interval '17 hours 00 minutes')::timestamptz, 175, true),
    (gen_random_uuid(), movie_ghost, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '14 hours 00 minutes')::timestamptz, 185, true),
    (gen_random_uuid(), movie_ghost, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_ghost, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 175, true),
    (gen_random_uuid(), movie_ghost, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 185, true),
    (gen_random_uuid(), movie_ghost, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_ghost, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 175, true),
    (gen_random_uuid(), movie_ghost, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 185, true),
    (gen_random_uuid(), movie_ghost, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '11 hours 30 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_ghost, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 175, true),
    (gen_random_uuid(), movie_ghost, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '17 hours 30 minutes')::timestamptz, 185, true),
    (gen_random_uuid(), movie_ghost, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
    (gen_random_uuid(), movie_ghost, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '13 hours 30 minutes')::timestamptz, 175, true),
    (gen_random_uuid(), movie_ghost, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '16 hours 30 minutes')::timestamptz, 185, true),

  -- ─────────────────────────────────────────
  -- YOWIS BEN: All 5 days
  -- ─────────────────────────────────────────

    (gen_random_uuid(), movie_yowis, theater_pvr,       screen_pvr_regular,   (now()::date + interval '11 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_yowis, theater_pvr,       screen_pvr_regular,   (now()::date + interval '15 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_yowis, theater_inox,      screen_inox_2d,       (now()::date + interval '10 hours 00 minutes')::timestamptz, 160, true),
    (gen_random_uuid(), movie_yowis, theater_inox,      screen_inox_2d,       (now()::date + interval '14 hours 30 minutes')::timestamptz, 160, true),
    (gen_random_uuid(), movie_yowis, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '12 hours 30 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_yowis, theater_pvr,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_yowis, theater_inox,      screen_inox_2d,       (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 160, true),
    (gen_random_uuid(), movie_yowis, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_yowis, theater_pvr,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_yowis, theater_inox,      screen_inox_2d,       (now()::date + interval '2 days' + interval '15 hours 00 minutes')::timestamptz, 160, true),
    (gen_random_uuid(), movie_yowis, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '18 hours 30 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_yowis, theater_pvr,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_yowis, theater_inox,      screen_inox_2d,       (now()::date + interval '3 days' + interval '14 hours 00 minutes')::timestamptz, 160, true),
    (gen_random_uuid(), movie_yowis, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 170, true),
    (gen_random_uuid(), movie_yowis, theater_pvr,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '11 hours 30 minutes')::timestamptz, 190, true),
    (gen_random_uuid(), movie_yowis, theater_inox,      screen_inox_2d,       (now()::date + interval '4 days' + interval '15 hours 30 minutes')::timestamptz, 160, true),
    (gen_random_uuid(), movie_yowis, theater_cinepolis, screen_cinepolis_2d,  (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 170, true);

end $$;

-- ─────────────────────────────────────────
-- EXTENDED SEED DATA
-- More theaters + all missing movies + more time slots
-- ─────────────────────────────────────────

do $$
declare
  -- Movie IDs
  movie_spiderman uuid;
  movie_avengers  uuid;
  movie_matrix    uuid;
  movie_tenet     uuid;
  movie_johnwick  uuid;
  movie_gucci     uuid;
  movie_ghost     uuid;
  movie_yowis     uuid;
  movie_sao       uuid;
  movie_resident  uuid;

  -- City IDs
  city_surat    uuid;
  city_mumbai   uuid;
  city_delhi    uuid;
  city_bangalore uuid;
  city_pune     uuid;

  -- Brand IDs
  brand_pvr       uuid;
  brand_inox      uuid;
  brand_cinepolis uuid;
  brand_miraj     uuid;
  brand_carnival  uuid;

  -- Existing Surat theater IDs
  theater_pvr_surat       uuid;
  theater_inox_surat      uuid;
  theater_cinepolis_surat uuid;

  -- New theater IDs
  theater_pvr_mumbai      uuid := gen_random_uuid();
  theater_inox_mumbai     uuid := gen_random_uuid();
  theater_pvr_delhi       uuid := gen_random_uuid();
  theater_cinepolis_delhi uuid := gen_random_uuid();
  theater_inox_bangalore  uuid := gen_random_uuid();
  theater_miraj_bangalore uuid := gen_random_uuid();
  theater_pvr_pune        uuid := gen_random_uuid();
  theater_carnival_pune   uuid := gen_random_uuid();

  -- New screen IDs
  screen_pvr_mumbai_regular  uuid := gen_random_uuid();
  screen_pvr_mumbai_gold     uuid := gen_random_uuid();
  screen_pvr_mumbai_imax     uuid := gen_random_uuid();
  screen_inox_mumbai_2d      uuid := gen_random_uuid();
  screen_inox_mumbai_4dx     uuid := gen_random_uuid();
  screen_pvr_delhi_regular   uuid := gen_random_uuid();
  screen_pvr_delhi_gold      uuid := gen_random_uuid();
  screen_cinepolis_delhi_2d  uuid := gen_random_uuid();
  screen_cinepolis_delhi_4dx uuid := gen_random_uuid();
  screen_inox_blr_2d         uuid := gen_random_uuid();
  screen_inox_blr_imax       uuid := gen_random_uuid();
  screen_miraj_blr_2d        uuid := gen_random_uuid();
  screen_pvr_pune_regular    uuid := gen_random_uuid();
  screen_pvr_pune_gold       uuid := gen_random_uuid();
  screen_carnival_pune_2d    uuid := gen_random_uuid();

  -- Existing surat screen IDs
  screen_pvr_regular   uuid;
  screen_pvr_gold      uuid;
  screen_inox_2d       uuid;
  screen_inox_imax     uuid;
  screen_cinepolis_2d  uuid;
  screen_cinepolis_4dx uuid;

begin

  -- ─────────────────────────────────────────
  -- Fetch all existing IDs
  -- ─────────────────────────────────────────
  select id into movie_spiderman from public.movies where name ilike '%Spider-Man%'      limit 1;
  select id into movie_avengers  from public.movies where name ilike '%Avengers%'        limit 1;
  select id into movie_matrix    from public.movies where name ilike '%Matrix%'          limit 1;
  select id into movie_tenet     from public.movies where name ilike '%Tenet%'           limit 1;
  select id into movie_johnwick  from public.movies where name ilike '%John Wick%'       limit 1;
  select id into movie_gucci     from public.movies where name ilike '%Gucci%'           limit 1;
  select id into movie_ghost     from public.movies where name ilike '%Ghostbusters%'    limit 1;
  select id into movie_yowis     from public.movies where name ilike '%Yowis%'           limit 1;
  select id into movie_sao       from public.movies where name ilike '%Sword Art%'       limit 1;
  select id into movie_resident  from public.movies where name ilike '%Resident Evil%'   limit 1;

  select id into city_surat     from public.cities where name = 'Surat'     limit 1;
  select id into city_mumbai    from public.cities where name = 'Mumbai'    limit 1;
  select id into city_delhi     from public.cities where name = 'Delhi'     limit 1;
  select id into city_bangalore from public.cities where name = 'Bangalore' limit 1;
  select id into city_pune      from public.cities where name = 'Pune'      limit 1;

  select id into brand_pvr       from public.brands where name = 'PVR'       limit 1;
  select id into brand_inox      from public.brands where name = 'INOX'      limit 1;
  select id into brand_cinepolis from public.brands where name = 'Cinepolis' limit 1;
  select id into brand_miraj     from public.brands where name = 'Miraj'     limit 1;
  select id into brand_carnival  from public.brands where name = 'Carnival'  limit 1;

  select id into theater_pvr_surat       from public.theater where name ilike '%PVR%'       and city_id = city_surat limit 1;
  select id into theater_inox_surat      from public.theater where name ilike '%INOX%'      and city_id = city_surat limit 1;
  select id into theater_cinepolis_surat from public.theater where name ilike '%Cinepolis%' and city_id = city_surat limit 1;

  select id into screen_pvr_regular   from public.screen where name = 'Regular 2D'  and theater_id = theater_pvr_surat       limit 1;
  select id into screen_pvr_gold      from public.screen where name = 'Gold Class'  and theater_id = theater_pvr_surat       limit 1;
  select id into screen_inox_2d       from public.screen where name = 'Standard 2D' and theater_id = theater_inox_surat      limit 1;
  select id into screen_inox_imax     from public.screen where name = 'IMAX'        and theater_id = theater_inox_surat      limit 1;
  select id into screen_cinepolis_2d  from public.screen where name = '2D Standard' and theater_id = theater_cinepolis_surat limit 1;
  select id into screen_cinepolis_4dx from public.screen where name = '4DX'         and theater_id = theater_cinepolis_surat limit 1;

  -- ─────────────────────────────────────────
  -- NEW THEATERS
  -- ─────────────────────────────────────────
insert into public.theater (id, name, address, brand_id, city_id, latitude, longitude) values
  -- Mumbai
  (theater_pvr_mumbai,      'PVR Phoenix Palladium',       'Phoenix Palladium Mall, Lower Parel, Mumbai',   brand_pvr,       city_mumbai,    19.0011, 72.8266),
  (theater_inox_mumbai,     'INOX Nariman Point',           'Nariman Point, Mumbai',                         brand_inox,      city_mumbai,    18.9322, 72.8264),
  -- Delhi
  (theater_pvr_delhi,       'PVR Select Citywalk',          'Select Citywalk Mall, Saket, Delhi',            brand_pvr,       city_delhi,     28.5274, 77.2194),
  (theater_cinepolis_delhi, 'Cinepolis DLF Promenade',      'DLF Promenade Mall, Vasant Kunj, Delhi',        brand_cinepolis, city_delhi,     28.5197, 77.1567),
  -- Bangalore
  (theater_inox_bangalore,  'INOX Garuda Mall',             'Garuda Mall, Magrath Road, Bangalore',          brand_inox,      city_bangalore, 12.9667, 77.6002),
  (theater_miraj_bangalore, 'Miraj Cinemas Koramangala',    'Koramangala, Bangalore',                        brand_miraj,     city_bangalore, 12.9352, 77.6245),
  -- Pune
  (theater_pvr_pune,        'PVR Seasons Mall',             'Seasons Mall, Magarpatta City, Pune',           brand_pvr,       city_pune,      18.5089, 73.9259),
  (theater_carnival_pune,   'Carnival Cinemas Amanora',     'Amanora Town Centre, Hadapsar, Pune',           brand_carnival,  city_pune,      18.5074, 73.9278);
  
  -- ─────────────────────────────────────────
  -- NEW SCREENS
  -- ─────────────────────────────────────────
  insert into public.screen (id, name, theater_id, type, total_seats, seat_row, seat_col) values
    -- PVR Mumbai
    (screen_pvr_mumbai_regular, 'Regular 2D', theater_pvr_mumbai,      'Regular',  140, 10, 14),
    (screen_pvr_mumbai_gold,    'Gold Class', theater_pvr_mumbai,      'Gold',      40,  5,  8),
    (screen_pvr_mumbai_imax,    'IMAX',       theater_pvr_mumbai,      'IMAX',      90,  9, 10),
    -- INOX Mumbai
    (screen_inox_mumbai_2d,     'Standard 2D',theater_inox_mumbai,     'Standard', 160, 10, 16),
    (screen_inox_mumbai_4dx,    '4DX',        theater_inox_mumbai,     '4DX',       60,  6, 10),
    -- PVR Delhi
    (screen_pvr_delhi_regular,  'Regular 2D', theater_pvr_delhi,       'Regular',  130, 10, 13),
    (screen_pvr_delhi_gold,     'Gold Class', theater_pvr_delhi,       'Gold',      50,  5, 10),
    -- Cinepolis Delhi
    (screen_cinepolis_delhi_2d, '2D Standard',theater_cinepolis_delhi,  'Standard', 140, 10, 14),
    (screen_cinepolis_delhi_4dx,'4DX',        theater_cinepolis_delhi,  '4DX',       60,  6, 10),
    -- INOX Bangalore
    (screen_inox_blr_2d,        'Standard 2D',theater_inox_bangalore,  'Standard', 150, 10, 15),
    (screen_inox_blr_imax,      'IMAX',       theater_inox_bangalore,  'IMAX',      80,  8, 10),
    -- Miraj Bangalore
    (screen_miraj_blr_2d,       'Regular 2D', theater_miraj_bangalore, 'Regular',  120, 10, 12),
    -- PVR Pune
    (screen_pvr_pune_regular,   'Regular 2D', theater_pvr_pune,        'Regular',  130, 10, 13),
    (screen_pvr_pune_gold,      'Gold Class', theater_pvr_pune,        'Gold',      40,  5,  8),
    -- Carnival Pune
    (screen_carnival_pune_2d,   'Standard 2D',theater_carnival_pune,   'Standard', 140, 10, 14);

  -- ─────────────────────────────────────────
  -- NEW SEATS for all new screens
  -- ─────────────────────────────────────────
  insert into public.seats (id, screen_id, seat_row, seat_col)
  select gen_random_uuid(), s.id, r.row_num, c.col_num
  from public.screen s
  cross join generate_series(1, s.seat_row) as r(row_num)
  cross join generate_series(1, s.seat_col) as c(col_num)
  where s.id in (
    screen_pvr_mumbai_regular, screen_pvr_mumbai_gold,    screen_pvr_mumbai_imax,
    screen_inox_mumbai_2d,     screen_inox_mumbai_4dx,
    screen_pvr_delhi_regular,  screen_pvr_delhi_gold,
    screen_cinepolis_delhi_2d, screen_cinepolis_delhi_4dx,
    screen_inox_blr_2d,        screen_inox_blr_imax,      screen_miraj_blr_2d,
    screen_pvr_pune_regular,   screen_pvr_pune_gold,       screen_carnival_pune_2d
  );

  -- ─────────────────────────────────────────
  -- SHOWTIMES — 4 slots per screen per day
  -- Morning: 10:00 | Afternoon: 13:30 | Evening: 17:00 | Night: 20:30
  -- All 10 movies × all theaters × days 0-4
  -- ─────────────────────────────────────────

  insert into public.showtimes (id, movie_id, theater_id, screen_id, show_time, price, is_active) values

  -- ══════════════════════════════════════════
  -- SPIDER-MAN — Mumbai, Delhi, Bangalore, Pune (today already in Surat)
  -- ══════════════════════════════════════════

  -- Mumbai PVR
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '13 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '20 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '0 days' + interval '11 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '0 days' + interval '15 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '0 days' + interval '19 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_gold,    (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 500, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_gold,    (now()::date + interval '0 days' + interval '16 hours 30 minutes')::timestamptz, 500, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_gold,    (now()::date + interval '0 days' + interval '20 hours 00 minutes')::timestamptz, 500, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '10 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '13 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '20 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '1 day' + interval '15 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '1 day' + interval '19 hours 00 minutes')::timestamptz, 420, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '2 days' + interval '12 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '2 days' + interval '16 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '2 days' + interval '20 hours 00 minutes')::timestamptz, 420, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '10 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '14 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '18 hours 30 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '3 days' + interval '11 hours 30 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '3 days' + interval '15 hours 30 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '3 days' + interval '19 hours 30 minutes')::timestamptz, 420, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 250, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 420, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_mumbai, screen_pvr_mumbai_imax,    (now()::date + interval '4 days' + interval '19 hours 00 minutes')::timestamptz, 420, true),

  -- Mumbai INOX
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '0 days' + interval '09 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '0 days' + interval '13 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '0 days' + interval '16 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '0 days' + interval '20 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '0 days' + interval '11 hours 30 minutes')::timestamptz, 520, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '0 days' + interval '16 hours 00 minutes')::timestamptz, 520, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '0 days' + interval '20 hours 30 minutes')::timestamptz, 520, true),

  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '1 day' + interval '09 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '1 day' + interval '16 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '1 day' + interval '20 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '1 day' + interval '11 hours 30 minutes')::timestamptz, 520, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 520, true),

  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '2 days' + interval '12 hours 00 minutes')::timestamptz, 520, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '2 days' + interval '17 hours 00 minutes')::timestamptz, 520, true),

  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '3 days' + interval '10 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '3 days' + interval '14 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '3 days' + interval '18 hours 30 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '3 days' + interval '13 hours 00 minutes')::timestamptz, 520, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 520, true),

  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_2d,  (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 220, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '4 days' + interval '12 hours 30 minutes')::timestamptz, 520, true),
  (gen_random_uuid(), movie_spiderman, theater_inox_mumbai, screen_inox_mumbai_4dx, (now()::date + interval '4 days' + interval '17 hours 30 minutes')::timestamptz, 520, true),

  -- Delhi PVR
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '0 days' + interval '13 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '0 days' + interval '20 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '0 days' + interval '11 hours 30 minutes')::timestamptz, 480, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '0 days' + interval '16 hours 00 minutes')::timestamptz, 480, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '0 days' + interval '20 hours 00 minutes')::timestamptz, 480, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '1 day' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '1 day' + interval '13 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '1 day' + interval '20 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 480, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 480, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '2 days' + interval '10 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '2 days' + interval '14 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '2 days' + interval '18 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 480, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '2 days' + interval '16 hours 00 minutes')::timestamptz, 480, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '3 days' + interval '14 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '3 days' + interval '12 hours 30 minutes')::timestamptz, 480, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '3 days' + interval '17 hours 30 minutes')::timestamptz, 480, true),

  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_regular, (now()::date + interval '4 days' + interval '19 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '4 days' + interval '13 hours 00 minutes')::timestamptz, 480, true),
  (gen_random_uuid(), movie_spiderman, theater_pvr_delhi, screen_pvr_delhi_gold,    (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 480, true),

  -- ══════════════════════════════════════════
  -- SAO — all cities, all 5 days (new movie, no existing showtimes)
  -- ══════════════════════════════════════════

  -- Surat — all 3 theaters, days 0-4
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '0 days' + interval '13 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '0 days' + interval '20 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '0 days' + interval '11 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '0 days' + interval '14 hours 30 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '0 days' + interval '16 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '0 days' + interval '20 hours 00 minutes')::timestamptz, 185, true),

  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '1 day' + interval '10 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '1 day' + interval '14 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '1 day' + interval '18 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '1 day' + interval '11 hours 30 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '1 day' + interval '15 hours 30 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '1 day' + interval '17 hours 30 minutes')::timestamptz, 185, true),

  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '2 days' + interval '10 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '2 days' + interval '14 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '2 days' + interval '18 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '2 days' + interval '12 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_2d,            (now()::date + interval '2 days' + interval '16 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '2 days' + interval '11 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_2d,       (now()::date + interval '2 days' + interval '17 hours 00 minutes')::timestamptz, 185, true),

  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '3 days' + interval '14 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_imax,          (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 360, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_imax,          (now()::date + interval '3 days' + interval '16 hours 00 minutes')::timestamptz, 360, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_4dx,      (now()::date + interval '3 days' + interval '13 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_4dx,      (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 490, true),

  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_pvr_surat,       screen_pvr_regular,        (now()::date + interval '4 days' + interval '19 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_imax,          (now()::date + interval '4 days' + interval '12 hours 00 minutes')::timestamptz, 360, true),
  (gen_random_uuid(), movie_sao, theater_inox_surat,      screen_inox_imax,          (now()::date + interval '4 days' + interval '17 hours 00 minutes')::timestamptz, 360, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_4dx,      (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_sao, theater_cinepolis_surat, screen_cinepolis_4dx,      (now()::date + interval '4 days' + interval '19 hours 30 minutes')::timestamptz, 490, true),

  -- SAO Mumbai
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '0 days' + interval '11 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '0 days' + interval '15 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '0 days' + interval '19 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '18 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '2 days' + interval '15 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '19 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '3 days' + interval '12 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '3 days' + interval '17 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '10 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '14 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_pvr_mumbai, screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '18 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_sao, theater_inox_mumbai, screen_inox_mumbai_2d,    (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 210, true),

  -- ══════════════════════════════════════════
  -- RESIDENT EVIL — all cities all 5 days
  -- ══════════════════════════════════════════

  -- Surat
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '0 days' + interval '10 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '0 days' + interval '17 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '0 days' + interval '21 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_2d,       (now()::date + interval '0 days' + interval '11 hours 30 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_2d,       (now()::date + interval '0 days' + interval '15 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_2d,       (now()::date + interval '0 days' + interval '18 hours 30 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_2d,  (now()::date + interval '0 days' + interval '12 hours 30 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_2d,  (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 510, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '0 days' + interval '19 hours 00 minutes')::timestamptz, 510, true),

  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '10 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '13 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '1 day' + interval '20 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_2d,       (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_2d,       (now()::date + interval '1 day' + interval '15 hours 30 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_2d,  (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 510, true),

  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '10 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '14 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '2 days' + interval '18 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_imax,     (now()::date + interval '2 days' + interval '12 hours 00 minutes')::timestamptz, 370, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_imax,     (now()::date + interval '2 days' + interval '17 hours 00 minutes')::timestamptz, 370, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_2d,  (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '2 days' + interval '15 hours 00 minutes')::timestamptz, 510, true),

  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '14 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_imax,     (now()::date + interval '3 days' + interval '11 hours 30 minutes')::timestamptz, 370, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_imax,     (now()::date + interval '3 days' + interval '16 hours 30 minutes')::timestamptz, 370, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '13 hours 30 minutes')::timestamptz, 510, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '3 days' + interval '19 hours 00 minutes')::timestamptz, 510, true),

  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '15 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_pvr_surat,       screen_pvr_regular,   (now()::date + interval '4 days' + interval '19 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_imax,     (now()::date + interval '4 days' + interval '12 hours 30 minutes')::timestamptz, 370, true),
  (gen_random_uuid(), movie_resident, theater_inox_surat,      screen_inox_imax,     (now()::date + interval '4 days' + interval '17 hours 30 minutes')::timestamptz, 370, true),
  (gen_random_uuid(), movie_resident, theater_cinepolis_surat, screen_cinepolis_4dx, (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 510, true),

  -- Resident Evil Mumbai
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '1 day' + interval '18 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '1 day' + interval '11 hours 30 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '1 day' + interval '16 hours 30 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '2 days' + interval '13 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '3 days' + interval '12 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '10 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '14 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_pvr_mumbai,  screen_pvr_mumbai_regular, (now()::date + interval '4 days' + interval '18 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_resident, theater_inox_mumbai, screen_inox_mumbai_4dx,    (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 530, true),

  -- ══════════════════════════════════════════
  -- AVENGERS, MATRIX, TENET, JOHN WICK, GUCCI, GHOST, YOWIS
  -- Delhi, Bangalore, Pune — days 0-4
  -- ══════════════════════════════════════════

  -- AVENGERS Delhi
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_cinepolis_delhi, screen_cinepolis_delhi_4dx, (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_avengers, theater_cinepolis_delhi, screen_cinepolis_delhi_4dx, (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '1 day' + interval '18 hours 30 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_cinepolis_delhi, screen_cinepolis_delhi_4dx, (now()::date + interval '1 day' + interval '11 hours 30 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_avengers, theater_cinepolis_delhi, screen_cinepolis_delhi_4dx, (now()::date + interval '1 day' + interval '16 hours 30 minutes')::timestamptz, 530, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_cinepolis_delhi, screen_cinepolis_delhi_2d,  (now()::date + interval '2 days' + interval '13 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_avengers, theater_cinepolis_delhi, screen_cinepolis_delhi_2d,  (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '3 days' + interval '19 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 240, true),
  (gen_random_uuid(), movie_avengers, theater_pvr_delhi,       screen_pvr_delhi_regular,   (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 240, true),

  -- MATRIX Bangalore
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_imax, (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_imax, (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '0 days' + interval '11 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '0 days' + interval '15 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '0 days' + interval '19 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_imax, (now()::date + interval '1 day' + interval '11 hours 30 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_imax, (now()::date + interval '2 days' + interval '12 hours 00 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '2 days' + interval '16 hours 30 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_imax, (now()::date + interval '3 days' + interval '13 hours 00 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '4 days' + interval '10 hours 30 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_2d,   (now()::date + interval '4 days' + interval '14 hours 30 minutes')::timestamptz, 195, true),
  (gen_random_uuid(), movie_matrix, theater_inox_bangalore,  screen_inox_blr_imax, (now()::date + interval '4 days' + interval '12 hours 30 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 160, true),
  (gen_random_uuid(), movie_matrix, theater_miraj_bangalore, screen_miraj_blr_2d,  (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 160, true),

  -- TENET Pune
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '13 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '17 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '20 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_gold,    (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 440, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_gold,    (now()::date + interval '0 days' + interval '16 hours 30 minutes')::timestamptz, 440, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '0 days' + interval '11 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '0 days' + interval '15 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '0 days' + interval '19 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '1 day' + interval '18 hours 30 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '1 day' + interval '16 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '2 days' + interval '18 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '2 days' + interval '15 hours 30 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '3 days' + interval '13 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '3 days' + interval '18 hours 00 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '4 days' + interval '18 hours 00 minutes')::timestamptz, 210, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '4 days' + interval '12 hours 30 minutes')::timestamptz, 170, true),
  (gen_random_uuid(), movie_tenet, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '4 days' + interval '17 hours 30 minutes')::timestamptz, 170, true),

  -- JOHN WICK Delhi + Bangalore
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '0 days' + interval '11 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '0 days' + interval '16 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '0 days' + interval '20 hours 30 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '1 day' + interval '12 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '1 day' + interval '17 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '2 days' + interval '16 hours 30 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_imax,     (now()::date + interval '2 days' + interval '15 hours 00 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '3 days' + interval '12 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '3 days' + interval '17 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '3 days' + interval '10 hours 00 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_imax,     (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 390, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '4 days' + interval '11 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_pvr_delhi,      screen_pvr_delhi_gold,    (now()::date + interval '4 days' + interval '16 hours 00 minutes')::timestamptz, 490, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_2d,       (now()::date + interval '4 days' + interval '11 hours 30 minutes')::timestamptz, 185, true),
  (gen_random_uuid(), movie_johnwick, theater_inox_bangalore, screen_inox_blr_imax,     (now()::date + interval '4 days' + interval '16 hours 30 minutes')::timestamptz, 390, true),

  -- GUCCI + GHOST + YOWIS — Pune theater for variety
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 165, true),
  (gen_random_uuid(), movie_gucci, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '0 days' + interval '16 hours 30 minutes')::timestamptz, 165, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 165, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '2 days' + interval '13 hours 00 minutes')::timestamptz, 165, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 165, true),
  (gen_random_uuid(), movie_gucci, theater_pvr_pune,      screen_pvr_pune_regular, (now()::date + interval '4 days' + interval '10 hours 30 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_gucci, theater_carnival_pune, screen_carnival_pune_2d, (now()::date + interval '4 days' + interval '14 hours 30 minutes')::timestamptz, 165, true),

  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_cinepolis_delhi, screen_cinepolis_delhi_2d, (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_ghost, theater_cinepolis_delhi, screen_cinepolis_delhi_2d, (now()::date + interval '0 days' + interval '16 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_cinepolis_delhi, screen_cinepolis_delhi_2d, (now()::date + interval '1 day' + interval '11 hours 00 minutes')::timestamptz, 200, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '4 days' + interval '10 hours 00 minutes')::timestamptz, 230, true),
  (gen_random_uuid(), movie_ghost, theater_pvr_delhi,      screen_pvr_delhi_regular,   (now()::date + interval '4 days' + interval '14 hours 00 minutes')::timestamptz, 230, true),

  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '0 days' + interval '10 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '0 days' + interval '14 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '0 days' + interval '18 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_miraj_bangalore, screen_miraj_blr_2d, (now()::date + interval '0 days' + interval '12 hours 00 minutes')::timestamptz, 150, true),
  (gen_random_uuid(), movie_yowis, theater_miraj_bangalore, screen_miraj_blr_2d, (now()::date + interval '0 days' + interval '16 hours 00 minutes')::timestamptz, 150, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '1 day' + interval '10 hours 30 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '1 day' + interval '14 hours 30 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_miraj_bangalore, screen_miraj_blr_2d, (now()::date + interval '1 day' + interval '13 hours 00 minutes')::timestamptz, 150, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '2 days' + interval '10 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '2 days' + interval '14 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_miraj_bangalore, screen_miraj_blr_2d, (now()::date + interval '2 days' + interval '11 hours 30 minutes')::timestamptz, 150, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '3 days' + interval '11 hours 00 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_miraj_bangalore, screen_miraj_blr_2d, (now()::date + interval '3 days' + interval '15 hours 00 minutes')::timestamptz, 150, true),
  (gen_random_uuid(), movie_yowis, theater_inox_bangalore,  screen_inox_blr_2d,  (now()::date + interval '4 days' + interval '10 hours 30 minutes')::timestamptz, 175, true),
  (gen_random_uuid(), movie_yowis, theater_miraj_bangalore, screen_miraj_blr_2d, (now()::date + interval '4 days' + interval '14 hours 30 minutes')::timestamptz, 150, true);

end $$;

