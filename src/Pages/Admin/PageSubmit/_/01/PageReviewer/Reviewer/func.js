import { db } from 'Modules/firebase';

export const getSubmit = async (jid,sid) => {
    const query = await db.collection('journals').doc(jid).collection('submits').doc(sid).get();
    return query.data()
}