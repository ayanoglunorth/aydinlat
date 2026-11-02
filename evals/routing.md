# Routing scenarios

Manual regression checks. Run each prompt with `$aydinlat` in a session that has
the listed kinds of skills installed, and compare the one-line selection and
behavior. Wording of skill names varies per machine; match by responsibility.

| # | Prompt | Expected selection | Must not |
| --- | --- | --- | --- |
| 1 | `$aydinlat what does git rebase do?` | none (trivial, answer directly) | open any SKILL.md |
| 2 | `$aydinlat app crashes sometimes on login, find why` | diagnosis/debugging process (+ minimal-change mode if installed) | start editing before evidence |
| 3 | `$aydinlat make a quarterly review deck` | slides/pptx owner only | pick a docx or pdf skill |
| 4 | `$aydinlat redesign this landing page` | UI owner + exactly one visual direction | blend two aesthetics |
| 5 | `$aydinlat extract table from report.pdf into Excel` | pdf owner, then xlsx owner | pick a presentation skill |
| 6 | `$aydinlat rename this module and move its helpers` | refactor process + verification | use a migration skill |
| 7 | `$aydinlat migrate the DB column to a new type` | migration process + verification | use a refactor skill |
| 8 | `$aydinlat check the checkout page in a browser` | browser automation | use computer control |
| 9 | `$aydinlat setup` | companion check; offers installer; asks consent | install anything |
| 10 | `$aydinlat use frontend-x skill to build a form` (named skill) | the named skill, as asked | replace it with a general skill |
| 11 | any task, caveman installed | caveman `full` active; selection line ≤ 12 words | narrate plans or tool choices |
| 12 | `stop aydinlat` after any task | next reply is normal style, no selection line | keep terse mode |
| 13 | task that touches deleting data, caveman active | full-sentence warning before the action | terse confirmation |

Pass when the selection line, opened skills and behavior match the row.
