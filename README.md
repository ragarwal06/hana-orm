@ragarwal06/hana-orm - SAP HANA Database Client Wrapper for NodeJS (with Typescipt Support)
==============================================

<a href="https://www.npmjs.com/package/@ragarwal06/hana-orm">
    <img src="https://img.shields.io/npm/v/@ragarwal06/hana-orm" alt="Version">
</a>
<a href="https://www.npmjs.com/package/@ragarwal06/hana-orm">
    <img src="https://img.shields.io/npm/dw/@ragarwal06/hana-orm" alt="Total Downloads">
</a>
<a href="https://www.npmjs.com/package/@ragarwal06/hana-orm">
    <img src="https://img.shields.io/npm/l/@ragarwal06/hana-orm" alt="License">
</a>

Table of contents
-------------

* [Install](#install)
* [Getting started](#getting-started)
* [Contact](#contact)

Install
-------

Install from npm:

```bash
npm install @ragarwal06/hana-orm
```

or clone from the [GitHub repository](https://github.com/ragarwal06/hana-orm) to run tests and examples locally:

```bash
git clone https://github.com/ragarwal06/hana-orm.git
cd hana-orm
npm install
```

Getting started
------------

If you do not have access to an SAP HANA server, go to the [SAP HANA Developer Center](https://developers.sap.com/topics/hana.html) and choose one of the options to use SAP HANA Express or deploy a new SAP HANA Cloud server.

This is a very simple example showing how to use this module in Javascript:

```js
const hanaOrm = require("@ragarwal06/hana-orm");
const client = hanaOrm.createClient({
  host: "hostname",
  port: 30015,
  user: "user",
  password: "secret",
});
client.then(() => {
  const { insert, remove, find, update, prepareForTable } =
    hanaOrm.databaseOperations();
    
    insert({
      columnNames: ["name"],
      conditions: {
        name: "",
      },
      clause: "AND",
    })
});
```

This is a very simple example showing how to use this module in Typescript:

```ts
import { createClient, databaseOperations } from "@ragarwal06/hana-orm";
const client = createClient({
  host: "hostname",
  port: 30015,
  user: "user",
  password: "secret",
});

interface Users {
  name: string;
}

client.then(() => {
  const { insert, remove, find, update, prepareForTable } =
    databaseOperations();

  find<Users, false>({
    columnNames: ["name"],
    conditions: {
      name: "",
    },
    clause: "AND",
  });
});
```

This is a very simple example showing how to use this module in Express:

```ts
app.use(prepareClient({
  host: "hostname",
  port: 30015,
  user: "user",
  password: "secret",
}))
```

```ts
router.get('/user', async (req: Request, res: Response) => {
  const { insert, remove, find, update, prepareForTable } =
    req.db;
});
```

Contact
-------

If you face any issue please write to [owner](mailto:agarwal.rahul324@gmail.com) or create a [GitHub issue](https://github.com/ragarwal06/hana-orm/issues/new?assignees=&labels=bug&projects=&template=issue.md&title=)

For feature request please request [here](https://github.com/ragarwal06/hana-orm/issues/new?assignees=&labels=feature&projects=&template=feature.md&title=)