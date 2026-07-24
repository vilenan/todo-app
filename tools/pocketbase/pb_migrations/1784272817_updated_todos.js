/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_113564862")

  // add field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select1655102503",
    "maxSelect": 0,
    "name": "priority",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "low",
      "medium",
      "high"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_113564862")

  // remove field
  collection.fields.removeById("select1655102503")

  return app.save(collection)
})
