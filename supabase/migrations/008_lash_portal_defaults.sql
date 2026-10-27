-- Lash Design defaults. Only exact starter fields are replaced; custom fields and content remain.
BEGIN;
UPDATE public.site_settings SET value = jsonb_set(value, '{name}', '"Sabrina Araújo"'::jsonb) WHERE key = 'general' AND value->'name' = '"Nome do Político"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{shortName}', '"SA"'::jsonb) WHERE key = 'general' AND value->'shortName' = '"NP"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{slogan}', '"Lash Design • Beleza em cada detalhe"'::jsonb) WHERE key = 'general' AND value->'slogan' = '"Trabalhando pelo Futuro de Nossa Gente"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{description}', '"Um olhar que expressa quem você é. Descubra o universo do lash design e encontre a técnica que combina com a sua beleza."'::jsonb) WHERE key = 'general' AND value->'description' = '"Compromisso com a verdade, transparência e o desenvolvimento de nossa região. Juntos, estamos construindo um legado de progresso e justiça social."'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{primary}', '"#181818"'::jsonb) WHERE key = 'colors' AND value->'primary' = '"#006738"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{secondary}', '"#ded4c5"'::jsonb) WHERE key = 'colors' AND value->'secondary' = '"#FFD100"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{accent}', '"#8c8173"'::jsonb) WHERE key = 'colors' AND value->'accent' = '"#0038A8"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{facebook}', '""'::jsonb) WHERE key = 'socials' AND value->'facebook' = '"https://facebook.com"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{instagram}', '""'::jsonb) WHERE key = 'socials' AND value->'instagram' = '"https://instagram.com"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{twitter}', '""'::jsonb) WHERE key = 'socials' AND value->'twitter' = '"https://twitter.com"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{whatsapp}', '""'::jsonb) WHERE key = 'socials' AND value->'whatsapp' = '"https://wa.me/5500000000000"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{email}', '""'::jsonb) WHERE key = 'contact' AND value->'email' = '"contato@exemplo.com.br"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{phone}', '""'::jsonb) WHERE key = 'contact' AND value->'phone' = '"(00) 00000-0000"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{address}', '""'::jsonb) WHERE key = 'contact' AND value->'address' = '"Endereço do Gabinete, Cidade - UF"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{title}', '"Seu olhar,"'::jsonb) WHERE key = 'hero' AND value->'title' = '"Pelo Futuro de Todos."'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{titleAccent}', '"sua essência."'::jsonb) WHERE key = 'hero' AND value->'titleAccent' = '"Futuro"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{ctaPrimary}', '"Agende seu momento"'::jsonb) WHERE key = 'hero' AND value->'ctaPrimary' = '"Conheça as Propostas"'::jsonb;
UPDATE public.site_settings SET value = jsonb_set(value, '{ctaSecondary}', '"Conheça as técnicas"'::jsonb) WHERE key = 'hero' AND value->'ctaSecondary' = '"Ver Manifesto"'::jsonb;
UPDATE public.site_settings SET value = '[]'::jsonb WHERE key='stats' AND value='[{"label":"Projetos Aprovados","value":"45+","icon":"ShieldCheck"},{"label":"Cidades Atendidas","value":"12","icon":"MapPin"},{"label":"Vidas Impactadas","value":"150k","icon":"Heart"}]'::jsonb;
INSERT INTO public.site_settings (key,value) VALUES
('general', '{"name":"Sabrina Araújo","shortName":"SA","slogan":"Lash Design • Beleza em cada detalhe","description":"Um olhar que expressa quem você é. Descubra o universo do lash design e encontre a técnica que combina com a sua beleza.","headerSubtitle":"Lash Designer"}'::jsonb),
('colors', '{"primary":"#181818","secondary":"#ded4c5","accent":"#8c8173","footer":"#101010"}'::jsonb),
('socials', '{"instagram":"","whatsapp":"","facebook":"","twitter":"","bio":"https://bio.link/sabrinaaraujooficial"}'::jsonb),
('contact', '{"email":"","phone":"","address":""}'::jsonb),
('hero', '{"title":"Seu olhar,","titleAccent":"sua essência.","ctaPrimary":"Agende seu momento","ctaSecondary":"Conheça as técnicas","hero_image_url":"","photoSub":"A beleza de ser você"}'::jsonb),
('nav', '{"sticky":true,"showContactButton":true,"contactButtonText":"Agendar horário","contactButtonLink":"/agendar"}'::jsonb),
('projects', '{"subtitle":"Arte em cada fio","title":"Olhares que inspiram.","titleAccent":"inspiram.","listTitle":"Portfólio de olhares","listDescription":"Conheça os trabalhos e detalhes das técnicas de lash design."}'::jsonb),
('blog', '{"subtitle":"Beauty journal","title":"Seu momento de leitura.","listTitle":"Cuidados & inspiração","listDescription":"Dicas, novidades e cuidados para valorizar o seu olhar."}'::jsonb),
('about', '{"title":"Sabrina Araújo","subtitle":"A beleza está nos detalhes. E o seu olhar merece uma atenção especial.","badgeTitle":"Lash Design","badgeDescription":"Um olhar único, como você.","content":"<p>Este é um espaço dedicado à beleza do olhar. Conheça as possibilidades do lash design e converse sobre a técnica que mais combina com o seu estilo.</p>"}'::jsonb),
('footer', '{"links":[{"label":"Sobre","url":"/sobre"},{"label":"Portfólio","url":"/portfolio"},{"label":"Journal","url":"/blog"}],"showTransparencyLink":false}'::jsonb),
('leadForm', '{}'::jsonb),
('stats', '[]'::jsonb),
('services', '[{"name":"Clássico fio a fio","tag":"LEVE & NATURAL","description":"Definição delicada para quem ama um olhar realçado com naturalidade."},{"name":"Volume brasileiro","tag":"MARCA PRESENÇA","description":"Textura e volume para um olhar expressivo, com um acabamento cheio de personalidade."},{"name":"Lash lifting","tag":"SUA BELEZA EM EVIDÊNCIA","description":"Uma proposta que valoriza a curvatura e a beleza dos seus cílios naturais."}]'::jsonb)
ON CONFLICT (key) DO NOTHING;
COMMIT;
