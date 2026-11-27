import {useDocumentOperation,type DocumentActionComponent} from 'sanity'
import {approvalSnapshot} from '../../scripts/sophia-approval.mjs'
export const ApproveSophiaReel:DocumentActionComponent=(props)=>{
 const {patch}=useDocumentOperation(props.id,props.type)
 const candidate={...props.draft,status:'approved'}
 const snapshot=approvalSnapshot(candidate)
 return {label:'Aprovar material Sophia',disabled:!snapshot||Boolean(patch.disabled),onHandle:()=>{
 if(!snapshot)return
 patch.execute([{set:{status:'approved',approvedSnapshot:snapshot}}])
 props.onComplete()
 }}
}
