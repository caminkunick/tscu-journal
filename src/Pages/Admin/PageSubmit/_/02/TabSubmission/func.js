import { db, dbTimestamp } from 'Modules/firebase';
import { getSubmissionById } from 'Method/submission';

export const onAccept = async (jid,sid) => {
  const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
  await path.update({
    status: 'submitting',
    step: 1,
    date: dbTimestamp(),
  })
  return await getSubmissionById(jid,sid);
}

export const onReject = async (jid,sid) => {
  const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
  await path.update({
    status: 'rejected',
    date: dbTimestamp(),
  })
  return await getSubmissionById(jid,sid);
}

export const onUnreject = async (jid,sid) => {
  const path = db.collection('journals').doc(jid).collection('submits').doc(sid);
  await path.update({
    status: 'submitting',
    date: dbTimestamp(),
  })
  return await getSubmissionById(jid,sid);
}