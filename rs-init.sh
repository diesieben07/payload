#!/bin/bash

mongosh "mongodb://mongo1:27017" <<EOF
var config = {
    "_id": "payload",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "localhost:27017",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
rs.reconfig(config, { force: true });
rs.status();
EOF
