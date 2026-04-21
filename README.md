# project-template-web

Generating AUTH_SECRET:

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```