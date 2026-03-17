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
  (gen_random_uuid(), 'Pushpa 2: The Rule',     'Sukumar',              '02:40:00', 'UA',   'action',   'streaming', 8.5, 'https://example.com/pushpa2.jpg'),
  (gen_random_uuid(), 'Animal',                 'Sandeep Reddy Vanga',  '03:21:00', 'A',    'action',   'streaming', 7.8, 'https://example.com/animal.jpg'),
  (gen_random_uuid(), 'Stree 2',                'Amar Kaushik',         '02:15:00', 'UA',   'horror',   'streaming', 8.9, 'https://example.com/stree2.jpg'),
  (gen_random_uuid(), 'Kalki 2898 AD',          'Nag Ashwin',           '02:58:00', 'UA',   'action',   'streaming', 7.5, 'https://example.com/kalki.jpg'),
  (gen_random_uuid(), 'Singham Returns',        'Rohit Shetty',         '02:30:00', 'UA',   'action',   'upcoming',  0.0, 'https://example.com/singham.jpg'),
  (gen_random_uuid(), 'War 2',                  'Ayan Mukerji',         '02:45:00', 'UA',   'action',   'upcoming',  0.0, 'https://example.com/war2.jpg'),
  (gen_random_uuid(), 'Deva',                   'Rosshan Andrrews',     '02:20:00', 'UA',   'action',   'streaming', 7.2, 'https://example.com/deva.jpg'),
  (gen_random_uuid(), 'Sky Force',              'Abhishek Anil Kapur',  '02:10:00', 'UA',   'war',      'streaming', 8.1, 'https://example.com/skyforce.jpg'),
  (gen_random_uuid(), 'Merry Christmas',        'Sriram Raghavan',      '02:15:00', 'UA',   'thriller', 'streaming', 7.9, 'https://example.com/merrychristmas.jpg'),
  (gen_random_uuid(), 'Fighter',                'Siddharth Anand',      '02:46:00', 'UA',   'war',      'streaming', 7.0, 'https://example.com/fighter.jpg');


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
  'tells the dramatic story behind one of the world''s most famous fashion empires...',
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
  'The new trailer for Spider-Man: No Way Home has finally arrived...',
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
  'marks the emotional conclusion of the popular Indonesian comedy-drama film series...',
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
  'Ghostbusters brings the beloved supernatural franchise back with a fresh story...',
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
  'Renowned martial arts star Donnie Yen returns to the big screen...',
  46
)
on conflict (id) do nothing;