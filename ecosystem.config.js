'use strict';

module.exports = {
    apps: [
        {
            name: "afume-server-prd",
            script: "index.js",
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "prd"
            }
        },
        {
            name: "afume-server-dev",
            script: "index.js",
            watch: true,
            env: {
                "PORT": 3001,
                "NODE_ENV": "dev"
            }
        }
    ]
};
