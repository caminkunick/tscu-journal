import { db } from 'Modules/firebase';

export const getSubmission = async (jid) => {
  const query = await db.collection('journals').doc(jid).collection('submits').get();
  const docs = query.docs.filter( doc => doc.data().step<3 );
  return docs;
}