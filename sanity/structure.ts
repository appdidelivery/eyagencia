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
      S.documentTypeListItem('aiContentJob').title('Agente de Conteúdo'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && ![
          'socialBrand', 'socialPublication', 'socialPackage', 'post', 'aiContentJob', 'category', 'author',
        ].includes(item.getId()!),
      ),
    ])
