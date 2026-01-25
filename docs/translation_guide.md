# Translation guide

If you want to add support for other languages, you should change these files (example: Japanese - `ja`):

- Create a locale file in `src/locales/ja.js`.
- Change `src/locales/index.js` so it includes the new `ja` key and the correct `TimeAgo` instance.
- Add a `language_ja` key in all `src/locales/{languageId}.js` files to localize the name that appears in the Settings modal.
- Update `src/data/dictionary.jsx` to include translations for `ja`.
- Add a `ja.yml` to each level for the chat script.
  - See `docs/chat_syntax.md` for some other considerations about the chat format.
  - The final credits shouldn't be localized.
- Change the `meta.json` file in each level to localize the `name` and the console `subtitle` keys.
- Localize all unit tests in `src/data/levels/$tests` and the `test.js` files. **This is optional**.
- Localize all theme titles and description in `src/models/themes/theme.js`.
- Create a file in `src/data/levels/02_Assembly/$help/ja.txt` with help for the Assembly chapter.
  - Each line should match the ones from other languages.

## Notes

- Some languages might require some rework in the game. RTL languages might be too difficult to support.
- The _ImGui_ parts of the game (Debugger, AudioTester) don't support localization.
