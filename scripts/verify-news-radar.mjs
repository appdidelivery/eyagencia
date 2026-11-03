import assert from 'node:assert/strict'
import {
  NEWS_SOURCES, decodeHtml, safeArticleUrl, extractNewsLinks,
  extractNewsDate, articleHeadline, isRecent, rankHeadline,
} from './news-source-parser.mjs'
const source=NEWS_SOURCES.eyagencia
assert.equal(decodeHtml('gest&atilde;o &amp; loja'),'gest&atilde;o & loja')
assert.equal(safeArticleUrl('https://evil.example/noticias/seo-em-lojas',source),null)
assert.equal(safeArticleUrl('http://www.ecommercebrasil.com.br/noticias/seo-em-lojas',source),null)
assert.equal(safeArticleUrl('https://www.ecommercebrasil.com.br/noticias/seo?page=1',source),
  'https://www.ecommercebrasil.com.br/noticias/seo-em-lojas')
assert.equal(safeArticleUrl('/noticias/seo-de-lojas-virtuais',source),
  'https://www.ecommercebrasil.com.br/noticias/seo-de-lojas-virtuais')
const html='<nav><a href="https://evil.example/noticias/malicioso">Notícia maliciosa no portal</a></nav>'+
  '<h3><a href="/noticias/novidades-no-ecommerce">Mudanças no e-commerce &amp; SEO</a></h3>'
assert.equal(extractNewsLinks(html,source).length,1)
assert.match(extractNewsLinks(html,source)[0].title,/SEO/)
assert.equal(articleHeadline('<h1>Novidades em <strong>SEO</strong> para lojas</h1>'),
  'Novidades em SEO para lojas')
assert.equal(extractNewsDate('<meta property="article:published_time" content="2026-11-02T15:00:00Z">')?.toISOString(),
  '2026-11-02T15:00:00.000Z')
assert.equal(extractNewsDate('<time datetime="2026-10-30T12:00:00-03:00">Data</time>')?.toISOString(),
  '2026-10-30T15:00:00.000Z')
assert.equal(extractNewsDate('<h1>Bares e restaurantes</h1><div>Publicado em: 30/10/2026</div>')?.getUTCDate(),30)
assert.equal(isRecent(new Date('2026-10-30T12:00:00Z'),new Date('2026-11-03T12:00:00Z')),true)
assert.equal(isRecent(new Date('2026-09-01T12:00:00Z'),new Date('2026-11-03T12:00:00Z')),false)
assert.ok(rankHeadline('IA transforma o checkout do e-commerce','eyagencia')>0)
assert.ok(rankHeadline('Delivery ganha novos canais para bares e restaurantes','velo-delivery')>0)
assert.equal(rankHeadline('Discussões eleitorais dividem empresários no setor','velo-delivery'),-1)
console.info('[industry-news-selftest] source whitelist, date, relevance and originality safeguards passed')
