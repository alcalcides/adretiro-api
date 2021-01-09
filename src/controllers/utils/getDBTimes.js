function getDBTimes() {
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  return { created_at, updated_at };
}
exports.getDBTimes = getDBTimes;
