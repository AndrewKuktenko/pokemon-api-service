# pokemon-api-service

## Installation

To start the server use following commands.

```sh
docker-compose build
docker-compose up
```

Application runs on PORT **:3000**

**Available endpoints:**

Get information about Pokemon using this endpoint.

GET /api/v1/pokemon/<pokemon name or id>



Get Pokemon list by Types value.

GET /api/v1/pokemon/type/<type id or name>

Upload file to get pokemons result. 
**Note:** File must have .CSV extension. Application reads first column of the file's row. Endpoint can accept no more than 20 rows in the document.
File should be uploaded to body **form-data** field named **file**. 
This endpoint available **authenticated** users only. Use bearer token.

POST /api/v1/pokemon/upload

### Authenfication.

Endpoints for sign in and sign up. 
**Note:** Endpoints do not use confirmation email, so you can use any email name.

POST /api/v1/auth/sign-up
Body example.
```
{
    "email":"your@email.com",
    "password":"yourpassword"
}
```

POST /api/v1/auth/sign-in
Body example.
```
{
    "email":"your@email.com",
    "password":"yourpassword"
}
```
In response you will get JWT and refresh token. 
Example:
```
{
    "accessToken": "<access>",
    "refreshToken": "<refresh>"
}
```
