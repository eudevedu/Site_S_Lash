export function build(presentation) {
 const root='C:/Users/Eduar/OneDrive/Documentos/GitHub/siteAssur/';
 const ink='#191817',paper='#F5F2EC',gold='#C9B494',muted='#837867';
 function text(s,name,value,x,y,w,h,size=26,color=ink,font='Arial') {
  const sh=s.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  sh.text=value;sh.text.style={fontSize:size,typeface:font,color,verticalAlignment:'top',insets:0};return sh;
 }
 function base(dark=false){const s=presentation.slides.add({width:1280,height:720});s.background.fill=dark?ink:paper;return s;}
 function image(s,name,path,x,y,w,h,crop){s.images.add({path:root+path,alt:name,fit:'contain',position:{left:x,top:y,width:w,height:h},...(crop?{crop}:{})});}
 const s1=base(true);
 s1.images.add({path:root+'public/images/beauty-editorial.jpg',alt:'Imagem editorial ilustrativa de beleza, não representa Sabrina Araújo',fit:'cover',position:{left:790,top:0,width:490,height:720}});
 text(s1,'cover-label','PROPOSTA COMERCIAL',72,78,600,35,18,gold);
 text(s1,'cover-title','Um portal para\nSabrina Araújo',72,228,660,190,64,paper,'Georgia');
 text(s1,'cover-description','Uma apresentação para o seu trabalho.\nUm caminho claro para o primeiro contato.',76,462,610,88,26,'#CCC1AE');
 text(s1,'cover-subject','PORTAL PARA LASH DESIGN',76,630,600,35,18,gold);
 text(s1,'image-disclosure','Imagem editorial ilustrativa',824,665,380,30,16,'#FFFFFF');
 s1.speakerNotes.text='Apresente a proposta como um portal personalizado para o estúdio. A imagem de capa é editorial ilustrativa e não uma foto da profissional ou de um atendimento. Fonte da imagem: https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec .';
 const s2=base();
 text(s2,'title','Um endereço para\na sua marca',72,76,1090,130,50,ink,'Georgia');
 text(s2,'body','A cliente encontra seus serviços, conhece seu trabalho e chega ao atendimento com mais contexto.',72,257,350,145,27,muted);
 text(s2,'support','O portal reúne as informações que ajudam a escolher o próximo cuidado.',72,455,350,130,25,muted);
 image(s2,'Prévia da página inicial','scratch/lash-portal-preview.png',470,217,740,416);
 text(s2,'caption','Prévia do portal. Fotos e textos sujeitos à sua aprovação.',472,646,690,28,16,muted);
 s2.speakerNotes.text='Mostre a identidade visual em preto e tons neutros, a apresentação da marca e o acesso aos serviços. As telas ilustram o projeto em desenvolvimento. Conteúdo e fotos finais precisam da aprovação da cliente. Fonte: captura local scratch/lash-portal-preview.png.';
 const s3=base();
 text(s3,'title','Serviços apresentados com clareza',72,65,1120,80,50,ink,'Georgia');
 text(s3,'body','Cada atendimento pode ter descrição, foto, valor e duração. Você escolhe o que publicar.',72,159,1080,70,27,muted);
 image(s3,'Catálogo de serviços do portal','scratch/lash-services-preview.png',72,240,1136,410,{left:0,top:.41,right:0,bottom:0});
 text(s3,'caption','Os serviços e as condições comerciais serão revisados com você.',72,660,1030,26,17,muted);
 s3.speakerNotes.text='Explique que o catálogo aproveita o cadastro do CMS. Os campos de valor, duração e foto são opcionais. Novos serviços podem ficar em rascunho, e a ordem dos destaques pode mudar. Não trate as técnicas do exemplo como uma lista já confirmada pela profissional. Fontes: src/admin/pages/ServicesSettings.jsx, src/site/components/ServiceCards.jsx e captura local scratch/lash-services-preview.png.';
 const s4=base(true);
 text(s4,'title','Seu trabalho no portfólio',72,72,1130,85,50,paper,'Georgia');
 text(s4,'body','Fotos dos resultados e publicações selecionadas do Instagram ajudam a apresentar o estilo do estúdio.',72,231,380,170,28,'#C9BEAB');
 text(s4,'detail','Você escolhe os posts e reels por link e define a ordem de exibição.',72,449,380,120,25,gold);
 image(s4,'Prévia da seleção de publicações do Instagram','scratch/instagram-portfolio-preview.png',505,180,700,492);
 s4.speakerNotes.text='A incorporação usa uma seleção manual de links, não a importação automática do perfil. As publicações precisam permitir incorporação e continuar disponíveis no Instagram. O link externo permanece acessível quando a incorporação não carrega. A imagem é uma prévia do cadastro, com dados de exemplo. Fontes: src/site/components/InstagramPortfolio.jsx, src/admin/pages/projects/InstagramPortfolioSettings.jsx e https://github.com/facebook/meta-embeds-for-wordpress .';
 const s5=base();
 text(s5,'title','O caminho até o atendimento',72,76,1135,85,50,ink,'Georgia');
 text(s5,'intro','O portal organiza as informações antes da conversa com você.',72,185,1080,55,28,muted);
 const steps=[['01','Conhecer','A cliente descobre a marca e os serviços disponíveis.'],['02','Escolher','Ela consulta uma opção e vê o serviço identificado no pedido de contato.'],['03','Conversar','O atendimento confirma valores, disponibilidade e horário.']];
 steps.forEach((a,i)=>{const x=72+i*398;text(s5,'step-number-'+i,a[0],x,292,300,65,50,'#AB9470','Georgia');text(s5,'step-title-'+i,a[1],x,378,340,55,35,ink,'Georgia');text(s5,'step-body-'+i,a[2],x,453,315,145,25,muted);});
 text(s5,'foot','Quando você configura o WhatsApp, a mensagem de interesse pode incluir o serviço escolhido.',72,642,1090,40,20,muted);
 s5.speakerNotes.text='Demonstre que o serviço escolhido aparece em /agendar. Um link compatível de WhatsApp recebe o nome do serviço na mensagem preparada, e a cliente decide enviá-la. O canal de atendimento confirma o horário. Não prometa confirmação automática ou resultados de venda. Fontes: src/site/pages/Booking.jsx e src/lib/services.js.';
 const s6=base();
 text(s6,'title','Um painel para cuidar do conteúdo',72,65,1130,80,50,ink,'Georgia');
 text(s6,'body','Você pode atualizar serviços e fotos, publicar trabalhos e organizar os textos do portal.',72,227,345,160,28,muted);
 text(s6,'support','A administração reúne os contatos enviados pelos formulários e os acessos da equipe.',72,442,345,145,25,muted);
 image(s6,'Prévia visual do painel administrativo','scratch/lash-admin-preview.png',450,175,760,500);
 s6.speakerNotes.text='Apresente as áreas de serviços, portfólio, páginas, mídia, artigos e contatos. As permissões de equipe controlam as ações disponíveis. A captura é uma prévia visual sem dados reais de clientes. A publicação final inclui configuração e conferência dos acessos. Fonte: captura local scratch/lash-admin-preview.png e código do painel em src/admin.';
 const s7=base(true);
 text(s7,'title','O escopo proposto',72,76,1100,90,52,paper,'Georgia');
 text(s7,'column-title-a','Portal para suas clientes',72,233,520,60,34,gold,'Georgia');
 text(s7,'scope-a','Apresentação da marca e da profissional\n\nCatálogo de serviços e portfólio\n\nAcesso ao canal de atendimento\n\nPáginas adaptadas ao celular',72,328,500,270,25,'#D8CCBA');
 text(s7,'column-title-b','Gestão do conteúdo',710,233,500,60,34,gold,'Georgia');
 text(s7,'scope-b','Painel para editar textos e imagens\n\nSeleção de posts do Instagram\n\nArtigos, formulários e contatos\n\nConfiguração básica de títulos e descrições para busca',710,328,485,300,25,'#D8CCBA');
 s7.speakerNotes.text='Este slide resume o escopo a negociar. A configuração de títulos e descrições ajuda a organizar a apresentação em mecanismos de busca, sem garantir posição em resultados. A plataforma tem CMS próprio, com React e Supabase, e não é uma instalação WordPress. Explique a tecnologia somente se a cliente perguntar. Fonte: funcionalidades do projeto local.';
 const s8=base();
 text(s8,'title','A implantação do seu portal',72,76,1130,90,50,ink,'Georgia');
 const plan=[['01','Conteúdo','Você aprova os serviços, as fotos e os canais de contato.'],['02','Personalização','O portal recebe os textos e a identidade definidos para a marca.'],['03','Revisão','Conferimos as páginas e o caminho de contato com você.'],['04','Publicação','Alinhamos domínio, hospedagem e acessos conforme a contratação.']];
 plan.forEach((a,i)=>{const x=i%2?710:72,y=i<2?243:452;text(s8,'plan-number-'+i,a[0],x,y,65,55,37,'#AD9570','Georgia');text(s8,'plan-title-'+i,a[1],x+90,y,425,55,32,ink,'Georgia');text(s8,'plan-body-'+i,a[2],x+90,y+65,405,105,24,muted);});
 s8.speakerNotes.text='Use este fluxo como proposta de implantação. Prazo, revisão e responsabilidades dependem do escopo aprovado e do envio dos materiais. Combine a configuração do ambiente, domínio, hospedagem e suporte antes da publicação. Não apresente uma data que ainda não foi acordada.';
 const s9=base(true);
 text(s9,'label','PROPOSTA PARA SABRINA ARAÚJO',72,74,1100,40,18,gold);
 text(s9,'title','Investimento e condições',72,195,1120,100,58,paper,'Georgia');
 text(s9,'price','A combinar',72,331,1100,100,72,gold,'Georgia');
 text(s9,'body','Implantação, mensalidade, prazo e suporte serão definidos após a validação do escopo.',77,468,1010,90,29,'#D2C5B1');
 text(s9,'next','Próximo passo: alinhar o conteúdo e apresentar a proposta final.',77,608,1070,50,25,paper);
 s9.speakerNotes.text='O responsável pela proposta informou que o investimento e as condições ficam a combinar. Não há valores ou garantias de retorno aprovados. Alinhe se domínio, hospedagem, manutenção e suporte entram na implantação ou em uma contratação recorrente antes de fechar a proposta.';
}
