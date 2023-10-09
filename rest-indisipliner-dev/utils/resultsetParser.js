const _ = require("lodash");

function parseResultArray(result, single = false) {
  result = _.head(result);
  if (_.hasIn(result, ["affectedRows"])) {
    result = _.assign({}, result);
    return result;
  }
  if (result.length > 0) {
    let data = [];
    _.forEach(result, (v) => data.push(_.assign({}, v)));
    if (single) return _.head(data);
    return data;
  } else {
    return result.length;
  }
}

/* moduile export */
module.exports = parseResultArray;
