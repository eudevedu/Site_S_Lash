export const siteConfig = {
  name: 'Sabrina Araújo', shortName: 'SA',
  slogan: 'Lash Design • Beleza em cada detalhe',
  description: 'Um olhar que expressa quem você é. Descubra o universo do lash design e encontre a técnica que combina com a sua beleza.',
  colors: { primary: '#181818', secondary: '#ded4c5', accent: '#8c8173', footer: '#101010' },
  socials: { instagram: '', whatsapp: '', facebook: '', twitter: '', bio: 'https://bio.link/sabrinaaraujooficial' },
  contact: { email: '', phone: '', address: '' },
}
export const defaultSettings = {
  general: { name: siteConfig.name, shortName: siteConfig.shortName, slogan: siteConfig.slogan, description: siteConfig.description, headerSubtitle: 'Lash Designer' },
  colors: siteConfig.colors, socials: siteConfig.socials, contact: siteConfig.contact,
  hero: { title: 'Seu olhar,', titleAccent: 'sua essência.', ctaPrimary: 'Agende seu momento', ctaSecondary: 'Conheça as técnicas', hero_image_url: '', photoSub: 'A beleza de ser você' },
  nav: { sticky: true, showContactButton: true, contactButtonText: 'Agendar horário', contactButtonLink: '/agendar' },
  projects: { subtitle: 'Arte em cada fio', title: 'Olhares que inspiram.', titleAccent: 'inspiram.', listTitle: 'Portfólio de olhares', listDescription: 'Conheça os trabalhos e detalhes das técnicas de lash design.' },
  blog: { subtitle: 'Beauty journal', title: 'Seu momento de leitura.', listTitle: 'Cuidados & inspiração', listDescription: 'Dicas, novidades e cuidados para valorizar o seu olhar.' },
  about: { eyebrow: 'Por trás de cada olhar', storyTitle: 'Um olhar único. Uma beleza que é sua.', mission: 'Valorizar a expressão de cada olhar, respeitando a individualidade e o estilo de cada pessoa.', values: 'Escuta, atenção aos detalhes e escolhas conscientes para uma beleza com identidade.', purpose: 'Fazer do cuidado com o olhar um momento de conexão com a sua própria beleza.', ctaTitle: 'Vamos descobrir o seu próximo olhar?', ctaDescription: 'Conte o que você procura, conheça as possibilidades e converse sobre o atendimento que combina com você.', ctaButton: 'Agende seu momento', title: 'Sabrina Araújo', subtitle: 'A beleza está nos detalhes. E o seu olhar merece uma atenção especial.', badgeTitle: 'Lash Design', badgeDescription: 'Um olhar único, como você.', content: '<p>Este é um espaço dedicado à beleza do olhar. Conheça as possibilidades do lash design e converse sobre a técnica que mais combina com o seu estilo.</p>' },
  footer: { links: [{ label: 'Sobre', url: '/sobre' }, { label: 'Serviços', url: '/servicos' }, { label: 'Portfólio', url: '/portfolio' }, { label: 'Journal', url: '/blog' }], showTransparencyLink: false },
  leadForm: {}, stats: [],
  portfolioInstagram: { enabled: false, title: 'Olhares no Instagram', posts: [] },
  servicesPage: { eyebrow: 'Serviços & cuidado', title: 'Um cuidado pensado para o seu olhar.', description: 'Conheça as opções do estúdio e escolha como você quer valorizar a sua beleza.', sectionTitle: 'Encontre o seu próximo cuidado.', note: 'Consulte a disponibilidade dos atendimentos e confirme os detalhes diretamente com o estúdio.' },
  services: [
    { name: 'Clássico fio a fio', tag: 'LEVE & NATURAL', description: 'Definição delicada para quem ama um olhar realçado com naturalidade.' },
    { name: 'Volume brasileiro', tag: 'MARCA PRESENÇA', description: 'Textura e volume para um olhar expressivo, com um acabamento cheio de personalidade.' },
    { name: 'Lash lifting', tag: 'SUA BELEZA EM EVIDÊNCIA', description: 'Uma proposta que valoriza a curvatura e a beleza dos seus cílios naturais.' },
  ],
}
export function mergeSettings(data = {}) {
  const result = { ...defaultSettings, ...data }
  for (const key of Object.keys(defaultSettings)) {
    if (!Array.isArray(defaultSettings[key])) result[key] = { ...defaultSettings[key], ...data[key] }
  }
  for (const key of Object.keys(defaultSettings.general)) {
    if (!result.general[key]?.trim()) result.general[key] = defaultSettings.general[key]
  }
  return result
}
export const bookingUrl = (settings) => settings?.socials?.whatsapp || settings?.socials?.bio || siteConfig.socials.bio
