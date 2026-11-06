export const bookUrl='https://www.eyagencia.com.br/diego/obras/enquanto-a-agua-subia'
export const bookTitle='Enquanto a Água Subia'
export const bookSubtitle='Uma família, a enchente de 2024 e as faces da humanidade'
export type Chapter={
 code:string;number:number;act:number;title:string;focus:string;
}
export type PublishedMedia={
 code:string;title:string;caption?:string|null;credit?:string|null;
 imageUrl?:string|null;alt?:string|null;videoUrl?:string|null;
 chapterCode?:string|null;eventDate?:string|null;locationPublic?:string|null;
}
export type PublishedChapter={
 code:string;title:string;body:string;revisedAt?:string|null
}
export const acts=[
 {number:1,title:'A decisão de ir',short:'O instante em que assistir já não parecia suficiente.'},
 {number:2,title:'A cidade transformada',short:'A distância entre as notícias e a realidade encontrada.'},
 {number:3,title:'O país que se ajudou',short:'Solidariedade, encontros e esforços compartilhados.'},
 {number:4,title:'O limite de todos nós',short:'Cansaço, falhas, decisões e a dimensão da resposta.'},
 {number:5,title:'O que a água não levou',short:'Voltar para casa, guardar silêncio e aprender a lembrar.'}
] as const
// Sumário de trabalho. Os capítulos NÃO são relatos reconstruídos ou aprovados.
// O texto factual será acrescentado com entrevistas e documentação do autor.
export const chapters:Chapter[]=[
 {number:1,code:'c01',act:1,title:'A notícia que atravessou a casa',focus:'Os primeiros relatos, a decisão de ajudar e as perguntas feitas antes de partir.'},
 {number:2,code:'c02',act:1,title:'Pai e filho, a mesma direção',focus:'A viagem, o papel de cada pessoa da família e as expectativas antes da chegada.'},
 {number:3,code:'c03',act:2,title:'Porto Alegre, maio de 2024',focus:'A primeira impressão da cidade e os sinais da dimensão do desastre.'},
 {number:4,code:'c04',act:2,title:'O que uma câmera não alcança',focus:'O contraste entre o noticiário e os acontecimentos testemunhados de perto.'},
 {number:5,code:'c05',act:3,title:'Gente que não se conhecia',focus:'Encontros com voluntários, moradores e pessoas atingidas, com depoimentos autorizados.'},
 {number:6,code:'c06',act:3,title:'O Brasil que chegou junto',focus:'Redes de ajuda, logística solidária e a participação da família.'},
 {number:7,code:'c07',act:3,title:'O trabalho invisível',focus:'Atividades essenciais pouco vistas: organização, deslocamentos, preparação e apoio.'},
 {number:8,code:'c08',act:4,title:'Quando o corpo pede para parar',focus:'As consequências físicas e emocionais da jornada, sem extrapolar as lembranças confirmadas.'},
 {number:9,code:'c09',act:4,title:'O que não funcionou',focus:'Testemunhos e documentos sobre decisões públicas, prevenção e estrutura de resposta.'},
 {number:10,code:'c10',act:4,title:'O peso do que ficou por fazer',focus:'Limites, conflitos, escolhas difíceis e o que nenhum voluntário consegue resolver sozinho.'},
 {number:11,code:'c11',act:5,title:'Voltar não é esquecer',focus:'O retorno e o lugar que a experiência ocupou na vida da família.'},
 {number:12,code:'c12',act:5,title:'A história que ainda não contei',focus:'A decisão de revisitar os registros e transformar silêncio em memória responsável.'}
]
export const opening=[
 'Em maio de 2024, as enchentes que devastaram o Rio Grande do Sul alteraram a vida de famílias inteiras. Para quem acompanhava os acontecimentos de longe, as notícias pareciam ultrapassar o que era possível compreender. Para quem estava perto, cada decisão tinha consequências concretas.',
 'Diego Lemes conta que viajou com a família para Porto Alegre e participou, junto de seu pai e de sua esposa, de uma jornada de solidariedade. As lembranças dessa experiência permaneceram, em grande parte, sem ser contadas. Algumas ainda são difíceis de revisitar.',
 'Este livro nasce do desejo de registrar o que viram, o que fizeram e o que aprenderam — mas também de ouvir outras pessoas e distinguir a experiência direta dos fatos apurados depois. O objetivo não é transformar ninguém em herói sem contradições, nem reduzir uma tragédia a explicações simples.',
 'A versão digital começa como um caderno de memória em construção. Os capítulos abaixo são caminhos de investigação, não depoimentos prontos. Fotografias, vídeos, documentos e relatos serão integrados somente depois de identificação, conferência e autorização editorial.'
]
export function chapterUrl(code:string){return bookUrl+'/registro/'+encodeURIComponent(code)}
