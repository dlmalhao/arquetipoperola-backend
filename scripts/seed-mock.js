'use strict';

/**
 * Dados de teste para Projetos, Imóveis, Tipos de projeto e Tipologias.
 *
 * Uso: npm run seed:mock
 * Pode ser executado de novo: substitui os projetos e imóveis de teste anteriores.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const tiposDeProjeto = ['Empreendimento', 'Reabilitação', 'Moradia'];
const tipologias = ['T1', 'T2', 'T3', 'T4'];

const projetos = [
  {
    nome: 'Jardins da Pérola',
    tipo: 'Empreendimento',
    localizacao: 'Braga',
    morada: 'Rua das Camélias 25, Braga',
    coordenadas: '41.5503, -8.4200',
    estado: 'construcao',
    ano_conclusao: 2027,
    plantas: ['Planta de implantação', 'Planta do piso tipo'],
    cor: '#2f6f62',
    descricao: 'Empreendimento residencial com apartamentos de linhas contemporâneas, varandas amplas e zonas verdes partilhadas, a poucos minutos do centro da cidade.',
    imoveis: [
      { nome: 'Apartamento 1A', tipologia: 'T1', preco: 185000, area_bruta: 62, area_util: 54, n_quartos: 1, n_casas_banho: 1, certificacao: 'A', disponibilidade: 'disponivel' },
      { nome: 'Apartamento 1B', tipologia: 'T1', preco: 190000, area_bruta: 64, area_util: 56, n_quartos: 1, n_casas_banho: 1, certificacao: 'A', disponibilidade: 'reservado' },
      { nome: 'Apartamento 2A', tipologia: 'T2', preco: 245000, area_bruta: 92, area_util: 81, n_quartos: 2, n_casas_banho: 2, certificacao: 'A', disponibilidade: 'disponivel' },
      { nome: 'Apartamento 2B', tipologia: 'T2', plantas: [], preco: null, area_bruta: 95, area_util: 84, n_quartos: 2, n_casas_banho: 2, certificacao: 'A+', disponibilidade: 'disponivel' },
      { nome: 'Apartamento 3A', tipologia: 'T3', preco: 325000, area_bruta: 128, area_util: 112, n_quartos: 3, n_casas_banho: 2, certificacao: 'A+', disponibilidade: 'vendido' },
      { nome: 'Apartamento 3B', tipologia: 'T3', preco: null, area_bruta: 131, area_util: 115, n_quartos: 3, n_casas_banho: 3, certificacao: 'A+', disponibilidade: 'disponivel' },
    ],
  },
  {
    nome: 'Edifício Mar e Sol',
    tipo: 'Reabilitação',
    localizacao: 'Porto',
    morada: 'Avenida da Boavista 1200, Porto',
    coordenadas: '41.1579, -8.6291',
    estado: 'concluido',
    ano_conclusao: 2024,
    plantas: ['Planta de implantação'],
    cor: '#9a6b3d',
    descricao: 'Reabilitação integral de um edifício histórico, preservando a fachada original e oferecendo interiores totalmente renovados.',
    imoveis: [
      { nome: 'Fração A', tipologia: 'T2', preco: 280000, area_bruta: 98, area_util: 87, n_quartos: 2, n_casas_banho: 2, certificacao: 'B', disponibilidade: 'disponivel' },
      { nome: 'Fração B', tipologia: 'T3', preco: 360000, area_bruta: 135, area_util: 120, n_quartos: 3, n_casas_banho: 2, certificacao: 'B', disponibilidade: 'disponivel' },
      { nome: 'Fração C', tipologia: 'T4', preco: null, area_bruta: 180, area_util: 162, n_quartos: 4, n_casas_banho: 3, certificacao: 'B+', disponibilidade: 'reservado' },
    ],
  },
  {
    nome: 'Casa da Encosta',
    tipo: 'Moradia',
    localizacao: 'Guimarães',
    morada: 'Estrada da Encosta 8, Guimarães',
    coordenadas: '41.4425, -8.2918',
    estado: 'concluido',
    ano_conclusao: 2025,
    cor: '#4a5a8a',
    descricao: 'Moradia unifamiliar isolada com jardim e piscina, implantada num terreno com vista desafogada sobre o vale.',
    imoveis: [
      { nome: 'Moradia Encosta', tipologia: 'T4', preco: 640000, area_bruta: 310, area_util: 255, n_quartos: 4, n_casas_banho: 4, certificacao: 'A', disponibilidade: 'disponivel' },
    ],
  },
  {
    nome: 'Quinta do Vale',
    tipo: 'Empreendimento',
    localizacao: 'Viana do Castelo',
    morada: null,
    coordenadas: null,
    estado: 'planeamento',
    ano_conclusao: 2029,
    plantas: ['Planta de implantação'],
    cor: '#6b4a7a',
    descricao: 'Futuro empreendimento em fase de planeamento. Em breve serão divulgados os imóveis disponíveis.',
    imoveis: [],
  },
];

// O Strapi só gera o slug automaticamente no painel, não na API de documentos.
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function writePlan(label, index) {
  const rooms = [
    [60, 60, 420, 300], [480, 60, 300, 180], [480, 240, 300, 120],
    [60, 360, 260, 280], [320, 360, 220, 280], [540, 360, 240, 280],
  ];
  const shapes = rooms.map(([x, y, w, h], room) => (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#111" stroke-width="6"/>`
    + `<text x="${x + w / 2}" y="${y + h / 2}" font-family="Arial, sans-serif" font-size="22" fill="#555" text-anchor="middle">Divisão ${room + 1}</text>`
  )).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="720" viewBox="0 0 840 720">
  <rect width="840" height="720" fill="#fafafa"/>${shapes}
  <text x="420" y="690" font-family="Arial, sans-serif" font-size="26" fill="#111" text-anchor="middle">${label}</text>
</svg>`;
  const filename = `planta-${slugify(label)}-${index}.svg`;
  const filepath = path.join(os.tmpdir(), filename);
  fs.writeFileSync(filepath, svg);
  return { filepath, originalFilename: filename, mimetype: 'image/svg+xml', size: fs.statSync(filepath).size };
}

async function uploadPlans(names) {
  const uploaded = [];
  for (const [index, name] of names.entries()) {
    const [file] = await strapi.plugin('upload').service('upload').upload({
      files: writePlan(name, index + 1),
      data: { fileInfo: { name, alternativeText: name } },
    });
    uploaded.push(file.id);
  }
  return uploaded;
}

function blocks(text) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

function writePlaceholder(label, color, index) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#1b1b1b"/>
  </linearGradient></defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <text x="800" y="500" font-family="Arial, sans-serif" font-size="72" fill="#ffffff" text-anchor="middle">${label}</text>
  <text x="800" y="580" font-family="Arial, sans-serif" font-size="36" fill="#ffffff" fill-opacity="0.7" text-anchor="middle">Imagem ${index}</text>
</svg>`;
  const filename = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}.svg`;
  const filepath = path.join(os.tmpdir(), filename);
  fs.writeFileSync(filepath, svg);
  return { filepath, originalFilename: filename, mimetype: 'image/svg+xml', size: fs.statSync(filepath).size };
}

async function uploadImages(label, color, count) {
  const uploaded = [];
  for (let index = 1; index <= count; index += 1) {
    const [file] = await strapi.plugin('upload').service('upload').upload({
      files: writePlaceholder(label, color, index),
      data: { fileInfo: { name: `${label} ${index}`, alternativeText: `${label} ${index}` } },
    });
    uploaded.push(file.id);
  }
  return uploaded;
}

async function setPublicPermissions(controllers) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  const query = strapi.query('plugin::users-permissions.permission');

  for (const controller of controllers) {
    for (const action of ['find', 'findOne']) {
      const name = `api::${controller}.${controller}.${action}`;
      const existing = await query.findOne({ where: { action: name, role: publicRole.id } });
      if (!existing) await query.create({ data: { action: name, role: publicRole.id } });
    }
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  // Substitui mocks anteriores (projetos e respetivos imóveis), identificados pelo nome.
  const existing = await strapi.documents('api::projeto.projeto').findMany({
    filters: { nome: { $in: projetos.map((projeto) => projeto.nome) } },
  });
  for (const projeto of existing) {
    const imoveis = await strapi.documents('api::imovel.imovel').findMany({
      filters: { projeto: { documentId: projeto.documentId } },
    });
    for (const imovel of imoveis) {
      await strapi.documents('api::imovel.imovel').delete({ documentId: imovel.documentId });
    }
    await strapi.documents('api::projeto.projeto').delete({ documentId: projeto.documentId });
  }

  async function findOrCreate(uid, nome) {
    const [found] = await strapi.documents(uid).findMany({ filters: { nome } });
    if (found) return found.documentId;
    const doc = await strapi.documents(uid).create({ data: { nome, slug: slugify(nome) }, status: 'published' });
    return doc.documentId;
  }

  const tipoIds = {};
  for (const nome of tiposDeProjeto) {
    tipoIds[nome] = await findOrCreate('api::tipo-de-projeto.tipo-de-projeto', nome);
  }

  const tipologiaIds = {};
  for (const nome of tipologias) {
    tipologiaIds[nome] = await findOrCreate('api::tipologia.tipologia', nome);
  }

  for (const projeto of projetos) {
    const projetoDoc = await strapi.documents('api::projeto.projeto').create({
      data: {
        nome: projeto.nome,
        slug: slugify(projeto.nome),
        descricao: blocks(projeto.descricao),
        localizacao: projeto.localizacao,
        morada: projeto.morada,
        coordenadas: projeto.coordenadas,
        estado: projeto.estado,
        ano_conclusao: projeto.ano_conclusao,
        imagens: await uploadImages(projeto.nome, projeto.cor, 3),
        plantas: await uploadPlans(projeto.plantas ?? []),
        tipo_de_projetos: [tipoIds[projeto.tipo]],
      },
      status: 'published',
    });

    for (const imovel of projeto.imoveis) {
      await strapi.documents('api::imovel.imovel').create({
        data: {
          nome: imovel.nome,
          slug: slugify(`${projeto.nome} ${imovel.nome}`),
          descricao: blocks(`${imovel.nome} do ${projeto.nome}, com acabamentos de qualidade e boa exposição solar.`),
          preco: imovel.preco,
          area_bruta: imovel.area_bruta,
          area_util: imovel.area_util,
          n_quartos: imovel.n_quartos,
          n_casas_banho: imovel.n_casas_banho,
          certificacao_energetica: imovel.certificacao,
          disponibilidade: imovel.disponibilidade,
          imagens: await uploadImages(`${projeto.nome} ${imovel.nome}`, projeto.cor, 3),
          plantas: await uploadPlans(imovel.plantas ?? [`Planta ${imovel.nome}`, `Planta ${imovel.nome} (pormenor)`]),
          projeto: projetoDoc.documentId,
          tipologias: [tipologiaIds[imovel.tipologia]],
        },
        status: 'published',
      });
    }
    console.log(`Criado: ${projeto.nome} (${projeto.imoveis.length} imóveis)`);
  }

  await setPublicPermissions(['projeto', 'imovel', 'tipologia', 'tipo-de-projeto']);
  console.log('Permissões públicas (find/findOne) ativadas.');

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
