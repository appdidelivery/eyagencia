// Every material change invalidates approval; compare the exact snapshot.
export function approvalSnapshot(d){
 const asset=d?.video?.asset?._ref
 if(typeof asset!=='string'||!/^file-[a-z0-9]+-mp4$/i.test(asset))return null
 if(typeof d.title!=='string'||!d.title.trim()||typeof d.clientName!=='string'||!d.clientName.trim())return null
 if(!d.commercialFactsVerified||!d.rightsVerified||!d.audioReviewed||!d.aiDisclosureReviewed||d.status!=='approved')return null
 if(d.collaborator&&!d.collaboratorVerified)return null
 return JSON.stringify([asset,d.title,d.clientName,d.ctaUrl,d.verifiedFacts||[],d.script||'',d.caption,d.collaborator||'',d.scheduledDay,d.width,d.height,d.durationSeconds,d.commercialFactsVerified===true,d.rightsVerified===true,d.audioReviewed===true,d.aiDisclosureReviewed===true,d.collaboratorVerified===true,d.source])
}
export function isCurrentApproval(d){const s=approvalSnapshot(d);return Boolean(s&&s===d.approvedSnapshot)}
