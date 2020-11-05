function isObject(obj) {
  return (obj !== null && typeof obj === 'object') || typeof obj === 'undefined'
};
const str = new URL(url);
const path = str.pathname;
const p = { method: " + method + " };
if (!url || url === '') { throw new Error('must has url') };
if (!isObject(header)) { throw new Error('header must be Object') } else { p.headers = header };
if (!isObject(param)) { throw new Error('param must be Object') } else { p.param = param };
if (isObject(data) && p.method.toLowerCase() !== 'get') { p.data = data };
const [err, res] = this.to(this.Service(p));
if (!err && res) {
  return res
} else {
  console.log(err)
  if (this.errorHandlers && this.errorHandlers.has(path)) {
    const func = this.errorHandlers.get(path);
    func(err);
  }
}
