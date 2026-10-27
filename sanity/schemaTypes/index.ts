import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {aiContentJobType} from './aiContentJobType'
import {socialBrandType} from './socialBrandType'
import {socialPublicationType} from './socialPublicationType'
import {socialPackageType} from './socialPackageType'
import {blogFeedbackType} from './blogFeedbackType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, aiContentJobType, socialBrandType, socialPublicationType, socialPackageType, blogFeedbackType],
}
