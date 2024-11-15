import { firebase, db } from "Modules/firebase";
import { Pattern01 } from "./mailPatterns";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";

const mailURL = `https://us-central1-phrain-kg.cloudfunctions.net/mailer`;

export const mailer = async (subject, to, message) => {
  const token = await firebase.auth().currentUser.getIdToken();
  const result = await axios.post(mailURL, {
    token,
    subject,
    to,
    message,
  });
  return (
    result.data || { error: "data-not-found", message: "result not found" }
  );
};

const getAdmin = async (jid) => {
  const query_users = await db
    .collection("journals")
    .doc(jid)
    .collection("users")
    .where("role", "==", "admin")
    .get();
  return query_users.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .filter((doc) => Boolean(doc.info))
    .map((doc) => doc.info.email);
};

export const sendMail01 = async (jid, sid, data) => {
  if (jid && sid) {
    const admin = await getAdmin(jid);
    const mailData = Pattern01({
      to: admin,
      title: data.title,
      sender: `${data.authors[0].fname} ${data.authors[0].sname}`,
      date: moment().format("LLL"),
      time: moment().format("LT"),
      link: `https://journal.phra.in/admin/s/${sid}`,
    });
    return await mailer(mailData.subject, admin, mailData.content);
  }
};

const api_uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/journal-mail"
    : `https://next-api-six.vercel.app/api/journal-mail`;

const mainLog = async ({ jid, id, type, patternNumber, result }) => {
  await db
    .collection("journals")
    .doc(jid)
    .collection("logs")
    .add({ id, type, patternNumber, result: JSON.stringify(result) });
  return true;
};

const mailDisabled = false;
export const sendMail = async (patternNumber, jid, id, type = null) => {
  if (mailDisabled === true) {
    return { data: true };
  }
  if (patternNumber && jid && id) {
    try {
      let result = {};
      if (type) {
        result = await axios.get(
          `${api_uri}/${patternNumber}/${type}/${jid}/${id}`
        );
      } else {
        result = await axios.get(`${api_uri}/${patternNumber}/${jid}/${id}`);
      }
      await mainLog({ jid, id, type, patternNumber, result: result.data });
      return result;
    } catch (err) {
      await mainLog({ jid, id, type, patternNumber, result: err });
      return err;
    }
  } else {
    return { error: "params-invalid", message: "Cannot send mail" };
  }
};
