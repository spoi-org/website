The website for the SPOI Mentoring Program.

To run it on your own:
1. Install the required packages using the following command:
```
npm install
```

2. Set the values for the environment variables:
    - `CLIENT_AUTH` - Base64 encoded `client_id:client_secret` for the discord application used for OAuth2.
    - `URL` - The url base to which the user should be redirected after finishing the discord OAuth2 (e.g. `http://localhost:3000`)
    - `API_URL` - The url for the API used to check whether a user has been verified. The API should take an `id` query parameter and return a JSON response with a boolean key `verified`.
    - `DATABASE_URL` - The url of the PostgreSQL database.

3. Generate the prisma client
```
npx prisma db push
```

3. Use `npm run dev` to start the development server.