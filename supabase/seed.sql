truncate table
  role_technologies,
  education_technologies,
  stack_group_technologies,
  project_technologies,
  roles,
  companies,
  education,
  stack_groups,
  projects,
  technologies,
  profile
restart identity cascade;

insert into profile (
  full_name, short_name, role, lead, status_label, is_open_to_work,
  hero_badges, experience_start_date, email, linkedin_url, github_url,
  contact_title, contact_lead, meta_title, meta_description
) values (
  'Sebastián González Ríos',
  'Sebas',
  '{"es": "Ingeniero de Software · Frontend", "en": "Software Engineer · Frontend"}'::jsonb,
  '{"es": "Construyo experiencias web fiables, claras y preparadas para crecer. Del monolito legacy a los microfrontends, con TypeScript, React e ingeniería asistida por IA.", "en": "I build reliable, clear web experiences ready to scale. From legacy monoliths to microfrontends, with TypeScript, React and AI-assisted engineering."}'::jsonb,
  '{"es": "Abierto a propuestas", "en": "Open to proposals"}'::jsonb,
  true,
  '[
    {"es": "React · TypeScript", "en": "React · TypeScript"},
    {"es": "Microfrontends", "en": "Microfrontends"}
  ]'::jsonb,
  '2022-07-01',
  'contact@sebasgrios.es',
  'https://linkedin.com/in/sebasgrios/',
  'https://github.com/sebasgrios',
  '{"es": "¿Construimos algo juntos?", "en": "Shall we build something?"}'::jsonb,
  '{"es": "Estoy abierto a nuevas propuestas y colaboraciones. Si tienes un proyecto en mente, hablemos.", "en": "I am open to new proposals and collaborations. If you have a project in mind, let us talk."}'::jsonb,
  '{"es": "Sebastián González Ríos — Ingeniero de Software", "en": "Sebastián González Ríos — Software Engineer"}'::jsonb,
  '{"es": "Portfolio de Sebastián González Ríos · Ingeniero de Software · Frontend", "en": "Portfolio of Sebastián González Ríos · Software Engineer · Frontend"}'::jsonb
);

insert into technologies (key, label, sort_order) values
  ('typescript',        'TypeScript',         10),
  ('javascript',        'JavaScript',         20),
  ('react',             'React',              30),
  ('react16',           'React 16',           31),
  ('reactnative',       'React Native',       40),
  ('nextjs',            'Next.js',            50),
  ('astro',             'Astro',              60),
  ('redux',             'Redux',              70),
  ('tailwindcss',       'TailwindCSS',        80),
  ('html',              'HTML',               90),
  ('css',               'CSS',                100),
  ('nodejs',            'Node.js',            110),
  ('rest',              'REST',               120),
  ('pwa',               'PWA',                130),
  ('microfrontends',    'Microfrontends',     140),
  ('githubcopilot',     'GitHub Copilot',     150),
  ('specdriven',        'Spec-Driven Dev',    160),
  ('genai',             'IA generativa',      170),
  ('jenkins',           'Jenkins',            180),
  ('bitbucket',         'Bitbucket',          190),
  ('git',               'Git',                200),
  ('cloudflare',        'Cloudflare',         210),
  ('adobeanalytics',    'Adobe Analytics',    220),
  ('adobetarget',       'Adobe Target',       230),
  ('mysql',             'MySQL',              240),
  ('wordpress',         'WordPress',          250),
  ('java',              'Java',               260),
  ('php',               'PHP',                270),
  ('sql',               'SQL',                280),
  ('oop',               'POO',                290),
  ('databases',         'Bases de datos',     300),
  ('networks',          'Redes',              310),
  ('systems',           'Sistemas',           320),
  ('hardware',          'Hardware',           330);

insert into companies (id, name, logo_url, meta_line, sort_order) values
  (
    '11111111-1111-1111-1111-111111111111',
    'SearchIT',
    null,
    '{"es": "Remoto · Málaga · 7 meses", "en": "Remote · Málaga · 7 months"}'::jsonb,
    100
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'NTT DATA',
    null,
    '{"es": "Remoto · Málaga · 3 años 5 meses", "en": "Remote · Málaga · 3 years 5 months"}'::jsonb,
    90
  );

insert into roles (
  id, company_id, title, sector, mode, mode_key,
  start_date, end_date, description, bullets, sort_order
) values
(
  '33333333-3333-3333-3333-333333333301',
  '11111111-1111-1111-1111-111111111111',
  '{"es": "Ingeniero de Software", "en": "Software Engineer"}'::jsonb,
  '{"es": "Banca privada · FinTech", "en": "Private banking · FinTech"}'::jsonb,
  '{"es": "En remoto", "en": "Remote"}'::jsonb,
  'remote',
  '2025-11-01', null,
  '{"es": "Impulso la evolución tecnológica de una plataforma de banca privada: lidero la transición de sistemas legacy hacia arquitecturas modernas y optimizo los ciclos de entrega con ingeniería asistida por IA.", "en": "I drive the technological evolution of a private banking platform: I lead the transition from legacy systems to modern architectures and optimize delivery cycles with AI-assisted engineering."}'::jsonb,
  '[
    {"es": "Lidero la migración de la app legacy del banco hacia un ecosistema escalable de microfrontends con TypeScript y React 16, con una refactorización integral que eleva los estándares de calidad de código a nivel funcional y visual.", "en": "I lead the migration of the bank legacy app to a scalable microfrontends ecosystem with TypeScript and React 16, with a comprehensive refactor that raises code quality standards at functional and visual levels."},
    {"es": "Integro Spec-Driven Development y herramientas de IA generativa (GitHub Copilot CLI) en el día a día para acelerar el desarrollo y la resolución de errores.", "en": "I integrate Spec-Driven Development and generative AI tools (GitHub Copilot CLI) into daily work to accelerate development and bug fixing."},
    {"es": "Coordino con DevOps la automatización de pipelines en Jenkins y la gestión de ramas en Bitbucket, asegurando despliegues controlados y validación rigurosa en preproducción antes de cada paso a producción.", "en": "I coordinate with DevOps on pipeline automation in Jenkins and branch management in Bitbucket, ensuring controlled deployments and rigorous pre-production validation before each production release."}
  ]'::jsonb,
  100
),
(
  '33333333-3333-3333-3333-333333333302',
  '22222222-2222-2222-2222-222222222222',
  '{"es": "Programador Full Stack", "en": "Full Stack Developer"}'::jsonb,
  '{"es": "Reciclaje · Cleantech", "en": "Recycling · Cleantech"}'::jsonb,
  '{"es": "En remoto", "en": "Remote"}'::jsonb,
  'remote',
  '2025-01-01', '2025-11-01',
  '{"es": "Trayectoria de alto crecimiento dentro de la compañía: ascendí de Junior a Full Stack entregando valor de forma constante en proyectos de PropTech, FinTech y Cleantech.", "en": "High-growth track inside the company: I rose from Junior to Full Stack delivering value consistently across PropTech, FinTech and Cleantech projects."}'::jsonb,
  '[
    {"es": "Lideré el desarrollo y mantenimiento del ecosistema digital de un proyecto de reciclaje: una app móvil nativa en React Native y su backoffice de gestión en React.", "en": "I led the development and maintenance of the digital ecosystem of a recycling project: a native mobile app in React Native and its management backoffice in React."},
    {"es": "Aseguré la sincronización de datos y la consistencia de la experiencia de usuario entre las plataformas móvil y de escritorio.", "en": "I ensured data sync and UX consistency between mobile and desktop platforms."}
  ]'::jsonb,
  90
),
(
  '33333333-3333-3333-3333-333333333303',
  '22222222-2222-2222-2222-222222222222',
  '{"es": "Desarrollador Web", "en": "Web Developer"}'::jsonb,
  '{"es": "Banca · FinTech", "en": "Banking · FinTech"}'::jsonb,
  '{"es": "En remoto", "en": "Remote"}'::jsonb,
  'remote',
  '2023-07-01', '2025-01-01',
  '{"es": "Promoción al equipo de soluciones financieras, asumiendo una aplicación web interna crítica para la operativa del negocio.", "en": "Promoted to the financial solutions team, taking ownership of an internal web app critical to business operations."}'::jsonb,
  '[
    {"es": "Desarrollé y mantuve una app web en React para la carga, gestión y automatización del etiquetado de Adobe Analytics y Adobe Target en las plataformas de la empresa.", "en": "I developed and maintained a React web app for loading, managing and automating Adobe Analytics and Adobe Target tagging across the company platforms."},
    {"es": "Optimicé flujos de trabajo internos, facilitando a los equipos operativos el tratamiento de datos y la analítica digital de forma eficiente.", "en": "I optimized internal workflows, helping operational teams process data and digital analytics efficiently."}
  ]'::jsonb,
  80
),
(
  '33333333-3333-3333-3333-333333333304',
  '22222222-2222-2222-2222-222222222222',
  '{"es": "Desarrollador de Aplicaciones Junior", "en": "Junior Application Developer"}'::jsonb,
  '{"es": "Inmobiliario · PropTech", "en": "Real estate · PropTech"}'::jsonb,
  '{"es": "En remoto", "en": "Remote"}'::jsonb,
  'remote',
  '2022-07-01', '2023-07-01',
  '{"es": "Primeros pasos profesionales en una PWA del sector inmobiliario, construyendo producto real en un entorno exigente y cambiante.", "en": "First professional steps on a real estate PWA, building real product in a demanding, fast-changing environment."}'::jsonb,
  '[
    {"es": "Participé en el desarrollo y mantenimiento de una PWA pensada para funcionar con fiabilidad tanto en local como en remoto.", "en": "I contributed to the development and maintenance of a PWA designed to work reliably both online and offline."},
    {"es": "Integré buenas prácticas de calidad desde una etapa temprana, consolidando criterio técnico y ritmo de entrega.", "en": "I integrated quality practices from an early stage, consolidating technical judgment and delivery rhythm."}
  ]'::jsonb,
  70
);

insert into role_technologies (role_id, technology_id, sort_order)
select '33333333-3333-3333-3333-333333333301', id, n.ord
from (values
  ('typescript', 10), ('react16', 20), ('microfrontends', 30),
  ('githubcopilot', 40), ('jenkins', 50), ('bitbucket', 60)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into role_technologies (role_id, technology_id, sort_order)
select '33333333-3333-3333-3333-333333333302', id, n.ord
from (values
  ('typescript', 10), ('react', 20), ('reactnative', 30),
  ('nodejs', 40), ('rest', 50)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into role_technologies (role_id, technology_id, sort_order)
select '33333333-3333-3333-3333-333333333303', id, n.ord
from (values
  ('typescript', 10), ('react', 20),
  ('adobeanalytics', 30), ('adobetarget', 40)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into role_technologies (role_id, technology_id, sort_order)
select '33333333-3333-3333-3333-333333333304', id, n.ord
from (values
  ('javascript', 10), ('pwa', 20), ('react', 30),
  ('html', 40), ('css', 50)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into education (
  id, title, school, start_date, end_date, description, bullets, sort_order
) values
(
  '44444444-4444-4444-4444-444444444401',
  '{"es": "Desarrollo de Aplicaciones Web (DAW)", "en": "Web Application Development (DAW)"}'::jsonb,
  'IES Campanillas',
  '2021-09-01', '2023-06-30',
  '{"es": "La etapa que convirtió mi interés por la tecnología en una base sólida orientada a crear experiencias digitales útiles y bien construidas.", "en": "The stage that turned my interest in technology into a solid foundation for building useful, well-crafted digital experiences."}'::jsonb,
  '[
    {"es": "Visión completa del desarrollo web: de la lógica de programación a cómo una interfaz comunica.", "en": "Comprehensive view of web development: from programming logic to how an interface communicates."},
    {"es": "Mentalidad práctica para convertir ideas en productos funcionales, con foco en maquetación, diseño y estructura.", "en": "Practical mindset for turning ideas into functional products, with focus on layout, design and structure."}
  ]'::jsonb,
  100
),
(
  '44444444-4444-4444-4444-444444444402',
  '{"es": "Desarrollo de Aplicaciones Multiplataforma (DAM)", "en": "Cross-Platform Application Development (DAM)"}'::jsonb,
  'IES Pablo Picasso',
  '2019-09-01', '2021-06-30',
  '{"es": "Una formación clave para ampliar mi forma de pensar el software y entender cómo adaptarlo a distintos entornos, lenguajes y necesidades.", "en": "Key training that broadened the way I think about software and how to adapt it to different environments, languages and needs."}'::jsonb,
  '[
    {"es": "Fundamentos de programación orientada a objetos, estructuras de datos y diseño de soluciones.", "en": "Foundations of object-oriented programming, data structures and solution design."},
    {"es": "Profundización en bases de datos, escritorio y seguridad, reforzando una base técnica versátil.", "en": "Deep dive into databases, desktop and security, reinforcing a versatile technical base."}
  ]'::jsonb,
  90
),
(
  '44444444-4444-4444-4444-444444444403',
  '{"es": "Sistemas Microinformáticos y Redes (SMR)", "en": "Microcomputing Systems and Networks (SMR)"}'::jsonb,
  'IES Juan de la Cierva',
  '2017-09-01', '2019-06-30',
  '{"es": "El inicio de todo: una formación que me acercó al lado más tangible de la tecnología y despertó mi interés por entender cómo funciona cada pieza.", "en": "Where it all began: training that brought me to the most tangible side of technology and sparked my interest in understanding how every piece works."}'::jsonb,
  '[
    {"es": "Comprensión de la infraestructura que sostiene la experiencia digital: equipos, redes y servicios.", "en": "Understanding of the infrastructure that supports the digital experience: equipment, networks and services."},
    {"es": "Mentalidad resolutiva ligada al diagnóstico, la configuración y la mejora continua.", "en": "Problem-solving mindset linked to diagnosis, configuration and continuous improvement."}
  ]'::jsonb,
  80
);

insert into education_technologies (education_id, technology_id, sort_order)
select '44444444-4444-4444-4444-444444444401', id, n.ord
from (values
  ('javascript', 10), ('html', 20), ('css', 30), ('php', 40), ('sql', 50)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into education_technologies (education_id, technology_id, sort_order)
select '44444444-4444-4444-4444-444444444402', id, n.ord
from (values
  ('java', 10), ('oop', 20), ('databases', 30)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into education_technologies (education_id, technology_id, sort_order)
select '44444444-4444-4444-4444-444444444403', id, n.ord
from (values
  ('networks', 10), ('systems', 20), ('hardware', 30)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into stack_groups (id, label, icon_key, sort_order) values
  ('55555555-5555-5555-5555-555555555501', '{"es": "Frontend", "en": "Frontend"}'::jsonb,                           'code',   100),
  ('55555555-5555-5555-5555-555555555502', '{"es": "Mobile", "en": "Mobile"}'::jsonb,                               'mobile', 90),
  ('55555555-5555-5555-5555-555555555503', '{"es": "DevOps & Tooling", "en": "DevOps & Tooling"}'::jsonb,           'git',    80),
  ('55555555-5555-5555-5555-555555555504', '{"es": "IA & Productividad", "en": "AI & Productivity"}'::jsonb,        'spark',  70),
  ('55555555-5555-5555-5555-555555555505', '{"es": "Analítica & Datos", "en": "Analytics & Data"}'::jsonb,          'chart',  60),
  ('55555555-5555-5555-5555-555555555506', '{"es": "CMS", "en": "CMS"}'::jsonb,                                     'layers', 50);

insert into stack_group_technologies (stack_group_id, technology_id, sort_order)
select '55555555-5555-5555-5555-555555555501', id, n.ord
from (values
  ('typescript', 10), ('javascript', 20), ('react', 30), ('nextjs', 40),
  ('astro', 50), ('redux', 60), ('tailwindcss', 70), ('html', 80), ('css', 90)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into stack_group_technologies (stack_group_id, technology_id, sort_order)
select '55555555-5555-5555-5555-555555555502', id, n.ord
from (values ('reactnative', 10), ('pwa', 20)) as n(key, ord)
join technologies t on t.key = n.key;

insert into stack_group_technologies (stack_group_id, technology_id, sort_order)
select '55555555-5555-5555-5555-555555555503', id, n.ord
from (values
  ('jenkins', 10), ('bitbucket', 20), ('git', 30), ('cloudflare', 40)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into stack_group_technologies (stack_group_id, technology_id, sort_order)
select '55555555-5555-5555-5555-555555555504', id, n.ord
from (values
  ('githubcopilot', 10), ('specdriven', 20), ('genai', 30)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into stack_group_technologies (stack_group_id, technology_id, sort_order)
select '55555555-5555-5555-5555-555555555505', id, n.ord
from (values
  ('adobeanalytics', 10), ('adobetarget', 20), ('mysql', 30)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into stack_group_technologies (stack_group_id, technology_id, sort_order)
select '55555555-5555-5555-5555-555555555506', id, n.ord
from (values ('wordpress', 10)) as n(key, ord)
join technologies t on t.key = n.key;

insert into projects (
  id, name, description, image_url, live_url, code_url, sort_order
) values
(
  '66666666-6666-6666-6666-666666666601',
  'BastianGR',
  '{"es": "Web personal de un particular, construida con foco en rendimiento y simplicidad.", "en": "Personal site of an individual, built with focus on performance and simplicity."}'::jsonb,
  null,
  'https://bastiangr.es',
  'https://github.com/sebasgrios/bastiangr',
  100
),
(
  '66666666-6666-6666-6666-666666666602',
  '1-100',
  '{"es": "Juego para entrenar concentración, reflejos y agudeza visual.", "en": "Game to train concentration, reflexes and visual sharpness."}'::jsonb,
  null,
  'https://1-100.pages.dev',
  'https://github.com/sebasgrios/1-100',
  90
),
(
  '66666666-6666-6666-6666-666666666603',
  'Mi lista',
  '{"es": "App para gestionar tus propias listas de forma fácil y sencilla.", "en": "App to manage your own lists easily and simply."}'::jsonb,
  null,
  'https://mi-lista.es',
  'https://github.com/sebasgrios/mi-lista',
  80
),
(
  '66666666-6666-6666-6666-666666666604',
  'Clara Romero',
  '{"es": "Web corporativa para una peluquería local.", "en": "Corporate site for a local hair salon."}'::jsonb,
  null,
  'http://clararomero.com',
  null,
  70
);

insert into project_technologies (project_id, technology_id, sort_order)
select '66666666-6666-6666-6666-666666666601', id, n.ord
from (values
  ('astro', 10), ('typescript', 20), ('tailwindcss', 30), ('cloudflare', 40)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into project_technologies (project_id, technology_id, sort_order)
select '66666666-6666-6666-6666-666666666602', id, n.ord
from (values
  ('astro', 10), ('tailwindcss', 20), ('cloudflare', 30)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into project_technologies (project_id, technology_id, sort_order)
select '66666666-6666-6666-6666-666666666603', id, n.ord
from (values
  ('nextjs', 10), ('typescript', 20), ('redux', 30), ('tailwindcss', 40)
) as n(key, ord)
join technologies t on t.key = n.key;

insert into project_technologies (project_id, technology_id, sort_order)
select '66666666-6666-6666-6666-666666666604', id, n.ord
from (values ('wordpress', 10), ('mysql', 20)) as n(key, ord)
join technologies t on t.key = n.key;
