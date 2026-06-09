# GT Designz customer assistant

The website widget is loaded by `assistant.js` and styled in `styles.css`. It runs on
GitHub Pages without exposing credentials.

## Current behaviour

- Answers only within the configured architecture and built-environment scope.
- Provides general RIBA, ARB, planning, build-over, Party Wall and budget guidance.
- Captures a structured project brief and explicit contact consent.
- Escalates disputes to a human callback flow.
- Uses a prepared email as the production fallback until the intake Worker is deployed.
- Stores at most five unsent, consented enquiries in that visitor's browser.

## Notion records

The Notion project page is named `GT Designz Customer Assistant`.

The child database is named `Client Enquiries`.

Data source ID:

```text
0d9dd55c-4fb8-4177-94f3-cd6b6ed1ee51
```

The database includes contact details, project brief, budget, timescale, RIBA stage,
planning-history, build-over, Party Wall, dispute and consent fields.

## Deploy the private intake endpoint

The Cloudflare Worker in `worker/` writes approved submissions to Notion. The Notion
token must never be placed in `assistant-config.js`, source control or browser code.

1. Create a Notion internal integration with permission to insert content.
2. Give that integration access to the `Client Enquiries` database.
3. Authenticate Wrangler with the intended Cloudflare account.
4. From `worker/`, set the secret:

   ```powershell
   npx wrangler secret put NOTION_TOKEN
   ```

5. Deploy:

   ```powershell
   npx wrangler deploy
   ```

6. Put the deployed Worker URL in `assistant-config.js`:

   ```js
   window.GT_ASSISTANT_CONFIG = {
     intakeEndpoint: "https://gtdesignz-intake.example.workers.dev",
     enquiryEmail: "enquiries@gtdesignzltd.com",
     phone: "+44 20 8212 7981"
   };
   ```

7. Test one consented enquiry and confirm it appears in the Notion pipeline.

## Professional boundary

The widget gives general information only. It must not make planning determinations,
give legal advice, decide liability, act as a Party Wall surveyor, promise a project
budget, or describe an individual as an architect unless their ARB registration has
been verified. Complex and disputed matters are routed to a competent human.
