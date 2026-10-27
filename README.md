# Sabrina Araújo — Lash Design

Portal React/Vite com o CMS existente preservado: autenticação, páginas, posts, portfólio, biblioteca de mídia, formulários e leads em Supabase. O projeto não contém uma instalação ou API WordPress.

## Executar

1. `npm ci`
2. Copie `.env.example` para `.env` e preencha as credenciais Supabase para usar o CMS.
3. `npm run dev`
4. `npm run build` gera `dist/`.

Sem credenciais, o portal exibe os conteúdos padrão e os estados vazios sem consultar um backend fictício. O painel exige conexão e autenticação reais.

## Conteúdo e identidade

- `/admin/pages/home`: textos de destaque, foto, botões, títulos do portfólio e journal.
- `/admin/pages/about`: apresentação e biografia.
- `/admin/services`: técnicas exibidas no portal.
- `/admin/projects`: trabalhos do portfólio (mantida a tabela e as rotas anteriores).
- `/admin/posts`: artigos do journal.
- `/admin/footer`: nome, contatos e redes sociais. Configure um WhatsApp real para que o agendamento use esse canal; o padrão encaminha ao bio.link fornecido.
- `/admin/design` e `/admin/footer`: cores, navegação e rodapé.

A imagem de destaque é editorial ilustrativa, não uma fotografia de Sabrina ou um trabalho do estúdio. Origem: https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec . Substitua pela imagem oficial no CMS.
As técnicas iniciais são exemplos de apresentação e devem ser revisadas de acordo com os serviços oferecidos. Nenhum preço, endereço, depoimento ou métrica foi inventado.

## Banco existente

A migration `008_lash_portal_defaults.sql` substitui somente campos que correspondem exatamente aos valores políticos de demonstração e adiciona configurações ausentes, mantendo conteúdos e cadastros personalizados. Revise e aplique pelo fluxo habitual do Supabase; ela não foi executada em um banco remoto.

URLs anteriores `/projetos`, `/projetos/:slug`, `/participar`, `/f/:slug` e `/p/:slug` continuam disponíveis. O novo agendamento está em `/agendar`, e `/portfolio` também abre a coleção de trabalhos.
