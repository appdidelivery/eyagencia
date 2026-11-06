import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Central de Conteúdo')
    .items([
      S.documentTypeListItem('socialBrand').title('Redes sociais · Clientes'),
      S.documentTypeListItem('socialPublication').title('Redes sociais · Publicações'),
      S.documentTypeListItem('socialPackage').title('Agente Social · Pacotes do Blog'),
      S.divider(),
      S.documentTypeListItem('post').title('Posts do Blog'),
      S.documentTypeListItem('diegoBook').title('Diego Lemes · Livros que li'),
      S.documentTypeListItem('diegoFloodChapter').title('Livro 02 · Capítulos'),
      S.documentTypeListItem('diegoFloodMedia').title('Livro 02 · Fotos e vídeos'),
      S.documentTypeListItem('aiContentJob').title('Agente de Conteúdo'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && ![
          'socialBrand', 'socialPublication', 'socialPackage', 'post', 'aiContentJob', 'category', 'author', 'diegoBook', 'diegoFloodChapter', 'diegoFloodMedia',
        ].includes(item.getId()!),
      ),
    ])
