const hash_sum = require("hash-sum");
const { resolve } = require("path");
const {
  adjust,
  apply,
  flip,
  map,
  objOf,
  pipe,
  repeat,
  toPairs,
  pathOr,
  fromPairs,
  mergeDeepLeft,
  applyTo,
  toString,
  curryN,
} = require("ramda");
const hbs = require("handlebars");
const { readFile, outputFile } = require("fs-extra");

const branch = flip(repeat);

module.exports = pipe(
  pathOr({}, ["data", "errors"]),
  pipe(
    branch(2),
    adjust(
      1,
      pipe(toPairs, map(adjust(1, pipe(hash_sum, objOf("code")))), fromPairs)
    ),
    apply(mergeDeepLeft),
    (data) =>
      readFile(resolve(__dirname, "index.hbs"))
        .then(toString)
        .then(hbs.compile)
        .then(applyTo(data))
        .then(curryN(2, outputFile)("index.ts"))
  )
);
