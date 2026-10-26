BIRTHDAY SURPRISE WEBSITE

Files:
- index.html
- style.css
- script.js

How to customize:
1. Open script.js.
2. Change PASSWORD = "486927" to the 6-digit password you want.
3. The countdown target is currently 2026-10-27 00:00 Vietnam time (+07:00):
   const TARGET_TIME = new Date("2026-10-27T00:00:00+07:00").getTime();
4. Edit BIRTHDAY_MESSAGE to personalize the birthday wish.

Test locally:
- Open index.html in a browser.
- Enter password 486927.
- To test the birthday reveal immediately, temporarily change TARGET_TIME to a timestamp in the past, e.g. new Date("2026-10-26T00:00:00+07:00").getTime().
- Restore the target before publishing.

Publish with GitHub Pages:
- Put the contents of this folder at the root of a GitHub repository, or create a new repository for this birthday site.
- In Settings > Pages, select GitHub Actions if using a custom workflow.
- The client-side password is only a playful gate; it is not secure because the password is stored in script.js.
