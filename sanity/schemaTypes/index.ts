import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {aiContentJobType} from './aiContentJobType'
import {socialBrandType} from './socialBrandType'
import {socialPublicationType} from './socialPublicationType'
import {socialPackageType} from './socialPackageType'
import {socialNewsPostType} from './socialNewsPostType'
import {socialNativeRepostType} from './socialNativeRepostType'
import {blogFeedbackType} from './blogFeedbackType'
import {diegoBookType} from './diegoBookType'
import {diegoFloodChapterType} from './diegoFloodChapterType'
import {diegoFloodMediaType} from './diegoFloodMediaType'
import {academyCompletionType} from './academyCompletionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, aiContentJobType, socialBrandType, socialPublicationType, socialPackageType, socialNewsPostType, socialNativeRepostType, blogFeedbackType, diegoBookType, diegoFloodChapterType, diegoFloodMediaType, academyCompletionType],
}
