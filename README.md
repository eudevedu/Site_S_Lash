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

## Painel do estúdio

A administração usa uma identidade própria em preto e tons neutros, independente das cores publicadas no portal. O menu reúne técnicas, trabalhos, contatos, conteúdo e gestão da equipe.

A visão geral consulta as quantidades reais de trabalhos e artigos publicados e os contatos recebidos. Em caso de falha, ela mostra um aviso e permite tentar novamente; não estima tendências ou confirma agendamentos.

Os nomes das telas mudaram para o universo Lash Design, mantendo as tabelas, os estados dos registros e as URLs administrativas existentes. A tela **Marca & canais** permite revisar a marca, o WhatsApp e os contatos já salvos no banco. Esses dados não são sobrescritos pelo novo visual.

A prévia do editor da página inicial resume os textos e a foto em uma composição próxima à identidade atual. A composição completa é conferida abrindo o portal depois de salvar.

A página Sobre (`/sobre`) inclui apresentação, foto ou monograma, biografia, princípios da marca e convite ao atendimento. Todos os textos estão em `/admin/pages/about`. Campos vazios de missão, valores e propósito ocultam os respectivos blocos. Título, nome da marca e apresentação recebem textos padrão quando necessários para evitar uma página vazia; a biografia aceita texto com parágrafos ou HTML já cadastrado.

## Instagram no portfólio

Em **Portfólio de olhares → Instagram no portfólio**, ative a exibição, adicione URLs de posts (`https://www.instagram.com/p/.../`) ou reels (`https://www.instagram.com/reel/.../`), escolha rascunho/publicado, ajuste a ordem pelas setas e salve. A seleção é manual; não há sincronização automática do perfil. Apenas links publicados e válidos aparecem em `/portfolio` e `/projetos`.

A configuração é armazenada em `site_settings`, na chave `portfolioInstagram`, usando as permissões existentes do CMS. Não é necessária uma migration. Os trabalhos tradicionais continuam na tabela `projects`.

O site usa o script oficial `https://www.instagram.com/embed.js`, carregado somente quando uma publicação entra perto da área visível. Mantenha as publicações públicas com incorporação permitida. Conteúdos removidos, restritos ou bloqueados pelo navegador podem não renderizar; o link externo permanece disponível. Endereços de perfil, Stories, HTML de iframe e links de outros domínios são recusados.

Validação: `node --test src/lib/instagram.test.js`.
Referência técnica: https://github.com/facebook/meta-embeds-for-wordpress (formatos de URL e script oficial de incorporação).

## Correção de remoção de usuários por Super Admin

Execute o conteúdo de `supabase/migrations/009_fix_superadmin_user_deletion.sql` no **SQL Editor do Supabase** usando a conexão administrativa do projeto. Essa migration substitui a RPC `delete_user_completely(uuid)` e verifica `profiles.role = 'superadmin'` para o usuário autenticado. Ela não promove usuários nem exclui contas ao ser aplicada.

A função impede autoexclusão, serializa remoções de Super Admins, preserva mídias e registra a exclusão no log na mesma transação. O painel segue as mesmas regras e não presume mais um papel de administrador quando a consulta de perfil falha. Sem aplicar o SQL no banco remoto, a validação anterior continua ativa.

Validação das regras do painel: `node --test src/lib/permissions.test.js`. A execução da migration e a autorização da RPC precisam ser conferidas no ambiente Supabase; nenhum usuário real foi removido como teste.

## Carregamento e navegação

O listener de autenticação apenas atualiza a sessão de forma síncrona. A consulta de perfil ocorre em um efeito separado e é cancelada ao trocar de conta ou desmontar o componente. Renovação de token com o mesmo usuário não repete a consulta do perfil; falhas têm um limite de espera e opção de tentar novamente, sem presumir privilégios de administrador. Referência: https://supabase.com/kb/troubleshooting/why-is-my-supabase-api-call-not-returning-PGzXw0 .

Listagens de posts, trabalhos e páginas usam campos resumidos. O menu consulta somente IDs, títulos e slugs de páginas publicadas e visíveis na navegação. O conteúdo completo continua sendo carregado ao abrir um item para leitura ou edição. Trabalhos relacionados são carregados independentemente do conteúdo principal.

Consultas simultâneas de configurações e menu são compartilhadas somente enquanto estão pendentes. Não existe cache adicional de permissões ou registros privados. As gravações invalidam as leituras públicas pendentes e o contexto ignora respostas antigas.

Links do menu antecipam o download do código ao receber foco ou ponteiro. O painel mantém a navegação visível durante o carregamento da tela seguinte; o editor de texto é baixado separadamente, e miniaturas administrativas usam carregamento sob demanda.

Testes de regressão: `node --test src/lib/authSession.test.js src/lib/publicReads.test.js src/lib/permissions.test.js src/lib/instagram.test.js`. A redução de espera em produção deve ser medida no ambiente publicado; os testes locais verificam comportamento e proteção de acesso.

## Serviços do estúdio

A página `/servicos` e os destaques da página inicial compartilham o cadastro de **Admin → Técnicas & serviços** (`/admin/services`). É possível definir nome, chamada curta, descrição, detalhes, foto, valor e duração. Os campos adicionais são opcionais. Os itens podem ser reordenados, mantidos em rascunho ou publicados; os três primeiros destaques publicados aparecem na página inicial.

Os serviços antigos sem campo de status continuam visíveis por compatibilidade. Novos itens começam como rascunho. A implementação aproveita o catálogo existente, sem acrescentar atendimentos, valores ou durações não fornecidos pela responsável.

As configurações são salvas em `site_settings`, nas chaves `services` e `servicesPage`, sem migration de banco. O botão de cada serviço identifica a escolha em `/agendar?servico=...`; em links de WhatsApp compatíveis, a mensagem de interesse inclui o nome do serviço. O envio da mensagem e a confirmação do horário permanecem a cargo da cliente e do estúdio.

Teste: `node --test src/lib/services.test.js`.
