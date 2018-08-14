const {
  readers: { eos: { NodeosActionReader } },
  watchers: { BaseActionWatcher },
} = require("../../dist/")
const ObjectActionHandler = require("./ObjectActionHandler")
const updaters = require("./updaters")
const effects = require("./effects")


const actionHandler = new ObjectActionHandler(
  updaters,
  effects,
)

const actionReader = new NodeosActionReader(
  "https://history.eoscalgary.io/",
  0,
)

const actionWatcher = new BaseActionWatcher(
  actionReader,
  actionHandler,
  250,
)

actionWatcher.watch()
