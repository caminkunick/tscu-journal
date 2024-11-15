export const getAuthorName = (name) => {
  const title = ["Others","อื่นๆ"].includes(name.title) ? name.othertitle : name.title;
  return `${title+name.fname} ${name.sname}`;
}